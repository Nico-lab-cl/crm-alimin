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
}

// Helper: get the due date for installment N (1-indexed) from acquisition date, in Chile timezone
function getInstallmentDueDate(acquisitionDate: string, installmentNumber: number): Date {
    const base = new Date(acquisitionDate);
    // Use the same day of month, N months after acquisition
    const due = new Date(base);
    due.setMonth(due.getMonth() + installmentNumber);
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

export function PaymentButtons({ reservationId, lot, reservation, acquisitionDate }: PaymentButtonsProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedCuotas, setSelectedCuotas] = useState<string>("1");
    const [isPieModalOpen, setIsPieModalOpen] = useState(false);
    const [isCuotasModalOpen, setIsCuotasModalOpen] = useState(false);

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
                installments: scope === 'INSTALLMENT' ? parseInt(selectedCuotas) : undefined
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
                        <Button className="w-full bg-[#36595F] hover:bg-[#2b464a] text-white font-bold opacity-70" disabled>
                            <CreditCard className="mr-2 h-4 w-4" />
                            Pagar Pie (Próximamente)
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
                        <Button className="w-full bg-[#36595F] hover:bg-[#2b464a] text-white font-bold opacity-70" disabled>
                            <CreditCard className="mr-2 h-4 w-4" />
                            Pagar Cuotas (Próximamente)
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
                                    return (
                                        <div className="border-t border-gray-200 mt-2 pt-2 space-y-1">
                                            <div className="flex justify-between text-blue-700 font-medium">
                                                <span>Cuota {paidCuotas + 1} vence:</span>
                                                <span>{formatDateChile(firstDue)}</span>
                                            </div>
                                            {count > 1 && (
                                                <div className="flex justify-between text-blue-700 font-medium">
                                                    <span>Cuota {paidCuotas + count} vence:</span>
                                                    <span>{formatDateChile(lastDue)}</span>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })()}
                                <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200 mt-2 text-[#36595F]">
                                    <span>Total a pagar:</span>
                                    <span>{formatCurrency(totalToPay)}</span>
                                </div>
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
