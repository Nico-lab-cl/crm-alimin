
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🔄 Aplicando Promoción Minipie a lotes DISPONIBLES...');
    console.log('--------------------------------------------------');

    const result200 = await prisma.lot.updateMany({
        where: {
            status: 'available',
            area_m2: { gte: 200, lte: 299 },
        },
        data: {
            price_total_clp: 40990000,
            pie: 1500000,
            cuotas: 71,
            valor_cuota: 550000,
        },
    });
    console.log(`✅ Lotes 200m2 actualizados: ${result200.count} (pie=$1.500.000, 71 cuotas de $550.000, total=$40.990.000)`);

    const result390 = await prisma.lot.updateMany({
        where: {
            status: 'available',
            area_m2: { gte: 300, lte: 399 },
        },
        data: {
            price_total_clp: 50990000,
            pie: 3000000,
            cuotas: 87,
            valor_cuota: 550000,
        },
    });
    console.log(`✅ Lotes 390m2 actualizados: ${result390.count} (pie=$3.000.000, 87 cuotas de $550.000, total=$50.990.000)`);

    console.log('--------------------------------------------------');
    console.log('Lotes reservados/vendidos NO fueron modificados (promo solo aplica a disponibles).');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
