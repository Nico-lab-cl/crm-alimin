'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MoraExplainerCard } from './MoraExplainerCard';
import { InfoTooltip } from './InfoTooltip';
import {
    Wallet,
    CreditCard,
    CheckCircle2,
    Clock,
    Receipt,
    ArrowRight,
    TrendingUp,
    DollarSign,
} from 'lucide-react';
import Link from 'next/link';

interface PaymentStats {
    totalLots: number;
    soldLots: number;
    lotsWithPiePaid: number;
    lotsWithPiePending: number;
    totalInstallmentsPaid: number;
}

interface SoldLot {
    id: number;
    number: string | null;
    stage: number | null;
    area_m2: number | null;
    price_total_clp: number | null;
}

interface MobilePaymentDashboardProps {
    stats: PaymentStats;
    soldLots: SoldLot[];
}

export function MobilePaymentDashboard({ stats, soldLots }: MobilePaymentDashboardProps) {
    return (
        <div className="space-y-4">
            {/* Stats Cards Row */}
            <div className="grid grid-cols-2 gap-3">
                <Card className="bg-gradient-to-br from-green-950/80 to-green-900/30 border-green-500/20 text-white">
                    <CardContent className="p-3">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                                <CheckCircle2 className="w-4 h-4 text-green-400" />
                            </div>
                            <InfoTooltip
                                content="Terrenos vendidos con el pie completamente pagado."
                                side="bottom"
                            />
                        </div>
                        <p className="text-2xl font-black text-green-400">{stats.lotsWithPiePaid}</p>
                        <p className="text-[10px] text-green-400/60 font-medium uppercase tracking-wider mt-0.5">
                            Pie Pagado
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-amber-950/80 to-amber-900/30 border-amber-500/20 text-white">
                    <CardContent className="p-3">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                                <Clock className="w-4 h-4 text-amber-400" />
                            </div>
                            <InfoTooltip
                                content="Terrenos vendidos donde el pie aún no se ha pagado."
                                side="bottom"
                            />
                        </div>
                        <p className="text-2xl font-black text-amber-400">{stats.lotsWithPiePending}</p>
                        <p className="text-[10px] text-amber-400/60 font-medium uppercase tracking-wider mt-0.5">
                            Pie Pendiente
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-indigo-950/80 to-indigo-900/30 border-indigo-500/20 text-white">
                    <CardContent className="p-3">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                                <CreditCard className="w-4 h-4 text-indigo-400" />
                            </div>
                        </div>
                        <p className="text-2xl font-black text-indigo-400">{stats.totalInstallmentsPaid}</p>
                        <p className="text-[10px] text-indigo-400/60 font-medium uppercase tracking-wider mt-0.5">
                            Cuotas Pagadas
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-950/80 to-purple-900/30 border-purple-500/20 text-white">
                    <CardContent className="p-3">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                                <DollarSign className="w-4 h-4 text-purple-400" />
                            </div>
                        </div>
                        <p className="text-2xl font-black text-purple-400">{stats.soldLots}</p>
                        <p className="text-[10px] text-purple-400/60 font-medium uppercase tracking-wider mt-0.5">
                            Terrenos Vendidos
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Receipts Link */}
            <Link href="/admin/receipts" className="block">
                <Card className="bg-white/5 border-white/10 text-white hover:bg-white/10 transition-colors cursor-pointer active:scale-[0.99]">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-alimin-gold/20 flex items-center justify-center">
                                <Receipt className="w-5 h-5 text-alimin-gold" />
                            </div>
                            <div>
                                <p className="font-bold text-sm">Verificación de Pagos</p>
                                <p className="text-xs text-gray-400">Revisar comprobantes pendientes</p>
                            </div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-400" />
                    </CardContent>
                </Card>
            </Link>

            {/* Mora Explainer Card */}
            <MoraExplainerCard soldLots={soldLots} />
        </div>
    );
}
