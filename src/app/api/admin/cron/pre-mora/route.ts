import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getInstallmentDueDate } from '@/lib/financials';
import { sendMoraWebhook } from '@/lib/webhooks';

// This endpoint is called by n8n on the 10th of every month
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
        const chileNow = new Date(now.toLocaleString("en-US", { timeZone: "America/Santiago" }));
        const dayOfMonth = chileNow.getDate();

        // The cron should be called daily by n8n.
        // We no longer lock it to the 10th, because custom due dates (e.g. 15th) mean
        // the pre-mora day could be the 20th, etc.

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
        const debugInfo: any[] = [];
        const isDebug = url.searchParams.get('debug') === 'true';

        for (const res of reservations) {
            if (!res.buyer_id || !res.buyer || !res.lot) {
                if (isDebug) debugInfo.push({ id: res.id, reason: 'Missing buyer_id, buyer, or lot' });
                continue;
            }

            const installmentsPaid = res.installments_paid || 0;
            const totalCuotas = res.lot.cuotas || 0;

            if (installmentsPaid >= totalCuotas) {
                if (isDebug) debugInfo.push({ id: res.id, name: res.buyer.name, reason: 'All installments paid', paid: installmentsPaid, total: totalCuotas });
                continue;
            }

            // @ts-ignore - Prisma client cache issue
            if (res.mora_frozen) {
                if (isDebug) debugInfo.push({ id: res.id, name: res.buyer.name, reason: 'Mora is frozen for this client' });
                continue;
            }

            const nextInstallmentNum = installmentsPaid + 1;
            
            const customStart = res.legacy_installment_start_date ? new Date(res.legacy_installment_start_date) : null;
            const customDueDay = customStart ? customStart.getDate() : null;
            const baseDate = customStart || res.created_at;
            
            const dueDate = getInstallmentDueDate(baseDate, nextInstallmentNum, Boolean(res.is_legacy), customDueDay, Boolean(res.is_promo));

            const dueMonth = dueDate.getMonth() + 1;
            const dueYear = dueDate.getFullYear();

            // Check if the due date is in the CURRENT month (or past)
            if (dueYear > year || (dueYear === year && dueMonth > month)) {
                if (isDebug) debugInfo.push({ id: res.id, name: res.buyer.name, reason: 'Due date in future', dueDate, dueMonth, currentMonth: month });
                continue;
            }

            // Calculate Grace Period End (Pre-Mora target day)
            const gracePeriodEnd = new Date(dueDate);
            gracePeriodEnd.setDate(dueDate.getDate() + 5);

            // If it's not a test, only process users whose exact pre-mora day is TODAY
            if (!isTest) {
                if (gracePeriodEnd.getDate() !== dayOfMonth || gracePeriodEnd.getMonth() + 1 !== month || gracePeriodEnd.getFullYear() !== year) {
                    if (isDebug) debugInfo.push({ id: res.id, name: res.buyer.name, reason: 'Not exactly their pre-mora day', preMoraDate: gracePeriodEnd, today: dayOfMonth });
                    continue;
                }
            }

            // Avoid duplicate notifications in the SAME month for the same user
            if (!isTest) {
                const existingNotification = await prisma.notification.findFirst({
                    where: {
                        user_id: res.buyer_id,
                        type: 'payment_warning',
                        created_at: {
                            gte: new Date(`${year}-${String(month).padStart(2, '0')}-01`),
                        }
                    }
                });
                if (existingNotification) {
                    if (isDebug) debugInfo.push({ id: res.id, name: res.buyer.name, reason: 'Already notified this month' });
                    continue;
                }
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
                interes_mora: 0,
                total_a_pagar: valorCuota,
                dias_atraso: 0,
                is_pre_mora: true,
                link_gestion_terreno: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://aliminlomasdelmar.com'}/user/plots`
            };

            // Trigger Webhook using the existing mora webhook ID
            await sendMoraWebhook(payload);

            // Create Local Notification
            if (!isTest) {
                await prisma.notification.create({
                    data: {
                        user_id: res.buyer_id,
                        type: 'payment_warning',
                        title: '⚠️ Aviso Pre-Mora',
                        message: `Recordatorio: Mañana comienza a aplicar el interés por mora para tu cuota ${nextInstallmentNum}/${totalCuotas}. Tienes hasta el día de hoy para pagar sin que te cobremos multas por atrasos.`,
                    }
                });
            }

            notifiedUsers.push(payload);
            notifiedCount++;
        }

        return NextResponse.json({
            ok: true,
            message: `Proceso completado. Alertas pre-mora enviadas: ${notifiedCount}`,
            data: notifiedUsers,
            debug: isDebug ? debugInfo : undefined
        });

    } catch (error) {
        console.error('[Cron Pre-Mora] Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
