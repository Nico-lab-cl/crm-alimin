'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Loader2, CreditCard } from 'lucide-react';
import { toast } from 'sonner';

interface PaymentButtonsProps {
    reservationId: string;
    lot: {
        id: number;
        pie: number | null;
        reservation_amount_clp: number | null;
        cuotas: number | null;
        valor_cuota: number | null;
        last_installment_amount: number | null;
    };
    reservation: {
        pie_status: string | null;
        installments_paid: number | null;
        is_legacy?: boolean;
        legacy_debt_start_date?: Date | string | null;
        legacy_installment_start_date?: Date | string | null;
        legacy_installment_ranges?: any;
    };
    acquisitionDate?: string | null;
    isAdminView?: boolean;
    simulatedDate?: Date;
    comparisonDate?: Date;
}

// Helper: get the due date for installment N (1-indexed) from acquisition date, in Chile timezone
function getInstallmentDueDate(acquisitionDate: string, installmentNumber: number): Date {
    const base = new Date(acquisitionDate);
    // Use the 5th day of the month, N months after acquisition
    // logic: Add months first, then fix day to 5.
    // e.g. Jan 20 + 1 month = Feb 20 -> Feb 5.
    const due = new Date(base);
    due.setMonth(due.getMonth() + installmentNumber);
    due.setDate(5);
    return due;
}

function formatDateChile(date: Date): string {
    return date.toLocaleDateString('es-CL', {
        timeZone: 'America/Santiago',
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });
}

// Helper: Determine the exact price for a specific installment number
function getInstallmentAmount(
    installmentNumber: number,
    totalCuotas: number,
    baseValorCuota: number,
    lastInstallmentAmount: number,
    legacyRanges?: any
): number {
    // 1. Last Installment Exception
    if (installmentNumber === totalCuotas) {
        return lastInstallmentAmount;
    }

    // 2. Custom Legacy Ranges Exception
    if (legacyRanges && Array.isArray(legacyRanges)) {
        for (const range of legacyRanges) {
            if (installmentNumber >= range.from && installmentNumber <= range.to) {
                return range.amount;
            }
        }
    }

    // 3. Standard Price
    return baseValorCuota;
}

export function PaymentButtons({ reservationId, lot, reservation, acquisitionDate, isAdminView, simulatedDate, comparisonDate }: PaymentButtonsProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedCuotas, setSelectedCuotas] = useState<string>("1");
    const [isPieModalOpen, setIsPieModalOpen] = useState(false);
    const [isCuotasModalOpen, setIsCuotasModalOpen] = useState(false);

    // Use simulatedDate if provided (Admin Mode), otherwise Now
    const currentDate = simulatedDate ? new Date(simulatedDate) : new Date();

    // PIE LOGIC
    const pieTotal = lot.pie || 0;
    const reservationPaid = lot.reservation_amount_clp || 0;
    const pieToPay = Math.max(0, pieTotal - reservationPaid);
    const isPiePaid = reservation.pie_status === 'PAID';

    // CUOTAS LOGIC
    const totalCuotas = lot.cuotas || 0;
    const paidCuotas = reservation.installments_paid || 0;
    const valorCuota = lot.valor_cuota || 0;
    const remainingCuotas = Math.max(0, totalCuotas - paidCuotas);
    const isCuotasPaid = remainingCuotas === 0;

    // Custom Logic for Last Installment
    const count = parseInt(selectedCuotas);
    const startInstallment = paidCuotas + 1;
    const endInstallment = startInstallment + count - 1;
    const includesLastInstallment = endInstallment === totalCuotas;
    const lastInstallmentPrice = lot.last_installment_amount || valorCuota;

    let totalToPay = 0;
    // Iterate over each installment being paid in this transaction to accumulate exact price
    for (let i = 0; i < count; i++) {
        const instNum = paidCuotas + 1 + i;
        totalToPay += getInstallmentAmount(
            instNum,
            totalCuotas,
            valorCuota,
            lastInstallmentPrice,
            reservation.legacy_installment_ranges
        );
    }

    const handlePayment = async (scope: 'PIE' | 'INSTALLMENT') => {
        setIsLoading(true);
        try {
            const body = {
                reservationId,
                scope,
                installments: scope === 'INSTALLMENT' ? parseInt(selectedCuotas) : undefined,
                simulatedDate: simulatedDate ? simulatedDate.toISOString() : undefined, // Start Date for manual range
                comparisonDate: comparisonDate ? comparisonDate.toISOString() : undefined // End Date for manual range
            };
            console.log("Initiating payment with body:", body);

            const res = await fetch('/api/webpay/init-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || 'Error al iniciar pago');
            }

            const data = await res.json();
            console.log("Payment initialized, data:", data);

            if (!data.url || !data.token) {
                console.error("Missing URL or Token from Webpay");
                throw new Error("Respuesta inválida de Webpay (Falta URL o Token)");
            }

            // Redirect to Webpay
            const form = document.createElement('form');
            form.action = data.url;
            form.method = 'POST';
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = 'token_ws';
            input.value = data.token;
            form.appendChild(input);
            document.body.appendChild(form);
            form.submit();

        } catch (error) {
            console.error('Payment Error:', error);
            toast.error(error instanceof Error ? error.message : 'Error al iniciar el pago');
            setIsLoading(false);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(amount);
    };

    // Calculate Preview Interest (Single Quota - Next Pending)
    let previewInterest = 0;
    let previewDays = 0;
    if ((simulatedDate || comparisonDate) && totalCuotas > 0) {
        const effectiveDate = comparisonDate || simulatedDate || new Date();
        const targetDate = new Date(effectiveDate);
        targetDate.setHours(0, 0, 0, 0);

        // Check ONLY the first pending quota
        const instNum = paidCuotas + 1;
        if (instNum <= totalCuotas) {

            // --- LEGACY OFFLINE DEBT CALCULATION ---
            if (reservation.is_legacy && reservation.legacy_debt_start_date) {
                const debtStart = new Date(reservation.legacy_debt_start_date);
                debtStart.setHours(0, 0, 0, 0);

                if (targetDate > debtStart) {
                    const diffTime = targetDate.getTime() - debtStart.getTime();
                    const lateDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                    if (lateDays > 0) {
                        let factor = 0.027785496;
                        if (totalCuotas >= 77) factor = 0.0227324392;

                        // Use getInstallmentAmount to get the EXACT amount for this installment
                        const iAmount = getInstallmentAmount(
                            instNum,
                            totalCuotas,
                            valorCuota,
                            lastInstallmentPrice,
                            reservation.legacy_installment_ranges
                        );
                        previewInterest = Math.round(iAmount * factor) * lateDays;
                        previewDays = lateDays;
                    }
                }
            }
            // --- STANDARD ONLINE DEBT CALCULATION ---
            else if (acquisitionDate) {
                const iDue = getInstallmentDueDate(acquisitionDate, instNum);
                const graceEnd = new Date(iDue);
                graceEnd.setDate(10);
                graceEnd.setHours(23, 59, 59, 999);

                if (targetDate > graceEnd) {
                    const diffTime = targetDate.getTime() - graceEnd.getTime();
                    const lateDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                    if (lateDays > 0) {
                        let factor = 0.027785496;
                        if (totalCuotas >= 77) factor = 0.0227324392;

                        const iAmount = getInstallmentAmount(
                            instNum,
                            totalCuotas,
                            valorCuota,
                            lastInstallmentPrice,
                            reservation.legacy_installment_ranges
                        );
                        previewInterest = Math.round(iAmount * factor) * lateDays;
                        previewDays = lateDays;
                    }
                }
            }
        }
    }

    return (
        <div className="flex flex-col gap-3 mt-4">
            {/* PIE PAYMENT */}
            {!isPiePaid && pieToPay > 0 && (
                <Dialog open={isPieModalOpen} onOpenChange={setIsPieModalOpen}>
                    <DialogTrigger asChild>
                        <Button
                            className="w-full bg-[#36595F] hover:bg-[#2b464a] text-white font-bold opacity-100"
                        >
                            <CreditCard className="mr-2 h-4 w-4" />
                            Pagar Pie
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-white text-black">
                        <DialogHeader>
                            <DialogTitle>Pagar Pie del Terreno</DialogTitle>
                            <DialogDescription>
                                El valor de la reserva ({formatCurrency(reservationPaid)}) se descontará del pie total.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="py-4 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Total Pie:</span>
                                <span>{formatCurrency(pieTotal)}</span>
                            </div>
                            <div className="flex justify-between text-sm text-green-600">
                                <span>- Reserva pagada:</span>
                                <span>{formatCurrency(reservationPaid)}</span>
                            </div>
                            <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                                <span>Total a pagar:</span>
                                <span>{formatCurrency(pieToPay)}</span>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsPieModalOpen(false)} className="bg-white text-black border-gray-300 hover:bg-gray-100 hover:text-black">Cancelar</Button>
                            <Button
                                onClick={() => handlePayment('PIE')}
                                disabled={isLoading}
                                className="bg-[#36595F] text-white"
                            >
                                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                Ir a Pagar
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}

            {/* PIE STATUS BADGE */}
            {isPiePaid && (
                <div className="p-2 bg-green-100 text-green-800 rounded-md text-center text-sm font-medium border border-green-200">
                    ✅ Pie Pagado
                </div>
            )}

            {/* CUOTAS PAYMENT */}
            {!isCuotasPaid && totalCuotas > 0 && (
                <Dialog open={isCuotasModalOpen} onOpenChange={setIsCuotasModalOpen}>
                    <DialogTrigger asChild>
                        <Button
                            className="w-full bg-[#36595F] hover:bg-[#2b464a] text-white font-bold opacity-100"
                        >
                            <CreditCard className="mr-2 h-4 w-4" />
                            Pagar Cuotas
                        </Button>
                    </DialogTrigger>
                    {previewInterest > 0 && isAdminView && (
                        <div className="mt-2 text-[10px] text-center text-red-400 bg-red-900/10 border border-red-500/20 rounded p-1">
                            Simulación: +{formatCurrency(previewInterest)}/cuota ({previewDays} días)
                        </div>
                    )}
                    <DialogContent className="bg-white text-black">
                        <DialogHeader>
                            <DialogTitle>Pagar Cuotas Mensuales</DialogTitle>
                            <DialogDescription>
                                Selecciona cuántas cuotas deseas pagar.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="py-4 space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Cantidad de cuotas:</label>
                                <Select value={selectedCuotas} onValueChange={setSelectedCuotas}>
                                    <SelectTrigger className="bg-white border-gray-300 text-black">
                                        <SelectValue placeholder="Seleccionar cantidad" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white border-gray-200 text-black">
                                        {Array.from({ length: remainingCuotas }, (_, i) => i + 1).map((num) => (
                                            <SelectItem key={num} value={String(num)} className="hover:bg-gray-100 focus:bg-gray-100 focus:text-black">
                                                {num} {num === 1 ? 'Cuota' : 'Cuotas'}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="bg-gray-50 p-3 rounded-lg space-y-1 text-sm">
                                <div className="flex justify-between">
                                    <span>Valor Cuota Normal:</span>
                                    <span>{formatCurrency(valorCuota)}</span>
                                </div>
                                {includesLastInstallment && (
                                    <div className="flex justify-between text-amber-600 font-medium">
                                        <span>Valor Última Cuota:</span>
                                        <span>{formatCurrency(lastInstallmentPrice)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <span>Cuotas restantes:</span>
                                    <span>{remainingCuotas} de {totalCuotas}</span>
                                </div>
                                {(acquisitionDate || reservation.legacy_installment_start_date) && count > 0 && (() => {
                                    // For legacy clients with a specific installment start, use that instead of acquisitionDate
                                    const baseDate = reservation.legacy_installment_start_date
                                        ? new Date(reservation.legacy_installment_start_date).toISOString()
                                        : acquisitionDate!;
                                    const firstDue = getInstallmentDueDate(baseDate, paidCuotas + 1);
                                    const lastDue = getInstallmentDueDate(baseDate, paidCuotas + count);

                                    // Calculate Interest for Display
                                    let calculatedInterest = 0;
                                    let daysLateForDisplay = 0;
                                    let lateRangeDisplay = "";

                                    for (let i = 0; i < count; i++) {
                                        // Only apply interest to the FIRST installment in the batch (the oldest one).
                                        if (i > 0) continue;

                                        const instNum = paidCuotas + 1 + i;
                                        const iAmount = (includesLastInstallment && instNum === totalCuotas) ? lastInstallmentPrice : valorCuota;

                                        // Target Payment Date (use simulation date if set, otherwise today)
                                        const effectiveDate = comparisonDate || simulatedDate || new Date();
                                        const targetDate = new Date(effectiveDate);
                                        targetDate.setHours(0, 0, 0, 0);

                                        let lateDays = 0;

                                        if (reservation.is_legacy && reservation.legacy_debt_start_date) {
                                            // LEGACY: Count days from the designated debt start date
                                            const debtStart = new Date(reservation.legacy_debt_start_date);
                                            debtStart.setHours(0, 0, 0, 0);

                                            if (targetDate > debtStart) {
                                                const diffTime = targetDate.getTime() - debtStart.getTime();
                                                lateDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                                                if (!lateRangeDisplay && lateDays > 0) {
                                                    const startStr = debtStart.toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit' });
                                                    const endStr = targetDate.toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit' });
                                                    lateRangeDisplay = `${startStr} - ${endStr}`;
                                                }
                                            }
                                        } else {
                                            // STANDARD: Count days past the grace period (10th of due month)
                                            const iDue = getInstallmentDueDate(baseDate, instNum);
                                            const graceEnd = new Date(iDue);
                                            graceEnd.setDate(10);
                                            graceEnd.setHours(23, 59, 59, 999);

                                            if (targetDate > graceEnd) {
                                                const diffTime = targetDate.getTime() - graceEnd.getTime();
                                                lateDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                                                if (!lateRangeDisplay && lateDays > 0) {
                                                    const lateStart = new Date(graceEnd);
                                                    lateStart.setDate(lateStart.getDate() + 1);
                                                    const startStr = lateStart.toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit' });
                                                    const endStr = targetDate.toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit' });
                                                    lateRangeDisplay = `${startStr} - ${endStr}`;
                                                }
                                            }
                                        }

                                        if (lateDays > 0) {
                                            let factor = 0.027785496;
                                            if (totalCuotas >= 77) factor = 0.0227324392;
                                            calculatedInterest += Math.round(iAmount * factor) * lateDays;
                                            daysLateForDisplay = Math.max(daysLateForDisplay, lateDays);
                                        }
                                    }

                                    const finalTotal = totalToPay + calculatedInterest;


                                    return (
                                        <div className="border-t border-gray-200 mt-2 pt-2 space-y-1">
                                            <div className="text-sm font-bold text-[#36595F] mb-1">
                                                Estás pagando:
                                            </div>
                                            {count === 1 ? (
                                                <div className="flex justify-between text-blue-700 font-medium bg-blue-50 p-2 rounded">
                                                    <span>Cuota {paidCuotas + 1}</span>
                                                    <span>Vence: {formatDateChile(firstDue)}</span>
                                                </div>
                                            ) : (
                                                <div className="space-y-1">
                                                    <div className="flex justify-between text-blue-700 font-medium text-xs">
                                                        <span>Desde Cuota {paidCuotas + 1}</span>
                                                        <span>{formatDateChile(firstDue)}</span>
                                                    </div>
                                                    <div className="flex justify-between text-blue-700 font-medium text-xs">
                                                        <span>Hasta Cuota {paidCuotas + count}</span>
                                                        <span>{formatDateChile(lastDue)}</span>
                                                    </div>
                                                </div>
                                            )}

                                            {calculatedInterest > 0 && (
                                                <div className="flex flex-col text-red-600 font-bold text-sm mt-2 border-t border-red-100 pt-1">
                                                    <div className="flex justify-between">
                                                        <span>Interés por mora:</span>
                                                        <span>{formatCurrency(calculatedInterest)}</span>
                                                    </div>
                                                    {lateRangeDisplay && (
                                                        <div className="text-xs font-normal text-red-500 text-right">
                                                            ({lateRangeDisplay}: {daysLateForDisplay} días)
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200 mt-2 text-[#36595F]">
                                                <span>Total a pagar:</span>
                                                <span>{formatCurrency(finalTotal)}</span>
                                            </div>
                                        </div>
                                    );
                                })()}

                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsCuotasModalOpen(false)} className="bg-white text-black border-gray-300 hover:bg-gray-100 hover:text-black">Cancelar</Button>
                            <Button
                                onClick={() => handlePayment('INSTALLMENT')}
                                disabled={isLoading}
                                className="bg-[#36595F] text-white"
                            >
                                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                Ir a Pagar
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}

            {/* CUOTAS STATUS */}
            {totalCuotas > 0 && (
                <div className="text-center mt-2">
                    {isCuotasPaid
                        ? <span className="text-green-600 font-bold text-sm">¡Crédito Pagado Completamente! 🎉</span>
                        : <span className="text-[#E0B457] font-bold text-sm uppercase tracking-wide">Avance: {paidCuotas} / {totalCuotas} cuotas pagadas</span>
                    }
                </div>
            )}
        </div>
    );
}
