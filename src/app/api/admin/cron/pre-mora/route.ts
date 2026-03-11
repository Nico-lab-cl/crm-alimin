import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { calculateTotalInterest, getInstallmentDueDate, calculateDailyInterest } from '@/lib/financials';
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
                lot: true,
                receipts: {
                    where: { status: 'APPROVED' },
                    orderBy: { created_at: 'desc' }
                }
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
                if (isDebug) debugInfo.push({ id: res.id, name: res.buyer.name, reason: 'All installments paid' });
                continue;
            }

            // @ts-ignore
            if (res.mora_frozen) {
                if (isDebug) debugInfo.push({ id: res.id, name: res.buyer.name, reason: 'Mora is frozen' });
                continue;
            }

            const nextInstallmentNum = installmentsPaid + 1;
            const customStart = res.legacy_installment_start_date ? new Date(res.legacy_installment_start_date) : null;
            const customDueDay = customStart ? customStart.getDate() : null;
            const isLegacyBool = Boolean(res.is_legacy);
            const baseDate = res.legacy_installment_start_date
                ? new Date(res.legacy_installment_start_date).toISOString()
                : res.created_at.toISOString();
            
            const nextDueDate = getInstallmentDueDate(baseDate, nextInstallmentNum, isLegacyBool, customDueDay, Boolean(res.is_promo));

            // Unified Interest Calculation (matches Postventa dashboard)
            const penaltyAmount = calculateTotalInterest(
                res.lot.price_total_clp || 0,
                res.lot.area_m2 || 200,
                nextDueDate,
                isLegacyBool,
                chileNow,
                // @ts-ignore
                Boolean(res.mora_frozen),
                res.legacy_debt_start_date
            );

            // Determine Status (using exact Dashboard logic)
            let isGracePeriod = false;
            let isLate = penaltyAmount > 0;

            if (!isLate && nextDueDate && chileNow >= nextDueDate) {
                // Potential Grace Period. Check if already paid for THIS month's installment.
                const hasPaidCurrent = res.receipts.some(r => {
                    if (r.scope !== 'INSTALLMENT') return false;
                    const rDate = new Date(r.created_at);
                    return rDate.getMonth() === nextDueDate.getMonth() && rDate.getFullYear() === nextDueDate.getFullYear();
                });

                if (!hasPaidCurrent) {
                    isGracePeriod = true;
                }
            }

            // If not in grace nor late, skip
            if (!isGracePeriod && !isLate) {
                if (isDebug) debugInfo.push({ id: res.id, name: res.buyer.name, reason: 'Up to date', nextDueDate });
                continue;
            }

            // Final check: is_pre_mora flag for n8n
            // true = reminder (grace), false = alert (mora)
            const isPreMora = isGracePeriod && !isLate;

            // ANTI-SPAM: Avoid duplicate notifications in the SAME month for the SAME status
            if (!isTest) {
                const typeToCheck = isPreMora ? 'payment_warning' : 'payment_late';
                const existingNotification = await prisma.notification.findFirst({
                    where: {
                        user_id: res.buyer_id,
                        type: typeToCheck,
                        created_at: {
                            gte: new Date(`${year}-${String(month).padStart(2, '0')}-01`),
                        }
                    }
                });
                if (existingNotification) {
                    if (isDebug) debugInfo.push({ id: res.id, name: res.buyer.name, reason: 'Already notified this month for this status', type: typeToCheck });
                    continue;
                }
            }

            const valorCuota = res.lot.valor_cuota || 0;
            const daily = calculateDailyInterest(res.lot.price_total_clp || 0, res.lot.area_m2 || 200);
            const daysLate = daily > 0 ? Math.round(penaltyAmount / daily) : 0;

            const payload = {
                reservation_id: res.id,
                contact_name: res.buyer.name,
                contact_email: res.buyer.email,
                lot_number: res.lot.number || '',
                lot_stage: res.lot.stage || 0,
                cuota_numero: nextInstallmentNum,
                monto_cuota: valorCuota,
                interes_mora: penaltyAmount,
                total_a_pagar: valorCuota + penaltyAmount,
                dias_atraso: daysLate,
                is_pre_mora: isPreMora,
                link_gestion_terreno: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://aliminlomasdelmar.com'}/user/plots`
            };

            // Trigger Webhook
            await sendMoraWebhook(payload);

            // Create Local Notification in DB (Anti-spam tracker)
            if (!isTest) {
                await prisma.notification.create({
                    data: {
                        user_id: res.buyer_id,
                        type: isPreMora ? 'payment_warning' : 'payment_late',
                        title: isPreMora ? '⚠️ Aviso de Vencimiento' : '🚨 Alerta de Mora',
                        message: isPreMora 
                            ? `Tu cuota ${nextInstallmentNum}/${totalCuotas} venció. Tienes pocos días de gracia restantes para pagar sin intereses.`
                            : `Tu cuota ${nextInstallmentNum}/${totalCuotas} está en mora. Se ha generado un interés de $${penaltyAmount.toLocaleString('es-CL')}.`,
                    }
                });
            }

            notifiedUsers.push(payload);
            notifiedCount++;
        }

        return NextResponse.json({
            ok: true,
            message: `Proceso completado. Alertas enviadas: ${notifiedCount}`,
            data: notifiedUsers,
            debug: isDebug ? debugInfo : undefined
        });

    } catch (error) {
        console.error('[Cron Pre-Mora] Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
