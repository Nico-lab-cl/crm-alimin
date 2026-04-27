const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const allLots = await prisma.lot.findMany({
    where: {
      status: 'sold',
      stage: {
        not: 4 // Excluir toda la etapa 4
      }
    },
    include: {
      reservations: {
        where: {
          status: { in: ['paid', 'confirmed'] }
        },
        include: {
          buyer: true
        }
      }
    }
  });

  let totalCounted = 0;
  let assigned = 0;
  let unassigned = 0;
  let unassignedDetails = [];

  // Excluir lotes especificos
  const excludedLots = [
    { stage: 1, number: "28" },
    { stage: 2, number: "1" },
    { stage: 2, number: "29" },
    { stage: 3, number: "26" },
    { stage: 3, number: "27" },
    { stage: 3, number: "43" }
  ];

  for (const lot of allLots) {
    // Check if lot is in exclusion list
    const isExcluded = excludedLots.some(ex => ex.stage === lot.stage && ex.number === lot.number.toString());
    
    if (isExcluded) {
      continue;
    }

    totalCounted++;
    let hasAssignedUser = false;
    for (const res of lot.reservations) {
      if (res.buyer_id || res.buyer) {
        hasAssignedUser = true;
        break;
      }
    }
    
    if (hasAssignedUser) {
      assigned++;
    } else {
      unassigned++;
      unassignedDetails.push(`Lote ${lot.number} (Etapa ${lot.stage})`);
    }
  }

  console.log(`============= REPORTE DE LOTES (FILTRADO FINAL) =============`);
  console.log(`Lotes "Vendidos" Totales Evaluados   : ${totalCounted}`);
  console.log(`Lotes Con Usuario (Cliente) Asignado : ${assigned}`);
  console.log(`Lotes SIN Usuario Asignado           : ${unassigned}`);
  console.log(`=============================================================`);
  
  if (unassigned > 0) {
      console.log("\nDetalle Lotes Vendidos SIN usuario restantes:");
      unassignedDetails.forEach(d => console.log(d));
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
