/**
 * Diagnóstico: Luis Varela - Cuotas Pagadas vs Fecha Próximo Pago
 * Usa Prisma Client (ya configurado en el proyecto)
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function getInstallmentDueDate(acquisitionDate, installmentNumber, isLegacy, customDueDay, isPromo) {
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
    console.log("✅ Conectado via Prisma.\n");

    // 1. Search for Varela
    const reservations = await prisma.$queryRaw`
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
        WHERE LOWER(r.name) LIKE '%varela%'
           OR LOWER(COALESCE(r.last_name,'')) LIKE '%varela%'
        ORDER BY r.created_at DESC
    `;

    if (reservations.length === 0) {
        console.log("❌ No se encontró 'varela'. Buscando 'luis'...\n");
        const luisRes = await prisma.$queryRaw`
            SELECT r.id, r.name, r.last_name, r.email, r.installments_paid, 
                   l.number as lot_number, l.stage as lot_stage
            FROM "Reservation" r
            JOIN "Lot" l ON r.lot_id = l.id
            WHERE LOWER(r.name) LIKE '%luis%'
            ORDER BY r.created_at DESC LIMIT 10
        `;
        console.table(luisRes.map(r => ({
            name: r.name,
            last_name: r.last_name,
            email: r.email,
            lot: r.lot_number,
            stage: r.lot_stage,
            installments_paid: r.installments_paid
        })));
        await prisma.$disconnect();
        return;
    }

    for (const row of reservations) {
        console.log("═══════════════════════════════════════════════════════════════");
        console.log(`📋 CLIENTE: ${row.name} ${row.last_name || ''}`);
        console.log(`   Email: ${row.email}`);
        console.log(`   Reservation ID: ${row.id}`);
        console.log(`   Estado: ${row.status}`);
        console.log("═══════════════════════════════════════════════════════════════");

        console.log("\n📊 DATOS CRUDOS:");
        console.log("───────────────────────────────────────");
        console.log(`   Lote:                       ${row.lot_number} (Etapa ${row.lot_stage})`);
        console.log(`   installments_paid (DB):     ${row.installments_paid}`);
        console.log(`   legacy_current_installment: ${row.legacy_current_installment}`);
        console.log(`   total cuotas:               ${row.total_cuotas}`);
        console.log(`   valor_cuota:                $${Number(row.valor_cuota || 0).toLocaleString('es-CL')}`);
        console.log(`   precio_total:               $${Number(row.price_total_clp || 0).toLocaleString('es-CL')}`);
        console.log(`   pie (reservation):          $${Number(row.pie || 0).toLocaleString('es-CL')}`);
        console.log(`   pie (lot):                  $${Number(row.lot_pie || 0).toLocaleString('es-CL')}`);
        console.log(`   pie_status:                 ${row.pie_status}`);
        console.log(`   is_legacy:                  ${row.is_legacy}`);
        console.log(`   is_promo:                   ${row.is_promo}`);
        console.log(`   mora_frozen:                ${row.mora_frozen}`);

        console.log("\n📅 FECHAS:");
        console.log("───────────────────────────────────────");
        console.log(`   created_at:                     ${row.created_at}`);
        console.log(`   legacy_installment_start_date:  ${row.legacy_installment_start_date}`);
        console.log(`   legacy_debt_start_date:         ${row.legacy_debt_start_date}`);
        console.log(`   next_payment_date (MANUAL):     ${row.next_payment_date}`);
        console.log(`   legacy_installment_ranges:      ${JSON.stringify(row.legacy_installment_ranges)}`);

        // Receipts
        const receipts = await prisma.$queryRaw`
            SELECT id, amount_clp, scope, status, created_at, nominal_installment_number, receipt_url
            FROM "PaymentReceipt"
            WHERE reservation_id = ${row.id}
            ORDER BY created_at ASC
        `;

        console.log("\n💳 RECIBOS:");
        console.log("───────────────────────────────────────");
        if (receipts.length === 0) {
            console.log("   (ninguno)");
        } else {
            receipts.forEach((r, i) => {
                const src = r.receipt_url === 'LEGACY_SYNC' ? 'LEGACY' : r.receipt_url === 'MANUAL_POSTVENTA' ? 'MANUAL' : 'UPLOAD';
                console.log(`   ${i + 1}. $${Number(r.amount_clp).toLocaleString('es-CL')} | ${String(r.scope).padEnd(12)} | ${String(r.status).padEnd(8)} | ${new Date(r.created_at).toISOString().slice(0, 10)} | #${r.nominal_installment_number || '-'} | ${src}`);
            });
        }

        const approvedInst = receipts.filter(r => r.scope === 'INSTALLMENT' && r.status === 'APPROVED');
        console.log(`\n   📌 Recibos INSTALLMENT aprobados: ${approvedInst.length}`);

        // Simulate
        const paidCuotas = Number(row.installments_paid) || 0;
        const totalCuotas = Number(row.total_cuotas) || 0;
        const isLegacyBool = Boolean(row.is_legacy);
        const baseDate = row.legacy_installment_start_date
            ? new Date(row.legacy_installment_start_date).toISOString()
            : new Date(row.created_at).toISOString();
        const customStart = row.legacy_installment_start_date ? new Date(row.legacy_installment_start_date) : null;
        const customDueDay = customStart ? customStart.getDate() : null;

        console.log("\n🔬 SIMULACIÓN:");
        console.log("───────────────────────────────────────");
        console.log(`   paidCuotas = ${paidCuotas}`);
        console.log(`   totalCuotas = ${totalCuotas}`);
        console.log(`   isLegacy = ${isLegacyBool}`);
        console.log(`   baseDate = ${baseDate}`);
        console.log(`   customDueDay = ${customDueDay || '5 (default)'}`);

        let nextDueDate = null;
        if (paidCuotas < totalCuotas) {
            if (row.next_payment_date) {
                nextDueDate = new Date(row.next_payment_date);
                console.log(`   ⚡ USA next_payment_date MANUAL: ${nextDueDate.toLocaleDateString('es-CL')}`);
            } else {
                nextDueDate = getInstallmentDueDate(baseDate, paidCuotas + 1, isLegacyBool, customDueDay, Boolean(row.is_promo));
                console.log(`   🧮 CALCULA: cuota ${paidCuotas + 1} → ${nextDueDate.toLocaleDateString('es-CL')}`);
            }
        }

        console.log("\n🖥️  MUESTRA EN DASHBOARD:");
        console.log("───────────────────────────────────────");
        console.log(`   «Cuotas Pagadas: ${paidCuotas} / ${totalCuotas}»`);
        console.log(`   «Próximo Pago:   ${nextDueDate ? nextDueDate.toLocaleDateString('es-CL', { day: '2-digit', month: 'long', year: 'numeric' }) : 'Finalizado'}»`);

        // Calendar
        console.log("\n📐 CALENDARIO:");
        console.log("───────────────────────────────────────");
        const limit = Math.min(totalCuotas || 12, 15);
        for (let i = 1; i <= limit; i++) {
            const d = getInstallmentDueDate(baseDate, i, isLegacyBool, customDueDay, Boolean(row.is_promo));
            const paid = i <= paidCuotas ? '✅' : '⬜';
            const mark = (i === paidCuotas + 1) ? ' ◄── PRÓXIMA' : '';
            console.log(`   ${paid} Cuota ${String(i).padStart(2)}: ${d.toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' })}${mark}`);
        }

        // Analysis
        console.log("\n🔍 DIAGNÓSTICO:");
        console.log("───────────────────────────────────────");
        if (paidCuotas !== approvedInst.length) {
            console.log(`   ⚠️  DISCREPANCIA: installments_paid=${paidCuotas} pero recibos aprobados=${approvedInst.length}`);
        } else {
            console.log(`   ✅ Consistente: installments_paid=${paidCuotas} = recibos=${approvedInst.length}`);
        }

        if (row.next_payment_date && paidCuotas < totalCuotas) {
            const manual = new Date(row.next_payment_date);
            const calc = getInstallmentDueDate(baseDate, paidCuotas + 1, isLegacyBool, customDueDay, Boolean(row.is_promo));
            if (manual.toDateString() !== calc.toDateString()) {
                console.log(`   ⚠️  OVERRIDE: Manual=${manual.toLocaleDateString('es-CL')} vs Calculado=${calc.toLocaleDateString('es-CL')}`);
            }
        }

        const expectedFormValue = paidCuotas + 1;
        if (row.legacy_current_installment != null) {
            const lci = Number(row.legacy_current_installment);
            if (lci !== expectedFormValue) {
                console.log(`   ⚠️  legacy_current_installment=${lci} ≠ expected ${expectedFormValue} (installments_paid+1)`);
            }
        }

        console.log("\n");
    }

    await prisma.$disconnect();
    console.log("🔌 Listo.");
}

main().catch(err => {
    console.error("Error:", err);
    process.exit(1);
});
