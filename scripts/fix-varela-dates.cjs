/**
 * Fix #2: Luis Varela - Corregir legacy_installment_start_date
 * 
 * El cliente es is_legacy=false, por lo que la fórmula es:
 *   Cuota N = base + (N-1) meses
 * 
 * Para que Cuota 1 = Enero 2026, la base debe ser 2026-01-05.
 * Estaba en 2025-12-05 (el admin siguió la instrucción del form
 * que aplica solo a clientes legacy).
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const RESERVATION_ID = '58185313-260d-4115-8963-361709cc299d';

async function main() {
    const before = await prisma.reservation.findUnique({
        where: { id: RESERVATION_ID },
        select: { 
            name: true,
            installments_paid: true, 
            next_payment_date: true, 
            legacy_installment_start_date: true,
            is_legacy: true 
        }
    });

    console.log(`Cliente: ${before.name}`);
    console.log(`is_legacy: ${before.is_legacy}`);
    console.log(`ANTES: legacy_installment_start_date = ${before.legacy_installment_start_date}`);
    console.log(`ANTES: installments_paid = ${before.installments_paid}`);
    console.log(`ANTES: next_payment_date = ${before.next_payment_date}`);

    // Fix: Change base date to Jan 5 2026 so Cuota 1 = Jan, Cuota 5 = May
    const newStartDate = new Date('2026-01-05T00:00:00.000Z');

    await prisma.reservation.update({
        where: { id: RESERVATION_ID },
        data: {
            legacy_installment_start_date: newStartDate,
            next_payment_date: null // ensure auto-calculation
        }
    });

    const after = await prisma.reservation.findUnique({
        where: { id: RESERVATION_ID },
        select: { 
            installments_paid: true, 
            next_payment_date: true, 
            legacy_installment_start_date: true 
        }
    });

    console.log(`\nDESPUÉS: legacy_installment_start_date = ${after.legacy_installment_start_date}`);
    console.log(`DESPUÉS: next_payment_date = ${after.next_payment_date}`);

    // Simulate calendar
    const paidCuotas = after.installments_paid;
    const baseDate = new Date(after.legacy_installment_start_date);
    const customDueDay = baseDate.getDate(); // 5
    
    console.log(`\nCalendario corregido:`);
    for (let i = 1; i <= 8; i++) {
        const due = new Date(baseDate.getFullYear(), baseDate.getMonth(), customDueDay, 12, 0, 0, 0);
        due.setMonth(due.getMonth() + (i - 1)); // non-legacy formula
        const paid = i <= paidCuotas ? '✅' : '⬜';
        const mark = (i === paidCuotas + 1) ? ' ◄── PRÓXIMA' : '';
        const monthName = due.toLocaleDateString('es-CL', { month: 'long', year: 'numeric' });
        console.log(`   ${paid} Cuota ${i}: 05 ${monthName}${mark}`);
    }

    console.log(`\n✅ Corregido.`);
    await prisma.$disconnect();
}

main().catch(err => {
    console.error("Error:", err);
    process.exit(1);
});
