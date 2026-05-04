'use client';

import { useState, useEffect } from 'react';
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
import { Loader2, CreditCard, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { getInstallmentDueDate, calculateDailyInterest, calculateTotalInterest } from '@/lib/financials';
import { uploadPaymentReceipt } from '@/actions/receipts';
import { Input } from '@/components/ui/input';

interface PaymentButtonsProps {
    reservationId: string;
    lot: {
        id: number;
        pie: number | null;
        reservation_amount_clp: number | null;
        cuotas: number | null;
        valor_cuota: number | null;
        last_installment_amount: number | null;
        area_m2: number | null;
        price_total_clp: number | null;
    };
    reservation: {
        pie_status: string | null;
        installments_paid: number | null;
        is_legacy?: boolean;
        is_promo?: boolean;
        mora_frozen?: boolean;
        legacy_debt_start_date?: Date | string | null;
        legacy_debt_end_date?: Date | string | null;
        legacy_installment_start_date?: Date | string | null;
        legacy_installment_ranges?: any;
        receipts?: any[];
        pie?: number | null;
    };
    acquisitionDate?: string | null;
    isAdminView?: boolean;
    simulatedDate?: Date;
    comparisonDate?: Date;
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
    let parsedRanges = legacyRanges;
    if (typeof legacyRanges === 'string') {
        try {
            parsedRanges = JSON.parse(legacyRanges);
        } catch (e) {
            console.error("Failed to parse legacyRanges:", legacyRanges);
        }
    }

    if (parsedRanges && Array.isArray(parsedRanges)) {
        for (const range of parsedRanges) {
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
    const [fileBase64, setFileBase64] = useState<string | null>(null);

    // Initial config for date calculations
    const customStart = reservation.legacy_installment_start_date ? new Date(reservation.legacy_installment_start_date) : null;
    const customDueDay = customStart ? customStart.getDate() : null;
    const baseDate = customStart
        ? customStart.toISOString()
        : (acquisitionDate || new Date().toISOString());
    const isLegacyBool = Boolean(reservation.is_legacy);
    const isPromoBool = Boolean(reservation.is_promo);

    // Pending Receipt Checks
    const pendingPieReceipt = reservation.receipts?.find((r: any) => r.scope === 'PIE' && r.status === 'PENDING');
    const pendingInstReceipt = reservation.receipts?.find((r: any) => r.scope === 'INSTALLMENT' && r.status === 'PENDING');

    // Use simulatedDate if provided (Admin Mode), otherwise Now
    const currentDate = simulatedDate ? new Date(simulatedDate) : new Date();

    // PIE LOGIC
    const pieTotal = reservation.pie ?? lot.pie ?? 0;
    const reservationPaid = lot.reservation_amount_clp || 0;
    const pieToPay = Math.max(0, pieTotal - reservationPaid);
    const isPiePaid = reservation.pie_status === 'PAID';

    // CUOTAS LOGIC
    const totalCuotas = lot.cuotas || 0;
    const paidCuotas = reservation.installments_paid || 0;
    const valorCuota = lot.valor_cuota || 0;
    const remainingCuotas = Math.max(0, totalCuotas - paidCuotas);
    const isCuotasPaid = remainingCuotas === 0;

    // MANDATORY OVERDUE CALCULATION
    const checkDate = simulatedDate ? new Date(simulatedDate) : new Date();
    checkDate.setHours(0, 0, 0, 0);

    let overdueCount = 0;
    for (let i = 1; i <= remainingCuotas; i++) {
        const instNum = paidCuotas + i;
        const iDue = getInstallmentDueDate(baseDate, instNum, isLegacyBool, customDueDay, isPromoBool);
        const interest = calculateTotalInterest(
            lot.price_total_clp || 0,
            lot.area_m2 || 200,
            iDue,
            isLegacyBool,
            checkDate,
            Boolean(reservation.mora_frozen),
            reservation.legacy_debt_start_date,
            reservation.legacy_debt_end_date
        );
        if (interest > 0) {
            overdueCount++;
        } else {
            break;
        }
    }

    const minRequired = Math.max(1, overdueCount);

    // Sync selectedCuotas with minRequired
    useEffect(() => {
        if (parseInt(selectedCuotas) < minRequired) {
            setSelectedCuotas(String(minRequired));
        }
    }, [minRequired]);

    const count = parseInt(selectedCuotas);
    const startInstallment = paidCuotas + 1;
    const endInstallment = startInstallment + count - 1;
    const includesLastInstallment = endInstallment === totalCuotas;
    const lastInstallmentPrice = lot.last_installment_amount || valorCuota;

    let totalToPay = 0;
    let accumulatedInterest = 0;
    let maxDaysLate = 0;
    let earliestRangeStart: Date | null = null;
    let latestRangeEnd: Date | null = null;

    // Iterate over each installment being paid in this transaction
    for (let i = 0; i < count; i++) {
        const instNum = paidCuotas + 1 + i;
        
        // Accumulate Base Price
        totalToPay += getInstallmentAmount(
            instNum,
            totalCuotas,
            valorCuota,
            lastInstallmentPrice,
            reservation.legacy_installment_ranges
        );

        // Accumulate Interest for this specific installment
        const iDue = getInstallmentDueDate(baseDate, instNum, isLegacyBool, customDueDay, isPromoBool);
        const interest = calculateTotalInterest(
            lot.price_total_clp || 0,
            lot.area_m2 || 200,
            iDue,
            isLegacyBool,
            checkDate,
            Boolean(reservation.mora_frozen),
            reservation.legacy_debt_start_date,
            reservation.legacy_debt_end_date
        );

        if (interest > 0) {
            accumulatedInterest += interest;
            const daily = calculateDailyInterest(lot.price_total_clp || 0, lot.area_m2 || 200);
            const days = daily > 0 ? Math.round(interest / daily) : 0;
            if (days > maxDaysLate) maxDaysLate = days;

            // Track range for display
            const rangeStart = reservation.legacy_debt_start_date 
                ? new Date(reservation.legacy_debt_start_date)
                : new Date(iDue);
            if (!reservation.legacy_debt_start_date) rangeStart.setDate(rangeStart.getDate() + 5);
            
            if (!earliestRangeStart || rangeStart < earliestRangeStart) earliestRangeStart = rangeStart;
            if (!latestRangeEnd || checkDate > latestRangeEnd) latestRangeEnd = checkDate;
        }
    }

    const calculatedInterest = accumulatedInterest;
    const daysLateForDisplay = maxDaysLate;
    let lateRangeDisplay = "";
    if (earliestRangeStart && latestRangeEnd) {
        lateRangeDisplay = `${earliestRangeStart.toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit' })} - ${latestRangeEnd.toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit' })}`;
    }

    const finalTotal = totalToPay + calculatedInterest;

    const firstDue = getInstallmentDueDate(baseDate, paidCuotas + 1, isLegacyBool, customDueDay, isPromoBool);
    const lastDue = getInstallmentDueDate(baseDate, paidCuotas + count, isLegacyBool, customDueDay, isPromoBool);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) {
            setFileBase64(null);
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setFileBase64(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleTransferSubmit = async (scope: 'PIE' | 'INSTALLMENT', amount: number, numCuotas: number = 0) => {
        if (!fileBase64) {
            toast.error('Debes adjuntar el comprobante de transferencia');
            return;
        }
        setIsLoading(true);
        try {
            await uploadPaymentReceipt({
                reservationId,
                lotId: lot.id,
                amount,
                receiptUrl: fileBase64,
                scope,
                installmentsCount: scope === 'INSTALLMENT' ? numCuotas : undefined
            });

            toast.success('Comprobante enviado. En revisión por administración.');
            setFileBase64(null);
            setIsPieModalOpen(false);
            setIsCuotasModalOpen(false);
        } catch (error) {
            console.error('Transfer Error:', error);
            toast.error(error instanceof Error ? error.message : 'Error al enviar comprobante');
        } finally {
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
                            className="w-full bg-[#36595F] hover:bg-[#2b464a] text-white font-bold opacity-100"
                        >
                            <CreditCard className="mr-2 h-4 w-4" />
                            Pagar Pie
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-white text-black sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>Pagar Pie del Terreno</DialogTitle>
                            <DialogDescription>
                                Transfiere el monto a la siguiente cuenta y sube el comprobante.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="py-4 space-y-4">
                            <div className="bg-gray-50 p-3 rounded text-sm space-y-1">
                                <p><strong>Banco:</strong> Santander</p>
                                <p><strong>Cuenta:</strong> Corriente N° 86876868</p>
                                <p><strong>Nombre:</strong> Alimin SPA</p>
                                <p><strong>RUT:</strong> 77.508.711-0</p>
                                <p><strong>Correo:</strong> inmobiliaria@aliminspa.cl</p>
                            </div>
                            <div className="space-y-2 border-t pt-4">
                                <div className="flex justify-between text-sm">
                                    <span>Total Pie:</span>
                                    <span>{formatCurrency(pieTotal)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-green-600">
                                    <span>- Reserva pagada:</span>
                                    <span>{formatCurrency(reservationPaid)}</span>
                                </div>
                                <div className="flex justify-between font-bold text-lg border-t pt-2">
                                    <span>Monto a Transferir:</span>
                                    <span>{formatCurrency(pieToPay)}</span>
                                </div>
                            </div>
                            <div className="space-y-2 pt-2 text-center">
                                <label className="text-sm font-medium block">Sube tu comprobante de pago</label>
                                <div className="text-[10px] text-gray-500 mb-2">Máximo 10MB por archivo</div>
                                <div className="relative inline-block w-full">
                                    <Input
                                        type="file"
                                        accept="image/*,.pdf"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                    />
                                    <Button variant="outline" className="w-full bg-white text-gray-700 border-gray-300">
                                        Seleccionar
                                    </Button>
                                    {fileBase64 && (
                                        <div className="mt-1 text-[10px] text-green-600 font-medium truncate">
                                            Archivo cargado ✓
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsPieModalOpen(false)} className="bg-white text-black border-gray-300 hover:bg-gray-100 hover:text-black">Cancelar</Button>
                            <Button
                                onClick={() => handleTransferSubmit('PIE', pieToPay)}
                                disabled={isLoading || !fileBase64 || Boolean(pendingPieReceipt)}
                                className="bg-[#36595F] text-white"
                            >
                                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                {pendingPieReceipt ? "En Revisión..." : "Subir Comprobante"}
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
                    {overdueCount > 0 && (
                        <div className="mt-2 text-[10px] text-center text-red-600 bg-red-50 border border-red-200 rounded p-2 flex items-center justify-center gap-1 font-bold">
                            <AlertCircle className="h-3 w-3" />
                            Tienes {overdueCount} {overdueCount === 1 ? 'cuota atrasada' : 'cuotas atrasadas'} obligatorias.
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
                                        {Array.from({ length: remainingCuotas }, (_, i) => i + 1)
                                            .map((num) => {
                                                const isMandatory = num <= overdueCount;
                                                return (
                                                    <SelectItem 
                                                        key={num} 
                                                        value={String(num)} 
                                                        disabled={num < minRequired}
                                                        className="hover:bg-gray-100 focus:bg-gray-100 focus:text-black"
                                                    >
                                                        {num} {num === 1 ? 'Cuota' : 'Cuotas'} {isMandatory ? '(OBLIGATORIO)' : ''}
                                                    </SelectItem>
                                                );
                                            })}
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
                                {(acquisitionDate || reservation.legacy_installment_start_date) && count > 0 && (
                                    <div className="border-t border-gray-200 mt-2 pt-2 space-y-1">
                                        <div className="text-sm font-bold text-[#36595F] mb-1">
                                            Estás pagando:
                                        </div>
                                        {count === 1 ? (
                                            <div className="flex justify-between text-blue-700 font-medium bg-blue-50 p-2 rounded relative">
                                                <span>Cuota {paidCuotas + 1}</span>
                                                <span>Vence: {formatDateChile(firstDue)}</span>
                                                {overdueCount >= 1 && (
                                                    <span className="absolute -top-2 -left-1 bg-red-600 text-white text-[8px] px-1 rounded">OBLIGATORIO</span>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="space-y-1">
                                                {Array.from({ length: count }, (_, i) => {
                                                    const instNum = paidCuotas + 1 + i;
                                                    const isOverdue = i < overdueCount;
                                                    const due = getInstallmentDueDate(baseDate, instNum, isLegacyBool, customDueDay, isPromoBool);
                                                    return (
                                                        <div key={instNum} className={`flex justify-between font-medium text-xs p-1 rounded ${isOverdue ? 'text-red-700 bg-red-50' : 'text-blue-700 bg-blue-50'}`}>
                                                            <span>Cuota {instNum} {isOverdue && '(ATRÁSADA)'}</span>
                                                            <span>{formatDateChile(due)}</span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}

                                        {calculatedInterest > 0 && (
                                            <div className="flex flex-col text-red-600 font-bold text-sm mt-2 border-t border-red-100 pt-1">
                                                <div className="flex justify-between">
                                                    <span>Interés por mora acumulado:</span>
                                                    <span>{formatCurrency(calculatedInterest)}</span>
                                                </div>
                                                {lateRangeDisplay && (
                                                    <div className="text-xs font-normal text-red-500 text-right">
                                                        ({lateRangeDisplay}: hasta {daysLateForDisplay} días de atraso)
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200 mt-2 text-[#36595F]">
                                            <span>Total a Transferir:</span>
                                            <span>{formatCurrency(finalTotal)}</span>
                                        </div>
                                    </div>
                                )}
                                <div className="bg-gray-50 p-3 rounded text-sm space-y-1 mt-4 border border-gray-200">
                                    <p className="font-semibold text-gray-800 mb-2">Datos de Transferencia:</p>
                                    <p><strong>Banco:</strong> Santander</p>
                                    <p><strong>Cuenta:</strong> Corriente N° 86876868</p>
                                    <p><strong>Nombre:</strong> Alimin SPA</p>
                                    <p><strong>RUT:</strong> 77.508.711-0</p>
                                    <p><strong>Correo:</strong> inmobiliaria@aliminspa.cl</p>
                                </div>
                                <div className="space-y-2 pt-2 text-center">
                                    <label className="text-sm font-medium text-gray-800 block">Sube tu comprobante de pago</label>
                                    <div className="text-[10px] text-gray-500 mb-2">Máximo 10MB por archivo</div>
                                    <div className="relative inline-block w-full">
                                        <Input
                                            type="file"
                                            accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                                            onChange={handleFileChange}
                                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                        />
                                        <Button variant="outline" className="w-full bg-white text-gray-700 border-gray-300">
                                            Seleccionar
                                        </Button>
                                        {fileBase64 && (
                                            <div className="mt-1 text-[10px] text-green-600 font-medium truncate">
                                                Archivo cargado ✓
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsCuotasModalOpen(false)} className="bg-white text-black border-gray-300 hover:bg-gray-100 hover:text-black">Cancelar</Button>
                            <Button
                                onClick={() => handleTransferSubmit('INSTALLMENT', finalTotal, parseInt(selectedCuotas))}
                                disabled={isLoading || !fileBase64 || Boolean(pendingInstReceipt)}
                                className="bg-[#36595F] text-white"
                            >
                                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                {pendingInstReceipt ? "Verificando Pago Anterior..." : "Subir Comprobante"}
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
                        : <span className="text-[#E0B457] font-bold text-sm uppercase tracking-wide">Pendientes: {remainingCuotas} / {totalCuotas} cuotas por pagar</span>
                    }
                </div>
            )}
        </div>
    );
}
