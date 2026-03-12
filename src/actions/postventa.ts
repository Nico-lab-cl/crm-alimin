'use server'

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { getInstallmentDueDate, calculateTotalInterest, calculateDailyInterest } from "@/lib/financials"

export async function getPostventaData() {
    const session = await auth()
    if (!session?.user || session.user.role !== 'ADMIN') {
        return { error: 'No autorizado', ledger: [], debtAlerts: [] }
    }

    try {
        const reservations = await prisma.reservation.findMany({
            where: {
                buyer_id: { not: null },
                lot: { status: { in: ['sold', 'reserved'] } }
            },
            include: {
                lot: true,
                buyer: true,
                receipts: {
                    where: { status: 'APPROVED' },
                    orderBy: { created_at: 'desc' }
                }
            }
        });

        const ledger = [];
        const debtAlerts = [];

        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        for (const res of reservations) {
            const lot = res.lot;
            const buyer = res.buyer;

            const pieAmount = res.receipts.filter(r => r.scope === 'PIE').reduce((acc, r) => acc + r.amount_clp, 0);
            const cuotasAmount = res.receipts.filter(r => r.scope === 'INSTALLMENT').reduce((acc, r) => acc + r.amount_clp, 0);
            
            // Fallback for legacy/manual data if receipts are not synced yet
            const effectivePieAmount = pieAmount || (res.pie_status === 'PAID' ? (lot.pie || 0) : 0);
            const effectiveCuotasAmount = cuotasAmount || ((res.installments_paid || 0) * (lot.valor_cuota || 0));
            
            const totalPaid = effectivePieAmount + effectiveCuotasAmount;
            const totalToPay = lot.price_total_clp || 0;
            const pendingBalance = Math.max(0, totalToPay - totalPaid - (lot.reservation_amount_clp || 0));

            const totalCuotas = lot.cuotas || 0;
            const paidCuotas = res.installments_paid || 0;

            let nextDueDate = null;
            let lateDays = 0;
            let penaltyAmount = 0;
            let isPieDebt = false;

            // Use cached values for the list view if updated in the last 24h
            // ONLY if this is NOT a detail request (getPostventaData is used for lists)
            const isCacheValid = res.last_financial_sync && 
                               (new Date().getTime() - new Date(res.last_financial_sync).getTime() < 24 * 60 * 60 * 1000);

            if (isCacheValid) {
                penaltyAmount = res.cached_mora_amount || 0;
                lateDays = res.cached_late_days || 0;
                
                // We still need nextDueDate for display
                const isLegacyBool = Boolean(res.is_legacy);
                const baseDate = res.legacy_installment_start_date
                    ? new Date(res.legacy_installment_start_date).toISOString()
                    : res.created_at.toISOString();
                
                if (paidCuotas < totalCuotas) {
                    const customStart = res.legacy_installment_start_date ? new Date(res.legacy_installment_start_date) : null;
                    const customDueDay = customStart ? customStart.getDate() : null;
                    nextDueDate = getInstallmentDueDate(baseDate, paidCuotas + 1, isLegacyBool, customDueDay, Boolean(res.is_promo));
                }
            } else {
                // FALLBACK TO REAL-TIME CALCULATION (Slow, but ensures correctness if sync failed)
                const isLegacyBool = Boolean(res.is_legacy);
                const baseDate = res.legacy_installment_start_date
                    ? new Date(res.legacy_installment_start_date).toISOString()
                    : res.created_at.toISOString();

                if (paidCuotas < totalCuotas) {
                    const customStart = res.legacy_installment_start_date ? new Date(res.legacy_installment_start_date) : null;
                    const customDueDay = customStart ? customStart.getDate() : null;
                    nextDueDate = getInstallmentDueDate(baseDate, paidCuotas + 1, isLegacyBool, customDueDay, Boolean(res.is_promo));

                    const lotAreaM2 = lot.area_m2 || 200;
                    
                    penaltyAmount = calculateTotalInterest(
                        totalToPay,
                        lotAreaM2,
                        nextDueDate,
                        isLegacyBool,
                        currentDate,
                        // @ts-ignore
                        Boolean(res.mora_frozen),
                        res.legacy_debt_start_date
                    );

                    if (penaltyAmount > 0) {
                        const daily = calculateDailyInterest(totalToPay, lotAreaM2);
                        lateDays = daily > 0 ? Math.round(penaltyAmount / daily) : 0;
                    }
                }
            }

            // identify Pie Debt status
            if (res.pie_status !== 'PAID') {
                isPieDebt = true;
                const pieDueDate = new Date(res.created_at);
                pieDueDate.setDate(pieDueDate.getDate() + 15);
            }

            const reservaAmount = lot.reservation_amount_clp || 0;

            let isGracePeriod = false;
            // A person is in grace only if:
            // 1. They are past due date
            // 2. Penalty is 0 (day 6-10)
            // 3. They DON'T have an approved payment for this specific installment
            if (nextDueDate && currentDate >= nextDueDate && penaltyAmount === 0) {
                const hasPaidCurrent = res.receipts.some(r => {
                    if (r.scope !== 'INSTALLMENT') return false;
                    const rDate = new Date(r.created_at);
                    return rDate.getMonth() === nextDueDate.getMonth() && rDate.getFullYear() === nextDueDate.getFullYear();
                });

                if (!hasPaidCurrent) {
                    isGracePeriod = true;
                }
            }

            const ledgerEntry = {
                id: res.id,
                clientName: buyer?.name || 'Sin nombre',
                clientEmail: buyer?.email,
                clientPhone: res.phone,
                lotNumber: lot.number,
                lotStage: lot.stage || 1,
                totalToPay,
                totalPaid,
                pendingBalance,
                paidCuotas,
                totalCuotas,
                pieStatus: res.pie_status,
                nextDueDate,
                reservaAmount,
                pieAmount,
                cuotasAmount,
                uploaded_contract_url: res.uploaded_contract_url,
                receipts: res.receipts,
                isGracePeriod,
                isPieDebt,
                valor_cuota: lot.valor_cuota || 0,
                monto_cuota: lot.valor_cuota || 0,
                // @ts-ignore
                isMoraFrozen: Boolean(res.mora_frozen),
                // @ts-ignore
                manual_documents: res.manual_documents,
                signed_at: res.signed_at,
                is_legacy: Boolean(res.is_legacy),
                last_financial_sync: res.last_financial_sync
            };
            ledger.push(ledgerEntry);

            const fiveDaysFromNow = new Date(currentDate);
            fiveDaysFromNow.setDate(fiveDaysFromNow.getDate() + 5);

            const isLate = penaltyAmount > 0;
            const isUpcomingPotential = nextDueDate ? (nextDueDate > currentDate && nextDueDate <= fiveDaysFromNow) : false;

            let isUpcoming = false;
            if (isUpcomingPotential && nextDueDate) {
                const hasPaidCurrent = res.receipts.some(r => {
                    if (r.scope !== 'INSTALLMENT') return false;
                    const rDate = new Date(r.created_at);
                    return rDate.getMonth() === nextDueDate.getMonth() && rDate.getFullYear() === nextDueDate.getFullYear();
                });
                if (!hasPaidCurrent) {
                    isUpcoming = true;
                }
            }

            const isUpToDate = !isGracePeriod && !isLate && !isUpcoming;

            debtAlerts.push({
                ...ledgerEntry,
                lateDays,
                penaltyAmount,
                isUpcoming,
                displayDueDate: nextDueDate,
                isLate,
                isUpToDate
            });
        }

        // Priority sorting: Mora > Grace > Pie > Upcoming
        debtAlerts.sort((a, b) => {
            if (a.penaltyAmount > 0 && b.penaltyAmount <= 0) return -1;
            if (b.penaltyAmount > 0 && a.penaltyAmount <= 0) return 1;
            if (a.isGracePeriod && !b.isGracePeriod) return -1;
            if (b.isGracePeriod && !a.isGracePeriod) return 1;
            if (a.isUpcoming && !b.isUpcoming) return -1;
            if (b.isUpcoming && !a.isUpcoming) return 1;
            if (a.isUpToDate && !b.isUpToDate) return 1;
            if (b.isUpToDate && !a.isUpToDate) return -1;
            if (b.lateDays !== a.lateDays) return b.lateDays - a.lateDays;
            return (a.nextDueDate?.getTime() || 0) - (b.nextDueDate?.getTime() || 0);
        });

        return { success: true, ledger, debtAlerts }
    } catch (error) {
        console.error("Error getting postventa data:", error);
        return { error: 'Error al cargar datos de postventa', ledger: [], debtAlerts: [] };
    }
}

/**
 * Syncs financial fields (mora, late days) for all active reservations.
 * This is intended to be called by a cron job once a day.
 */
export async function syncAllFinancials() {
    const session = await auth()
    if (!session?.user || session.user.role !== 'ADMIN') {
        return { error: 'No autorizado' }
    }

    try {
        const reservations = await prisma.reservation.findMany({
            where: {
                buyer_id: { not: null },
                lot: { status: { in: ['sold', 'reserved'] } }
            },
            include: {
                lot: true,
                receipts: {
                    where: { status: 'APPROVED' }
                }
            }
        });

        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        let count = 0;

        for (const res of reservations) {
            const lot = res.lot;
            const paidCuotas = res.installments_paid || 0;
            const totalCuotas = lot.cuotas || 0;
            const totalToPay = lot.price_total_clp || 0;

            let lateDays = 0;
            let penaltyAmount = 0;

            if (paidCuotas < totalCuotas) {
                const isLegacyBool = Boolean(res.is_legacy);
                const baseDate = res.legacy_installment_start_date
                    ? new Date(res.legacy_installment_start_date).toISOString()
                    : res.created_at.toISOString();

                const customStart = res.legacy_installment_start_date ? new Date(res.legacy_installment_start_date) : null;
                const customDueDay = customStart ? customStart.getDate() : null;
                
                const nextDueDate = getInstallmentDueDate(baseDate, paidCuotas + 1, isLegacyBool, customDueDay, Boolean(res.is_promo));
                const lotAreaM2 = lot.area_m2 || 200;

                penaltyAmount = calculateTotalInterest(
                    totalToPay,
                    lotAreaM2,
                    nextDueDate,
                    isLegacyBool,
                    currentDate,
                    // @ts-ignore
                    Boolean(res.mora_frozen),
                    res.legacy_debt_start_date
                );

                if (penaltyAmount > 0) {
                    const daily = calculateDailyInterest(totalToPay, lotAreaM2);
                    lateDays = daily > 0 ? Math.round(penaltyAmount / daily) : 0;
                }
            }

            await prisma.reservation.update({
                where: { id: res.id },
                data: {
                    cached_mora_amount: penaltyAmount,
                    cached_late_days: lateDays,
                    last_financial_sync: new Date()
                }
            });
            count++;
        }

        return { success: true, count };
    } catch (error) {
        console.error("Error syncing all financials:", error);
        return { error: 'Error al sincronizar datos financieros' };
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
                            installments_count: cuotaNum,
                            reservation_id: res.id,
                            lot_id: res.lot_id,
                            processed_at: new Date('2026-03-11')
                        }
                    });
                    syncedCount++;
                }
            }
        }

        return { success: true, syncedCount };
    } catch (error) {
        console.error("Error syncing legacy receipts:", error);
        return { error: 'Error al sincronizar recibos' };
    }
}
