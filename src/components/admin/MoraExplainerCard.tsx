'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calculator, TrendingUp, AlertTriangle, Clock, CalendarDays } from 'lucide-react';
import { calculateDailyInterest } from '@/lib/financials';
import { InfoTooltip } from './InfoTooltip';

export function MoraExplainerCard() {
    const [totalLotPrice, setTotalLotPrice] = useState(45000000);
    const [daysLate, setDaysLate] = useState(15);
    const [areaM2, setAreaM2] = useState(200);

    const calculation = useMemo(() => {
        const dailyInterest = calculateDailyInterest(totalLotPrice, areaM2);
        const totalInterest = dailyInterest * daysLate;
        return { dailyInterest, totalInterest };
    }, [totalLotPrice, daysLate, areaM2]);

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
                                <p>Cada cuota vence el <b>día 5</b> de cada mes. Hay un período de gracia hasta el <b>día 10</b>.</p>
                                <p>Si el cliente no paga antes del <b>día 11</b>, comienza a correr un interés <b>diario</b> que se calcula sobre el <b>valor total del terreno</b> (no sobre la cuota).</p>
                                <p className="pt-1 border-t border-white/10">• Terrenos &lt; 300m²: factor 0.0278% diario</p>
                                <p>• Terrenos ≥ 300m²: factor 0.0227% diario</p>
                                <p className="text-gray-400 pt-1">El interés se acumula por cada día de atraso después del día 10.</p>
                            </div>
                        }
                    />
                </div>
            </CardHeader>
            <CardContent className="space-y-5">
                {/* How it works — brief explanation */}
                <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                    <div className="flex items-start gap-2">
                        <CalendarDays className="w-4 h-4 text-alimin-gold mt-0.5 shrink-0" />
                        <p className="text-xs text-gray-300 leading-relaxed">
                            La cuota vence el <span className="text-white font-semibold">día 5</span> de cada mes.
                            Hay gracia hasta el <span className="text-white font-semibold">día 10</span>.
                            A partir del <span className="text-red-400 font-semibold">día 11</span>, se aplica un interés diario
                            sobre el <span className="text-alimin-gold font-semibold">valor total del terreno</span>.
                        </p>
                    </div>
                </div>

                {/* Interactive Example */}
                <div className="bg-alimin-gold/10 border border-alimin-gold/20 rounded-xl p-3">
                    <p className="text-xs text-alimin-gold/80 font-medium mb-1 flex items-center gap-1.5">
                        <TrendingUp className="w-3.5 h-3.5" />
                        Ejemplo Interactivo
                    </p>
                    <p className="text-sm text-gray-200 leading-relaxed">
                        Si el terreno vale <span className="font-bold text-white">{CLP(totalLotPrice)}</span> y
                        el cliente se atrasa <span className="font-bold text-alimin-gold">{daysLate} días</span> después del día 10,
                        el interés acumulado es de <span className="font-bold text-red-400">{CLP(calculation.totalInterest)}</span>
                    </p>
                </div>

                {/* Controls */}
                <div className="space-y-4">
                    {/* Total Lot Price */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label className="text-xs text-gray-400 font-medium flex items-center gap-1">
                                Valor Total del Terreno
                                <InfoTooltip
                                    side="top"
                                    content="El interés se calcula sobre el valor total del terreno, no sobre el valor de la cuota individual."
                                />
                            </Label>
                            <span className="text-xs text-white font-mono">{CLP(totalLotPrice)}</span>
                        </div>
                        <Input
                            type="number"
                            value={totalLotPrice}
                            onChange={(e) => setTotalLotPrice(Number(e.target.value) || 0)}
                            className="bg-white/5 border-white/10 text-white h-10 text-sm"
                            step={1000000}
                        />
                    </div>

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

                    {/* Area Toggle */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => setAreaM2(200)}
                            className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-bold transition-all min-h-[44px] ${areaM2 < 300
                                ? 'bg-alimin-green text-white'
                                : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                }`}
                        >
                            &lt; 300m²
                        </button>
                        <button
                            onClick={() => setAreaM2(300)}
                            className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-bold transition-all min-h-[44px] ${areaM2 >= 300
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
                                content={`Valor del terreno × factor diario (${areaM2 >= 300 ? '0.0227%' : '0.0278%'}). Este interés se cobra por cada día que pasa después del día 10 sin pagar la cuota.`}
                            />
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
