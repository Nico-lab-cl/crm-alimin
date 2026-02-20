import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// This endpoint is called by n8n on the 5th of every month
// Protected by a secret header: x-cron-secret
export async function POST(req: NextRequest) {
    const secret = req.headers.get('x-cron-secret');
    if (secret !== process.env.CRON_SECRET) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const now = new Date();
        const month = now.getMonth() + 1;
        const year = now.getFullYear();

        // Find all users with active reservations in 'PAGO_CUOTAS' or signed stage
        const reservations = await prisma.reservation.findMany({
            where: {
                status: { in: ['paid', 'confirmed'] },
                buyer_id: { not: null },
                // They should have a signed contract at minimum to be in payment stage
                signed_at: { not: null },
            },
            select: {
                id: true,
                buyer_id: true,
                installments_paid: true,
                lot: {
                    select: {
                        number: true,
                        stage: true,
                        cuotas: true,
                        valor_cuota: true,
                    }
                }
            }
        });

        let created = 0;

        for (const res of reservations) {
            if (!res.buyer_id) continue;

            // Check if we already sent this notification this month (avoid duplicates)
            const existingNotification = await prisma.notification.findFirst({
                where: {
                    user_id: res.buyer_id,
                    type: 'payment_due',
                    created_at: {
                        gte: new Date(`${year}-${String(month).padStart(2, '0')}-01`),
                    }
                }
            });

            if (existingNotification) continue; // Already notified this month

            const cuotasPaid = res.installments_paid ?? 0;
            const totalCuotas = res.lot?.cuotas ?? 0;

            // Only notify if there are still installments pending
            if (totalCuotas > 0 && cuotasPaid < totalCuotas) {
                const nextCuota = cuotasPaid + 1;
                const valorCuota = res.lot?.valor_cuota;
                const valorStr = valorCuota
                    ? `$${valorCuota.toLocaleString('es-CL')}`
                    : '';

                await prisma.notification.create({
                    data: {
                        user_id: res.buyer_id,
                        type: 'payment_due',
                        title: '📅 Cuota mensual disponible',
                        message: `Hoy comienza el período de pago de tu cuota ${nextCuota}/${totalCuotas}${valorStr ? ` (${valorStr})` : ''} — Lote ${res.lot?.number}, Etapa ${res.lot?.stage}. Tienes hasta el 10 de este mes para pagar sin interés.`,
                    }
                });

                created++;
            }
        }

        return NextResponse.json({
            ok: true,
            message: `Notificaciones creadas: ${created}`,
            month: `${year}-${month}`,
        });
    } catch (error) {
        console.error('[Cron] Error creating monthly notifications:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
