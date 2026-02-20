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
        const month = now.getMonth() + 1; // 1-12
        const year = now.getFullYear();

        // Payments start March 5, 2026 — don't send notifications before that
        const PAYMENTS_START_YEAR = 2026;
        const PAYMENTS_START_MONTH = 3;

        if (
            year < PAYMENTS_START_YEAR ||
            (year === PAYMENTS_START_YEAR && month < PAYMENTS_START_MONTH)
        ) {
            return NextResponse.json({
                ok: false,
                message: `Notificaciones de cuotas empiezan en Marzo 2026. Mes actual: ${year}-${month}`,
            }, { status: 200 });
        }

        // Find all users with active reservations (signed contract)
        const reservations = await prisma.reservation.findMany({
            where: {
                status: { in: ['paid', 'confirmed'] },
                buyer_id: { not: null },
                signed_at: { not: null },
            },
            select: {
                id: true,
                buyer_id: true,
                installments_paid: true,
                buyer: {
                    select: { name: true, email: true }
                },
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
        const notifiedUsers: Array<{
            name: string;
            email: string;
            lotNumber: string;
            lotStage: number;
            cuotaNumero: number;
            totalCuotas: number;
            valorCuota: string;
        }> = [];

        for (const res of reservations) {
            if (!res.buyer_id || !res.buyer) continue;

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

            if (existingNotification) continue;

            const cuotasPaid = res.installments_paid ?? 0;
            const totalCuotas = res.lot?.cuotas ?? 0;

            if (totalCuotas > 0 && cuotasPaid < totalCuotas) {
                const nextCuota = cuotasPaid + 1;
                const valorCuota = res.lot?.valor_cuota;
                const valorStr = valorCuota
                    ? `$${valorCuota.toLocaleString('es-CL')}`
                    : 'Por confirmar';

                await prisma.notification.create({
                    data: {
                        user_id: res.buyer_id,
                        type: 'payment_due',
                        title: '📅 Cuota mensual disponible',
                        message: `Hoy comienza el período de pago de tu cuota ${nextCuota}/${totalCuotas}${valorStr ? ` (${valorStr})` : ''} — Lote ${res.lot?.number}, Etapa ${res.lot?.stage}. Tienes hasta el 10 de este mes para pagar sin interés.`,
                    }
                });

                notifiedUsers.push({
                    name: res.buyer.name,
                    email: res.buyer.email,
                    lotNumber: res.lot?.number ?? '',
                    lotStage: res.lot?.stage ?? 0,
                    cuotaNumero: nextCuota,
                    totalCuotas,
                    valorCuota: valorStr,
                });

                created++;
            }
        }

        return NextResponse.json({
            ok: true,
            message: `Notificaciones creadas: ${created}`,
            month: `${year}-${month}`,
            notifiedUsers, // n8n uses this to send emails
        });
    } catch (error) {
        console.error('[Cron] Error creating monthly notifications:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
