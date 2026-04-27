/**
 * Fix timezone: Luis Varela - La fecha se guardó en UTC y se desfasó un día
 * Necesitamos que el día 5 se mantenga en zona horaria chilena
 */
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const RESERVATION_ID = '58185313-260d-4115-8963-361709cc299d';

async function main() {
    // Use noon UTC to avoid timezone issues (noon UTC = 9am Chile = still same day)
    const correctDate = new Date('2026-01-05T12:00:00.000Z');
    
    console.log(`Fecha a guardar: ${correctDate.toISOString()}`);
    console.log(`En Chile: ${correctDate.toLocaleString('es-CL', { timeZone: 'America/Santiago' })}`);

    await prisma.reservation.update({
        where: { id: RESERVATION_ID },
        data: { legacy_installment_start_date: correctDate }
    });

    const after = await prisma.reservation.findUnique({
        where: { id: RESERVATION_ID },
        select: { legacy_installment_start_date: true }
    });
    
    const d = new Date(after.legacy_installment_start_date);
    console.log(`\nVerificación DB: ${d.toISOString()}`);
    console.log(`getDate(): ${d.getDate()}`);
    console.log(`✅ Corregido`);
    
    await prisma.$disconnect();
}

main().catch(err => { console.error(err); process.exit(1); });
