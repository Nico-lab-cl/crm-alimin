import { PrismaClient } from '@prisma/client';
import { getInstallmentDueDate } from '../src/lib/financials';

const prisma = new PrismaClient();

async function main() {
    const isWrite = process.argv.includes('--write');
    console.log(isWrite ? "🚨 MODO ESCRITURA ACTIVO. Se guardarán los cambios en la base de datos." : "🔍 MODO SIMULACIÓN. No se guardará ningún cambio.");

    const reservations = await prisma.reservation.findMany({
        where: { buyer_id: { not: null } },
        include: { lot: true, receipts: true }
    });

    console.log(`Encontradas ${reservations.length} reservas activas para analizar.`);
    let discrepanciesCount = 0;
    let fixedCount = 0;

    for (const res of reservations) {
        const approvedReceipts = res.receipts.filter(r => r.status === 'APPROVED' && r.scope === 'INSTALLMENT');
        const legacySyncedCount = approvedReceipts.filter(r => r.receipt_url === 'LEGACY_SYNC').length;
        const nonLegacySyncedCount = approvedReceipts
            .filter(r => r.receipt_url !== 'LEGACY_SYNC')
            .reduce((sum, r) => sum + Math.max(1, r.installments_count || 1), 0);

        const startingLegacyCount = res.legacy_current_installment || 0;
        const expectedPaid = startingLegacyCount + nonLegacySyncedCount;

        const totalCuotas = res.lot?.cuotas || 0;
        let expectedNextPaymentDate: Date | null = null;

        if (expectedPaid < totalCuotas) {
            const isLegacyBool = Boolean(res.is_legacy);
            const baseDate = res.legacy_installment_start_date
                ? new Date(res.legacy_installment_start_date).toISOString()
                : res.created_at.toISOString();

            const customStart = res.legacy_installment_start_date ? new Date(res.legacy_installment_start_date) : null;
            const customDueDay = customStart ? customStart.getDate() : null;

            expectedNextPaymentDate = getInstallmentDueDate(
                baseDate,
                expectedPaid + 1,
                isLegacyBool,
                customDueDay,
                Boolean(res.is_promo)
            );
        }

        const dateMismatch = (res.next_payment_date && expectedNextPaymentDate)
            ? new Date(res.next_payment_date).toDateString() !== expectedNextPaymentDate.toDateString()
            : res.next_payment_date !== expectedNextPaymentDate;

        if (res.installments_paid !== expectedPaid || dateMismatch) {
            discrepanciesCount++;
            console.log(`--------------------------------------------------`);
            console.log(`Discrepancia en Cliente: ${res.name} ${res.last_name || ''} (${res.email})`);
            console.log(`  Lote: ${res.lot?.number} (Etapa ${res.lot?.stage})`);
            console.log(`  ANTES:`);
            console.log(`    installments_paid: ${res.installments_paid}`);
            console.log(`    next_payment_date: ${res.next_payment_date ? new Date(res.next_payment_date).toISOString() : 'null'}`);
            console.log(`  DEBIESE SER:`);
            console.log(`    installments_paid: ${expectedPaid}`);
            console.log(`    next_payment_date: ${expectedNextPaymentDate ? expectedNextPaymentDate.toISOString() : 'null'}`);

            if (isWrite) {
                await prisma.reservation.update({
                    where: { id: res.id },
                    data: {
                        installments_paid: expectedPaid,
                        next_payment_date: expectedNextPaymentDate
                    }
                });
                fixedCount++;
                console.log(`  ✅ REGISTRO ACTUALIZADO EN BASE DE DATOS.`);
            }
        }
    }

    console.log(`==================================================`);
    console.log(`Análisis finalizado.`);
    console.log(`Total discrepancias encontradas: ${discrepanciesCount}`);
    if (isWrite) {
        console.log(`Total reservas corregidas en la DB: ${fixedCount}`);
    } else {
        console.log(`Ejecuta con la opción '--write' para aplicar los cambios.`);
    }

    await prisma.$disconnect();
}

main().catch(console.error);
