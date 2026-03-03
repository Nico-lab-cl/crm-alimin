'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Calculator, TrendingUp, AlertTriangle, Clock, CalendarDays } from 'lucide-react';
import { calculateDailyInterest } from '@/lib/financials';
import { InfoTooltip } from './InfoTooltip';
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

export function MoraExplainerCard({ soldLots }: MoraExplainerCardProps) {
    const [selectedLotId, setSelectedLotId] = useState<string>(
        soldLots.length > 0 ? String(soldLots[0].id) : ''
    );
    const [daysLate, setDaysLate] = useState(15);

    const selectedLot = soldLots.find(l => String(l.id) === selectedLotId) || soldLots[0];

    const totalLotPrice = selectedLot?.price_total_clp || 0;
    const areaM2 = selectedLot?.area_m2 || 200;

    const calculation = useMemo(() => {
        const dailyInterest = calculateDailyInterest(totalLotPrice, areaM2);
        const totalInterest = dailyInterest * daysLate;
        return { dailyInterest, totalInterest };
    }, [totalLotPrice, areaM2, daysLate]);

    const CLP = (value: number) =>
        new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(value);

    const penaltyRate = areaM2 >= 300 ? '0,000227324392' : '0,00027785496';

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
            <CardContent className="space-y-5">
                {/* How it works */}
                <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                    <div className="flex items-start gap-2">
                        <CalendarDays className="w-4 h-4 text-alimin-gold mt-0.5 shrink-0" />
                        <p className="text-xs text-gray-300 leading-relaxed">
                            La cuota vence el <span className="text-white font-semibold">día 5</span>.
                            Gracia hasta el <span className="text-white font-semibold">día 10</span>.
                            Desde el <span className="text-red-400 font-semibold">día 11</span> se cobra:
                            <br />
                            <span className="text-alimin-gold font-mono text-[11px]">{penaltyRate} × valor total del terreno</span> por cada día.
                        </p>
                    </div>
                </div>

                {/* Lot Selector — REAL DATA */}
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

                {/* Selected lot info */}
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
                        {daysLate > 0 && (
                            <p className="text-sm text-gray-200 leading-relaxed mt-1">
                                Con <span className="font-bold text-alimin-gold">{daysLate} días</span> de atraso,
                                la multa es de <span className="font-bold text-red-400">{CLP(calculation.totalInterest)}</span>
                            </p>
                        )}
                    </div>
                )}

                {/* Days Late Slider */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <Label className="text-xs text-gray-400 font-medium flex items-center gap-1.5">
                            <Clock className="w-3 h-3" />
                            Días de atraso (desde el día 11)
                        </Label>
                        <span className={`text-sm font-bold font-mono ${daysLate > 30 ? 'text-red-400' : daysLate > 10 ? 'text-amber-400' : 'text-green-400'}`}>
                            {daysLate} días
                        </span>
                    </div>
                    <Slider
                        value={[daysLate]}
                        onValueChange={(v) => setDaysLate(v[0])}
                        min={1}
                        max={180}
                        step={1}
                        className="touch-pan-y"
                    />
                    <div className="flex justify-between text-[10px] text-gray-500">
                        <span>1 día</span>
                        <span>6 meses</span>
                    </div>
                </div>

                {/* Results */}
                <div className="bg-black/30 rounded-xl p-3 border border-white/5 space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Fórmula</span>
                        <span className="font-mono text-gray-300 text-xs">
                            {penaltyRate} × {CLP(totalLotPrice)}
                        </span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400 flex items-center gap-1">
                            Interés diario
                        </span>
                        <span className="font-mono text-white">{CLP(calculation.dailyInterest)}/día</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Días de atraso</span>
                        <span className="font-mono text-white">× {daysLate}</span>
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
            </CardContent>
        </Card>
    );
}
