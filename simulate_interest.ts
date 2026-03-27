
import { calculateTotalInterest, getInstallmentDueDate } from './src/lib/financials';

const clientData = {
    lotPrice: 35900000,
    lotArea: 370, // Number of lot? User says "Lote 37". Area is not explicitly given, but price 35.9M usually means ~200-299m2.
    // Price 35.9M: In financials, > 300m2 uses a different rate. 
    // Let's assume < 300m2 based on the price 35.9M (standard for Stage 1/2 small lots).
    paidCuotas: 2,
    totalCuotas: 52,
    installmentStartDate: '2026-01-19',
    manualNextPayment: '2026-04-19',
    debtStartDate: '2026-02-19',
    currentDate: new Date('2026-03-27T15:56:54'),
    isLegacy: true,
    moraFrozen: false
};

const nextDueDate = new Date(clientData.manualNextPayment);
const penaltyAmount = calculateTotalInterest(
    clientData.lotPrice,
    200, // lotAreaM2
    nextDueDate,
    clientData.isLegacy,
    clientData.currentDate,
    clientData.moraFrozen,
    clientData.debtStartDate
);

console.log("Next Due Date:", nextDueDate.toLocaleDateString());
console.log("Current Date:", clientData.currentDate.toLocaleDateString());
console.log("Penalty Amount:", penaltyAmount);
console.log("Days Late (approx):", penaltyAmount / (35900000 * 0.00027785496));
