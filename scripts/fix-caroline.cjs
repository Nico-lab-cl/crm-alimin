const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const resId = "705f05d5-7216-4b9e-a4d2-f6e8ae782f0f";
    
    console.log(`Starting fix for Reservation ${resId}...`);

    // 1. Update Reservation (just in case, as requested by plan, though user said they did it)
    const updatedRes = await prisma.reservation.update({
        where: { id: resId },
        data: {
            installments_paid: 2,
            next_payment_date: new Date('2026-05-05T12:00:00Z'), // Cuota 3
            legacy_current_installment: 3
        }
    });
    console.log(`Updated Reservation: PAID=${updatedRes.installments_paid}, NEXT=${updatedRes.next_payment_date.toISOString()}`);

    // 2. Update Receipts
    // We have two receipts: 8bab678c... and 046634dc...
    // Both are currently #1. We'll set 046634dc to #2.
    
    const receipts = await prisma.paymentReceipt.findMany({
        where: { reservation_id: resId, scope: 'INSTALLMENT' },
        orderBy: { created_at: 'asc' }
    });

    console.log(`Found ${receipts.length} installment receipts.`);

    for (const r of receipts) {
        if (r.id.startsWith('046634dc')) {
            console.log(`Updating receipt ${r.id} to Cuota #2...`);
            await prisma.paymentReceipt.update({
                where: { id: r.id },
                data: {
                    nominal_installment_number: 2,
                    nominal_installment_range: '2'
                }
            });
        } else if (r.id.startsWith('8bab678c')) {
            console.log(`Ensuring receipt ${r.id} is Cuota #1...`);
            await prisma.paymentReceipt.update({
                where: { id: r.id },
                data: {
                    nominal_installment_number: 1,
                    nominal_installment_range: '1'
                }
            });
        }
    }

    console.log("Done.");
    await prisma.$disconnect();
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
