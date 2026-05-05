
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function findDocFiles() {
  try {
    const reservations = await prisma.reservation.findMany({
      include: { lot: true }
    });

    const matches = reservations.filter(res => {
      const str = JSON.stringify(res).toLowerCase();
      return str.includes('.doc');
    });

    const out = matches.map(res => ({
      client: `${res.name} ${res.last_name || ''}`.trim(),
      email: res.email,
      lot: `Lote ${res.lot.number} - Etapa ${res.lot.stage}`,
      data: res
    }));

    console.log(JSON.stringify(out, null, 2));

  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

findDocFiles();
