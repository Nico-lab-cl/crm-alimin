import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('--- CORRIGIENDO PRECIOS DESACTUALIZADOS ---');

    // Actualizar lotes que no están vendidos (available, reserved, blocked)
    // Excluyendo Etapa 4
    
    console.log('Actualizando lotes de ~200 m2 (Etapas 1-3, No Sold)...');
    const update200 = await prisma.$executeRaw`
        UPDATE "Lot" 
        SET 
          price_total_clp = 29990000,
          pie = 5500000,
          valor_cuota = 550000,
          cuotas = 45,
          last_installment_amount = 290000
        WHERE status IN ('available', 'reserved', 'blocked')
          AND (stage != 4 OR stage IS NULL)
          AND area_m2 >= 200 AND area_m2 < 300
    `;
    console.log(`Lotes de 200m2 actualizados: ${update200}`);

    console.log('Actualizando lotes de ~390 m2 (Etapas 1-3, No Sold)...');
    const update390 = await prisma.$executeRaw`
        UPDATE "Lot" 
        SET 
          price_total_clp = 37900000,
          pie = 7500000,
          valor_cuota = 550000,
          cuotas = 56,
          last_installment_amount = 240000
        WHERE status IN ('available', 'reserved', 'blocked')
          AND (stage != 4 OR stage IS NULL)
          AND area_m2 >= 300
    `;
    console.log(`Lotes de 390m2 actualizados: ${update390}`);

    process.exit(0);
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
