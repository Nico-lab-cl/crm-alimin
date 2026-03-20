import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const lotStats = await prisma.lot.groupBy({
    by: ['status'],
    _count: { id: true }
  });
  
  const resStats = await prisma.reservation.groupBy({
    by: ['pipeline_stage'],
    _count: { id: true }
  });

  console.log('--- Resumen de Lotes ---');
  console.log(JSON.stringify(lotStats, null, 2));
  
  console.log('--- Resumen de Reservas por Etapa ---');
  console.log(JSON.stringify(resStats, null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
