"use client";

import { useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AlertTriangle, Home, RefreshCcw, LifeBuoy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { getLotSpec } from '@/services/lotSpecs';

function PagoFalloContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const lotId = useMemo(() => {
        const raw = searchParams.get('lotId');
        if (!raw) return null;
        const n = Number(raw);
        return Number.isFinite(n) ? n : null;
    }, [searchParams]);

    const reason = useMemo(() => {
        const r = searchParams.get('reason');
        return r ? String(r) : null;
    }, [searchParams]);

    const lotLabel = useMemo(() => {
        if (lotId == null) return 'Sin información';
        const spec = getLotSpec(lotId);
        const stage = spec?.stage;
        const stageLotNumber = spec?.stageLotNumber;
        if (stage != null && stageLotNumber != null) return `L-${stageLotNumber} (Etapa ${stage})`;
        return `#${lotId}`;
    }, [lotId]);

    return (
        <div className="min-h-screen bg-black/95 relative flex flex-col">
            <div className="absolute inset-0 bg-[url('/terreno-bg.JPG')] bg-cover bg-center opacity-20 blur-sm fixed" />

            <div className="relative z-10 w-full">
                <Header projectName="Lomas Del Mar" />
            </div>

            <main className="container mx-auto px-4 py-12 relative z-10 text-white flex-grow">
                <div className="max-w-3xl mx-auto">
                    <div className="bg-black/60 shadow-2xl border border-white/10 rounded-xl p-8 mb-8 backdrop-blur-md">
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-900/30 mb-6 animate-scale-in">
                                <AlertTriangle className="w-12 h-12 text-amber-500" />
                            </div>

                            <h1 className="text-4xl font-bold text-white mb-4">Pago no completado</h1>
                            <p className="text-lg text-gray-300">
                                No se pudo finalizar la transacción. Si fue un error temporal, puedes intentar nuevamente.
                            </p>
                        </div>

                        <div className="status-card mb-6">
                            <h2 className="text-2xl font-bold text-white mb-4 border-b border-white/10 pb-2">Detalle</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 bg-white/5 rounded-lg border border-white/5">
                                    <p className="text-sm text-gray-400">Estado</p>
                                    <p className="text-xl font-semibold text-white">Rechazado / Cancelado</p>
                                </div>

                                <div className="p-4 bg-white/5 rounded-lg border border-white/5">
                                    <p className="text-sm text-gray-400">Lote</p>
                                    <p className="text-xl font-semibold text-white">{lotLabel}</p>
                                </div>
                            </div>

                            {reason && (
                                <div className="mt-5 rounded-lg border border-amber-500/30 bg-amber-900/20 p-4">
                                    <div className="flex items-start gap-3">
                                        <LifeBuoy className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="font-semibold text-amber-200">Motivo</p>
                                            <p className="text-sm text-amber-100/80">{reason}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                            <Button size="lg" onClick={() => router.push('/')} className="gap-2 bg-[#36595F] hover:bg-[#2A464B] text-white">
                                <Home className="w-5 h-5" />
                                Volver al Inicio
                            </Button>

                            <Button size="lg" variant="outline" onClick={() => window.location.reload()} className="gap-2 border-white/20 hover:bg-white/10 text-white bg-transparent">
                                <RefreshCcw className="w-5 h-5" />
                                Reintentar
                            </Button>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default function PagoFalloPage() {
    return (
        <Suspense fallback={<div>Cargando...</div>}>
            <PagoFalloContent />
        </Suspense>
    );
}
