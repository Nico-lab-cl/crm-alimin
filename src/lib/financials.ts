
export const INTEREST_RATE_HIGH_TIER = 0.0227324392; // 2.27% approx for >= 77 cuotas
export const INTEREST_RATE_LOW_TIER = 0.027785496;  // 2.77% approx for >= 64 cuotas
export const GRACE_PERIOD_DAYS = 5; // From day 5 to 10 (inclusive)

export function getInstallmentDueDate(acquisitionDate: Date | string, installmentNumber: number): Date {
    const base = new Date(acquisitionDate);
    const due = new Date(base);
    due.setMonth(due.getMonth() + installmentNumber);
    due.setDate(5); // Due date is always the 5th
    due.setHours(0, 0, 0, 0);
    return due;
}

export function calculateDailyInterest(
    installmentAmount: number,
    totalLotCuotas: number
): number {
    let factor = 0;
    if (totalLotCuotas >= 77) {
        factor = INTEREST_RATE_HIGH_TIER;
    } else if (totalLotCuotas >= 64) {
        factor = INTEREST_RATE_LOW_TIER;
    } else {
        // Default to low tier logic (higher interest) or 0? 
        // User said "no hay ningún lote menor a 64".
        // Use the low tier factor as a safe fallback for now.
        factor = INTEREST_RATE_LOW_TIER;
    }
    return Math.round(installmentAmount * factor);
}

export function calculateTotalInterest(
    installmentAmount: number,
    dueDate: Date,
    totalLotCuotas: number,
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
    // User: "se cobra multa por 1 dia el dia 11".
    // So if paymentDate is 11th, we want 1 day.
    // 11 - 10 = 1.
    // We calculate difference in days between paymentDate and gracePeriodEnd.

    // Normalize dates to remove time for day diff calculation
    const pDate = new Date(paymentDate);
    pDate.setHours(0, 0, 0, 0);

    const gDate = new Date(gracePeriodEnd);
    gDate.setHours(0, 0, 0, 0);

    const diffTime = pDate.getTime() - gDate.getTime();
    const daysLate = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (daysLate <= 0) return 0;

    const dailyInterest = calculateDailyInterest(installmentAmount, totalLotCuotas);
    return dailyInterest * daysLate;
}
