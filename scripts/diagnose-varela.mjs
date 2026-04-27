/**
 * Diagnóstico: Luis Varela - Cuotas Pagadas vs Fecha Próximo Pago
 * 
 * Ejecuta directamente contra la BD para extraer los datos crudos
 * y simular el cálculo financiero.
 */

import pg from 'pg';
const { Client } = pg;

const DATABASE_URL = "postgres://alimin:alimin2026@72.62.11.186:5432/db-alimin?sslmode=disable";

// ---- FINANCIAL LOGIC (replicated from financials.ts) ----
function getInstallmentDueDate(acquisitionDate, installmentNumber, isLegacy = false, customDueDay = null, isPromo = false) {
    const base = new Date(acquisitionDate);
    const dueDay = customDueDay || 5;
    const due = new Date(base.getFullYear(), base.getMonth(), dueDay, 12, 0, 0, 0);

    if (isLegacy) {
        due.setMonth(due.getMonth() + installmentNumber);
    } else {
        if (customDueDay) {
            due.setMonth(due.getMonth() + (installmentNumber - 1));
        } else {
            if (base.getDate() <= 5) {
                due.setMonth(due.getMonth() + (installmentNumber - 1));
            } else {
                due.setMonth(due.getMonth() + installmentNumber);
            }
        }
    }
    return due;
}

async function main() {
    const client = new Client({ connectionString: DATABASE_URL });
    await client.connect();
    console.log("✅ Conectado a la base de datos.\n");

    // 1. Buscar reservaciones con nombre "Luis Varela" o similar
    const searchQuery = `
        SELECT 
            r.id,
            r.name,
            r.last_name,
            r.email,
            r.installments_paid,
            r.pie_status,
            r.is_legacy,
            r.is_promo,
            r.legacy_installment_start_date,
            r.legacy_debt_start_date,
            r.legacy_current_installment,
            r.legacy_installment_ranges,
            r.next_payment_date,
            r.mora_frozen,
            r.created_at,
            r.status,
            r.extra_paid_amount,
            r.pending_amount,
            r.pie,
            l.id as lot_id,
            l.number as lot_number,
            l.stage as lot_stage,
            l.price_total_clp,
            l.pie as lot_pie,
            l.cuotas as total_cuotas,
            l.valor_cuota,
            l.area_m2,
            l.last_installment_amount
        FROM "Reservation" r
        JOIN "Lot" l ON r.lot_id = l.id
        WHERE LOWER(r.name) LIKE '%varela%'
           OR LOWER(r.last_name) LIKE '%varela%'
           OR LOWER(r.email) LIKE '%varela%'
        ORDER BY r.created_at DESC;
    `;

    const result = await client.query(searchQuery);
    
    if (result.rows.length === 0) {
        // Try with "luis" as well
        const result2 = await client.query(`
            SELECT 
                r.id, r.name, r.last_name, r.email, r.installments_paid, r.pie_status,
                r.is_legacy, r.is_promo, r.legacy_installment_start_date, r.legacy_debt_start_date,
                r.legacy_current_installment, r.legacy_installment_ranges, r.next_payment_date,
                r.mora_frozen, r.created_at, r.status, r.extra_paid_amount, r.pending_amount, r.pie,
                l.id as lot_id, l.number as lot_number, l.stage as lot_stage,
                l.price_total_clp, l.pie as lot_pie, l.cuotas as total_cuotas,
                l.valor_cuota, l.area_m2, l.last_installment_amount
            FROM "Reservation" r
            JOIN "Lot" l ON r.lot_id = l.id
            WHERE (LOWER(r.name) LIKE '%luis%' AND LOWER(r.name) LIKE '%varela%')
               OR (LOWER(r.name) LIKE '%luis%' AND LOWER(COALESCE(r.last_name,'')) LIKE '%varela%')
            ORDER BY r.created_at DESC;
        `);
        
        if (result2.rows.length === 0) {
            console.log("❌ No se encontró ninguna reservación para 'Luis Varela'.");
            console.log("\n🔍 Buscando todas las reservaciones con 'luis' en el nombre...");
            const result3 = await client.query(`
                SELECT r.id, r.name, r.last_name, r.email, r.installments_paid, l.number as lot_number
                FROM "Reservation" r
                JOIN "Lot" l ON r.lot_id = l.id
                WHERE LOWER(r.name) LIKE '%luis%'
                ORDER BY r.created_at DESC LIMIT 10;
            `);
            console.table(result3.rows);
            await client.end();
            return;
        }
        result.rows = result2.rows;
    }

    for (const row of result.rows) {
        console.log("═══════════════════════════════════════════════════════════════");
        console.log(`📋 CLIENTE: ${row.name} ${row.last_name || ''}`);
        console.log(`   Email: ${row.email}`);
        console.log(`   Reservation ID: ${row.id}`);
        console.log(`   Estado Reserva: ${row.status}`);
        console.log("═══════════════════════════════════════════════════════════════");

        console.log("\n📊 DATOS CRUDOS DE LA BASE DE DATOS:");
        console.log("───────────────────────────────────────");
        console.log(`   Lote:                     ${row.lot_number} (Etapa ${row.lot_stage})`);
        console.log(`   installments_paid (DB):   ${row.installments_paid}`);
        console.log(`   legacy_current_installment: ${row.legacy_current_installment}`);
        console.log(`   total cuotas (lot.cuotas): ${row.total_cuotas}`);
        console.log(`   valor_cuota:              $${(row.valor_cuota || 0).toLocaleString('es-CL')}`);
        console.log(`   precio_total:             $${(row.price_total_clp || 0).toLocaleString('es-CL')}`);
        console.log(`   pie (reservation):        $${(row.pie || 0).toLocaleString('es-CL')}`);
        console.log(`   pie (lot):                $${(row.lot_pie || 0).toLocaleString('es-CL')}`);
        console.log(`   pie_status:               ${row.pie_status}`);
        console.log(`   is_legacy:                ${row.is_legacy}`);
        console.log(`   is_promo:                 ${row.is_promo}`);
        console.log(`   mora_frozen:              ${row.mora_frozen}`);
        console.log(`   extra_paid_amount:        $${(row.extra_paid_amount || 0).toLocaleString('es-CL')}`);
        console.log(`   pending_amount:           $${(row.pending_amount || 0).toLocaleString('es-CL')}`);

        console.log("\n📅 DATOS DE FECHAS:");
        console.log("───────────────────────────────────────");
        console.log(`   created_at:                     ${row.created_at}`);
        console.log(`   legacy_installment_start_date:  ${row.legacy_installment_start_date}`);
        console.log(`   legacy_debt_start_date:         ${row.legacy_debt_start_date}`);
        console.log(`   next_payment_date (DB MANUAL):  ${row.next_payment_date}`);
        console.log(`   legacy_installment_ranges:      ${JSON.stringify(row.legacy_installment_ranges)}`);

        // 2. Fetch receipts
        const receiptsResult = await client.query(`
            SELECT id, amount_clp, scope, status, created_at, nominal_installment_number, receipt_url, installments_count
            FROM "PaymentReceipt"
            WHERE reservation_id = $1
            ORDER BY created_at ASC;
        `, [row.id]);

        console.log("\n💳 RECIBOS EN LA BASE DE DATOS:");
        console.log("───────────────────────────────────────");
        if (receiptsResult.rows.length === 0) {
            console.log("   (ningún recibo encontrado)");
        } else {
            receiptsResult.rows.forEach((r, i) => {
                console.log(`   ${i + 1}. $${r.amount_clp.toLocaleString('es-CL')} | ${r.scope} | ${r.status} | ${r.created_at.toISOString().slice(0, 10)} | Cuota#${r.nominal_installment_number || 'N/A'} | ${r.receipt_url === 'LEGACY_SYNC' ? '(LEGACY SYNC)' : r.receipt_url === 'MANUAL_POSTVENTA' ? '(MANUAL)' : 'Comprobante'}`);
            });
        }

        const approvedInstallmentReceipts = receiptsResult.rows.filter(r => r.scope === 'INSTALLMENT' && r.status === 'APPROVED');
        const approvedPieReceipts = receiptsResult.rows.filter(r => r.scope === 'PIE' && r.status === 'APPROVED');

        console.log("\n   📌 Resumen Recibos:");
        console.log(`      Cuotas aprobadas (recibos): ${approvedInstallmentReceipts.length}`);
        console.log(`      Pie aprobados (recibos):    ${approvedPieReceipts.length}`);

        // 3. Simulate the calculation from postventa.ts
        console.log("\n🔬 SIMULACIÓN DE CÁLCULO (como lo hace postventa.ts):");
        console.log("───────────────────────────────────────");

        const paidCuotas = row.installments_paid || 0;
        const totalCuotas = row.total_cuotas || 0;
        const isLegacyBool = Boolean(row.is_legacy);
        const baseDate = row.legacy_installment_start_date
            ? new Date(row.legacy_installment_start_date).toISOString()
            : new Date(row.created_at).toISOString();

        console.log(`   paidCuotas (from installments_paid): ${paidCuotas}`);
        console.log(`   totalCuotas (from lot.cuotas):       ${totalCuotas}`);
        console.log(`   isLegacy:                            ${isLegacyBool}`);
        console.log(`   baseDate para cálculo:               ${baseDate}`);

        const customStart = row.legacy_installment_start_date ? new Date(row.legacy_installment_start_date) : null;
        const customDueDay = customStart ? customStart.getDate() : null;
        console.log(`   customDueDay:                        ${customDueDay || '5 (default)'}`);

        let nextDueDate = null;
        if (paidCuotas < totalCuotas) {
            if (row.next_payment_date) {
                nextDueDate = new Date(row.next_payment_date);
                console.log(`\n   ⚡ USANDO next_payment_date MANUAL: ${nextDueDate.toISOString()}`);
            } else {
                nextDueDate = getInstallmentDueDate(baseDate, paidCuotas + 1, isLegacyBool, customDueDay, Boolean(row.is_promo));
                console.log(`\n   🧮 CALCULANDO next due via getInstallmentDueDate:`);
                console.log(`      getInstallmentDueDate("${baseDate}", ${paidCuotas + 1}, ${isLegacyBool}, ${customDueDay}, ${Boolean(row.is_promo)})`);
                console.log(`      = ${nextDueDate.toISOString()}`);
            }
        } else {
            console.log(`\n   ✅ TODAS LAS CUOTAS PAGADAS (${paidCuotas}/${totalCuotas})`);
        }

        // 4. Show what the dashboard SHOULD show
        console.log("\n🖥️  LO QUE MUESTRA EL DASHBOARD:");
        console.log("───────────────────────────────────────");
        console.log(`   Cuotas Pagadas:    ${paidCuotas} / ${totalCuotas}`);
        console.log(`   Próximo Pago:      ${nextDueDate ? nextDueDate.toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Finalizado'}`);

        // 5. Simulate for each possible installment count to find what "makes sense"
        console.log("\n📐 TABLA DE SIMULACIÓN: Fecha de vencimiento por cuota");
        console.log("───────────────────────────────────────");
        for (let i = 1; i <= Math.min(totalCuotas || 12, 12); i++) {
            const dueDate = getInstallmentDueDate(baseDate, i, isLegacyBool, customDueDay, Boolean(row.is_promo));
            const marker = (i === paidCuotas + 1) ? ' ◄── PRÓXIMA (calculada)' : '';
            console.log(`   Cuota ${String(i).padStart(2, ' ')}: ${dueDate.toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' })}${marker}`);
        }

        // 6. Check for inconsistency
        console.log("\n🔍 ANÁLISIS DE DISCREPANCIA:");
        console.log("───────────────────────────────────────");

        if (paidCuotas !== approvedInstallmentReceipts.length) {
            console.log(`   ⚠️  DISCREPANCIA: installments_paid (${paidCuotas}) ≠ recibos aprobados INSTALLMENT (${approvedInstallmentReceipts.length})`);
        } else {
            console.log(`   ✅ Consistente: installments_paid (${paidCuotas}) = recibos aprobados INSTALLMENT (${approvedInstallmentReceipts.length})`);
        }

        if (row.next_payment_date) {
            const manualDate = new Date(row.next_payment_date);
            const calculatedDate = getInstallmentDueDate(baseDate, paidCuotas + 1, isLegacyBool, customDueDay, Boolean(row.is_promo));
            if (manualDate.toDateString() !== calculatedDate.toDateString()) {
                console.log(`   ⚠️  OVERRIDE ACTIVO: next_payment_date manual (${manualDate.toLocaleDateString('es-CL')}) ≠ calculado (${calculatedDate.toLocaleDateString('es-CL')})`);
            }
        }

        const formValueExpected = paidCuotas + 1;
        if (row.legacy_current_installment !== null && row.legacy_current_installment !== undefined) {
            if (row.legacy_current_installment !== formValueExpected) {
                console.log(`   ⚠️  legacy_current_installment (${row.legacy_current_installment}) ≠ installments_paid + 1 (${formValueExpected})`);
            }
        }

        console.log("\n");
    }

    await client.end();
    console.log("🔌 Conexión cerrada.");
}

main().catch(err => {
    console.error("Error fatal:", err);
    process.exit(1);
});
