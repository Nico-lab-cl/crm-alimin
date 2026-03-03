'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

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

export async function approvePaymentReceipt(receiptId: string) {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
        throw new Error("Unauthorized");
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

        // 1. Mark Receipt as Approved
        // @ts-ignore
        await prisma.paymentReceipt.update({
            where: { id: receiptId },
            data: { status: 'APPROVED', processed_at: new Date() }
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
                    pipeline_stage: 'PAGO_CUOTAS'
                }
            });
        }

        revalidatePath('/admin/receipts');
        revalidatePath('/user/plots');
        return { success: true };

    } catch (error) {
        console.error("Error approving receipt:", error);
        throw new Error("Error al aprobar comprobante");
    }
}

export async function rejectPaymentReceipt(receiptId: string, reason: string) {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
        throw new Error("Unauthorized");
    }

    try {
        // @ts-ignore
        await prisma.paymentReceipt.update({
            where: { id: receiptId },
            data: {
                status: 'REJECTED',
                processed_at: new Date(),
                rejection_reason: reason
            }
        });

        revalidatePath('/admin/receipts');
        revalidatePath('/user/plots');
        return { success: true };

    } catch (error) {
        console.error("Error rejecting receipt:", error);
        throw new Error("Error al rechazar comprobante");
    }
}
