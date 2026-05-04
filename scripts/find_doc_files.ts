
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function findDocFiles() {
  try {
    // Faster query using filters
    const reservations = await prisma.reservation.findMany({
      where: {
        OR: [
          { uploaded_contract_url: { contains: '.doc', mode: 'insensitive' } },
          { legacy_uploaded_contracts: { contains: '.doc', mode: 'insensitive' } },
          { manual_documents: { path: ['$[*]', 'url'], array_contains: '.doc' } as any },
          { manual_documents: { path: ['$[*]', 'name'], array_contains: '.doc' } as any }
        ]
      },
      include: {
        lot: true,
        contact: {
          include: {
            files: {
              where: {
                OR: [
                  { name: { contains: '.doc', mode: 'insensitive' } },
                  { url: { contains: '.doc', mode: 'insensitive' } }
                ]
              }
            }
          }
        }
      }
    });

    if (reservations.length === 0) {
      console.log("No se encontraron clientes con documentos .doc/.docx en la base de datos principal.");
      return;
    }

    console.log(`ENCONTRADOS ${reservations.length} CLIENTES:`);
    console.log("==============================");
    reservations.forEach(r => {
      console.log(`Cliente: ${r.name} ${r.last_name || ''}`);
      console.log(`Email: ${r.email}`);
      console.log(`Terreno: Lote ${r.lot.number} - Etapa ${r.lot.stage}`);
      console.log(`Archivos detectados:`);
      if (r.uploaded_contract_url) console.log(`  - Contrato: ${r.uploaded_contract_url}`);
      if (r.legacy_uploaded_contracts) console.log(`  - Legacy Docs: ${r.legacy_uploaded_contracts}`);
      if (r.manual_documents) console.log(`  - Manual Docs: ${JSON.stringify(r.manual_documents)}`);
      if (r.contact?.files) {
        r.contact.files.forEach(f => console.log(`  - Contact File: ${f.name} (${f.url})`));
      }
      console.log("------------------------------");
    });

  } catch (error) {
    console.error("Error al ejecutar la consulta:", error);
  } finally {
    await prisma.$disconnect();
  }
}

findDocFiles();
