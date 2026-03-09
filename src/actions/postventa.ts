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
                status: { in: ['paid', 'confirmed'] }, // Filter by active reservations
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

            const totalToPay = lot.price_total_clp || 0;
            const totalPaid = res.receipts.reduce((acc, r) => acc + r.amount_clp, 0) + (lot.reservation_amount_clp || 0);
            const pendingBalance = Math.max(0, totalToPay - totalPaid);

            const totalCuotas = lot.cuotas || 0;
            const paidCuotas = res.installments_paid || 0;

            let nextDueDate = null;
            let lateDays = 0;
            let penaltyAmount = 0;
            let isPieDebt = false;

            const isLegacyBool = Boolean(res.is_legacy);
            const baseDate = res.legacy_installment_start_date
                ? new Date(res.legacy_installment_start_date).toISOString()
                : res.created_at.toISOString();

            if (res.pie_status !== 'PAID') {
                // Pie Debt Logic
                isPieDebt = true;
                // Assuming Pie is due 15 days after reservation if not specified
                const pieDueDate = new Date(res.created_at);
                pieDueDate.setDate(pieDueDate.getDate() + 15);
                nextDueDate = pieDueDate;

                if (currentDate > pieDueDate) {
                    const diffTime = currentDate.getTime() - pieDueDate.getTime();
                    lateDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    // No interest for Pie yet, just alert
                }
            } else if (paidCuotas < totalCuotas) {
                // Installment Logic
                nextDueDate = getInstallmentDueDate(baseDate, paidCuotas + 1, isLegacyBool);

                if (isLegacyBool && res.legacy_debt_start_date) {
                    const debtStart = new Date(res.legacy_debt_start_date);
                    debtStart.setHours(0, 0, 0, 0);
                    if (currentDate > debtStart) {
                        const diffTime = currentDate.getTime() - debtStart.getTime();
                        lateDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                        if (lateDays > 0) {
                            const lotAreaM2 = lot.area_m2 || 200;
                            const dailyInterest = calculateDailyInterest(totalToPay, lotAreaM2);
                            penaltyAmount = dailyInterest * lateDays;
                        }
                    }
                } else {
                    const iDue = getInstallmentDueDate(baseDate, paidCuotas + 1, isLegacyBool);
                    const lotAreaM2 = lot.area_m2 || 200;
                    penaltyAmount = calculateTotalInterest(
                        totalToPay,
                        lotAreaM2,
                        iDue,
                        false,
                        currentDate
                    );

                    if (penaltyAmount > 0) {
                        const daily = calculateDailyInterest(totalToPay, lotAreaM2);
                        lateDays = daily > 0 ? Math.round(penaltyAmount / daily) : 0;
                    }
                }
            }

            const reservaAmount = lot.reservation_amount_clp || 0;
            const pieAmount = res.receipts.filter(r => r.scope === 'PIE').reduce((acc, r) => acc + r.amount_clp, 0);
            const cuotasAmount = res.receipts.filter(r => r.scope === 'INSTALLMENT').reduce((acc, r) => acc + r.amount_clp, 0);

            let isGracePeriod = false;
            // If they are past their due date but have 0 penalty, they are in grace (5th to 10th)
            if (nextDueDate && currentDate >= nextDueDate && penaltyAmount === 0) {
                isGracePeriod = true;
            }

            const ledgerEntry = {
                id: res.id,
                clientName: buyer?.name || 'Sin nombre',
                clientEmail: buyer?.email,
                clientPhone: res.phone,
                lotNumber: lot.number,
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
                receipts: res.receipts,
                isGracePeriod,
                isPieDebt,
                valor_cuota: lot.valor_cuota || 0
            };
            ledger.push(ledgerEntry);

            const fiveDaysFromNow = new Date(currentDate);
            fiveDaysFromNow.setDate(fiveDaysFromNow.getDate() + 5);

            // Include in alerts if:
            // 1. They are already past the due date (grace or mora)
            // 2. OR their due date is in the next 5 days ("A punto de vencer")
            if (nextDueDate && (currentDate >= nextDueDate || nextDueDate <= fiveDaysFromNow)) {
                debtAlerts.push({
                    ...ledgerEntry,
                    lateDays,
                    penaltyAmount,
                    isUpcoming: nextDueDate > currentDate && nextDueDate <= fiveDaysFromNow
                });
            }
        }

        // Priority sorting: Mora > Grace > Pie > Upcoming
        debtAlerts.sort((a, b) => {
            // 1. Mora (penalty > 0)
            if (a.penaltyAmount > 0 && b.penaltyAmount <= 0) return -1;
            if (b.penaltyAmount > 0 && a.penaltyAmount <= 0) return 1;

            // 2. Grace (isGracePeriod)
            if (a.isGracePeriod && !b.isGracePeriod) return -1;
            if (b.isGracePeriod && !a.isGracePeriod) return 1;

            // 3. Pie Debt
            if (a.isPieDebt && !b.isPieDebt) return -1;
            if (b.isPieDebt && !a.isPieDebt) return 1;

            // 4. Then by late days (desc)
            if (b.lateDays !== a.lateDays) return b.lateDays - a.lateDays;

            // 5. Finally by date
            return (a.nextDueDate?.getTime() || 0) - (b.nextDueDate?.getTime() || 0);
        });

        return { success: true, ledger, debtAlerts }
    } catch (error) {
        console.error("Error getting postventa data:", error);
        return { error: 'Error al cargar datos de postventa', ledger: [], debtAlerts: [] };
    }
}
