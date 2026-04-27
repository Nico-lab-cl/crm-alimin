/**
 * Verificación post-migración: todos los clientes con legacy_installment_start_date
 */
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function getInstallmentDueDateNEW(acquisitionDate, installmentNumber, isLegacy, customDueDay) {
    const base = new Date(acquisitionDate);
    const dueDay = customDueDay || 5;
    const due = new Date(base.getFullYear(), base.getMonth(), dueDay, 12, 0, 0, 0);

    if (customDueDay) {
        due.setMonth(due.getMonth() + (installmentNumber - 1));
    } else if (isLegacy) {
        due.setMonth(due.getMonth() + installmentNumber);
    } else {
        if (base.getDate() <= 5) {
            due.setMonth(due.getMonth() + (installmentNumber - 1));
        } else {
            due.setMonth(due.getMonth() + installmentNumber);
        }
    }
    return due;
}

async function main() {
    const clients = await prisma.$queryRaw`
        SELECT r.id, r.name, r.last_name, r.is_legacy, r.installments_paid,
               r.legacy_installment_start_date, r.next_payment_date,
               l.number as lot_number, l.cuotas as total_cuotas
        FROM "Reservation" r
        JOIN "Lot" l ON r.lot_id = l.id
        WHERE r.legacy_installment_start_date IS NOT NULL
          AND r.status IN ('paid', 'confirmed')
        ORDER BY l.number ASC
    `;

    for (const c of clients) {
        const paid = Number(c.installments_paid) || 0;
        const total = Number(c.total_cuotas) || 0;
        const baseDate = new Date(c.legacy_installment_start_date);
        const customDueDay = baseDate.getDate();

        console.log(`\n${c.name} ${c.last_name || ''} | Lote ${c.lot_number} | legacy=${c.is_legacy} | ${paid}/${total} cuotas`);
        console.log(`  base: ${baseDate.toLocaleDateString('es-CL')} | customDueDay=${customDueDay}`);

        for (let i = 1; i <= Math.min(6, total || 6); i++) {
            const d = getInstallmentDueDateNEW(baseDate, i, c.is_legacy, customDueDay);
            const mark = i <= paid ? '✅' : (i === paid + 1 ? '⬜ ◄' : '⬜');
            console.log(`  ${mark} Cuota ${i}: ${d.toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' })}`);
        }
    }

    await prisma.$disconnect();
}

main().catch(err => { console.error(err); process.exit(1); });
