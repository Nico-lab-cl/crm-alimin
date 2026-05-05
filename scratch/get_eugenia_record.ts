
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const res = await prisma.reservation.findFirst({
        where: { name: { contains: 'Eugenia' } }
    });
    console.log(JSON.stringify(res, null, 2));
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
