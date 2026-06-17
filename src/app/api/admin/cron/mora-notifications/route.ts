import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { calculateTotalInterest, getInstallmentDueDate, calculateDaysLate } from '@/lib/financials';
import { sendMoraWebhook } from '@/lib/webhooks';

// This endpoint is called by n8n on the 11th of every month
// Protected by a secret header: x-cron-secret
export async function POST(req: NextRequest) {
    const secret = req.headers.get('x-cron-secret');
    if (secret !== process.env.CRON_SECRET) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // ?test=true → bypasses date check and skips DB writes (safe for testing in n8n)
    const url = new URL(req.url);
    const isTest = url.searchParams.get('test') === 'true';

    try {
        const now = new Date();
        // Force Chile Time for date calculation (to be consistent with the 11th rule)
        const chileNow = new Date(now.toLocaleString("en-US", { timeZone: "America/Santiago" }));
        const dayOfMonth = chileNow.getDate();

        // The cron should be called daily by n8n.
        // We no longer lock it from the 11th, because custom due dates (e.g. 15th) mean
        // the mora day could be the 21st, etc.

        const month = chileNow.getMonth() + 1;
        const year = chileNow.getFullYear();

        // Find all users with active reservations (matching postventa dashboard logic)
        const reservations = await prisma.reservation.findMany({
            where: {
                buyer_id: { not: null },
                lot: { status: { in: ['sold', 'reserved'] } },
                status: { not: 'pending' } // Exclude completely unpaid shopping carts
            },
            include: {
                buyer: true,
                lot: true
            }
        });

        let notifiedCount = 0;
        const notifiedUsers: any[] = [];

        for (const res of reservations) {
            if (!res.buyer_id || !res.buyer || !res.lot) continue;

            const installmentsPaid = res.installments_paid || 0;
            const totalCuotas = res.lot.cuotas || 0;

            if (installmentsPaid >= totalCuotas) continue;

            // Determine the "Next" installment number
            const nextInstallmentNum = installmentsPaid + 1;

            // Calculate Due Date for this installment
            const customStart = res.legacy_installment_start_date ? new Date(res.legacy_installment_start_date) : null;
            const customDueDay = customStart ? customStart.getDate() : null;
            const baseDate = customStart || res.created_at;
            
            const dueDate = getInstallmentDueDate(baseDate, nextInstallmentNum, Boolean(res.is_legacy), customDueDay, Boolean(res.is_promo));

            // Check if this installment's due date is in the CURRENT month (or past)
            // But specifically, if today is the 11th, we are checking if the installment due on the 5th of THIS month is unpaid.
            const dueMonth = dueDate.getMonth() + 1;
            const dueYear = dueDate.getFullYear();

            // If the due date is in the future (next month), it's not late yet.
            if (dueYear > year || (dueYear === year && dueMonth > month)) {
                continue;
            }

            // Calculate Interest
            const interest = calculateTotalInterest(
                res.lot.price_total_clp || 0,
                res.lot.area_m2 || 200,
                dueDate,
                res.is_legacy,
                chileNow,
                // @ts-ignore - Prisma client cache issue
                Boolean(res.mora_frozen),
                // @ts-ignore
                res.legacy_debt_start_date,
                // @ts-ignore
                res.legacy_debt_end_date
            );

            // If interest > 0, it means it's past the day 10 cutoff
            if (interest > 0) {
                // Determine days late
                const daysLate = calculateDaysLate(
                    dueDate,
                    chileNow,
                    res.is_legacy,
                    res.legacy_debt_start_date,
                    // @ts-ignore
                    res.legacy_debt_end_date
                );

                // Avoid duplicate notifications in the SAME month for the same user
                if (!isTest) {
                    const existingNotification = await prisma.notification.findFirst({
                        where: {
                            user_id: res.buyer_id,
                            type: 'payment_late',
                            created_at: {
                                gte: new Date(`${year}-${String(month).padStart(2, '0')}-01`),
                            }
                        }
                    });
                    if (existingNotification) continue;
                }

                const valorCuota = res.lot.valor_cuota || 0;
                const payload = {
                    reservation_id: res.id,
                    contact_name: res.buyer.name,
                    contact_email: res.buyer.email,
                    lot_number: res.lot.number || '',
                    lot_stage: res.lot.stage || 0,
                    cuota_numero: nextInstallmentNum,
                    monto_cuota: valorCuota,
                    interes_mora: interest,
                    total_a_pagar: valorCuota + interest,
                    dias_atraso: daysLate,
                    link_gestion_terreno: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://aliminlomasdelmar.com'}/user/plots`
                };

                // Trigger Webhook
                await sendMoraWebhook(payload);

                // Create Local Notification
                if (!isTest) {
                    await prisma.notification.create({
                        data: {
                            user_id: res.buyer_id,
                            type: 'payment_late',
                            title: '⚠️ Alerta de Mora',
                            message: `Tu cuota ${nextInstallmentNum}/${totalCuotas} se encuentra vencida. Se ha generado un interés de $${interest.toLocaleString('es-CL')} por ${daysLate} días de atraso.`,
                        }
                    });
                }

                notifiedUsers.push(payload);
                notifiedCount++;
            }
        }

        return NextResponse.json({
            ok: true,
            message: `Proceso completado. Notificaciones enviadas: ${notifiedCount}`,
            data: notifiedUsers
        });

    } catch (error) {
        console.error('[Cron Mora] Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
