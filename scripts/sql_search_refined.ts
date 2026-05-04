
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function findDocFiles() {
  try {
    const results: any[] = await prisma.$queryRawUnsafe(`
      SELECT name, last_name, email, uploaded_contract_url, legacy_uploaded_contracts, manual_documents 
      FROM "Reservation" 
      WHERE 
        uploaded_contract_url ILIKE '%.doc%' OR 
        legacy_uploaded_contracts ILIKE '%.doc%' OR 
        CAST(manual_documents AS TEXT) ILIKE '%.doc%'
    `);

    if (results.length === 0) {
      console.log("No se encontraron clientes con documentos .doc/.docx.");
      return;
    }

    results.forEach(r => {
      console.log(`CLIENTE: ${r.name} ${r.last_name || ''} (${r.email})`);
      // Find the specific file
      const allStrings = JSON.stringify(r).toLowerCase();
      const matches = allStrings.match(/[^\s"']+\.docx?/gi);
      if (matches) {
        matches.forEach(m => {
          if (m.toLowerCase().includes('.doc')) {
             console.log(`  - ARCHIVO: ${m}`);
          }
        });
      }
      console.log("---");
    });

  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

findDocFiles();
