import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { calculateTotalInterest, getInstallmentDueDate } from '@/lib/financials';
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

        // Rule: Only run from the 11th onwards (unless it's a test)
        if (!isTest && dayOfMonth < 11) {
            return NextResponse.json({
                ok: false,
                message: `La notificación de mora solo se procesa desde el día 11 de cada mes. Hoy es día ${dayOfMonth}`,
            }, { status: 200 });
        }

        const month = chileNow.getMonth() + 1;
        const year = chileNow.getFullYear();

        // Find all users with active reservations
        const reservations = await prisma.reservation.findMany({
            where: {
                status: { in: ['paid', 'confirmed'] },
                buyer_id: { not: null },
                // Use signed_at as a filter to only include those who have already started their payment schedule
                signed_at: { not: null },
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
            const dueDate = getInstallmentDueDate(res.created_at, nextInstallmentNum, res.is_legacy);

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
                chileNow
            );

            // If interest > 0, it means it's past the day 10 cutoff
            if (interest > 0) {
                // Determine days late
                const graceEnd = new Date(dueDate);
                graceEnd.setDate(10);
                graceEnd.setHours(0, 0, 0, 0);
                const dNow = new Date(chileNow);
                dNow.setHours(0, 0, 0, 0);
                const diffTime = dNow.getTime() - graceEnd.getTime();
                const daysLate = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

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
