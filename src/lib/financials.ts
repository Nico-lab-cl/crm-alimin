export const GRACE_PERIOD_DAYS = 5; // From day 5 to 10 (inclusive)
export const FIXED_DAILY_PENALTY = 10000;
export const PENALTY_START_DATE_WEB = new Date('2026-03-11T00:00:00-03:00'); // March 11, 2026

export function getInstallmentDueDate(
    acquisitionDate: Date | string,
    installmentNumber: number,
    isLegacy: boolean = false,
    customDueDay?: number | null,
    isPromo: boolean = false
): Date {
    const base = new Date(acquisitionDate);
    // Business Rule: All installments are due on the 5th, UNLESS a custom date is provided
    const dueDay = customDueDay || 5;
    const due = new Date(base.getFullYear(), base.getMonth(), dueDay, 12, 0, 0, 0);

    if (customDueDay) {
        // When admin explicitly set a start date, it represents the MONTH of cuota 1.
        // Formula: base + (N-1). Works the same for legacy and non-legacy.
        due.setMonth(due.getMonth() + (installmentNumber - 1));
    } else if (isLegacy) {
        // Legacy clients without custom start: base is "month before" cuota 1
        due.setMonth(due.getMonth() + installmentNumber);
    } else {
        // Web Users without custom start:
        // Si compraron entre el día 1 y 5 (inclusive), su primera cuota es este mismo mes.
        // Si compraron después del día 5, su primera cuota es el mes siguiente.
        if (base.getDate() <= 5) {
            due.setMonth(due.getMonth() + (installmentNumber - 1));
        } else {
            due.setMonth(due.getMonth() + installmentNumber);
        }
    }

    return due;
}

export function calculateDailyInterest(
    _totalLotPrice: number,
    _lotAreaM2: number
): number {
    return FIXED_DAILY_PENALTY;
}

export function calculateTotalInterest(
    totalLotPrice: number,
    lotAreaM2: number,
    dueDate: Date,
    isLegacy: boolean,
    paymentDate: Date = new Date(),
    moraFrozen: boolean = false,
    legacyDebtStartDate?: Date | string | null,
    legacyDebtEndDate?: Date | string | null
): number {
    if (moraFrozen) return 0;

    // 1. Establish Calculation Date (capped by legacy debt end date if present)
    let pDate = new Date(paymentDate);
    if (legacyDebtEndDate) {
        const endDate = new Date(legacyDebtEndDate);
        if (pDate > endDate) {
            pDate.setTime(endDate.getTime());
        }
    }
    pDate.setHours(12, 0, 0, 0); // Use mid-day to avoid TZ shifts near boundaries

    const effectiveDueDate = new Date(dueDate);
    effectiveDueDate.setHours(0, 0, 0, 0);
    
    // 2. Determine Grace Period End (Dynamic)
    const gracePeriodEnd = new Date(dueDate);
    // Rule: Grace period is 5 days. If due is 5th, grace is 6, 7, 8, 9, 10.
    // Penalty starts on the 11th.
    gracePeriodEnd.setDate(dueDate.getDate() + 5);
    gracePeriodEnd.setHours(23, 59, 59, 999);

    if (pDate <= gracePeriodEnd) return 0;

    let gDate: Date;

    if (legacyDebtStartDate) {
        const manualStart = new Date(legacyDebtStartDate);
        manualStart.setHours(0, 0, 0, 0);
        // Business Rule: Use the LATER of the manual start date and the original grace period end.
        gDate = manualStart > gracePeriodEnd ? manualStart : gracePeriodEnd;
    } else {
        gDate = gracePeriodEnd;
    }

    // 3. Apply Web Rule Cutoff (March 11, 2026) for non-legacy users
    // If a user has a manual debt start date, we treat them as legacy (ignore the web cutoff)
    const effectiveIsLegacy = isLegacy || !!legacyDebtStartDate;

    if (!effectiveIsLegacy) {
        const webCutoff = new Date(PENALTY_START_DATE_WEB);
        webCutoff.setHours(0, 0, 0, 0); // March 11 00:00:00

        // If the payment is happening before March 11, no penalty.
        if (pDate < webCutoff) {
            return 0;
        }

        // If the grace period end was before March 11, we move the starting line to March 10 23:59:59,
        // so that the first day of penalty (diff > 0) is March 11.
        if (gDate < webCutoff) {
            gDate = new Date(webCutoff.getTime() - 1000); // March 10 23:59:59
        }
    }

    // 4. Calculate Days Late
    // Rule: If grace ends at 23:59:59 on the 10th.
    // At 00:00:01 on the 11th, it's 1 day late.
    // At 23:59:59 on the 11th, it's 1 day late.
    // At 00:00:01 on the 12th, it's 2 days late.
    const diffTime = pDate.getTime() - gDate.getTime();
    let daysLate = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const dailyInterest = calculateDailyInterest(totalLotPrice, lotAreaM2);
    return dailyInterest * (daysLate > 0 ? daysLate : 0);
}
