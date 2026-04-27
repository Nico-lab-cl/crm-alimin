import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('--- CORRIGIENDO TYPO EN PRECIO 390m2 ---');

    const update = await prisma.$executeRaw`
        UPDATE "Lot" 
        SET price_total_clp = 37990000
        WHERE status IN ('available', 'reserved', 'blocked')
          AND (stage != 4 OR stage IS NULL)
          AND area_m2 >= 300
    `;
    console.log(`Lotes actualizados: ${update}`);

    process.exit(0);
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
