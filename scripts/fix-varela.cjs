/**
 * Fix: Luis Varela - Corregir installments_paid y limpiar next_payment_date
 * 
 * Problema: approvePaymentReceipt incrementó installments_paid pero
 * puede haber desincronización. Además next_payment_date tiene un
 * override manual que debe limpiarse para que el sistema recalcule.
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const RESERVATION_ID = '58185313-260d-4115-8963-361709cc299d';

async function main() {
    // 1. Count actual approved INSTALLMENT receipts
    const approvedCount = await prisma.paymentReceipt.count({
        where: {
            reservation_id: RESERVATION_ID,
            scope: 'INSTALLMENT',
            status: 'APPROVED'
        }
    });

    console.log(`📊 Recibos INSTALLMENT aprobados: ${approvedCount}`);

    // 2. Get current reservation state
    const reservation = await prisma.reservation.findUnique({
        where: { id: RESERVATION_ID },
        select: { installments_paid: true, next_payment_date: true, name: true }
    });

    console.log(`📋 Estado actual:`);
    console.log(`   installments_paid = ${reservation.installments_paid}`);
    console.log(`   next_payment_date = ${reservation.next_payment_date}`);

    if (reservation.installments_paid === approvedCount && reservation.next_payment_date === null) {
        console.log(`\n✅ Ya está correcto. No se necesitan cambios.`);
        await prisma.$disconnect();
        return;
    }

    // 3. Fix it
    console.log(`\n🔧 Corrigiendo:`);
    console.log(`   installments_paid: ${reservation.installments_paid} → ${approvedCount}`);
    console.log(`   next_payment_date: ${reservation.next_payment_date} → null (auto-cálculo)`);

    await prisma.reservation.update({
        where: { id: RESERVATION_ID },
        data: {
            installments_paid: approvedCount,
            next_payment_date: null
        }
    });

    console.log(`\n✅ Corregido exitosamente para ${reservation.name}.`);
    
    // 4. Verify
    const updated = await prisma.reservation.findUnique({
        where: { id: RESERVATION_ID },
        select: { installments_paid: true, next_payment_date: true }
    });
    console.log(`\n📋 Verificación:`);
    console.log(`   installments_paid = ${updated.installments_paid}`);
    console.log(`   next_payment_date = ${updated.next_payment_date}`);

    await prisma.$disconnect();
}

main().catch(err => {
    console.error("Error:", err);
    process.exit(1);
});
