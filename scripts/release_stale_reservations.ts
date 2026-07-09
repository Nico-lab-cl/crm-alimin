
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Libera lotes con status='reserved' cuyo bloqueo temporal (reserved_until)
// ya expiro y nunca se limpio, aplicando el mismo precio minipie que a los
// lotes ya disponibles. Espeja lo que bootstrap.ts hace en cada arranque.
async function main() {
    console.log('🔄 Liberando reservas vencidas y aplicando precio minipie...');
    console.log('--------------------------------------------------');

    const now = new Date();
    const reservedLots = await prisma.lot.findMany({ where: { status: 'reserved' } });
    const stale = reservedLots.filter(l => !l.reserved_until || l.reserved_until < now);

    console.log(`Encontrados ${stale.length} lotes con reserva vencida.`);

    let updated200 = 0;
    let updated390 = 0;
    let updatedOther = 0;

    for (const lot of stale) {
        const area = lot.area_m2;
        let pricingData: Record<string, number> = {};

        if (lot.stage !== 4 && area != null && area >= 200 && area <= 299) {
            pricingData = { price_total_clp: 40990000, pie: 1500000, cuotas: 71, valor_cuota: 550000 };
            updated200++;
        } else if (lot.stage !== 4 && area != null && area >= 300 && area <= 399) {
            pricingData = { price_total_clp: 50990000, pie: 3000000, cuotas: 87, valor_cuota: 550000 };
            updated390++;
        } else {
            updatedOther++;
        }

        await prisma.lot.update({
            where: { id: lot.id },
            data: {
                status: 'available',
                reserved_at: null,
                reserved_by: null,
                reserved_until: null,
                order_id: null,
                ...pricingData,
            },
        });
    }

    console.log(`✅ Liberados y con precio minipie: ${updated200} lotes 200m2, ${updated390} lotes 390m2.`);
    console.log(`ℹ️ Liberados sin cambio de precio (etapa 4 u otra area): ${updatedOther}.`);
    console.log('--------------------------------------------------');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
