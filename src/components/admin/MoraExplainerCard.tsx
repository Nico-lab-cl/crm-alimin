'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calculator, TrendingUp, AlertTriangle, Clock } from 'lucide-react';
import { calculateDailyInterest } from '@/lib/financials';
import { InfoTooltip } from './InfoTooltip';

export function MoraExplainerCard() {
    const [debtAmount, setDebtAmount] = useState(45000000);
    const [daysLate, setDaysLate] = useState(15);
    const [areaM2, setAreaM2] = useState(200);

    const calculation = useMemo(() => {
        const dailyInterest = calculateDailyInterest(debtAmount, areaM2);
        const totalInterest = dailyInterest * daysLate;
        return { dailyInterest, totalInterest };
    }, [debtAmount, daysLate, areaM2]);

    const CLP = (value: number) =>
        new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(value);

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
                                <p>Se aplica un interés diario sobre el valor total del terreno después de 5 días de gracia desde la fecha de vencimiento de cada cuota.</p>
                                <p>• Terrenos &lt; 300m²: factor 0.0278%</p>
                                <p>• Terrenos ≥ 300m²: factor 0.0227%</p>
                                <p>El interés se acumula por cada día de atraso después del periodo de gracia.</p>
                            </div>
                        }
                    />
                </div>
            </CardHeader>
            <CardContent className="space-y-5">
                {/* Interactive Example Header */}
                <div className="bg-alimin-gold/10 border border-alimin-gold/20 rounded-xl p-3">
                    <p className="text-xs text-alimin-gold/80 font-medium mb-1 flex items-center gap-1.5">
                        <TrendingUp className="w-3.5 h-3.5" />
                        Ejemplo de Cliente Real
                    </p>
                    <p className="text-sm text-gray-200 leading-relaxed">
                        Si el cliente debe <span className="font-bold text-white">{CLP(debtAmount)}</span> y
                        lleva <span className="font-bold text-alimin-gold">{daysLate} días</span> de atraso,
                        el interés aplicado es de <span className="font-bold text-red-400">{CLP(calculation.totalInterest)}</span>
                    </p>
                </div>

                {/* Controls */}
                <div className="space-y-4">
                    {/* Debt Amount */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label className="text-xs text-gray-400 font-medium">Valor del Terreno</Label>
                            <span className="text-xs text-white font-mono">{CLP(debtAmount)}</span>
                        </div>
                        <Input
                            type="number"
                            value={debtAmount}
                            onChange={(e) => setDebtAmount(Number(e.target.value) || 0)}
                            className="bg-white/5 border-white/10 text-white h-10 text-sm"
                            step={1000000}
                        />
                    </div>

                    {/* Days Late Slider */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <Label className="text-xs text-gray-400 font-medium flex items-center gap-1.5">
                                <Clock className="w-3 h-3" />
                                Días de Atraso
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

                    {/* Area Toggle */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => setAreaM2(200)}
                            className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all ${areaM2 < 300
                                ? 'bg-alimin-green text-white'
                                : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                }`}
                        >
                            &lt; 300m²
                        </button>
                        <button
                            onClick={() => setAreaM2(300)}
                            className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all ${areaM2 >= 300
                                ? 'bg-alimin-green text-white'
                                : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                }`}
                        >
                            ≥ 300m²
                        </button>
                    </div>
                </div>

                {/* Results */}
                <div className="bg-black/30 rounded-xl p-3 border border-white/5 space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400 flex items-center gap-1">
                            Interés diario
                            <InfoTooltip
                                side="top"
                                content={`Se calcula como: Valor Terreno × Factor diario (${areaM2 >= 300 ? '0.0227%' : '0.0278%'})`}
                            />
                        </span>
                        <span className="font-mono text-white">{CLP(calculation.dailyInterest)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Días de atraso</span>
                        <span className="font-mono text-white">× {daysLate}</span>
                    </div>
                    <div className="border-t border-white/10 pt-2 mt-2">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-bold text-alimin-gold flex items-center gap-1.5">
                                <AlertTriangle className="w-4 h-4" />
                                Total Multa
                            </span>
                            <span className="text-lg font-black text-red-400 font-mono">
                                {CLP(calculation.totalInterest)}
                            </span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
