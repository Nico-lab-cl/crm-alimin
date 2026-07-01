'use server'

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { getInstallmentDueDate, calculateTotalInterest, calculateDailyInterest, getChileToday, calculateDaysLate, calculateResidualMoraOnPaidInstallments } from "@/lib/financials"
import { memoryCache } from "@/lib/cache"
import { revalidatePath } from "next/cache"
import { addReceiptToManualDocuments } from "@/actions/receipts"

const POSTVENTA_CACHE_KEY = 'postventa_data';
const CACHE_TTL = 300; // 5 minutes for postventa data (reduced from 1h to catch mora changes faster)

export async function invalidatePostventaCache() {
    memoryCache.deleteByPrefix('postventa_full_');
}

export async function getFullPostventaData({
    stage = 'ALL',
    serverAuthOverride = false
}: {
    stage?: string | number;
    serverAuthOverride?: boolean;
} = {}) {
    if (!serverAuthOverride) {
        const session = await auth()
        const isPostventa = session?.user?.email === 'postventa@lomasdelmar.cl' || session?.user?.email === 'postventa@aliminspa.cl';
        if (!session?.user || (session.user.role !== 'ADMIN' && !isPostventa)) {
            return { error: 'No autorizado', data: [], totalPages: 0 }
        }
    }

    const cacheKey = `postventa_full_${stage}`;
    const cached = memoryCache.get(cacheKey);
    if (cached) return cached;

    try {
        const whereStats: any = {
            buyer_id: { not: null },
            lot: { 
                status: { in: ['sold', 'reserved'] },
                ...(stage !== 'ALL' ? { stage: parseInt(stage.toString()) } : {})
            }
        };

        // We cast to any[] because we manually added columns via SQL that aren't in Prisma schema yet
        const allReservations: any[] = await prisma.reservation.findMany({
            where: whereStats,
            orderBy: { created_at: 'desc' },
            select: {
                id: true,
                name: true,
                // @ts-ignore
                last_name: true,
                phone: true,
                email: true,
                installments_paid: true,
                pie_status: true,
                uploaded_contract_url: true,
                created_at: true,
                is_legacy: true,
                legacy_installment_start_date: true,
                legacy_debt_start_date: true,
                legacy_debt_end_date: true,
                legacy_uploaded_contracts: true,
                // @ts-ignore
                mora_frozen: true,
                // @ts-ignore
                has_operational_expenses: true,
                // @ts-ignore
                manual_documents: true,
                // @ts-ignore
                signed_at: true,
                // @ts-ignore
                is_promo: true,
                notes: true,
                lot: {
                    select: {
                        id: true,
                        number: true,
                        stage: true,
                        price_total_clp: true,
                        reservation_amount_clp: true,
                        cuotas: true,
                        valor_cuota: true,
                        area_m2: true,
                        pie: true,
                        last_installment_amount: true
                    }
                },
                buyer: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                receipts: {
                    where: { status: 'APPROVED' },
                    orderBy: { created_at: 'desc' },
                    select: {
                        id: true,
                        amount_clp: true,
                        scope: true,
                        created_at: true,
                        nominal_installment_number: true
                    }
                },
                rut: true,
                address_street: true,
                address_number: true,
                address_commune: true,
                address_region: true,
                marital_status: true,
                profession: true,
                // @ts-ignore
                advisor: true,
                // @ts-ignore
                observation: true,
                nationality: true,
                legacy_installment_ranges: true,
                legacy_current_installment: true,
                promesa_signed_at: true,
                // @ts-ignore
                extra_paid_amount: true,
                // @ts-ignore
                pending_amount: true,
                // @ts-ignore
                pending_amount_reason: true,
                // @ts-ignore
                pie: true,
                status: true,
                next_payment_date: true,
                next_installment_discount: true
            }
        }) as any[];

        const processedData = allReservations.map(res => {
            const lot = res.lot;
            const buyer = res.buyer;

            const pieAmount = res.receipts.reduce((acc: number, r: any) => r.scope === 'PIE' ? acc + r.amount_clp : acc, 0);
            const cuotasAmount = res.receipts.reduce((acc: number, r: any) => r.scope === 'INSTALLMENT' ? acc + r.amount_clp : acc, 0);
            
            // Calculate mora credits (abonos parciales de intereses)
            const moraCredits = res.receipts
                .filter((r: any) => r.scope === 'MORA')
                .reduce((acc: number, r: any) => acc + r.amount_clp, 0);
            
            // Count actual installment receipts for discrepancy detection
            const receiptBasedInstallmentCount = res.receipts
                .filter((r: any) => r.scope === 'INSTALLMENT')
                .reduce((sum: number, r: any) => sum + (r.installments_count || 1), 0);
            
            // Historical pie receipts were imported as Gross Pie. Subtract reservation to get Net Pie.
            // --- SIMPLIFIED FINANCIAL CALCULATION ---
            // Formula: Pie (Gross) + Sum(Installments) + Extra Payments
            // PRIORITY: Manual CRM Fields > Digitized Receipts (for Legacy Sync consistency)
            let actualPieComponent = 0;
            const manualPie = (res as any).pie || 0;
            const targetGrossPie = manualPie || lot.pie || 0;
            
            if (manualPie > 0) {
                actualPieComponent = manualPie;
            } else if (pieAmount > 0) {
                actualPieComponent = pieAmount;
            } else if (res.pie_status === 'PAID') {
                actualPieComponent = targetGrossPie;
            }

            // --- REFINED INSTALLMENT CALCULATION ---
            const paidCuotas = res.installments_paid || 0;
            let calculatedCuotasTotal = 0;

            // Priority: Calculate based on installments_paid field first to respect legacy ranges
            const ranges = res.legacy_installment_ranges ? (typeof res.legacy_installment_ranges === 'string' ? JSON.parse(res.legacy_installment_ranges) : res.legacy_installment_ranges) : [];
            for (let i = 1; i <= paidCuotas; i++) {
                const range = (ranges as any[]).find((r: any) => i >= Number(r.from) && i <= Number(r.to));
                calculatedCuotasTotal += range ? Number(range.amount) : (lot.valor_cuota || 0);
            }

            // If we have manual receipts that sum to more than the calculated amount, we could use them, 
            // but for Legacy consistency we stick to the calculated installments total unless 0.
            if (calculatedCuotasTotal === 0 && cuotasAmount > 0) {
                calculatedCuotasTotal = cuotasAmount;
            }
            
            // Include reservation payment in totalPaid if reservation status is paid/confirmed
            const isReservationPaid = res.status === 'paid' || res.status === 'confirmed';
            const reservationAmountPaid = isReservationPaid ? (lot.reservation_amount_clp || 500000) : 0;
            
            const totalToPay = lot.price_total_clp || 0;
            const totalCuotas = lot.cuotas || 0;

            // Total Invertido: Reserva + Pie + Installments + Extra Manual Payments
            // For cash sales (totalCuotas === 0), totalPaid is simply the total lot price plus extra paid amounts
            let totalPaid = reservationAmountPaid + actualPieComponent + calculatedCuotasTotal + ((res as any).extra_paid_amount || 0);
            if (totalCuotas === 0) {
                totalPaid = totalToPay + ((res as any).extra_paid_amount || 0);
            }
            
            // Balance = Price Total - Total Invertido + Additional Debts
            const pendingBalance = Math.max(0, totalToPay - totalPaid + ((res as any).pending_amount || 0));
            // -- redundant paidCuotas removed --

            let nextDueDate = null;
            let lateDays = 0;
            let penaltyAmount = 0;
            const overdueInstallments: any[] = [];
            let totalOverdueInstallmentsAmount = 0;

            const isLegacyBool = Boolean(res.is_legacy);
            const baseDate = res.legacy_installment_start_date
                ? new Date(res.legacy_installment_start_date).toISOString()
                : res.created_at.toISOString();

            const currentDate = getChileToday();

            if (paidCuotas < totalCuotas) {
                const customStart = res.legacy_installment_start_date ? new Date(res.legacy_installment_start_date) : null;
                const customDueDay = customStart ? customStart.getDate() : null;
                
                if (res.next_payment_date) {
                    nextDueDate = new Date(res.next_payment_date);
                } else {
                    nextDueDate = getInstallmentDueDate(baseDate, paidCuotas + 1, isLegacyBool, customDueDay, Boolean(res.is_promo));
                }

                const lotAreaM2 = lot.area_m2 || 200;
                
                // --- SUM INTEREST FOR ALL REMAINING INSTALLMENTS ---
                const remainingCount = totalCuotas - paidCuotas;
                const daily = calculateDailyInterest(totalToPay, lotAreaM2);

                for (let i = 1; i <= remainingCount; i++) {
                    const instNum = paidCuotas + i;
                    const iDue = getInstallmentDueDate(baseDate, instNum, isLegacyBool, customDueDay, Boolean(res.is_promo));
                    
                    const instInterest = calculateTotalInterest(
                        totalToPay,
                        lotAreaM2,
                        iDue,
                        isLegacyBool,
                        currentDate,
                        // @ts-ignore
                        Boolean(res.mora_frozen),
                        res.legacy_debt_start_date,
                        res.legacy_debt_end_date
                    );
                    
                    if (iDue < currentDate) {
                        const range = ranges.find((r: any) => instNum >= Number(r.from) && instNum <= Number(r.to));
                        const instAmount = range ? Number(range.amount) : (lot.valor_cuota || 0);
                        
                        const daysLateForInst = calculateDaysLate(
                            iDue,
                            currentDate,
                            isLegacyBool,
                            res.legacy_debt_start_date,
                            res.legacy_debt_end_date
                        );
                        
                        const MONTHS_ES = [
                            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
                        ];
                        const monthName = MONTHS_ES[iDue.getMonth()];
                        
                        // Calculate MORA credits specifically for this installment number
                        const instMoraCredits = res.receipts
                            .filter((r: any) => r.scope === 'MORA' && r.nominal_installment_number === instNum)
                            .reduce((sum: number, r: any) => sum + r.amount_clp, 0);

                        overdueInstallments.push({
                            number: instNum,
                            dueDate: iDue.toISOString(),
                            amount: instAmount,
                            daysLate: Math.max(0, daysLateForInst),
                            interestPenalty: Math.max(0, instInterest - instMoraCredits),
                            monthName
                        });
                        totalOverdueInstallmentsAmount += instAmount;
                    }
                    
                    if (instInterest > 0) {
                        penaltyAmount += instInterest;
                        // Track maximum days late for display
                        const currentInstDays = daily > 0 ? Math.round(instInterest / daily) : 0;
                        if (currentInstDays > lateDays) lateDays = currentInstDays;
                    } else {
                        if (iDue >= currentDate) {
                            break;
                        }
                    }
                }
            }

            const fiveDaysFromNow = new Date(currentDate);
            fiveDaysFromNow.setDate(fiveDaysFromNow.getDate() + 5);

            // Single pass over receipts for performance
            let hasPaidCurrentInstallment = false;
            if (nextDueDate) {
                const targetMonth = nextDueDate.getUTCMonth();
                const targetYear = nextDueDate.getUTCFullYear();
                hasPaidCurrentInstallment = res.receipts.some((r: any) => {
                    if (r.scope !== 'INSTALLMENT') return false;
                    const rDate = new Date(r.created_at);
                    return rDate.getUTCMonth() === targetMonth && rDate.getUTCFullYear() === targetYear;
                });
            }

            let isGracePeriod = false;
            if (nextDueDate && currentDate >= nextDueDate && penaltyAmount === 0 && !hasPaidCurrentInstallment) {
                isGracePeriod = true;
            }

            let isUpcoming = false;
            if (nextDueDate && nextDueDate > currentDate && nextDueDate <= fiveDaysFromNow && !hasPaidCurrentInstallment) {
                isUpcoming = true;
            }

            // -------------------------------------------------------------
            // OPTIMIZATION: Strip Base64 and return Dynamic API URLs
            // -------------------------------------------------------------
            
            // 1. Contrato de Reserva
            let uploadedContractUrl = res.uploaded_contract_url ? 
                `/api/contracts/${res.id}/file?type=RESERVA&name=Contrato_Reserva.pdf` : null;

            // 2. Promesa
            let legacyContractsMeta = null;
            if (res.legacy_uploaded_contracts) {
                try {
                    const parsedLegacy = typeof res.legacy_uploaded_contracts === 'string' 
                        ? JSON.parse(res.legacy_uploaded_contracts) 
                        : res.legacy_uploaded_contracts;
                    if (Array.isArray(parsedLegacy) && parsedLegacy.length > 0) {
                        legacyContractsMeta = JSON.stringify([{
                            name: parsedLegacy[0].name || 'Promesa de Compraventa',
                            url: `/api/contracts/${res.id}/file?type=PROMESA&name=${encodeURIComponent(parsedLegacy[0].name || 'Promesa_Compraventa.pdf')}`
                        }]);
                    }
                } catch (e) {}
            }

            // 3. Manual Documents
            let manualDocumentsMeta: any = [];
            if ((res as any).manual_documents) {
                try {
                    const parsedManual = Array.isArray((res as any).manual_documents) 
                        ? (res as any).manual_documents 
                        : JSON.parse((res as any).manual_documents as string);
                    
                    manualDocumentsMeta = parsedManual.map((d: any) => ({
                        name: d.name,
                        category: d.category,
                        uploadedAt: d.uploadedAt,
                        url: `/api/contracts/${res.id}/file?type=${encodeURIComponent(d.category)}&name=${encodeURIComponent(d.name)}`
                    }));
                } catch (e) {}
            }

            // --- RESIDUO DE MORA EN CUOTAS YA PAGADAS (mora desacoplada del capital) ---
            const customDueDayPaid = res.legacy_installment_start_date
                ? new Date(res.legacy_installment_start_date).getDate()
                : null;
            const residualMora = calculateResidualMoraOnPaidInstallments({
                baseDate,
                paidCuotas,
                isLegacy: isLegacyBool,
                customDueDay: customDueDayPaid,
                isPromo: Boolean(res.is_promo),
                currentDate,
                moraFrozen: Boolean(res.mora_frozen),
                legacyDebtStartDate: res.legacy_debt_start_date,
                legacyDebtEndDate: res.legacy_debt_end_date,
                moraReceipts: res.receipts.filter((r: any) => r.scope === 'MORA'),
                totalLotPrice: totalToPay,
                lotAreaM2: lot.area_m2 || 200,
            });

            // Créditos de mora ya consumidos por el residuo de cuotas pagadas (evita doble descuento)
            const moraCreditsPaidTracked = res.receipts
                .filter((r: any) => r.scope === 'MORA' && r.nominal_installment_number != null && r.nominal_installment_number <= paidCuotas)
                .reduce((acc: number, r: any) => acc + r.amount_clp, 0);
            const moraCreditsUnpaid = Math.max(0, moraCredits - moraCreditsPaidTracked);

            // Mora efectiva = (interés de cuotas impagas - créditos no aplicados) + residuo de cuotas pagadas
            const effectivePenalty = Math.max(0, penaltyAmount - moraCreditsUnpaid) + residualMora.total;

            // Reflejar las cuotas pagadas con mora pendiente en el desglose de deuda vencida
            const MONTHS_ES_RESIDUAL = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
            for (const ri of residualMora.installments) {
                overdueInstallments.push({
                    number: ri.number,
                    dueDate: ri.dueDate,
                    amount: 0,
                    daysLate: ri.daysLate,
                    interestPenalty: ri.residual,
                    monthName: MONTHS_ES_RESIDUAL[new Date(ri.dueDate).getUTCMonth()],
                    capitalPaid: true,
                });
            }

            const fetchedName = buyer?.name || res.name || 'Sin nombre';
            const fetchedLastName = (res as any).last_name || '';
            const fullNameConcat = fetchedLastName ? `${fetchedName} ${fetchedLastName}`.trim() : fetchedName;

            return {
                id: res.id,
                name: fetchedName,
                // @ts-ignore
                last_name: fetchedLastName || null,
                clientName: fullNameConcat,
                clientEmail: buyer?.email || res.email,
                clientPhone: res.phone,
                lotNumber: lot.number,
                lotStage: lot.stage || 1,
                totalToPay,
                totalPaid,
                pendingBalance,
                paidCuotas,
                installments_paid: paidCuotas,
                totalCuotas,
                pieStatus: res.pie_status,
                nextDueDate,
                displayDueDate: nextDueDate,
                reservaAmount: lot.reservation_amount_clp || 0,
                pieAmount,
                cuotasAmount,
                uploaded_contract_url: uploadedContractUrl,
                isGracePeriod,
                isPieDebt: res.pie_status !== 'PAID',
                valor_cuota: lot.valor_cuota || 0,
                monto_cuota: lot.valor_cuota || 0,
                isMoraFrozen: Boolean(res.mora_frozen),
                manual_documents: manualDocumentsMeta,
                signed_at: res.signed_at,
                is_legacy: Boolean(res.is_legacy),
                lateDays,
                penaltyAmount,
                moraCredits,
                residualMoraTotal: residualMora.total,
                effectivePenalty: effectivePenalty,
                pending_amount: (res as any).pending_amount || 0,
                pending_amount_reason: (res as any).pending_amount_reason || null,
                isUpcoming,
                isLate: effectivePenalty > 0 || ((res as any).pending_amount || 0) > 0,
                isUpToDate: !isGracePeriod && effectivePenalty <= 0 && !isUpcoming && ((res as any).pending_amount || 0) <= 0,
                status: (effectivePenalty > 0 && !Boolean(res.mora_frozen)) ? 'LATE' : 
                        (((res as any).pending_amount || 0) > 0 && !Boolean(res.mora_frozen)) ? 'LATE' :
                        (isGracePeriod && !Boolean(res.mora_frozen)) ? 'GRACE' : 
                        (isUpcoming && !Boolean(res.mora_frozen)) ? 'UPCOMING' : 'OK',
                reservationStatus: res.status,
                overdueInstallments,
                totalOverdueInstallmentsAmount,
                totalOverdueAmount: totalOverdueInstallmentsAmount + effectivePenalty + ((res as any).pending_amount || 0),
                // Additional fields for editing
                lotId: lot.id,
                buyer: buyer,
                lot: lot,
                rut: res.rut,
                address_street: res.address_street,
                address_number: res.address_number,
                address_commune: res.address_commune,
                address_region: res.address_region,
                marital_status: res.marital_status,
                profession: res.profession,
                nationality: res.nationality,
                legacy_installment_ranges: res.legacy_installment_ranges,
                legacy_installment_start_date: res.legacy_installment_start_date,
                legacy_debt_start_date: res.legacy_debt_start_date,
                legacy_debt_end_date: res.legacy_debt_end_date,
                legacy_uploaded_contracts: legacyContractsMeta,
                promesa_signed_at: res.promesa_signed_at,
                is_promo: res.is_promo,
                notes: res.notes,
                pie_status: res.pie_status,
                // Fields needed by AssignOwnerModal
                phone: res.phone,
                email: buyer?.email || res.email,
                mora_frozen: Boolean(res.mora_frozen),
                // @ts-ignore
                has_operational_expenses: Boolean(res.has_operational_expenses),
                // @ts-ignore
                advisor: res.advisor || null,
                // @ts-ignore
                observation: res.observation || null,
                next_payment_date: res.next_payment_date,
                // Discrepancy detection: compare DB installments_paid vs actual receipt count
                receiptBasedInstallmentCount,
                installmentDiscrepancy: paidCuotas - receiptBasedInstallmentCount
            };
        });

        // Statistics are based on the full dataset for this stage
        const stats = {
            total: processedData.length,
            late: processedData.filter(d => d.isLate && !d.isMoraFrozen).length,
            grace: processedData.filter(d => d.isGracePeriod && !d.isMoraFrozen).length,
            upcoming: processedData.filter(d => d.isUpcoming && !d.isMoraFrozen).length,
            ok: processedData.filter(d => d.isUpToDate || d.isMoraFrozen).length
        };

        const result = {
            success: true,
            data: processedData,
            stats
        };

        memoryCache.set(cacheKey, result, CACHE_TTL);
        return result;

    } catch (error) {
        console.error("Error getting full postventa data:", error);
        return { error: 'Error al cargar datos de postventa', data: [], totalPages: 0 };
    }
}

export async function updateReservationContract(reservationId: string, url: string) {
    const session = await auth()
    if (!session?.user || session.user.role !== 'ADMIN') {
        return { success: false, error: 'No autorizado' }
    }

    try {
        await prisma.reservation.update({
            where: { id: reservationId },
            data: { uploaded_contract_url: url }
        });
        
        memoryCache.deleteByPrefix('postventa_full_');
        memoryCache.deleteByPrefix('receipts_paginated_');
        revalidatePath('/admin/dashboard');
        
        return { success: true };
    } catch (error) {
        console.error("Error updating contract:", error);
        return { success: false, error: 'Error al actualizar el contrato' };
    }
}

export async function syncLegacyReceipts() {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
        return { error: 'No autorizado' };
    }

    try {
        const reservations = await prisma.reservation.findMany({
            where: { buyer_id: { not: null } },
            include: { 
                lot: true,
                receipts: true
            }
        });

        let syncedCount = 0;

        for (const res of reservations) {
            // 1. Sync Pie if PAID but no record
            if (res.pie_status === 'PAID') {
                const hasPieReceipt = res.receipts.some(r => r.scope === 'PIE');
                if (!hasPieReceipt) {
                    await prisma.paymentReceipt.create({
                        data: {
                            amount_clp: res.lot.pie || 0,
                            status: 'APPROVED',
                            receipt_url: 'LEGACY_SYNC',
                            scope: 'PIE',
                            reservation_id: res.id,
                            lot_id: res.lot_id,
                            processed_at: new Date('2026-03-11')
                        }
                    });
                    syncedCount++;
                }
            }

            // 2. Sync installments_paid
            const paidCount = res.installments_paid || 0;
            const existingCuotasReceipts = res.receipts.filter(r => r.scope === 'INSTALLMENT').length;
            
            if (paidCount > existingCuotasReceipts) {
                const toSync = paidCount - existingCuotasReceipts;
                for (let i = 0; i < toSync; i++) {
                    const cuotaNum = existingCuotasReceipts + i + 1;
                    
                    await prisma.paymentReceipt.create({
                        data: {
                            amount_clp: res.lot.valor_cuota || 0,
                            status: 'APPROVED',
                            receipt_url: 'LEGACY_SYNC',
                            scope: 'INSTALLMENT',
                            nominal_installment_number: cuotaNum,
                            reservation_id: res.id,
                            lot_id: res.lot_id,
                            processed_at: new Date('2026-03-11')
                        }
                    });
                    syncedCount++;
                }
            }
        }

        memoryCache.deleteByPrefix('postventa_full_');
        memoryCache.deleteByPrefix('receipts_paginated_');
        revalidatePath('/admin/dashboard');
        revalidatePath('/admin/receipts');

        return { success: true, syncedCount };
    } catch (error) {
        console.error("Error syncing legacy receipts:", error);
        return { error: 'Error al sincronizar recibos' };
    }
}

export async function getReservationReceipts(reservationId: string) {
    const session = await auth();
    if (!session?.user) return { error: "No autorizado" };

    try {
        const receipts = await prisma.paymentReceipt.findMany({
            where: {
                reservation_id: reservationId,
                status: 'APPROVED'
            },
            orderBy: { created_at: 'desc' },
            select: {
                id: true,
                amount_clp: true,
                scope: true,
                status: true,
                processed_at: true,
                created_at: true,
                receipt_url: true
            }
        });
        return { success: true, receipts };
    } catch (error) {
        console.error("Error fetching reservation receipts:", error);
        return { error: "Error al cargar recibos" };
    }
}
export async function registerPostventaPayment({
    reservationId,
    amount,
    scope,
    receiptUrl = 'MANUAL_POSTVENTA',
    date = new Date().toISOString(),
    serverAuthOverride = false,
    nominalInstallmentNumber
}: {
    reservationId: string;
    amount: number;
    scope: 'PIE' | 'INSTALLMENT' | 'GASTOS_OPERACIONALES' | 'MORA';
    receiptUrl?: string;
    date?: string;
    serverAuthOverride?: boolean;
    nominalInstallmentNumber?: number;
}) {
    if (!serverAuthOverride) {
        const session = await auth();
        const isPostventa = session?.user?.email === 'postventa@lomasdelmar.cl' || session?.user?.email === 'postventa@aliminspa.cl';
        if (!session?.user || (session.user.role !== 'ADMIN' && !isPostventa)) {
            return { error: 'No autorizado' };
        }
    }

    try {
        const reservation = await prisma.reservation.findUnique({
            where: { id: reservationId },
            include: { lot: true }
        });

        if (!reservation) return { error: 'Reserva no encontrada' };

        // 1. Calculate Nominal Number for manual payment
        let nominalNumber: number | null = null;
        if (scope === 'INSTALLMENT') {
            nominalNumber = nominalInstallmentNumber !== undefined ? nominalInstallmentNumber : (reservation.installments_paid || 0) + 1;
        } else if (scope === 'MORA') {
            // For mora credits, track which installment the interest payment corresponds to
            nominalNumber = nominalInstallmentNumber !== undefined ? nominalInstallmentNumber : null;
        }

        const receipt = await prisma.paymentReceipt.create({
            data: {
                amount_clp: amount,
                status: 'APPROVED',
                receipt_url: receiptUrl,
                scope: scope === 'GASTOS_OPERACIONALES' ? 'OTHERS' : (scope === 'MORA' ? 'MORA' : scope),
                installments_count: scope === 'INSTALLMENT' ? 1 : undefined,
                nominal_installment_number: nominalNumber,
                reservation_id: reservationId,
                lot_id: reservation.lot_id,
                processed_at: new Date(date),
                created_at: new Date(date)
            }
        });

        // Load digital receipt in the client portal
        await addReceiptToManualDocuments(reservationId, {
            id: receipt.id,
            scope: receipt.scope,
            nominal_installment_number: receipt.nominal_installment_number,
            nominal_installment_range: receipt.nominal_installment_range
        });

        // 2. Update Reservation State
        if (scope === 'PIE') {
            await prisma.reservation.update({
                where: { id: reservationId },
                data: { pie_status: 'PAID' }
            });
        } else if (scope === 'INSTALLMENT') {
            // Atomic increment - safe against race conditions
            const updatedReservation = await prisma.reservation.update({
                where: { id: reservationId },
                data: { 
                    installments_paid: { increment: 1 },
                    pipeline_stage: 'PAGO_CUOTAS'
                },
                include: { lot: true }
            });

            // Calculate next_payment_date based on the new installments_paid
            const { calculateNextPaymentDate } = await import("@/actions/receipts");
            const nextPaymentDate = await calculateNextPaymentDate(updatedReservation);
            await prisma.reservation.update({
                where: { id: reservationId },
                data: { next_payment_date: nextPaymentDate }
            });
        }
        // MORA scope: no state change needed - it's only an interest credit, not an installment payment

        memoryCache.deleteByPrefix('postventa_full_');
        memoryCache.deleteByPrefix('receipts_paginated_');
        revalidatePath('/admin/dashboard');
        revalidatePath('/admin/receipts');

        return { success: true, receipt };
    } catch (error) {
        console.error("Error registering manual payment:", error);
        return { error: 'Error al registrar el pago' };
    }
}

/**
 * Manually adjust the installments_paid counter for a reservation.
 * Used when legacy migration inflated the value and needs correction.
 * Creates an audit log entry for traceability.
 */
export async function adjustInstallmentsPaid({
    reservationId,
    newCount,
    reason
}: {
    reservationId: string;
    newCount: number;
    reason: string;
}) {
    const session = await auth();
    const isPostventa = session?.user?.email === 'postventa@lomasdelmar.cl' || session?.user?.email === 'postventa@aliminspa.cl';
    if (!session?.user || (session.user.role !== 'ADMIN' && !isPostventa)) {
        return { error: 'No autorizado' };
    }

    if (newCount < 0) {
        return { error: 'El número de cuotas no puede ser negativo' };
    }

    if (!reason || reason.trim().length < 5) {
        return { error: 'Debes indicar un motivo (mínimo 5 caracteres)' };
    }

    try {
        const reservation = await prisma.reservation.findUnique({
            where: { id: reservationId },
            include: { 
                lot: { select: { number: true, stage: true, cuotas: true } },
                buyer: { select: { name: true, email: true } }
            }
        });

        if (!reservation) return { error: 'Reserva no encontrada' };

        const oldCount = reservation.installments_paid || 0;
        const totalCuotas = reservation.lot?.cuotas || 0;

        if (newCount > totalCuotas) {
            return { error: `No puedes superar el total de cuotas (${totalCuotas})` };
        }

        if (newCount === oldCount) {
            return { error: 'El valor nuevo es igual al actual' };
        }

        // 1. Update installments_paid
        const updatedReservation = await prisma.reservation.update({
            where: { id: reservationId },
            data: { installments_paid: newCount },
            include: { lot: true }
        });

        // 2. Recalculate next_payment_date
        const { calculateNextPaymentDate } = await import("@/actions/receipts");
        const nextPaymentDate = await calculateNextPaymentDate(updatedReservation);
        await prisma.reservation.update({
            where: { id: reservationId },
            data: { next_payment_date: nextPaymentDate }
        });

        // 3. Create audit log
        const clientName = reservation.buyer?.name || 'Desconocido';
        const lotNumber = reservation.lot?.number || 'N/A';
        const lotStage = reservation.lot?.stage || 'N/A';

        await prisma.auditLog.create({
            data: {
                action: 'UPDATE',
                entity: 'Reservation',
                entity_id: reservationId,
                details: JSON.stringify({
                    type: 'ADJUST_INSTALLMENTS_PAID',
                    oldCount,
                    newCount,
                    difference: newCount - oldCount,
                    reason: reason.trim(),
                    clientName,
                    lotNumber,
                    lotStage,
                    newNextPaymentDate: nextPaymentDate?.toISOString() || null,
                    adjustedBy: session.user.email
                }),
                pk: reservationId,
                user_id: session.user.id,
                user_email: session.user.email,
            }
        });

        // 4. Invalidate caches
        memoryCache.deleteByPrefix('postventa_full_');
        memoryCache.deleteByPrefix('receipts_paginated_');
        revalidatePath('/admin/dashboard');

        return {
            success: true,
            message: `Cuotas pagadas ajustadas de ${oldCount} a ${newCount}. Próximo vencimiento recalculado.`,
            newNextPaymentDate: nextPaymentDate
        };
    } catch (error) {
        console.error("Error adjusting installments_paid:", error);
        return { error: 'Error al ajustar las cuotas pagadas' };
    }
}

/**
 * Sealed action: manually adjust the "Fecha Inicio de Cuotas" (legacy_installment_start_date).
 * This date drives every due-date and mora calculation, so it requires a mandatory reason
 * and is logged for traceability, same pattern as adjustInstallmentsPaid.
 */
export async function updateInstallmentStartDate({
    reservationId,
    newStartDate,
    reason
}: {
    reservationId: string;
    newStartDate: string;
    reason: string;
}) {
    const session = await auth();
    const isPostventa = session?.user?.email === 'postventa@lomasdelmar.cl' || session?.user?.email === 'postventa@aliminspa.cl';
    if (!session?.user || (session.user.role !== 'ADMIN' && !isPostventa)) {
        return { error: 'No autorizado' };
    }

    if (!newStartDate) {
        return { error: 'Debes indicar la nueva fecha de inicio de cuotas' };
    }

    if (!reason || reason.trim().length < 5) {
        return { error: 'Debes indicar un motivo (mínimo 5 caracteres)' };
    }

    try {
        const reservation = await prisma.reservation.findUnique({
            where: { id: reservationId },
            include: {
                lot: { select: { number: true, stage: true, cuotas: true } },
                buyer: { select: { name: true, email: true } }
            }
        });

        if (!reservation) return { error: 'Reserva no encontrada' };

        const oldDate = reservation.legacy_installment_start_date;
        const newDate = new Date(newStartDate);

        // 1. Update legacy_installment_start_date
        const updatedReservation = await prisma.reservation.update({
            where: { id: reservationId },
            data: { legacy_installment_start_date: newDate },
            include: { lot: true }
        });

        // 2. Recalculate next_payment_date
        const { calculateNextPaymentDate } = await import("@/actions/receipts");
        const nextPaymentDate = await calculateNextPaymentDate(updatedReservation);
        await prisma.reservation.update({
            where: { id: reservationId },
            data: { next_payment_date: nextPaymentDate }
        });

        // 3. Create audit log
        const clientName = reservation.buyer?.name || 'Desconocido';
        const lotNumber = reservation.lot?.number || 'N/A';
        const lotStage = reservation.lot?.stage || 'N/A';

        await prisma.auditLog.create({
            data: {
                action: 'UPDATE',
                entity: 'Reservation',
                entity_id: reservationId,
                details: JSON.stringify({
                    type: 'UPDATE_INSTALLMENT_START_DATE',
                    oldDate: oldDate ? new Date(oldDate).toISOString() : null,
                    newDate: newDate.toISOString(),
                    reason: reason.trim(),
                    clientName,
                    lotNumber,
                    lotStage,
                    newNextPaymentDate: nextPaymentDate?.toISOString() || null,
                    adjustedBy: session.user.email
                }),
                pk: reservationId,
                user_id: session.user.id,
                user_email: session.user.email,
            }
        });

        // 4. Invalidate caches
        memoryCache.deleteByPrefix('postventa_full_');
        memoryCache.deleteByPrefix('receipts_paginated_');
        revalidatePath('/admin/dashboard');

        return {
            success: true,
            message: `Fecha de inicio de cuotas actualizada. Próximo vencimiento recalculado.`,
            newNextPaymentDate: nextPaymentDate
        };
    } catch (error) {
        console.error("Error updating installment start date:", error);
        return { error: 'Error al actualizar la fecha de inicio de cuotas' };
    }
}
