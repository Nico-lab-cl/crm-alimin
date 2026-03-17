const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { getInstallmentDueDate, calculateTotalInterest } = require('./src/lib/financials');

async function findPending() {
    const allReservations = await prisma.reservation.findMany({
        where: {
            buyer_id: { not: null },
            lot: { 
                status: { in: ['sold', 'reserved'] }
            }
        },
        include: {
            lot: true,
            receipts: { where: { status: 'APPROVED' } }
        }
    });

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    let lateCount = 0;
    let graceCount = 0;
    let upcomingCount = 0;
    let okCount = 0;
    
    const fiveDaysFromNow = new Date(currentDate);
    fiveDaysFromNow.setDate(fiveDaysFromNow.getDate() + 5);

    for (const res of allReservations) {
        const lot = res.lot;
        const totalCuotas = lot.cuotas || 0;
        const paidCuotas = res.installments_paid || 0;
        
        let status = 'OK';

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

            const targetMonth = nextDueDate.getUTCMonth();
            const targetYear = nextDueDate.getUTCFullYear();
            const hasPaidCurrentInstallment = res.receipts.some(r => {
                if (r.scope !== 'INSTALLMENT') return false;
                const rDate = new Date(r.created_at);
                return rDate.getUTCMonth() === targetMonth && rDate.getUTCFullYear() === targetYear;
            });

            if (penaltyAmount > 0 && !res.mora_frozen) {
                status = 'LATE';
                lateCount++;
            } else if (nextDueDate <= currentDate && penaltyAmount === 0 && !res.mora_frozen && !hasPaidCurrentInstallment) {
                status = 'GRACE';
                graceCount++;
            } else if (nextDueDate > currentDate && nextDueDate <= fiveDaysFromNow && !hasPaidCurrentInstallment && !res.mora_frozen) {
                status = 'UPCOMING';
                upcomingCount++;
            } else {
                okCount++;
            }
        } else {
            okCount++;
        }
    }

    console.log('--- Postventa Stats ---');
    console.log('Late (Mora):', lateCount);
    console.log('Grace Period:', graceCount);
    console.log('Upcoming:', upcomingCount);
    console.log('OK:', okCount);
    console.log('Total Non-OK:', lateCount + graceCount + upcomingCount);
    process.exit(0);
}

findPending().catch(e => { console.error(e); process.exit(1); });
