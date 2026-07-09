
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Libera lotes con status='reserved' cuyo bloqueo temporal (reserved_until)
// ya expiro y nunca se limpio, aplicando el mismo precio minipie que a los
// lotes ya disponibles. Espeja lo que bootstrap.ts hace en cada arranque.
//
// IMPORTANTE: reserved_until vencido NO implica que el checkout fue
// abandonado -- un cliente puede haber pagado su reserva y el campo
// simplemente nunca se limpio despues del pago. Por eso este script
// EXCLUYE cualquier lote que tenga una Reservation con status='paid',
// para no tocar precio/disponibilidad de un cliente que ya pago.
async function main() {
    console.log('🔄 Liberando reservas vencidas y aplicando precio minipie...');
    console.log('--------------------------------------------------');

    const now = new Date();
    const reservedLots = await prisma.lot.findMany({ where: { status: 'reserved' } });
    const staleCandidates = reservedLots.filter(l => !l.reserved_until || l.reserved_until < now);

    const paidReservations = await prisma.reservation.findMany({
        where: { lot_id: { in: staleCandidates.map(l => l.id) }, status: 'paid' },
        select: { lot_id: true },
    });
    const paidLotIds = new Set(paidReservations.map(r => r.lot_id));

    const stale = staleCandidates.filter(l => !paidLotIds.has(l.id));
    const skipped = staleCandidates.length - stale.length;

    console.log(`Encontrados ${staleCandidates.length} lotes con reserva vencida (${skipped} excluidos por tener una Reservation pagada -- cliente real, no se tocan).`);

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
