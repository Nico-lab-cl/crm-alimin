import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const lots = await prisma.lot.findMany({
    where: {
      number: '42'
    }
  });

  console.log('--- Lotes con número 42 ---');
  console.log(JSON.stringify(lots, null, 2));

  const reservations = await prisma.reservation.findMany({
    where: {
      lot_id: { in: lots.map(l => l.id) }
    },
    include: {
      lot: true
    }
  });

  console.log('--- Reservas para estos lotes ---');
  console.log(JSON.stringify(reservations, null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
