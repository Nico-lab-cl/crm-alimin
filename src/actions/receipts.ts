'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { sendPaymentReceiptWebhook } from '@/lib/webhooks';
import { memoryCache } from '@/lib/cache';
import { getInstallmentDueDate } from '@/lib/financials';

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
            await removeReceiptFromManualDocuments(receipt.reservation_id, receiptId);
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
        revalidatePath('/admin/receipts');

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
    scope,
    startDate,
    endDate,
    serverAuthOverride = false
}: {
    page?: number;
    pageSize?: number;
    status?: string | null;
    search?: string;
    scope?: 'PAGOS' | 'RESERVATION' | string;
    startDate?: string;
    endDate?: string;
    serverAuthOverride?: boolean;
} = {}) {
    if (!serverAuthOverride) {
        const session = await auth();
        if (!session?.user || session.user.role !== 'ADMIN') {
            throw new Error("Unauthorized");
        }
    }

    const cacheKey = `${RECEIPTS_PAGINATED_CACHE_KEY}${page}_${pageSize}_${status || 'all'}_${search || ''}_${scope || 'all'}_${startDate || ''}_${endDate || ''}`;
    const cached = memoryCache.get(cacheKey);
    if (cached) return cached;

    try {
        const where: any = {};
        if (status && status !== 'ALL') {
            where.status = status;
        }

        if (scope === 'RESERVATION') {
            where.scope = 'RESERVATION';
        } else if (scope === 'PAGOS') {
            where.scope = { not: 'RESERVATION' };
        }

        if (startDate || endDate) {
            where.created_at = {};
            if (startDate) {
                where.created_at.gte = new Date(`${startDate}T00:00:00.000Z`);
            }
            if (endDate) {
                where.created_at.lte = new Date(`${endDate}T23:59:59.999Z`);
            }
        }

        if (search) {
            where.OR = [
                { reservation: { buyer: { name: { contains: search, mode: 'insensitive' } } } },
                { reservation: { lot: { number: { contains: search, mode: 'insensitive' } } } }
            ];
        }

        const pendingWhere = { ...where, status: 'PENDING' };

        const [receipts, totalCount, pendingCount] = await Promise.all([
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
            prisma.paymentReceipt.count({ where }),
            prisma.paymentReceipt.count({ where: pendingWhere })
        ]);

        const result = {
            success: true,
            receipts,
            totalCount,
            totalPages: Math.ceil(totalCount / pageSize),
            currentPage: page,
            pendingCount
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

        memoryCache.deleteByPrefix('postventa_full_');
        memoryCache.deleteByPrefix('receipts_paginated_');
        revalidatePath('/admin/receipts');
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

        // Load digital receipt in the client portal
        await addReceiptToManualDocuments(receipt.reservation_id, {
            id: receiptId,
            scope: receipt.scope,
            nominal_installment_number: nominalNumber,
            nominal_installment_range: nominalRange
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
            const incrementBy = receipt.installments_count || 1;
            const currentPendingAmount = (receipt.reservation as any).pending_amount || 0;
            const currentExtraPaid = (receipt.reservation as any).extra_paid_amount || 0;

            // Atomic increment - safe against race conditions
            const updatedReservation = await prisma.reservation.update({
                where: { id: receipt.reservation_id },
                data: {
                    installments_paid: { increment: incrementBy },
                    pipeline_stage: 'PAGO_CUOTAS',
                    // @ts-ignore
                    extra_paid_amount: currentExtraPaid + currentPendingAmount,
                    // @ts-ignore
                    pending_amount: 0
                },
                include: { lot: true }
            });

            // Calculate next_payment_date based on the new installments_paid
            const nextPaymentDate = await calculateNextPaymentDate(updatedReservation);
            await prisma.reservation.update({
                where: { id: receipt.reservation_id },
                data: { next_payment_date: nextPaymentDate }
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

/**
 * Edit the amount of an existing payment receipt.
 * Creates an audit log entry for traceability.
 */
export async function editReceiptAmount(receiptId: string, newAmount: number, reason: string) {
    const session = await auth();
    const isPostventa = session?.user?.email === 'postventa@lomasdelmar.cl' || session?.user?.email === 'postventa@aliminspa.cl';
    if (!session?.user || (session.user.role !== 'ADMIN' && !isPostventa)) {
        return { error: 'No autorizado' };
    }

    if (!newAmount || newAmount <= 0) {
        return { error: 'El monto debe ser mayor a 0' };
    }

    try {
        const receipt = await prisma.paymentReceipt.findUnique({
            where: { id: receiptId },
            include: { 
                reservation: { 
                    include: { 
                        lot: { select: { number: true, stage: true } },
                        buyer: { select: { name: true, email: true } }
                    } 
                } 
            }
        });

        if (!receipt) return { error: 'Recibo no encontrado' };

        const oldAmount = receipt.amount_clp;

        if (oldAmount === newAmount) {
            return { error: 'El monto nuevo es igual al actual' };
        }

        // 1. Update the receipt amount
        await prisma.paymentReceipt.update({
            where: { id: receiptId },
            data: { amount_clp: newAmount }
        });

        // 2. Create audit log entry
        const clientName = receipt.reservation?.buyer?.name || 'Desconocido';
        const lotNumber = receipt.reservation?.lot?.number || 'N/A';
        const lotStage = receipt.reservation?.lot?.stage || 'N/A';

        await prisma.auditLog.create({
            data: {
                action: 'UPDATE',
                entity: 'PaymentReceipt',
                entity_id: receiptId,
                details: JSON.stringify({
                    type: 'EDIT_RECEIPT_AMOUNT',
                    oldAmount,
                    newAmount,
                    difference: newAmount - oldAmount,
                    reason: reason || 'Sin motivo especificado',
                    clientName,
                    lotNumber,
                    lotStage,
                    scope: receipt.scope,
                    receiptDate: receipt.created_at,
                    editedBy: session.user.email
                }),
                pk: receipt.reservation_id,
                user_id: session.user.id,
                user_email: session.user.email,
            }
        });

        // 3. Invalidate caches
        memoryCache.deleteByPrefix('postventa_full_');
        memoryCache.deleteByPrefix('receipts_paginated_');
        revalidatePath('/admin/receipts');
        revalidatePath('/admin/dashboard');
        revalidatePath('/user/plots');

        return { 
            success: true, 
            message: `Monto actualizado de $${oldAmount.toLocaleString('es-CL')} a $${newAmount.toLocaleString('es-CL')}` 
        };

    } catch (error) {
        console.error("Error editing receipt amount:", error);
        return { error: 'Error al editar el monto del recibo' };
    }
}

export async function addReceiptToManualDocuments(
    reservationId: string,
    receipt: {
        id: string;
        scope: string;
        nominal_installment_number?: number | null;
        nominal_installment_range?: string | null;
    }
) {
    try {
        const reservation = await prisma.reservation.findUnique({
            where: { id: reservationId },
            select: { manual_documents: true }
        });

        if (!reservation) return;

        let manualDocs: any[] = [];
        if (reservation.manual_documents) {
            try {
                manualDocs = Array.isArray(reservation.manual_documents)
                    ? (reservation.manual_documents as any[])
                    : JSON.parse(reservation.manual_documents as string);
            } catch (e) {
                console.error("Error parsing manual_documents:", e);
            }
        }

        const pdfUrl = `/api/receipt/${receipt.id}/pdf`;

        // Check if it already exists to avoid duplicates
        const alreadyExists = manualDocs.some((doc: any) => doc.url === pdfUrl || doc.url?.includes(receipt.id));
        if (alreadyExists) return;

        let category = 'OTRO';
        let docName = 'Comprobante';
        if (receipt.scope === 'PIE') {
            category = 'PIE';
            docName = 'Comprobante de Pie';
        } else if (receipt.scope === 'INSTALLMENT') {
            category = 'CUOTAS';
            const num = receipt.nominal_installment_number;
            const range = receipt.nominal_installment_range;
            if (range) {
                docName = `Comprobante de Cuotas #${range}`;
            } else if (num) {
                docName = `Comprobante de Cuota #${num}`;
            } else {
                docName = `Comprobante de Cuota`;
            }
        }

        manualDocs.push({
            name: `${docName}.pdf`,
            url: pdfUrl,
            category: category,
            uploadedAt: new Date().toISOString()
        });

        await prisma.reservation.update({
            where: { id: reservationId },
            data: {
                manual_documents: manualDocs
            }
        });
    } catch (err) {
        console.error("Error adding receipt to manual_documents:", err);
    }
}

export async function removeReceiptFromManualDocuments(reservationId: string, receiptId: string) {
    try {
        const reservation = await prisma.reservation.findUnique({
            where: { id: reservationId },
            select: { manual_documents: true }
        });

        if (!reservation || !reservation.manual_documents) return;

        let manualDocs: any[] = [];
        try {
            manualDocs = Array.isArray(reservation.manual_documents)
                ? (reservation.manual_documents as any[])
                : JSON.parse(reservation.manual_documents as string);
        } catch (e) {
            console.error("Error parsing manual_documents:", e);
            return;
        }

        const pdfUrl = `/api/receipt/${receiptId}/pdf`;
        const updatedDocs = manualDocs.filter((doc: any) => doc.url !== pdfUrl && !doc.url?.includes(receiptId));

        if (updatedDocs.length !== manualDocs.length) {
            await prisma.reservation.update({
                where: { id: reservationId },
                data: {
                    manual_documents: updatedDocs
                }
            });
        }
    } catch (err) {
        console.error("Error removing receipt from manual_documents:", err);
    }
}

/**
 * Calculates the next_payment_date based on the current installments_paid.
 * Does NOT modify installments_paid - that should be done via atomic increment.
 */
export async function calculateNextPaymentDate(reservation: any): Promise<Date | null> {
    const totalCuotas = reservation.lot?.cuotas || 0;
    const currentPaid = reservation.installments_paid || 0;

    if (currentPaid >= totalCuotas) {
        return null; // All installments paid
    }

    const isLegacyBool = Boolean(reservation.is_legacy);
    const baseDate = reservation.legacy_installment_start_date
        ? new Date(reservation.legacy_installment_start_date).toISOString()
        : reservation.created_at.toISOString();

    const customStart = reservation.legacy_installment_start_date ? new Date(reservation.legacy_installment_start_date) : null;
    const customDueDay = customStart ? customStart.getDate() : null;

    return getInstallmentDueDate(
        baseDate,
        currentPaid + 1,
        isLegacyBool,
        customDueDay,
        Boolean(reservation.is_promo)
    );
}
