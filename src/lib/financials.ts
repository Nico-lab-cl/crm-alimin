
export const PENALTY_RATE_200M2 = 0.00027785496;  // For lots < 300m2
export const PENALTY_RATE_300M2 = 0.000227324392; // For lots >= 300m2
export const GRACE_PERIOD_DAYS = 5; // From day 5 to 10 (inclusive)
export const PENALTY_START_DATE_WEB = new Date('2026-03-11T00:00:00-03:00'); // March 11, 2026

export function getInstallmentDueDate(
    acquisitionDate: Date | string, 
    installmentNumber: number, 
    isLegacy: boolean = false, 
    customDueDay?: number | null
): Date {
    const base = new Date(acquisitionDate);
    // Business Rule: All installments are due on the 5th, UNLESS a custom date is provided
    const dueDay = customDueDay || 5;
    const due = new Date(base.getFullYear(), base.getMonth(), dueDay, 12, 0, 0, 0);

    if (isLegacy) {
        // Offline clients: the base date is typically a virtual month before their first debt
        due.setMonth(due.getMonth() + installmentNumber);
    } else {
        // Web Users:
        if (customDueDay) {
            // When an admin assigns a custom date (e.g. March 15), cuota 1 is exactly in that month.
            due.setMonth(due.getMonth() + (installmentNumber - 1));
        } else {
            // Si compraron entre el día 1 y 5 (inclusive), su primera cuota es este mismo mes.
            // Si compraron después del día 5, su primera cuota es el mes siguiente.
            if (base.getDate() <= 5) {
                due.setMonth(due.getMonth() + (installmentNumber - 1));
            } else {
                due.setMonth(due.getMonth() + installmentNumber);
            }
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

    // Rule: Grace period ends exactly 5 days after the due date.
    // If due date is the 5th, grace period ends on the 10th. If 15th, ends on the 20th.
    gracePeriodEnd.setDate(dueDate.getDate() + 5);
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
            gDate.setDate(gDate.getDate() - 1); 
        }
    }

    const diffTime = pDate.getTime() - gDate.getTime();
    const daysLate = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (daysLate <= 0) return 0;

    const dailyInterest = calculateDailyInterest(totalLotPrice, lotAreaM2);
    return dailyInterest * daysLate;
}
