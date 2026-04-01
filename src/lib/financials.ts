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
    legacyDebtStartDate?: Date | string | null
): number {
    if (moraFrozen) return 0;

    // 1. Calculate days late
    const pDate = new Date(paymentDate);
    pDate.setHours(0, 0, 0, 0);

    let gDate: Date;

    if (legacyDebtStartDate) {
        // For users with a manual debt start date, we use that date directly
        gDate = new Date(legacyDebtStartDate);
    } else {
        // 1. Determine Grace Period End (Dynamic)
        const gracePeriodEnd = new Date(dueDate);
        // Rule: Grace period ends exactly 5 days after the due date.
        gracePeriodEnd.setDate(dueDate.getDate() + 5);
        gracePeriodEnd.setHours(23, 59, 59, 999);
        gDate = gracePeriodEnd;

        if (paymentDate <= gracePeriodEnd) {
            return 0;
        }
    }
    gDate.setHours(0, 0, 0, 0);

    // 3. Apply Web Rule Cutoff (March 11, 2026) for non-legacy users
    // If a non-legacy user is late, we ONLY count days late starting from March 11.
    // If their due date/grace period was BEFORE March 11, we act as if their grace period
    // magically extended until March 10, so day 1 of penalty is March 11.
    if (!isLegacy) {
        const webCutoff = new Date(PENALTY_START_DATE_WEB);
        webCutoff.setHours(0, 0, 0, 0);

        // If the payment is happening before or on March 10, no penalty.
        if (pDate < webCutoff) {
            return 0;
        }

        // If the grace period end was before March 10, we move the starting line to March 10,
        // so that the first day of penalty calculated is March 11.
        if (gDate < webCutoff) {
            gDate.setTime(webCutoff.getTime());
            gDate.setDate(gDate.getDate() - 1); 
        }
    }

    const diffTime = pDate.getTime() - gDate.getTime();
    let daysLate = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // If late, the first day of penalty (the start of the debt) is also counted
    if (daysLate > 0) {
        daysLate += 1;
    }

    if (daysLate <= 0) return 0;

    const dailyInterest = calculateDailyInterest(totalLotPrice, lotAreaM2);
    return dailyInterest * daysLate;
}
