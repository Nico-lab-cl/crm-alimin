import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// URGENTE: revierte los 14 lotes que tenian una Reservation con status='paid'
// (cliente real que ya pago la reserva) y que fueron incorrectamente liberados
// a 'available' + precio minipie por release_stale_reservations.ts. Ese script
// asumio que status='reserved' con reserved_until vencido = checkout abandonado,
// pero en estos 14 casos la reserva SI se completo (pago realizado) y el campo
// reserved_until simplemente nunca se limpio tras el pago. Se restaura el
// status y el pricing original para que el lote no quede visible/seleccionable
// para otros visitantes y el cliente no vea cambiados los terminos que acepto.
const PAID_LOT_IDS = [125, 107, 67, 110, 66, 109, 123, 120, 108, 114, 126, 124, 58, 69];

async function main() {
  console.log('🔄 Revirtiendo 14 lotes con reserva PAGADA por cliente real...');
  console.log('--------------------------------------------------');

  const lots = await prisma.lot.findMany({ where: { id: { in: PAID_LOT_IDS } } });

  let reverted200 = 0;
  let reverted390 = 0;

  for (const lot of lots) {
    const area = lot.area_m2;
    let pricingData: Record<string, number> = {};

    if (area != null && area >= 200 && area <= 299) {
      pricingData = { price_total_clp: 29990000, pie: 5500000, cuotas: 45, valor_cuota: 550000, last_installment_amount: 290000 };
      reverted200++;
    } else if (area != null && area >= 300 && area <= 399) {
      pricingData = { price_total_clp: 37990000, pie: 7500000, cuotas: 56, valor_cuota: 550000, last_installment_amount: 240000 };
      reverted390++;
    }

    await prisma.lot.update({
      where: { id: lot.id },
      data: {
        status: 'reserved',
        ...pricingData,
      },
    });
    console.log(`  Lote id=${lot.id} (stage ${lot.stage} #${lot.number}, ${area}m2) -> status=reserved, precio original restaurado`);
  }

  console.log('--------------------------------------------------');
  console.log(`✅ Revertidos: ${reverted200} de 200m2, ${reverted390} de 390m2. Total: ${lots.length}`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
