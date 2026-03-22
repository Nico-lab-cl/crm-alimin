const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const receipts = await prisma.paymentReceipt.findMany({
    where: {
        reservation: {
            buyer: {
                name: { contains: 'Marcela', mode: 'insensitive' },
            }
        }
    },
    select: { id: true, amount_clp: true, receipt_url: true, created_at: true }
  });
  
  if (receipts.length === 0) {
     const res2 = await prisma.paymentReceipt.findMany({
       where: { reservation: { name: { contains: 'Marcela', mode: 'insensitive' } } },
       select: { id: true, receipt_url: true, created_at: true }
     });
     console.log("From legacy name field:", res2.map(r => ({ id: r.id, url: r.receipt_url?.substring(0, 100) })));
  } else {
     console.log("From buyer table:", receipts.map(r => ({ id: r.id, url: r.receipt_url?.substring(0, 100) })));
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
