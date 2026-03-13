'use server'

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { getInstallmentDueDate, calculateTotalInterest, calculateDailyInterest } from "@/lib/financials"
import { memoryCache } from "@/lib/cache"
import { revalidatePath } from "next/cache"

const POSTVENTA_CACHE_KEY = 'postventa_data';
const CACHE_TTL = 300; // 5 minutes

export async function getFullPostventaData({
    stage = 'ALL'
}: {
    stage?: string | number;
} = {}) {
    const session = await auth()
    if (!session?.user || session.user.role !== 'ADMIN') {
        return { error: 'No autorizado', data: [], totalPages: 0 }
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

        const allReservations = await prisma.reservation.findMany({
            where: whereStats,
            orderBy: { created_at: 'desc' },
            select: {
                id: true,
                name: true,
                phone: true,
                installments_paid: true,
                pie_status: true,
                uploaded_contract_url: true,
                created_at: true,
                is_legacy: true,
                legacy_installment_start_date: true,
                legacy_debt_start_date: true,
                // @ts-ignore
                mora_frozen: true,
                // @ts-ignore
                manual_documents: true,
                // @ts-ignore
                signed_at: true,
                // @ts-ignore
                is_promo: true,
                lot: {
                    select: {
                        number: true,
                        stage: true,
                        price_total_clp: true,
                        reservation_amount_clp: true,
                        cuotas: true,
                        valor_cuota: true,
                        area_m2: true,
                        pie: true
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
                        created_at: true
                    }
                }
            }
        });

        const processedData = allReservations.map(res => {
            const lot = res.lot;
            const buyer = res.buyer;

            const pieAmount = res.receipts.reduce((acc, r) => r.scope === 'PIE' ? acc + r.amount_clp : acc, 0);
            const cuotasAmount = res.receipts.reduce((acc, r) => r.scope === 'INSTALLMENT' ? acc + r.amount_clp : acc, 0);
            
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

            const isLegacyBool = Boolean(res.is_legacy);
            const baseDate = res.legacy_installment_start_date
                ? new Date(res.legacy_installment_start_date).toISOString()
                : res.created_at.toISOString();

            const currentDate = new Date();
            currentDate.setHours(0, 0, 0, 0);

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

            const fiveDaysFromNow = new Date(currentDate);
            fiveDaysFromNow.setDate(fiveDaysFromNow.getDate() + 5);

            // Single pass over receipts for performance
            let hasPaidCurrentInstallment = false;
            if (nextDueDate) {
                const targetMonth = nextDueDate.getUTCMonth();
                const targetYear = nextDueDate.getUTCFullYear();
                hasPaidCurrentInstallment = res.receipts.some(r => {
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

            return {
                id: res.id,
                clientName: buyer?.name || res.name || 'Sin nombre',
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
                reservaAmount: lot.reservation_amount_clp || 0,
                pieAmount,
                cuotasAmount,
                uploaded_contract_url: res.uploaded_contract_url,
                receipts: res.receipts,
                isGracePeriod,
                isPieDebt: res.pie_status !== 'PAID',
                valor_cuota: lot.valor_cuota || 0,
                monto_cuota: lot.valor_cuota || 0,
                // @ts-ignore
                isMoraFrozen: Boolean(res.mora_frozen),
                // @ts-ignore
                manual_documents: res.manual_documents,
                signed_at: res.signed_at,
                is_legacy: Boolean(res.is_legacy),
                lateDays,
                penaltyAmount,
                isUpcoming,
                isLate: penaltyAmount > 0,
                isUpToDate: !isGracePeriod && penaltyAmount <= 0 && !isUpcoming
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

        memoryCache.deleteByPrefix('postventa_full_');
        memoryCache.deleteByPrefix('receipts_paginated_');
        revalidatePath('/admin/dashboard');

        return { success: true, syncedCount };
    } catch (error) {
        console.error("Error syncing legacy receipts:", error);
        return { error: 'Error al sincronizar recibos' };
    }
}
