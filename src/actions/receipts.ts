'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { sendPaymentReceiptWebhook } from '@/lib/webhooks';
import { memoryCache } from '@/lib/cache';

const POSTVENTA_CACHE_KEY = 'postventa_data';
const RECEIPTS_PAGINATED_CACHE_KEY = 'receipts_paginated_';

export async function deletePaymentReceipt(receiptId: string) {
    const session = await auth();
    const isPostventa = session?.user?.email === 'postventa@lomasdelmar.cl' || session?.user?.email === 'postventa@aliminspa.cl';
    if (!session?.user || (session.user.role !== 'ADMIN' && !isPostventa)) {
        return { error: 'No autorizado' };
    }

    try {
        const receipt = await prisma.paymentReceipt.findUnique({
            where: { id: receiptId },
            include: { reservation: true }
        });

        if (!receipt) return { error: 'Recibo no encontrado' };

        // Revert reservation state if approved
        if (receipt.status === 'APPROVED') {
            if (receipt.scope === 'INSTALLMENT') {
                await prisma.reservation.update({
                    where: { id: receipt.reservation_id },
                    data: {
                        installments_paid: { decrement: 1 }
                    }
                });
            } else if (receipt.scope === 'PIE') {
                await prisma.reservation.update({
                    where: { id: receipt.reservation_id },
                    data: { pie_status: 'PENDING' }
                });
            }
        }

        await prisma.paymentReceipt.delete({
            where: { id: receiptId }
        });

        memoryCache.deleteByPrefix('postventa_full_');
        memoryCache.deleteByPrefix('receipts_paginated_');
        revalidatePath('/admin/dashboard');

        return { success: true };
    } catch (error) {
        console.error("Error deleting receipt:", error);
        return { error: 'Error al eliminar el recibo' };
    }
}

export async function getPaginatedReceipts({
    page = 1,
    pageSize = 20,
    status,
    search,
    serverAuthOverride = false
}: {
    page?: number;
    pageSize?: number;
    status?: string | null;
    search?: string;
    serverAuthOverride?: boolean;
} = {}) {
    if (!serverAuthOverride) {
        const session = await auth();
        if (!session?.user || session.user.role !== 'ADMIN') {
            throw new Error("Unauthorized");
        }
    }

    const cacheKey = `${RECEIPTS_PAGINATED_CACHE_KEY}${page}_${pageSize}_${status || 'all'}_${search || ''}`;
    const cached = memoryCache.get(cacheKey);
    if (cached) return cached;

    try {
        const where: any = {};
        if (status && status !== 'ALL') {
            where.status = status;
        }

        if (search) {
            where.OR = [
                { reservation: { buyer: { name: { contains: search, mode: 'insensitive' } } } },
                { reservation: { lot: { number: { contains: search, mode: 'insensitive' } } } }
            ];
        }

        const [receipts, totalCount] = await Promise.all([
            prisma.paymentReceipt.findMany({
                where,
                skip: (page - 1) * pageSize,
                take: pageSize,
                orderBy: { created_at: 'desc' },
                select: {
                    id: true,
                    amount_clp: true,
                    receipt_url: true,
                    status: true,
                    scope: true,
                    installments_count: true,
                    created_at: true,
                    rejection_reason: true,
                    reservation: {
                        select: {
                            id: true,
                            buyer: {
                                select: { name: true, email: true }
                            },
                            lot: {
                                select: { number: true, stage: true }
                            }
                        }
                    }
                }
            }),
            prisma.paymentReceipt.count({ where })
        ]);

        const result = {
            success: true,
            receipts,
            totalCount,
            totalPages: Math.ceil(totalCount / pageSize),
            currentPage: page
        };

        memoryCache.set(cacheKey, result, 60); // 1 minute cache
        return result;

    } catch (error) {
        console.error("Error fetching paginated receipts:", error);
        throw new Error("Error al cargar comprobantes");
    }
}

export async function uploadPaymentReceipt({
    reservationId,
    lotId,
    amount,
    receiptUrl,
    scope,
    installmentsCount = 0
}: {
    reservationId: string;
    lotId: number;
    amount: number;
    receiptUrl: string;
    scope: 'PIE' | 'INSTALLMENT';
    installmentsCount?: number;
}) {
    const session = await auth();
    if (!session?.user) {
        throw new Error("Unauthorized");
    }

    // Verify reservation owns lot
    const reservation = await prisma.reservation.findUnique({
        where: { id: reservationId },
        select: { buyer_id: true, seller_id: true }
    });

    if (!reservation) {
        throw new Error("Reserva no encontrada");
    }

    try {
        const receipt = await prisma.paymentReceipt.create({
            data: {
                reservation_id: reservationId,
                lot_id: lotId,
                amount_clp: amount,
                receipt_url: receiptUrl,
                scope: scope,
                installments_count: installmentsCount,
                status: 'PENDING'
            }
        });

        // Trigger webhook or notification logic if necessary

        revalidatePath('/user/plots');
        return { success: true, receipt };

    } catch (error) {
        console.error("Error creating receipt:", error);
        throw new Error("Error al subir el comprobante");
    }
}

export async function approvePaymentReceipt(receiptId: string, serverAuthOverride = false) {
    if (!serverAuthOverride) {
        const session = await auth();
        if (!session?.user || session.user.role !== 'ADMIN') {
            throw new Error("Unauthorized");
        }
    }

    try {
        const receipt = await prisma.paymentReceipt.findUnique({
            where: { id: receiptId },
            include: { reservation: true }
        });

        if (!receipt) {
            throw new Error("Comprobante no encontrado");
        }
        if (receipt.status !== 'PENDING') {
            throw new Error("El comprobante ya fue procesado");
        }

        // 1. Calculate Nominal Serial Numbers
        const currentPaid = receipt.reservation.installments_paid || 0;
        const count = receipt.installments_count || 1;
        let nominalNumber: number | null = null;
        let nominalRange: string | null = null;

        if (receipt.scope === 'INSTALLMENT') {
            if (count === 1) {
                nominalNumber = currentPaid + 1;
            } else {
                nominalRange = `${currentPaid + 1}-${currentPaid + count}`;
            }
        }

        // 2. Mark Receipt as Approved
        await prisma.paymentReceipt.update({
            where: { id: receiptId },
            data: { 
                status: 'APPROVED', 
                processed_at: new Date(),
                nominal_installment_number: nominalNumber,
                nominal_installment_range: nominalRange
            }
        });

        // 2. Process Business Logic (similar to webpay commit)
        if (receipt.scope === 'PIE') {
            await prisma.reservation.update({
                where: { id: receipt.reservation_id },
                data: {
                    pie_status: 'PAID',
                    pipeline_stage: 'PIE_PAGADO' // Avanzamos el embudo
                }
            });
        } else if (receipt.scope === 'INSTALLMENT') {
            const currentInstallmentsPaid = receipt.reservation.installments_paid || 0;
            const newInstallmentsPaid = currentInstallmentsPaid + (receipt.installments_count || 1);

            await prisma.reservation.update({
                where: { id: receipt.reservation_id },
                data: {
                    installments_paid: newInstallmentsPaid,
                    pipeline_stage: 'PAGO_CUOTAS',
                    next_payment_date: null // Clear manual override so system recalculates
                }
            });
        }

        // Trigger webhook for Email Notification with PDF logic
        // We do this non-blocking to prevent slow UI response
        sendPaymentReceiptWebhook(receiptId).catch((e) => console.error("Webhook Error on Receipt Approval:", e));

        memoryCache.deleteByPrefix('postventa_full_');
        memoryCache.deleteByPrefix('receipts_paginated_');
        revalidatePath('/admin/receipts');
        revalidatePath('/user/plots');
        return { success: true };

    } catch (error) {
        console.error("Error approving receipt:", error);
        throw new Error("Error al aprobar comprobante");
    }
}

export async function rejectPaymentReceipt(receiptId: string, reason: string, serverAuthOverride = false) {
    if (!serverAuthOverride) {
        const session = await auth();
        if (!session?.user || session.user.role !== 'ADMIN') {
            throw new Error("Unauthorized");
        }
    }

    try {
        await prisma.paymentReceipt.update({
            where: { id: receiptId },
            data: {
                status: 'REJECTED',
                processed_at: new Date(),
                rejection_reason: reason
            }
        });

        memoryCache.deleteByPrefix('postventa_full_');
        memoryCache.deleteByPrefix('receipts_paginated_');
        revalidatePath('/admin/receipts');
        revalidatePath('/user/plots');
        return { success: true };

    } catch (error) {
        console.error("Error rejecting receipt:", error);
        throw new Error("Error al rechazar comprobante");
    }
}
