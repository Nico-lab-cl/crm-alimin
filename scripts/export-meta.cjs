const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();

async function main() {
  const clients = await prisma.reservation.findMany({
    where: {
      status: 'paid', // Confirmado / Pagado
      lot: {
        status: 'sold',
        stage: { not: 4 }
      },
      buyer_id: { not: null }
    },
    include: {
      lot: true
    }
  });

  const excludedLots = [
    { stage: 1, number: "28" },
    { stage: 2, number: "1" },
    { stage: 2, number: "29" },
    { stage: 3, number: "26" },
    { stage: 3, number: "27" },
    { stage: 3, number: "43" }
  ];

  const csvRows = [
    'email,phone,fn,ln,ct,event_name,event_time,value,currency'
  ];

  for (const client of clients) {
    // 1. Exclusion filter
    const isExcluded = excludedLots.some(ex => ex.stage === client.lot.stage && ex.number === client.lot.number.toString());
    if (isExcluded) continue;

    // 2. Format Phone (569XXXXXXXX)
    let phone = client.phone.replace(/\D/g, '');
    if (!phone.startsWith('56')) {
        phone = '56' + (phone.startsWith('9') ? phone : '9' + phone);
    }
    // Final check to ensure it looks like a Chilean mobile
    if (phone.length === 11 && phone.startsWith('569')) {
        // Correct
    } else if (phone.length === 9) {
        phone = '56' + phone;
    }

    // 3. Format Names
    const fn = client.name || '';
    const ln = client.last_name || '';

    // 4. Format Event Time (YYYY-MM-DD)
    const eventTimeDate = client.signed_at || client.created_at;
    const eventTime = eventTimeDate.toISOString().split('T')[0];

    // 5. Format Value
    const value = client.lot.reservation_amount_clp || 500000;

    // 6. City (Commune)
    const ct = client.address_commune || '';

    const row = [
      client.email.toLowerCase().trim(),
      phone,
      fn.trim(),
      ln.trim(),
      ct.trim(),
      'Reserva_Lote',
      eventTime,
      value,
      'CLP'
    ].map(val => `"${val}"`).join(',');

    csvRows.push(row);
  }

  const csvContent = csvRows.join('\n');
  fs.writeFileSync('clientes_lomas_meta_offline.csv', csvContent);

  console.log(`Reporte generado: clientes_lomas_meta_offline.csv`);
  console.log(`Total clientes exportados: ${csvRows.length - 1}`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
