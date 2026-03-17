const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { getInstallmentDueDate, calculateTotalInterest } = require('../src/lib/financials');

async function findPending() {
    const allReservations = await prisma.reservation.findMany({
        where: {
            buyer_id: { not: null },
            lot: { 
                status: { in: ['sold', 'reserved'] }
            }
        },
        include: {
            lot: true
        }
    });

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    let lateCount = 0;
    let graceCount = 0;
    
    for (const res of allReservations) {
        const lot = res.lot;
        const totalCuotas = lot.cuotas || 0;
        const paidCuotas = res.installments_paid || 0;
        
        if (paidCuotas < totalCuotas) {
            const baseDate = res.legacy_installment_start_date
                ? new Date(res.legacy_installment_start_date).toISOString()
                : res.created_at.toISOString();
            
            const customStart = res.legacy_installment_start_date ? new Date(res.legacy_installment_start_date) : null;
            const customDueDay = customStart ? customStart.getDate() : null;
            
            const nextDueDate = getInstallmentDueDate(baseDate, paidCuotas + 1, Boolean(res.is_legacy), customDueDay, Boolean(res.is_promo));
            
            const penaltyAmount = calculateTotalInterest(
                lot.price_total_clp || 0,
                lot.area_m2 || 200,
                nextDueDate,
                Boolean(res.is_legacy),
                currentDate,
                Boolean(res.mora_frozen),
                res.legacy_debt_start_date
            );

            if (penaltyAmount > 0 && !res.mora_frozen) {
                lateCount++;
            } else if (currentDate >= nextDueDate && penaltyAmount === 0 && !res.mora_frozen) {
                graceCount++;
            }
        }
    }

    console.log('--- Postventa Stats ---');
    console.log('Late (Mora):', lateCount);
    console.log('Grace Period:', graceCount);
    console.log('Total Pending Action:', lateCount + graceCount);
    process.exit(0);
}

findPending().catch(e => { console.error(e); process.exit(1); });
