
export const PENALTY_RATE_200M2 = 0.00027785496;  // For lots < 300m2
export const PENALTY_RATE_300M2 = 0.000227324392; // For lots >= 300m2
export const GRACE_PERIOD_DAYS = 5; // From day 5 to 10 (inclusive)
export const PENALTY_START_DATE_WEB = new Date('2026-03-11T00:00:00-03:00'); // March 11, 2026

export function getInstallmentDueDate(acquisitionDate: Date | string, installmentNumber: number, isLegacy: boolean = false): Date {
    const base = new Date(acquisitionDate);
    const due = new Date(base);

    // For legacy users, baseDate is legacy_installment_start_date (1 month before first cuota)
    if (isLegacy) {
        due.setMonth(due.getMonth() + installmentNumber);
    } else {
        // For web users, baseDate is purchase date. First cuota is due in the same month.
        due.setMonth(due.getMonth() + (installmentNumber - 1));
    }

    due.setDate(5); // Due date is always the 5th
    due.setHours(0, 0, 0, 0);
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
    // 1. Determine Grace Period End (10th of the month of the due date)
    // Due date is always 5th. Grace period is until 10th.
    const gracePeriodEnd = new Date(dueDate);
    gracePeriodEnd.setDate(10);
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
