import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { calculateTotalInterest, getInstallmentDueDate } from '@/lib/financials';
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

            // Calculate Interest
            const interest = calculateTotalInterest(
                res.lot.price_total_clp || 0,
                res.lot.area_m2 || 200,
                dueDate,
                res.is_legacy,
                chileNow,
                // @ts-ignore
                Boolean(res.mora_frozen),
                res.legacy_debt_start_date
            );

            let isPreMora = false;
            let daysLate = 0;

            // STATUS 1: PRE-MORA (Last day of grace period)
            const gracePeriodEnd = new Date(dueDate);
            gracePeriodEnd.setDate(dueDate.getDate() + 5);
            gracePeriodEnd.setHours(0, 0, 0, 0);

            const isExactlyGraceEnd = 
                gracePeriodEnd.getDate() === dayOfMonth && 
                gracePeriodEnd.getMonth() + 1 === month && 
                gracePeriodEnd.getFullYear() === year;

            if (isExactlyGraceEnd && interest === 0) {
                isPreMora = true;
            } 
            // STATUS 2: MORA (Interest already accruing)
            else if (interest > 0) {
                isPreMora = false;
                const dNow = new Date(chileNow);
                dNow.setHours(0, 0, 0, 0);
                const diffTime = dNow.getTime() - gracePeriodEnd.getTime();
                daysLate = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
            }
            // OTHERWISE: Not delinquent yet
            else {
                if (isDebug) debugInfo.push({ id: res.id, name: res.buyer.name, reason: 'Not in pre-mora nor mora', dueDate, gracePeriodEnd });
                continue;
            }

            // Avoid duplicate notifications in the SAME month for the same type
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
                    if (isDebug) debugInfo.push({ id: res.id, name: res.buyer.name, reason: 'Already notified this month for this status' });
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
                interes_mora: interest,
                total_a_pagar: valorCuota + interest,
                dias_atraso: daysLate,
                is_pre_mora: isPreMora,
                link_gestion_terreno: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://aliminlomasdelmar.com'}/user/plots`
            };

            // Trigger Webhook using the existing mora webhook ID
            await sendMoraWebhook(payload);

            // Create Local Notification in DB
            if (!isTest) {
                await prisma.notification.create({
                    data: {
                        user_id: res.buyer_id,
                        type: isPreMora ? 'payment_warning' : 'payment_late',
                        title: isPreMora ? '⚠️ Aviso Pre-Mora' : '⚠️ Alerta de Mora',
                        message: isPreMora 
                            ? `Recordatorio: Mañana comienza a aplicar el interés por mora para tu cuota ${nextInstallmentNum}/${totalCuotas}. Tienes hasta hoy para pagar.`
                            : `Tu cuota ${nextInstallmentNum}/${totalCuotas} está vencida. Se ha generado un interés de $${interest.toLocaleString('es-CL')} por ${daysLate} días de atraso.`,
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
