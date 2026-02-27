const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    console.log("Looking for recent legacy reservations...");

    // Find legacy reservations from the last few hours
    const reservations = await prisma.reservation.findMany({
        where: {
            is_legacy: true,
            workflow_activated: true
        },
        orderBy: {
            created_at: 'desc'
        },
        take: 5,
        include: {
            buyer: true,
            lot: true
        }
    });

    console.log(`Found ${reservations.length} recently activated legacy reservations.`);

    for (const res of reservations) {
        console.log(`- Reservation ${res.id} | Buyer: ${res.buyer.name} | Lot: ${res.lot.number}`);

        await prisma.reservation.update({
            where: { id: res.id },
            data: { workflow_activated: false }
        });
        console.log(`  -> Reset workflow_activated to FALSE`);
    }

    console.log("Done.");
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
