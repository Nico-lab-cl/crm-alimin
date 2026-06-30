export const GRACE_PERIOD_DAYS = 5; // From day 5 to 10 (inclusive)
export const FIXED_DAILY_PENALTY = 10000;
export const PENALTY_START_DATE_WEB = new Date('2026-03-11T00:00:00-03:00'); // March 11, 2026

export function toSantiagoMidnight(date: Date | string): Date {
    const d = typeof date === 'string' ? new Date(date) : date;
    const santiagoStr = d.toLocaleString("en-US", { timeZone: "America/Santiago" });
    const [datePart] = santiagoStr.split(',');
    const [monthStr, dayStr, yearStr] = datePart.split('/');
    const month = parseInt(monthStr, 10) - 1;
    const day = parseInt(dayStr, 10);
    const year = parseInt(yearStr, 10);
    return new Date(Date.UTC(year, month, day, 12, 0, 0, 0));
}

export function getChileToday(): Date {
    return toSantiagoMidnight(new Date());
}

export function getInstallmentDueDate(
    acquisitionDate: Date | string,
    installmentNumber: number,
    isLegacy: boolean = false,
    customDueDay?: number | null,
    isPromo: boolean = false
): Date {
    const base = toSantiagoMidnight(acquisitionDate);
    const dueDay = customDueDay || 5;
    
    // Construct base due date in UTC at 12:00:00
    const due = new Date(Date.UTC(base.getUTCFullYear(), base.getUTCMonth(), dueDay, 12, 0, 0, 0));

    if (customDueDay) {
        due.setUTCMonth(due.getUTCMonth() + (installmentNumber - 1));
    } else if (isLegacy) {
        due.setUTCMonth(due.getUTCMonth() + installmentNumber);
    } else {
        if (base.getUTCDate() <= 5) {
            due.setUTCMonth(due.getUTCMonth() + (installmentNumber - 1));
        } else {
            due.setUTCMonth(due.getUTCMonth() + installmentNumber);
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

export function calculateDaysLate(
    dueDate: Date,
    paymentDate: Date,
    isLegacy: boolean,
    legacyDebtStartDate?: Date | string | null,
    legacyDebtEndDate?: Date | string | null
): number {
    const paymentMidnight = toSantiagoMidnight(paymentDate);
    let effectivePayment = paymentMidnight;

    if (legacyDebtEndDate) {
        const endMidnight = toSantiagoMidnight(legacyDebtEndDate);
        if (effectivePayment > endMidnight) {
            effectivePayment = endMidnight;
        }
    }

    const dueMidnight = toSantiagoMidnight(dueDate);
    
    // Grace period end: dueMidnight + 5 days
    const gracePeriodEnd = new Date(dueMidnight);
    gracePeriodEnd.setUTCDate(gracePeriodEnd.getUTCDate() + 5);

    let effectiveMoraStart = gracePeriodEnd;
    if (legacyDebtStartDate) {
        const manualStart = toSantiagoMidnight(legacyDebtStartDate);
        effectiveMoraStart = manualStart > gracePeriodEnd ? manualStart : gracePeriodEnd;
    }

    if (effectivePayment < effectiveMoraStart) {
        return 0;
    }

    let gDate: Date;
    if (legacyDebtStartDate) {
        const manualStart = toSantiagoMidnight(legacyDebtStartDate);
        const baseAnchor = manualStart > gracePeriodEnd ? manualStart : gracePeriodEnd;
        // We anchor to the day before so that difference is 1 on start date
        gDate = new Date(baseAnchor);
        gDate.setUTCDate(gDate.getUTCDate() - 1);
    } else {
        gDate = gracePeriodEnd;
    }

    const effectiveIsLegacy = isLegacy || !!legacyDebtStartDate;
    if (!effectiveIsLegacy) {
        const webCutoff = toSantiagoMidnight(PENALTY_START_DATE_WEB);
        if (effectivePayment < webCutoff) {
            return 0;
        }
        if (gDate < webCutoff) {
            // Anchor to March 10 so difference on March 11 is 1 day
            const dayBeforeCutoff = new Date(webCutoff);
            dayBeforeCutoff.setUTCDate(dayBeforeCutoff.getUTCDate() - 1);
            gDate = dayBeforeCutoff;
        }
    }

    const diffMs = effectivePayment.getTime() - gDate.getTime();
    const daysLate = Math.round(diffMs / (1000 * 60 * 60 * 24));
    return daysLate > 0 ? daysLate : 0;
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
    const daysLate = calculateDaysLate(dueDate, paymentDate, isLegacy, legacyDebtStartDate, legacyDebtEndDate);
    const dailyInterest = calculateDailyInterest(totalLotPrice, lotAreaM2);
    return dailyInterest * daysLate;
}

export interface ResidualMoraInstallment {
    number: number;
    dueDate: string;
    interest: number;
    credits: number;
    residual: number;
    daysLate: number;
}

/**
 * Residuo de mora en cuotas YA PAGADAS (capital cubierto) cuyo interés de mora
 * todavía no se salda. Desacopla la mora del capital: una cuota sigue acumulando
 * mora a $10.000/día aunque su capital esté pagado, HASTA que los abonos de mora
 * (scope=MORA, nominal_installment_number = N) cubran el interés devengado.
 *
 * OPT-IN (gating): solo aplica a cuotas pagadas que tengan al menos un abono de
 * mora registrado. Así no se reactiva retroactivamente la mora de cuotas antiguas
 * pagadas tarde sin abono. Para frenar definitivamente el residuo, usar mora_frozen
 * o la fecha de cierre (legacy_debt_end_date), que ya topan el cálculo.
 */
export function calculateResidualMoraOnPaidInstallments(params: {
    baseDate: Date | string;
    paidCuotas: number;
    isLegacy: boolean;
    customDueDay?: number | null;
    isPromo?: boolean;
    currentDate: Date;
    moraFrozen?: boolean;
    legacyDebtStartDate?: Date | string | null;
    legacyDebtEndDate?: Date | string | null;
    moraReceipts: Array<{ nominal_installment_number: number | null; amount_clp: number }>;
    totalLotPrice: number;
    lotAreaM2: number;
}): { total: number; installments: ResidualMoraInstallment[] } {
    const installments: ResidualMoraInstallment[] = [];
    if (params.moraFrozen || params.paidCuotas <= 0) return { total: 0, installments };

    let total = 0;
    for (let n = 1; n <= params.paidCuotas; n++) {
        // Gating: solo cuotas con abono de mora explícito
        const credits = params.moraReceipts
            .filter((r) => r.nominal_installment_number === n)
            .reduce((sum, r) => sum + (r.amount_clp || 0), 0);
        if (credits <= 0) continue;

        const due = getInstallmentDueDate(
            params.baseDate,
            n,
            params.isLegacy,
            params.customDueDay ?? null,
            Boolean(params.isPromo)
        );
        if (due >= params.currentDate) continue;

        const interest = calculateTotalInterest(
            params.totalLotPrice,
            params.lotAreaM2,
            due,
            params.isLegacy,
            params.currentDate,
            false,
            params.legacyDebtStartDate,
            params.legacyDebtEndDate
        );

        const residual = Math.max(0, interest - credits);
        if (residual <= 0) continue;

        const daysLate = calculateDaysLate(
            due,
            params.currentDate,
            params.isLegacy,
            params.legacyDebtStartDate,
            params.legacyDebtEndDate
        );

        installments.push({
            number: n,
            dueDate: due.toISOString(),
            interest,
            credits,
            residual,
            daysLate: Math.max(0, daysLate),
        });
        total += residual;
    }

    return { total, installments };
}

