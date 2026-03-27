'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Calculator, TrendingUp, AlertTriangle, CalendarDays, MapPin, Maximize } from 'lucide-react';
import { calculateDailyInterest, PENALTY_START_DATE_WEB } from '@/lib/financials';
import { InfoTooltip } from './InfoTooltip';
import { Calendar } from '@/components/ui/calendar';
import type { DateRange } from 'react-day-picker';
import { Badge } from '@/components/ui/badge';
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
        let daysLate = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
        
        if (daysLate > 0) {
            daysLate += 1;
        }

        const totalInterest = dailyInterest * daysLate;
        return { dailyInterest, totalInterest, daysLate };
    }, [totalLotPrice, areaM2, dateRange]);

    const CLP = (value: number) =>
        new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(value);

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
        <Card className="bg-[#1a1a1a]/60 backdrop-blur-xl border-white/10 text-white overflow-hidden shadow-2xl">
            <CardHeader className="pb-6 border-b border-white/5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center border border-orange-500/20">
                            <Calculator className="w-5 h-5 text-orange-400" />
                        </div>
                        <div>
                            <CardTitle className="text-xl font-black text-white tracking-tight">
                                Simulador de Mora
                            </CardTitle>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">Cálculo de intereses acumulados</p>
                        </div>
                    </div>
                    <InfoTooltip
                        content={
                            <div className="space-y-2 text-xs">
                                <p className="font-bold text-orange-400">¿Cómo funciona la mora?</p>
                                <p>Cada cuota vence el día de su aniversario. Hay un período de gracia de <b>5 días</b>.</p>
                                <p>Si el cliente no paga antes del vencimiento del periodo de gracia, comienza a correr un interés <b>diario fijo</b>.</p>
                                <p className="pt-2 border-t border-white/10 font-bold text-lg text-white">Multa: $10.000 / día</p>
                                <p className="text-[10px] text-gray-500 italic">(Se cuenta desde el primer día de atraso)</p>
                            </div>
                        }
                    />
                </div>
            </CardHeader>
            <CardContent className="p-6">
                <div className="lg:grid lg:grid-cols-[1fr_380px] lg:gap-8 items-start">
                    {/* Left Column: Input Controls */}
                    <div className="space-y-8">
                        {/* Summary Info (only on LG) */}
                        <div className="hidden lg:block bg-white/5 rounded-2xl p-5 border border-white/5 space-y-3">
                            <div className="flex items-center gap-3">
                                <CalendarDays className="w-5 h-5 text-orange-400 shrink-0" />
                                <p className="text-sm text-gray-300 leading-snug">
                                    Simula el costo de atraso seleccionando el terreno y el <span className="text-white font-bold">rango de fechas</span> de mora.
                                </p>
                            </div>
                        </div>

                        {/* Lot Selector */}
                        <div className="space-y-3">
                            <Label className="text-[11px] text-gray-500 font-black uppercase tracking-widest px-1">1. Seleccionar Terreno Vendido</Label>
                            <Select value={selectedLotId} onValueChange={setSelectedLotId}>
                                <SelectTrigger className="bg-black/40 border-white/10 text-white h-14 rounded-2xl focus:ring-orange-500/20 transition-all hover:bg-black/60">
                                    <SelectValue placeholder="Elige un terreno" />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-950 border-white/10 text-white max-h-60 rounded-2xl shadow-2xl">
                                    {soldLots.map(lot => (
                                        <SelectItem key={lot.id} value={String(lot.id)} className="cursor-pointer focus:bg-orange-500/10 focus:text-white rounded-xl mx-1 my-0.5">
                                            <div className="flex items-center gap-3 py-1">
                                                <Badge className="bg-white/10 text-white font-black">T-{lot.number}</Badge>
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-bold">Etapa {lot.stage} · {lot.area_m2}m²</span>
                                                    <span className="text-[10px] text-orange-400 font-black tracking-tight">{CLP(lot.price_total_clp || 0)}</span>
                                                </div>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Calendar Range Picker */}
                        <div className="space-y-3">
                            <Label className="text-[11px] text-gray-500 font-black uppercase tracking-widest px-1">
                                2. Definir Rango de Atraso
                            </Label>
                            <div className="bg-black/40 rounded-3xl p-6 border border-white/5">
                                <div className="flex justify-center">
                                    <Calendar
                                        mode="range"
                                        selected={dateRange}
                                        onSelect={setDateRange}
                                        defaultMonth={PENALTY_START}
                                        disabled={{ before: PENALTY_START }}
                                        numberOfMonths={1}
                                        className="rounded-xl"
                                        classNames={{
                                            months: "flex flex-col space-y-4",
                                            month: "space-y-4",
                                            caption: "flex justify-center pt-1 relative items-center mb-4",
                                            caption_label: "text-base font-black text-white tracking-tight",
                                            nav: "space-x-1 flex items-center",
                                            nav_button: "h-9 w-9 bg-white/5 border border-white/10 rounded-xl p-0 opacity-70 hover:opacity-100 hover:bg-white/10 inline-flex items-center justify-center transition-all",
                                            nav_button_previous: "absolute left-1",
                                            nav_button_next: "absolute right-1",
                                            table: "w-full border-collapse",
                                            head_row: "flex mb-2",
                                            head_cell: "text-gray-600 rounded-md w-10 font-black text-[0.6rem] uppercase tracking-tighter",
                                            row: "flex w-full mt-1.5",
                                            cell: "h-10 w-10 text-center text-sm p-0 relative [&:has([aria-selected])]:bg-orange-500/10 first:[&:has([aria-selected])]:rounded-l-xl last:[&:has([aria-selected])]:rounded-r-xl focus-within:relative focus-within:z-20",
                                            day: "h-10 w-10 p-0 font-bold rounded-xl hover:bg-orange-500/20 transition-all inline-flex items-center justify-center cursor-pointer text-gray-400 hover:text-white group",
                                            day_selected: "bg-orange-500 text-black font-black hover:bg-orange-500 hover:text-black shadow-lg shadow-orange-500/20",
                                            day_today: "bg-white/10 text-white font-black ring-1 ring-white/20",
                                            day_outside: "text-gray-800 opacity-30",
                                            day_disabled: "text-gray-800 opacity-10 cursor-not-allowed hover:bg-transparent",
                                            day_range_middle: "bg-orange-500/10 text-orange-400 rounded-none",
                                            day_range_end: "rounded-r-xl",
                                            day_hidden: "invisible",
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Execution & Results */}
                    <div className="space-y-6 mt-8 lg:mt-0 lg:sticky lg:top-0">
                        {/* Selected Lot Detail Card */}
                        {selectedLot && (
                            <div className="bg-gradient-to-br from-[#2a1a10] to-[#1a1a1a] border border-orange-500/20 rounded-3xl p-6 shadow-xl relative overflow-hidden group">
                                <TrendingUp className="absolute -bottom-4 -right-4 w-24 h-24 text-orange-500/5 rotate-12 group-hover:scale-110 transition-transform" />
                                <div className="space-y-4 relative z-10">
                                    <div className="flex items-center gap-3">
                                        <Badge className="bg-orange-500 text-black font-black text-px py-0.5">T-{selectedLot.number}</Badge>
                                        <span className="text-[10px] text-orange-400 font-black uppercase tracking-widest">Valor del Activo</span>
                                    </div>
                                    <p className="text-3xl font-black text-white">{CLP(totalLotPrice)}</p>
                                    <div className="flex items-center gap-4 text-xs font-bold text-gray-400 border-t border-white/5 pt-4">
                                        <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Etapa {selectedLot.stage}</span>
                                        <span className="flex items-center gap-1.5"><Maximize className="w-3.5 h-3.5" /> {areaM2}m²</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Calculation Results */}
                        {dateRange?.from && dateRange?.to && calculation.daysLate > 0 ? (
                            <div className="bg-black/40 backdrop-blur-md rounded-3xl p-6 border border-white/10 space-y-6 shadow-2xl">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest text-gray-500">
                                        <span>Detalle del Cálculo</span>
                                        <Badge variant="outline" className="border-orange-500/30 text-orange-400 text-[10px]">{calculation.daysLate} días</Badge>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex justify-between items-end">
                                            <span className="text-xs text-gray-400 font-medium">Tipo de interés:</span>
                                            <span className="font-bold text-white text-[10px]">Multa Diaria Fija</span>
                                        </div>
                                        <div className="flex justify-between items-end border-b border-white/5 pb-2">
                                            <span className="text-xs text-gray-400 font-medium">Interés diario:</span>
                                            <span className="font-bold text-white text-sm">{CLP(calculation.dailyInterest)}</span>
                                        </div>
                                        <div className="flex justify-between items-end">
                                            <span className="text-xs text-gray-400 font-medium">Total Acumulado:</span>
                                            <span className="font-black text-green-400 text-sm">+{CLP(calculation.totalInterest)}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-5 space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-black text-red-400 uppercase tracking-tight flex items-center gap-2">
                                            <AlertTriangle className="w-4 h-4" />
                                            Multa a Cobrar
                                        </span>
                                        <span className="text-2xl font-black text-white font-mono tracking-tighter">
                                            {CLP(calculation.totalInterest)}
                                        </span>
                                    </div>
                                    <p className="text-[10px] text-red-300/50 font-bold uppercase tracking-wider text-center pt-2 border-t border-red-500/10">Este monto se suma a la cuota mensual</p>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-black/20 rounded-3xl p-12 border border-dashed border-white/5 flex flex-col items-center justify-center text-center space-y-4">
                                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                                    <Calculator className="w-6 h-6 text-gray-600" />
                                </div>
                                <div>
                                    <p className="text-gray-500 font-bold text-sm uppercase tracking-widest">Esperando Selección</p>
                                    <p className="text-[10px] text-gray-600 font-bold max-w-[200px] mt-2 leading-relaxed">
                                        {!dateRange?.from
                                            ? 'Selecciona una fecha en el calendario para iniciar la simulación'
                                            : 'Define la fecha de término del atraso'}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
