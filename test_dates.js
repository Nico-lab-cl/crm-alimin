function getInstallmentDueDate(acquisitionDate, installmentNumber, isLegacy = false) {
    const base = new Date(acquisitionDate);
    const due = new Date(base.getFullYear(), base.getMonth(), 5, 0, 0, 0, 0);

    if (isLegacy) {
        due.setMonth(due.getMonth() + installmentNumber);
    } else {
        if (base.getDate() <= 5) {
            due.setMonth(due.getMonth() + (installmentNumber - 1));
        } else {
            due.setMonth(due.getMonth() + installmentNumber);
        }
    }
    return due;
}

console.log("Jan 31:", getInstallmentDueDate('2026-01-31T12:00:00', 1).toISOString());
console.log("Feb 15:", getInstallmentDueDate('2026-02-15T12:00:00', 1).toISOString());
console.log("Feb 28:", getInstallmentDueDate('2026-02-28T12:00:00', 1).toISOString());
console.log("Mar  4:", getInstallmentDueDate('2026-03-04T12:00:00', 1).toISOString());
console.log("Mar  5:", getInstallmentDueDate('2026-03-05T12:00:00', 1).toISOString());
console.log("Mar  6:", getInstallmentDueDate('2026-03-06T12:00:00', 1).toISOString());
