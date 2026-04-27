const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();

async function main() {
    const res = await prisma.reservation.findFirst({
        where: { lot: { number: '45', stage: 2 } },
        include: { receipts: { orderBy: { created_at: 'asc' } } }
    });
    if (!res) { 
        fs.writeFileSync('diag_output.json', JSON.stringify({ error: 'NONE' }));
        return; 
    }
    fs.writeFileSync('diag_output.json', JSON.stringify(res, null, 2));
    await prisma.$disconnect();
}
main();
