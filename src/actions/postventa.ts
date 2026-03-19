'use server'

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { getInstallmentDueDate, calculateTotalInterest, calculateDailyInterest } from "@/lib/financials"
import { memoryCache } from "@/lib/cache"
import { revalidatePath } from "next/cache"

const POSTVENTA_CACHE_KEY = 'postventa_data';
const CACHE_TTL = 300; // 5 minutes

export async function invalidatePostventaCache() {
    memoryCache.deleteByPrefix('postventa_full_');
}

export async function getFullPostventaData({
    stage = 'ALL'
}: {
    stage?: string | number;
} = {}) {
    const session = await auth()
    const isPostventa = session?.user?.email === 'postventa@lomasdelmar.cl';
    if (!session?.user || (session.user.role !== 'ADMIN' && !isPostventa)) {
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
                // @ts-ignore
                mora_frozen: true,
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
                        created_at: true
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
                legacy_uploaded_contracts: true
            }
        });

        const processedData = allReservations.map(res => {
            const lot = res.lot;
            const buyer = res.buyer;

            const pieAmount = res.receipts.reduce((acc, r) => r.scope === 'PIE' ? acc + r.amount_clp : acc, 0);
            const cuotasAmount = res.receipts.reduce((acc, r) => r.scope === 'INSTALLMENT' ? acc + r.amount_clp : acc, 0);
            
            const effectivePieAmount = pieAmount || (res.pie_status === 'PAID' ? (lot.pie || 0) : 0);
            const effectiveCuotasAmount = cuotasAmount || ((res.installments_paid || 0) * (lot.valor_cuota || 0));
            
            const totalPaid = effectivePieAmount + effectiveCuotasAmount + (lot.reservation_amount_clp || 0);
            const totalToPay = lot.price_total_clp || 0;
            const pendingBalance = Math.max(0, totalToPay - totalPaid);

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
                isUpcoming,
                isLate: penaltyAmount > 0,
                isUpToDate: !isGracePeriod && penaltyAmount <= 0 && !isUpcoming,
                status: (penaltyAmount > 0 && !Boolean(res.mora_frozen)) ? 'LATE' : 
                        (isGracePeriod && !Boolean(res.mora_frozen)) ? 'GRACE' : 
                        (isUpcoming && !Boolean(res.mora_frozen)) ? 'UPCOMING' : 'OK',
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
                advisor: res.advisor || null,
                // @ts-ignore
                observation: res.observation || null
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
    date = new Date().toISOString()
}: {
    reservationId: string;
    amount: number;
    scope: 'PIE' | 'INSTALLMENT' | 'GASTOS_OPERACIONALES';
    receiptUrl?: string;
    date?: string;
}) {
    const session = await auth();
    const isPostventa = session?.user?.email === 'postventa@lomasdelmar.cl';
    if (!session?.user || (session.user.role !== 'ADMIN' && !isPostventa)) {
        return { error: 'No autorizado' };
    }

    try {
        const reservation = await prisma.reservation.findUnique({
            where: { id: reservationId },
            include: { lot: true }
        });

        if (!reservation) return { error: 'Reserva no encontrada' };

        // 1. Create APPROVED receipt
        const receipt = await prisma.paymentReceipt.create({
            data: {
                amount_clp: amount,
                status: 'APPROVED',
                receipt_url: receiptUrl,
                scope: scope === 'GASTOS_OPERACIONALES' ? 'OTHERS' : scope,
                reservation_id: reservationId,
                lot_id: reservation.lot_id,
                processed_at: new Date(date),
                created_at: new Date(date)
            }
        });

        // 2. Update Reservation State
        if (scope === 'PIE') {
            await prisma.reservation.update({
                where: { id: reservationId },
                data: { pie_status: 'PAID' }
            });
        } else if (scope === 'INSTALLMENT') {
            await prisma.reservation.update({
                where: { id: reservationId },
                data: { 
                    installments_paid: { increment: 1 },
                    pipeline_stage: 'PAGO_CUOTAS'
                }
            });
        }

        memoryCache.deleteByPrefix('postventa_full_');
        memoryCache.deleteByPrefix('receipts_paginated_');
        revalidatePath('/admin/dashboard');

        return { success: true, receipt };
    } catch (error) {
        console.error("Error registering manual payment:", error);
        return { error: 'Error al registrar el pago' };
    }
}
