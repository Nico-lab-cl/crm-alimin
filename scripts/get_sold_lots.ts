import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function main() {
  const reservations = await prisma.reservation.findMany({
    include: {
      lot: true
    },
    orderBy: {
        created_at: 'desc'
    }
  });

  if (reservations.length === 0) {
    fs.writeFileSync('reporte_lotes.txt', 'No se encontraron reservas.');
    return;
  }

  let output = 'LOTE | NOMBRE | ETAPA CRM | VALOR TOTAL | CUOTAS PAGADAS | MONTO CUOTA | ÚLT. CUOTA\n';
  output += '------------------------------------------------------------------------------------------\n';

  reservations.forEach((res) => {
    const lot = res.lot;
    const name = `${res.name} ${res.last_name || ''}`.trim();
    const stage = res.pipeline_stage;
    const total = lot.price_total_clp?.toLocaleString('es-CL') || '0';
    const paid = res.installments_paid || 0;
    const cuota = lot.valor_cuota?.toLocaleString('es-CL') || '0';
    const last = lot.last_installment_amount?.toLocaleString('es-CL') || '0';
    const num = lot.number || `#${lot.id}`;

    output += `${num} | ${name} | ${stage} | $${total} | ${paid} | $${cuota} | $${last}\n`;
  });

  fs.writeFileSync('reporte_lotes.txt', output);
  console.log('Reporte generado en reporte_lotes.txt');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
