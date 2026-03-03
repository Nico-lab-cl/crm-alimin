'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator, CalendarIcon } from 'lucide-react';
import { calculateDailyInterest } from '@/lib/financials';
import { cn } from '@/lib/utils';
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

export function InterestSimulator() {
    const [startDate, setStartDate] = useState<Date | undefined>(new Date());
    const [endDate, setEndDate] = useState<Date | undefined>(new Date());
    const [totalPrice, setTotalPrice] = useState<number>(45000000);
    const [areaM2, setAreaM2] = useState<number>(200);

    // Calculation Logic
    const calculate = (): { error?: string, days?: number, daily?: number, total?: number, final?: number } | null => {
        if (!startDate || !endDate) return null;

        // Reset times to compare dates only
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        const end = new Date(endDate);
        end.setHours(0, 0, 0, 0);

        if (end < start) return { error: "La fecha final debe ser posterior a la inicial" };

        const diffTime = end.getTime() - start.getTime();
        const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const daysCount = days; // Align with PaymentButtons.tsx which uses direct math without inclusive +1
        const dailyInterest = calculateDailyInterest(totalPrice, areaM2);
        const totalInterest = dailyInterest * daysCount;

        return {
            days: daysCount,
            daily: dailyInterest,
            total: totalInterest,
            final: Math.round(totalPrice / 77) + totalInterest // Mock base installment for display
        };
    };

    const result = calculate();

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className="gap-2 bg-yellow-500/10 text-yellow-500 border-yellow-500/50 hover:bg-yellow-500/20">
                    <Calculator className="w-4 h-4" />
                    Simular Intereses
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] bg-gray-900 border-white/10 text-white">
                <DialogHeader>
                    <DialogTitle className="text-[#36595F] text-xl">Simulador de Intereses</DialogTitle>
                    <DialogDescription className="text-gray-400">
                        Herramienta exclusiva para administradores. Simula el cobro de multas por atraso.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Precio Total Lote</Label>
                            <Input
                                type="number"
                                value={totalPrice}
                                onChange={(e) => setTotalPrice(Number(e.target.value))}
                                className="bg-black/20 border-white/10 text-white"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Área (m2)</Label>
                            <Input
                                type="number"
                                value={areaM2}
                                onChange={(e) => setAreaM2(Number(e.target.value))}
                                className="bg-black/20 border-white/10 text-white"
                                placeholder="Ej: 200 o 300"
                            />
                            <p className="text-[10px] text-gray-400">
                                {areaM2 >= 300 ? "Factor >= 300m2 (0.000227324392)" : "Factor < 300m2 (0.00027785496)"}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2 flex flex-col">
                            <Label>Fecha Inicio Multa</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full justify-start text-left font-normal bg-black/20 border-white/10 text-white hover:bg-white/5 hover:text-white",
                                            !startDate && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {startDate ? format(startDate, "PPP", { locale: es }) : <span>Elegir fecha</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0 bg-gray-900 border-white/10 text-white">
                                    <Calendar
                                        mode="single"
                                        selected={startDate}
                                        onSelect={setStartDate}
                                        initialFocus
                                        className="bg-gray-900 text-white"
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="space-y-2 flex flex-col">
                            <Label>Fecha Pago (Fin)</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full justify-start text-left font-normal bg-black/20 border-white/10 text-white hover:bg-white/5 hover:text-white",
                                            !endDate && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {endDate ? format(endDate, "PPP", { locale: es }) : <span>Elegir fecha</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0 bg-gray-900 border-white/10 text-white">
                                    <Calendar
                                        mode="single"
                                        selected={endDate}
                                        onSelect={setEndDate}
                                        initialFocus
                                        className="bg-gray-900 text-white"
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>

                    {result && !result.error && (
                        <div className="bg-black/40 p-4 rounded-lg space-y-2 border border-white/10">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Días de atraso:</span>
                                <span className="font-mono">{result.days} días</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Interés Diario:</span>
                                <span>${result.daily?.toLocaleString()}</span>
                            </div>
                            <div className="border-t border-white/10 my-2 pt-2">
                                <div className="flex justify-between text-[#E0B457] font-bold">
                                    <span>Total Interés:</span>
                                    <span>${result.total?.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-[#36595F] font-bold text-lg mt-1">
                                    <span>Total a Pagar:</span>
                                    <span>${result.final?.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {result && result.error && (
                        <div className="text-red-400 text-sm text-center bg-red-900/20 p-2 rounded">
                            {result.error as string}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
