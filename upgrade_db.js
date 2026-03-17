const { webPrisma } = require('./src/lib/prisma');
const { Prisma } = require('@prisma/client');

async function upgradeTable() {
    try {
        console.log("Adding UTM columns to 'leads' table in Contabo...");
        
        // Execute raw SQL to add columns if they don't exist
        await webPrisma.$executeRawUnsafe(`
            ALTER TABLE "leads" 
            ADD COLUMN IF NOT EXISTS "utm_source" TEXT,
            ADD COLUMN IF NOT EXISTS "utm_medium" TEXT,
            ADD COLUMN IF NOT EXISTS "utm_campaign" TEXT,
            ADD COLUMN IF NOT EXISTS "utm_content" TEXT,
            ADD COLUMN IF NOT EXISTS "utm_term" TEXT;
        `);
        
        console.log("Success! UTM columns added.");
        process.exit(0);
    } catch (error) {
        console.error("Failed to upgrade table:", error);
        process.exit(1);
    }
}

upgradeTable();
