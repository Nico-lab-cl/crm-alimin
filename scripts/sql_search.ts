
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function findDocFiles() {
  try {
    const results = await prisma.$queryRawUnsafe(`
      SELECT name, last_name, email, uploaded_contract_url, legacy_uploaded_contracts, manual_documents 
      FROM "Reservation" 
      WHERE 
        uploaded_contract_url ILIKE '%.doc%' OR 
        legacy_uploaded_contracts ILIKE '%.doc%' OR 
        CAST(manual_documents AS TEXT) ILIKE '%.doc%'
    `);

    console.log(JSON.stringify(results, null, 2));

  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

findDocFiles();
