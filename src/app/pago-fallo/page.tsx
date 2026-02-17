"use client";

import { useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { XCircle, Home, RefreshCcw, AlertCircle, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
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

            <main className="container mx-auto px-4 py-12 relative z-10 flex-grow flex items-center justify-center">
                <div className="w-full max-w-2xl">
                    {/* Main Card */}
                    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
                        {/* Header Section */}
                        <div className="bg-gradient-to-br from-red-500 to-red-600 px-8 py-10 text-center">
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm mb-4 animate-scale-in">
                                <XCircle className="w-12 h-12 text-white" strokeWidth={2.5} />
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                                Pago no completado
                            </h1>
                            <p className="text-red-50/90 text-lg max-w-md mx-auto">
                                No se pudo procesar tu transacción en este momento
                            </p>
                        </div>

                        {/* Content Section */}
                        <div className="p-8 space-y-6">
                            {/* Status Info */}
                            <div className="bg-red-50 border border-red-200 rounded-xl p-5">
                                <div className="flex items-start gap-3">
                                    <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <h3 className="font-semibold text-red-900 mb-1">
                                            Transacción rechazada o cancelada
                                        </h3>
                                        <p className="text-sm text-red-700">
                                            La transacción no pudo completarse. Esto puede deberse a fondos insuficientes,
                                            límite de tarjeta excedido, o cancelación manual del proceso.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Lot Details */}
                            <div className="border border-gray-200 rounded-xl overflow-hidden">
                                <div className="bg-gray-50 px-5 py-3 border-b border-gray-200">
                                    <h2 className="font-semibold text-gray-900">Detalles de la reserva</h2>
                                </div>
                                <div className="p-5">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-600 mb-1">Lote seleccionado</p>
                                            <p className="text-lg font-semibold text-gray-900">{lotLabel}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600 mb-1">Estado</p>
                                            <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
                                                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                                No procesado
                                            </div>
                                        </div>
                                    </div>

                                    {reason && (
                                        <div className="mt-4 pt-4 border-t border-gray-200">
                                            <div className="flex items-start gap-2">
                                                <HelpCircle className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
                                                <div>
                                                    <p className="text-xs text-gray-600 mb-1">Motivo del rechazo</p>
                                                    <p className="text-sm text-gray-800">{reason}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Help Section */}
                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <HelpCircle className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-blue-900 mb-2">
                                            ¿Necesitas ayuda?
                                        </h3>
                                        <p className="text-sm text-blue-700 mb-3">
                                            Si el problema persiste, contáctanos por WhatsApp y te ayudaremos a completar tu reserva.
                                        </p>
                                        <a
                                            href="https://wa.me/56973077128?text=Hola,%20tuve%20un%20problema%20con%20el%20pago%20y%20necesito%20ayuda"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <Button
                                                size="sm"
                                                className="bg-[#25D366] hover:bg-[#1EBE5D] text-white"
                                            >
                                                Contactar Soporte
                                            </Button>
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                <Button
                                    size="lg"
                                    onClick={() => window.location.reload()}
                                    className="flex-1 bg-[#36595F] hover:bg-[#2a454a] text-white gap-2"
                                >
                                    <RefreshCcw className="w-5 h-5" />
                                    Intentar nuevamente
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    onClick={() => router.push('/')}
                                    className="flex-1 border-gray-300 hover:bg-gray-50 gap-2"
                                >
                                    <Home className="w-5 h-5" />
                                    Volver al inicio
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Additional Info */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-400">
                            Tu lote sigue disponible. Puedes intentar el pago nuevamente cuando estés listo.
                        </p>
                    </div>
                </div>
            </main>

            <div className="relative z-10">
                <Footer />
            </div>
        </div>
    );
}

export default function PagoFalloPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-black/95 flex items-center justify-center">
                <div className="text-white text-lg">Cargando...</div>
            </div>
        }>
            <PagoFalloContent />
        </Suspense>
    );
}
