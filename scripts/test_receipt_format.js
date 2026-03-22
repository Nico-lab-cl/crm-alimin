const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const receipts = await prisma.paymentReceipt.findMany({
    take: 10,
    where: { receipt_url: { not: 'LEGACY_SYNC' } }
  });
  
  for (const r of receipts) {
      if (r.receipt_url) {
          console.log(`ID: ${r.id}, Length: ${r.receipt_url.length}, Start: ${r.receipt_url.substring(0, 100)}`);
      } else {
          console.log(`ID: ${r.id}, No URL`);
      }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
