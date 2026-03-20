import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const users = ['Eduardo Arroyo', 'Alan Larico'];
  
  for (const name of users) {
    console.log(`\n--- Buscando a: ${name} ---`);
    const res = await prisma.reservation.findFirst({
      where: {
        OR: [
          { name: { contains: name.split(' ')[0] }, last_name: { contains: name.split(' ')[1] } },
          { name: { contains: name } }
        ]
      },
      include: {
        lot: true
      }
    });

    if (res) {
      console.log(`Nombre: ${res.name} ${res.last_name}`);
      console.log(`Lote (Número): ${res.lot.number}`);
      console.log(`Lote (ID): ${res.lot.id}`);
      console.log(`Etapa del Lote: ${res.lot.stage}`);
      console.log(`Monto Reserva en BD: ${res.lot.reservation_amount_clp}`);
    } else {
      console.log('No encontrado.');
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
