'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Calculator, TrendingUp, AlertTriangle, CalendarDays } from 'lucide-react';
import { calculateDailyInterest, PENALTY_START_DATE_WEB } from '@/lib/financials';
import { InfoTooltip } from './InfoTooltip';
import { Calendar } from '@/components/ui/calendar';
import type { DateRange } from 'react-day-picker';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface SoldLot {
    id: number;
    number: string | null;
    stage: number | null;
    area_m2: number | null;
    price_total_clp: number | null;
}

interface MoraExplainerCardProps {
    soldLots: SoldLot[];
}

// March 11, 2026 — the date penalties begin
const PENALTY_START = new Date(PENALTY_START_DATE_WEB);

export function MoraExplainerCard({ soldLots }: MoraExplainerCardProps) {
    const [selectedLotId, setSelectedLotId] = useState<string>(
        soldLots.length > 0 ? String(soldLots[0].id) : ''
    );
    const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

    const selectedLot = soldLots.find(l => String(l.id) === selectedLotId) || soldLots[0];

    const totalLotPrice = selectedLot?.price_total_clp || 0;
    const areaM2 = selectedLot?.area_m2 || 200;

    const calculation = useMemo(() => {
        if (!dateRange?.from || !dateRange?.to) return { dailyInterest: 0, totalInterest: 0, daysLate: 0 };

        const dailyInterest = calculateDailyInterest(totalLotPrice, areaM2);

        const start = new Date(dateRange.from);
        start.setHours(0, 0, 0, 0);
        const end = new Date(dateRange.to);
        end.setHours(0, 0, 0, 0);

        const diffTime = end.getTime() - start.getTime();
        const daysLate = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

        const totalInterest = dailyInterest * daysLate;
        return { dailyInterest, totalInterest, daysLate };
    }, [totalLotPrice, areaM2, dateRange]);

    const CLP = (value: number) =>
        new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(value);

    const penaltyRate = areaM2 >= 300 ? '0,000227324392' : '0,00027785496';

    const formatDateChile = (date: Date) =>
        date.toLocaleDateString('es-CL', { day: '2-digit', month: 'long', year: 'numeric' });

    if (soldLots.length === 0) {
        return (
            <Card className="bg-gradient-to-br from-gray-900 via-gray-900 to-amber-950/20 border-alimin-gold/20 text-white">
                <CardContent className="p-6 text-center text-gray-400 text-sm">
                    No hay terrenos vendidos para simular mora.
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="bg-gradient-to-br from-gray-900 via-gray-900 to-amber-950/20 border-alimin-gold/20 text-white overflow-hidden">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-alimin-gold/20 flex items-center justify-center">
                            <Calculator className="w-4 h-4 text-alimin-gold" />
                        </div>
                        <CardTitle className="text-base font-bold text-white">
                            Simulador de Mora
                        </CardTitle>
                    </div>
                    <InfoTooltip
                        content={
                            <div className="space-y-2 text-xs">
                                <p className="font-semibold text-alimin-gold">¿Cómo funciona la mora?</p>
                                <p>Cada cuota vence el <b>día 5</b> de cada mes. Hay un período de gracia hasta el <b>día 10</b>.</p>
                                <p>Si el cliente no paga antes del <b>día 11</b>, comienza a correr un interés <b>diario</b> que se calcula sobre el <b>valor total del terreno</b>.</p>
                                <p className="pt-1 border-t border-white/10">• Terrenos &lt; 300m²: {penaltyRate} × valor total</p>
                                <p>• Terrenos ≥ 300m²: 0,000227324392 × valor total</p>
                            </div>
                        }
                    />
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* How it works */}
                <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                    <div className="flex items-start gap-2">
                        <CalendarDays className="w-4 h-4 text-alimin-gold mt-0.5 shrink-0" />
                        <p className="text-xs text-gray-300 leading-relaxed">
                            Selecciona un <span className="text-white font-semibold">rango de fechas</span> en el calendario.
                            La primera fecha es cuando inicia el atraso (desde el <span className="text-red-400 font-semibold">día 11</span>)
                            y la segunda es cuando el cliente paga. Se cobra:
                            <br />
                            <span className="text-alimin-gold font-mono text-[11px]">{penaltyRate} × valor total del terreno</span> por cada día de ese rango.
                        </p>
                    </div>
                </div>

                {/* Lot Selector */}
                <div className="space-y-2">
                    <Label className="text-xs text-gray-400 font-medium">Seleccionar Terreno</Label>
                    <Select value={selectedLotId} onValueChange={setSelectedLotId}>
                        <SelectTrigger className="bg-white/5 border-white/10 text-white h-11">
                            <SelectValue placeholder="Elige un terreno" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900 border-white/10 text-white max-h-60">
                            {soldLots.map(lot => (
                                <SelectItem key={lot.id} value={String(lot.id)}>
                                    <span className="flex items-center gap-2">
                                        <span className="font-bold">T-{lot.number}</span>
                                        <span className="text-gray-400">·</span>
                                        <span className="text-gray-400">Etapa {lot.stage}</span>
                                        <span className="text-gray-400">·</span>
                                        <span className="text-gray-400">{lot.area_m2}m²</span>
                                        <span className="text-gray-400">·</span>
                                        <span className="text-alimin-gold font-mono text-xs">{CLP(lot.price_total_clp || 0)}</span>
                                    </span>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Calendar Range Picker */}
                <div className="space-y-2">
                    <Label className="text-xs text-gray-400 font-medium">
                        Selecciona rango: fecha inicio mora → fecha de pago
                    </Label>
                    <div className="flex justify-center">
                        <Calendar
                            mode="range"
                            selected={dateRange}
                            onSelect={setDateRange}
                            defaultMonth={PENALTY_START}
                            disabled={{ before: PENALTY_START }}
                            numberOfMonths={1}
                            className="rounded-xl border border-white/10 bg-white/5 text-white"
                            classNames={{
                                months: "flex flex-col space-y-4",
                                month: "space-y-3",
                                caption: "flex justify-center pt-1 relative items-center",
                                caption_label: "text-sm font-bold text-white",
                                nav: "space-x-1 flex items-center",
                                nav_button: "h-8 w-8 bg-white/10 border border-white/10 rounded-lg p-0 opacity-70 hover:opacity-100 hover:bg-white/20 inline-flex items-center justify-center transition-colors",
                                nav_button_previous: "absolute left-1",
                                nav_button_next: "absolute right-1",
                                table: "w-full border-collapse",
                                head_row: "flex",
                                head_cell: "text-gray-500 rounded-md w-9 font-medium text-[0.7rem] uppercase",
                                row: "flex w-full mt-1",
                                cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected])]:bg-alimin-gold/15 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md",
                                day: "h-9 w-9 p-0 font-normal rounded-lg hover:bg-alimin-gold/20 transition-colors inline-flex items-center justify-center cursor-pointer text-gray-300 hover:text-white",
                                day_selected: "bg-alimin-gold text-black font-bold hover:bg-alimin-gold/90 hover:text-black",
                                day_today: "bg-white/10 text-white font-bold",
                                day_outside: "text-gray-700 opacity-40",
                                day_disabled: "text-gray-700 opacity-20 cursor-not-allowed hover:bg-transparent",
                                day_range_middle: "bg-alimin-gold/15 text-alimin-gold rounded-none",
                                day_range_end: "rounded-r-lg",
                                day_hidden: "invisible",
                            }}
                        />
                    </div>
                    {/* Range display */}
                    {dateRange?.from && (
                        <div className="text-center text-xs text-gray-400 mt-1">
                            <span className="text-white font-semibold">{formatDateChile(dateRange.from)}</span>
                            {dateRange.to && (
                                <>
                                    {' → '}
                                    <span className="text-white font-semibold">{formatDateChile(dateRange.to)}</span>
                                </>
                            )}
                            {!dateRange.to && (
                                <span className="text-gray-500 ml-1">— selecciona la fecha de pago</span>
                            )}
                        </div>
                    )}
                </div>

                {/* Selected Lot Info + Result */}
                {selectedLot && (
                    <div className="bg-alimin-gold/10 border border-alimin-gold/20 rounded-xl p-3">
                        <p className="text-xs text-alimin-gold/80 font-medium mb-1 flex items-center gap-1.5">
                            <TrendingUp className="w-3.5 h-3.5" />
                            Terreno {selectedLot.number} — Etapa {selectedLot.stage}
                        </p>
                        <p className="text-sm text-gray-200 leading-relaxed">
                            Valor total: <span className="font-bold text-white">{CLP(totalLotPrice)}</span> · {areaM2}m²
                            {areaM2 >= 300 ? ' (terreno grande)' : ' (terreno estándar)'}
                        </p>
                        {dateRange?.from && dateRange?.to && calculation.daysLate > 0 && (
                            <p className="text-sm text-gray-200 leading-relaxed mt-1">
                                Atraso de <span className="font-bold text-alimin-gold">{calculation.daysLate} días</span>{' '}
                                ({formatDateChile(dateRange.from)} → {formatDateChile(dateRange.to)})
                            </p>
                        )}
                    </div>
                )}

                {/* Results */}
                {dateRange?.from && dateRange?.to && calculation.daysLate > 0 && (
                    <div className="bg-black/30 rounded-xl p-3 border border-white/5 space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Fórmula</span>
                            <span className="font-mono text-gray-300 text-xs">
                                {penaltyRate} × {CLP(totalLotPrice)}
                            </span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Interés diario</span>
                            <span className="font-mono text-white">{CLP(calculation.dailyInterest)}/día</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Días de atraso</span>
                            <span className="font-mono text-white">× {calculation.daysLate}</span>
                        </div>
                        <div className="border-t border-white/10 pt-2 mt-2">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-bold text-alimin-gold flex items-center gap-1.5">
                                    <AlertTriangle className="w-4 h-4" />
                                    Multa Total
                                </span>
                                <span className="text-lg font-black text-red-400 font-mono">
                                    {CLP(calculation.totalInterest)}
                                </span>
                            </div>
                            <p className="text-[10px] text-gray-500 mt-1">
                                Se suma al valor de la cuota que debe pagar el cliente
                            </p>
                        </div>
                    </div>
                )}

                {/* Empty state */}
                {(!dateRange?.from || !dateRange?.to) && (
                    <div className="text-center py-3 text-gray-500 text-xs">
                        {!dateRange?.from
                            ? 'Selecciona la fecha de inicio de mora en el calendario'
                            : 'Ahora selecciona la fecha de pago para calcular la multa'}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
