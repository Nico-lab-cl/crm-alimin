import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkKarenData() {
    const res = await prisma.reservation.findFirst({
        where: {
            buyer_id: { not: null },
            name: { contains: 'KAREN', mode: 'insensitive' }
        },
        include: { lot: true, receipts: true }
    });

    if (!res) {
        console.log('Karen not found');
        return;
    }

    console.log(`Reservation ID: ${res.id}`);
    console.log(`Lot Reservation Amount: ${res.lot?.reservation_amount_clp}`);
    console.log(`Lot Pie: ${res.lot?.pie}`);
    console.log(`Receipts Count: ${res.receipts.length}`);
    res.receipts.forEach(r => {
        console.log(`- Scope: ${r.scope}, Amount: ${r.amount_clp}`);
    });
}

checkKarenData().catch(console.error).finally(() => prisma.$disconnect());
