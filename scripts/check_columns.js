const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
    const res = await prisma.$queryRawUnsafe("SELECT column_name FROM information_schema.columns WHERE table_name = 'Reservation'");
    console.log(JSON.stringify(res, null, 2));
    process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });
