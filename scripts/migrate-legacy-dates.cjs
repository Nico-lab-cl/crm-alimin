/**
 * Migration: Ajustar legacy_installment_start_date para clientes legacy
 * 
 * La lógica cambió de:
 *   legacy + customDueDay: base + N (mes anterior)
 * A:
 *   customDueDay: base + (N-1) (mes de la primera cuota)
 * 
 * Para que los calendarios no cambien, debemos mover la fecha base
 * 1 mes adelante para todos los clientes que:
 *   - is_legacy = true
 *   - legacy_installment_start_date IS NOT NULL
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    // Find all legacy clients with custom start date
    const affected = await prisma.$queryRaw`
        SELECT r.id, r.name, r.last_name, r.is_legacy, r.legacy_installment_start_date,
               l.number as lot_number
        FROM "Reservation" r
        JOIN "Lot" l ON r.lot_id = l.id
        WHERE r.is_legacy = true 
          AND r.legacy_installment_start_date IS NOT NULL
          AND r.status IN ('paid', 'confirmed')
    `;

    console.log(`📊 Clientes legacy con fecha de inicio custom: ${affected.length}\n`);

    if (affected.length === 0) {
        console.log("✅ No hay clientes que migrar.");
        await prisma.$disconnect();
        return;
    }

    let migrated = 0;

    for (const row of affected) {
        const oldDate = new Date(row.legacy_installment_start_date);
        const newDate = new Date(oldDate);
        newDate.setMonth(newDate.getMonth() + 1); // Move 1 month forward

        console.log(`  ${row.name} ${row.last_name || ''} (Lote ${row.lot_number})`);
        console.log(`    ${oldDate.toLocaleDateString('es-CL')} → ${newDate.toLocaleDateString('es-CL')}`);

        await prisma.reservation.update({
            where: { id: row.id },
            data: { legacy_installment_start_date: newDate }
        });

        migrated++;
    }

    console.log(`\n✅ Migrados: ${migrated} clientes.`);
    await prisma.$disconnect();
}

main().catch(err => {
    console.error("Error:", err);
    process.exit(1);
});
