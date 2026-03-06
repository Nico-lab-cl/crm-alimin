
export const PENALTY_RATE_200M2 = 0.00027785496;  // For lots < 300m2
export const PENALTY_RATE_300M2 = 0.000227324392; // For lots >= 300m2
export const GRACE_PERIOD_DAYS = 5; // From day 5 to 10 (inclusive)
export const PENALTY_START_DATE_WEB = new Date('2026-03-11T00:00:00-03:00'); // March 11, 2026

export function getInstallmentDueDate(acquisitionDate: Date | string, installmentNumber: number, isLegacy: boolean = false): Date {
    const base = new Date(acquisitionDate);
    // Use the actual day from the base date (e.g., if assigned on the 15th, due is 15th)
    const dueDay = base.getDate();
    const due = new Date(base.getFullYear(), base.getMonth(), dueDay, 0, 0, 0, 0);

    if (isLegacy) {
        // Offline clients: the base date is typically a virtual month before their first debt
        due.setMonth(due.getMonth() + installmentNumber);
    } else {
        // Web Users:
        // Si compraron entre el día 1 y 5, su primera cuota es este mismo mes.
        // Si compraron después del 5, su primera cuota es el mes siguiente.
        if (base.getDate() <= 5) {
            due.setMonth(due.getMonth() + (installmentNumber - 1));
        } else {
            due.setMonth(due.getMonth() + installmentNumber);
        }
    }

    return due;
}

export function calculateDailyInterest(
    totalLotPrice: number,
    lotAreaM2: number
): number {
    const rate = lotAreaM2 >= 300 ? PENALTY_RATE_300M2 : PENALTY_RATE_200M2;
    return Math.round(totalLotPrice * rate);
}

export function calculateTotalInterest(
    totalLotPrice: number,
    lotAreaM2: number,
    dueDate: Date,
    isLegacy: boolean,
    paymentDate: Date = new Date()
): number {
    // 1. Determine Grace Period End (Dynamic)
    const gracePeriodEnd = new Date(dueDate);

    // Rule: If due date is precisely the 5th, grace period ends on the 10th (standard 5-day grace).
    // If due date is ANY OTHER day (e.g., 15th), grace period ends on the 15th itself (penalty starts on the 16th).
    if (dueDate.getDate() === 5) {
        gracePeriodEnd.setDate(10);
    } else {
        // No grace period for custom dates; penalty starts the next day
        // ensure it's at the very end of the day
    }
    gracePeriodEnd.setHours(23, 59, 59, 999);

    if (paymentDate <= gracePeriodEnd) {
        return 0;
    }

    // 2. Calculate days late
    const pDate = new Date(paymentDate);
    pDate.setHours(0, 0, 0, 0);

    const gDate = new Date(gracePeriodEnd);
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
            gDate.setDate(gDate.getDate() - 1); // Grace period ends on March 10
        }
    }

    const diffTime = pDate.getTime() - gDate.getTime();
    const daysLate = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (daysLate <= 0) return 0;

    const dailyInterest = calculateDailyInterest(totalLotPrice, lotAreaM2);
    return dailyInterest * daysLate;
}
