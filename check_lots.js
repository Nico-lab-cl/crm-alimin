
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
    const lots = await prisma.lot.findMany({
        where: { status: { in: ['sold', 'reserved'] } },
        include: { reservations: { include: { buyer: true } } }
    });

    console.log(`Total Sold/Reserved Lots: ${lots.length}`);

    lots.forEach(lot => {
        const activeRes = lot.reservations.find(r => r.buyer_id !== null);
        if (!activeRes) {
            console.log(`[MISSING BUYER] Lot ${lot.number} (ID: ${lot.id}) has no reservation with buyer_id`);
        } else {
            console.log(`[OK] Lot ${lot.number} - Buyer: ${activeRes.buyer?.name || 'Unknown'}`);
        }
    });
}

check().catch(e => console.error(e)).finally(() => prisma.$disconnect());
