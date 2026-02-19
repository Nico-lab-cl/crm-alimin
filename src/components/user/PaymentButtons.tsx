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
    if (includesLastInstallment) {
        // (Normal installments * price) + (1 * Last Price)
        // Note: If count is 1 and it IS the last installment, then (0 * normal) + last.
        totalToPay = ((count - 1) * valorCuota) + lastInstallmentPrice;
    } else {
        totalToPay = count * valorCuota;
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

    return (
        <div className="flex flex-col gap-3 mt-4">
            {/* PIE PAYMENT */}
            {!isPiePaid && pieToPay > 0 && (
                <Dialog open={isPieModalOpen} onOpenChange={setIsPieModalOpen}>
                    <DialogTrigger asChild>
                        <Button
                            className="w-full bg-[#36595F] hover:bg-[#2b464a] text-white font-bold opacity-70"
                            disabled={!isAdminView}
                        >
                            <CreditCard className="mr-2 h-4 w-4" />
                            {isAdminView ? "Pagar Pie" : "Pagar Pie (Próximamente)"}
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
                            <Button variant="outline" onClick={() => setIsPieModalOpen(false)}>Cancelar</Button>
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
                            className="w-full bg-[#36595F] hover:bg-[#2b464a] text-white font-bold opacity-70"
                            disabled={!isAdminView}
                        >
                            <CreditCard className="mr-2 h-4 w-4" />
                            {isAdminView ? "Pagar Cuotas" : "Pagar Cuotas (Próximamente)"}
                        </Button>
                    </DialogTrigger>
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
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar cantidad" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Array.from({ length: remainingCuotas }, (_, i) => i + 1).map((num) => (
                                            <SelectItem key={num} value={String(num)}>
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
                                {acquisitionDate && count > 0 && (() => {
                                    const firstDue = getInstallmentDueDate(acquisitionDate, paidCuotas + 1);
                                    const lastDue = getInstallmentDueDate(acquisitionDate, paidCuotas + count);

                                    // Calculate Interest for Display
                                    let calculatedInterest = 0;
                                    let daysLateForDisplay = 0;

                                    for (let i = 0; i < count; i++) {
                                        const instNum = paidCuotas + 1 + i;
                                        const iDue = getInstallmentDueDate(acquisitionDate, instNum);
                                        const iAmount = (includesLastInstallment && instNum === totalCuotas) ? lastInstallmentPrice : valorCuota;

                                        // MANUAL SIMULATION OVERRIDE
                                        if (simulatedDate && comparisonDate) {
                                            const startSim = new Date(simulatedDate);
                                            const endSim = new Date(comparisonDate);
                                            // Reset hours
                                            startSim.setHours(0, 0, 0, 0);
                                            endSim.setHours(0, 0, 0, 0);

                                            // Calculate days between start and end
                                            const diffTime = endSim.getTime() - startSim.getTime();
                                            const daysLateSim = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                            // If end is after start, we have positive days. 
                                            // User request: "monto de la deuda por los dias que especifique"
                                            // So if they pick Start=1st, End=5th. That's 4 days difference? Or 5 inclusive?
                                            // Let's assume inclusive of the start date as "Day 1 of Fine".
                                            // So 5 - 1 = 4. +1 = 5 days.

                                            if (daysLateSim > 0) {
                                                const effectiveDays = daysLateSim + 1; // Inclusive

                                                let factor = 0.027785496;
                                                if (totalCuotas >= 77) factor = 0.0227324392;

                                                calculatedInterest += Math.round(iAmount * factor) * effectiveDays;
                                                daysLateForDisplay = Math.max(daysLateForDisplay, effectiveDays);
                                            }
                                        }
                                        // DEFAULT LOGIC (If no manual simulation)
                                        else {
                                            // Grace Period Logic Replicated
                                            const graceEnd = new Date(iDue);
                                            graceEnd.setDate(10);
                                            graceEnd.setHours(23, 59, 59, 999);

                                            // Use simulatedDate as "Now" if provided alone (Backward compatibility or simple simulation)
                                            // But if both provided, we used the block above.
                                            // If only simulatedDate is provided, treating it as "Today" for standard calculation:
                                            const nowReference = simulatedDate ? new Date(simulatedDate) : new Date();

                                            if (nowReference > graceEnd) {
                                                const diff = nowReference.getTime() - graceEnd.getTime();
                                                const late = Math.ceil(diff / (1000 * 60 * 60 * 24));
                                                if (late > 0) {
                                                    let factor = 0.027785496;
                                                    if (totalCuotas >= 77) factor = 0.0227324392;

                                                    calculatedInterest += Math.round(iAmount * factor) * late;
                                                    daysLateForDisplay = Math.max(daysLateForDisplay, late);
                                                }
                                            }
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
                                                <div className="flex justify-between text-red-600 font-bold text-sm mt-2 border-t border-red-100 pt-1">
                                                    <span>Interés por mora (aprox. {daysLateForDisplay} días):</span>
                                                    <span>{formatCurrency(calculatedInterest)}</span>
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
                            <Button variant="outline" onClick={() => setIsCuotasModalOpen(false)}>Cancelar</Button>
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
