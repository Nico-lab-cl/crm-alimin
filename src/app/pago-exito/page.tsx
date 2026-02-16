"use client";

import { useEffect, useMemo, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle2, Home, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { getLotSpec, getStageLotSpec } from '@/services/lotSpecs';

type ReceiptData = {
    lot?: {
        id?: unknown;
        number?: unknown;
        stage?: unknown;
        area_m2?: unknown;
        area?: unknown;
        price_total_clp?: unknown;
    };
    reservation?: Record<string, unknown>;
    payment?: Record<string, unknown>;
};

const safeText = (v: unknown): string => {
    if (v === null || v === undefined) return '—';
    if (typeof v === 'string') return v.length ? v : '—';
    if (typeof v === 'number' && Number.isFinite(v)) return String(v);
    return String(v);
};

const asRecord = (v: unknown): Record<string, unknown> | null =>
    v && typeof v === 'object' ? (v as Record<string, unknown>) : null;

function PagoExitoContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [receipt, setReceipt] = useState<ReceiptData | null>(null);
    const [receiptError, setReceiptError] = useState<'pending_confirmation' | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const lotId = useMemo(() => {
        const raw = searchParams.get('lotId');
        if (!raw) return null;
        const n = Number(raw);
        return Number.isFinite(n) ? n : null;
    }, [searchParams]);

    const reservationId = useMemo(() => {
        const raw = searchParams.get('reservationId');
        return raw ? String(raw) : null;
    }, [searchParams]);

    const receiptLotId = useMemo(() => {
        const raw = receipt?.lot?.id;
        return typeof raw === 'number' && Number.isFinite(raw) ? raw : null;
    }, [receipt]);

    const receiptStage = useMemo(() => {
        const raw = receipt?.lot?.stage;
        return typeof raw === 'number' && Number.isFinite(raw) ? raw : null;
    }, [receipt]);

    const receiptMetraje = useMemo(() => {
        const rawA = receipt?.lot?.area_m2;
        if (typeof rawA === 'number' && Number.isFinite(rawA) && rawA > 0) return rawA;
        const rawB = receipt?.lot?.area;
        if (typeof rawB === 'number' && Number.isFinite(rawB) && rawB > 0) return rawB;
        return null;
    }, [receipt]);

    const lotSpecMetraje = useMemo(() => {
        if (receiptLotId == null) return null;
        const stageFromReceipt = receiptStage;

        const numberRaw = receipt?.lot?.number;
        const parsedNumber = Number.parseInt(String(numberRaw), 10);
        const stageLotNumber = Number.isFinite(parsedNumber) ? parsedNumber : null;

        const spec =
            stageFromReceipt != null && stageLotNumber != null
                ? getStageLotSpec(stageFromReceipt, stageLotNumber)
                : getLotSpec(receiptLotId);

        const area = spec?.area_m2;
        return typeof area === 'number' && Number.isFinite(area) && area > 0 ? area : null;
    }, [receipt, receiptLotId, receiptStage]);

    const lotMetrajeToShow = receiptMetraje ?? lotSpecMetraje;

    const summaryLotLabel = useMemo(() => {
        const receiptNumberRaw = receipt?.lot?.number;
        if (receiptNumberRaw != null) return `L-${safeText(receiptNumberRaw)}`;
        if (lotId == null) return 'Sin información';

        const spec = getLotSpec(lotId);
        if (spec?.stageLotNumber != null) return `L-${spec.stageLotNumber}`;
        return `#${lotId}`;
    }, [lotId, receipt]);

    const summaryStageLabel = useMemo(() => {
        if (receiptStage != null) return `Etapa ${receiptStage}`;
        if (lotId == null) return null;
        const spec = getLotSpec(lotId);
        return spec?.stage != null ? `Etapa ${spec.stage}` : null;
    }, [lotId, receiptStage]);

    useEffect(() => {
        if (!reservationId) return;
        let cancelled = false;

        setReceipt(null);
        setReceiptError(null);

        const run = async () => {
            setIsLoading(true);

            const MAX_ATTEMPTS = 10;
            const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

            try {
                for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
                    if (cancelled) return;

                    try {
                        const res = await fetch(`/api/receipt/${encodeURIComponent(reservationId)}`);
                        const jsonUnknown: unknown = await res.json().catch(() => null);
                        const json =
                            jsonUnknown && typeof jsonUnknown === 'object' ? (jsonUnknown as Record<string, unknown>) : null;

                        const ok = Boolean(json && json['ok']);
                        if (!res.ok || !ok) {
                            throw new Error('receipt_not_ready');
                        }

                        const data = json?.['data'] as unknown;
                        if (!cancelled) {
                            setReceipt((data ?? null) as ReceiptData | null);
                            setReceiptError(null);
                        }
                        return;
                    } catch {
                        if (attempt >= MAX_ATTEMPTS) {
                            if (!cancelled) setReceiptError('pending_confirmation');
                            return;
                        }
                        await delay(1000);
                    }
                }
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        };

        void run();
        return () => {
            cancelled = true;
        };
    }, [reservationId]);

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
            minimumFractionDigits: 0,
        }).format(amount);

    return (
        <div className="min-h-screen bg-black/95 relative flex flex-col">
            <div className="absolute inset-0 bg-[url('/terreno-bg.JPG')] bg-cover bg-center opacity-20 blur-sm fixed" />

            <style>{`
        @media print {
          @page { margin: 12mm; }
          html, body { background: #fff !important; }
          header, footer { display: none !important; }
          .no-print { display: none !important; }
          main { padding: 0 !important; }
          .print-container { max-width: none !important; margin: 0 !important; }
          .print-area { border: 0 !important; background: #fff !important; padding: 0 !important; }
          .print-area * { box-shadow: none !important; color: #000 !important; }
          .print-area a[href]:after { content: "" !important; }
        }
      `}</style>
            <div className="relative z-10 w-full">
                <Header projectName="Lomas Del Mar" />
            </div>

            <main className="container mx-auto px-4 pt-32 pb-12 flex-grow relative z-10 text-white">
                <div className="max-w-3xl mx-auto print-container">
                    <div className="bg-black/60 shadow-2xl border border-white/10 rounded-xl p-8 mb-8 print-area backdrop-blur-md">
                        <div className="text-center mb-10 no-print">
                            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-[#36595F]/20 mb-6 animate-scale-in">
                                <CheckCircle2 className="w-12 h-12 text-[#36595F]" />
                            </div>

                            <h1 className="text-4xl font-bold text-white mb-4">
                                {receipt ? '¡Pago Confirmado!' : 'Procesando...'}
                            </h1>
                            <p className="text-lg text-gray-300">
                                {receipt
                                    ? 'Tu reserva ha sido registrada con éxito.'
                                    : 'Estamos validando tu pago, por favor espera un momento.'}
                            </p>
                        </div>

                        <div className="status-card mb-6">
                            <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-2">Resumen de la Operación</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 no-print mb-8">
                                <div className="p-5 bg-white/5 rounded-lg flex flex-col justify-center items-center text-center border border-white/5">
                                    <p className="text-sm text-gray-400 uppercase tracking-wider mb-1">Estado</p>
                                    <div className={`text-xl font-bold px-4 py-1 rounded-full ${receipt ? 'bg-green-900/50 text-green-400 border border-green-500/30' : 'bg-yellow-900/50 text-yellow-400 border border-yellow-500/30'}`}>
                                        {receipt ? 'APROBADO' : isLoading ? 'Procesando...' : 'En Verificación'}
                                    </div>
                                </div>

                                <div className="p-5 bg-white/5 rounded-lg flex flex-col justify-center items-center text-center border border-white/5">
                                    <p className="text-sm text-gray-400 uppercase tracking-wider mb-1">Lote Reservado</p>
                                    <p className="text-2xl font-bold text-white">{summaryLotLabel}</p>
                                    {summaryStageLabel && (
                                        <p className="text-sm text-gray-400 font-medium">{summaryStageLabel}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h3 className="text-xl font-semibold text-white">Detalles del Comprobante</h3>

                                {isLoading && (
                                    <div className="p-4 bg-white/5 rounded-lg animate-pulse">
                                        <div className="h-4 bg-white/10 rounded w-3/4 mb-2"></div>
                                        <div className="h-4 bg-white/10 rounded w-1/2"></div>
                                    </div>
                                )}

                                {!isLoading && receiptError === 'pending_confirmation' && (
                                    <div className="p-4 bg-yellow-900/20 text-yellow-200 border border-yellow-500/30 rounded-lg">
                                        <p className="text-sm font-medium">
                                            Pago procesado, pero aún estamos confirmando la boleta.
                                        </p>
                                        <p className="text-xs mt-1 text-yellow-200/70">Refresca la página en unos segundos.</p>
                                        <p className="text-xs mt-2 font-mono bg-yellow-900/40 p-1 rounded inline-block">
                                            ID: {safeText(reservationId)}
                                        </p>
                                    </div>
                                )}

                                {!isLoading && !receiptError && receipt && (
                                    <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
                                        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/10">
                                            {/* Comprador */}
                                            <div className="p-6 space-y-3">
                                                <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">Comprador</h4>
                                                <div>
                                                    <p className="font-bold text-lg text-white">{safeText(receipt.reservation?.name)}</p>
                                                    <p className="text-sm text-gray-300">{safeText(receipt.reservation?.email)}</p>
                                                    <p className="text-sm text-gray-300">{safeText(receipt.reservation?.phone)}</p>
                                                    <p className="text-sm text-gray-300">RUT: {safeText(receipt.reservation?.rut)}</p>
                                                </div>
                                            </div>

                                            {/* Lote Detalle */}
                                            <div className="p-6 space-y-3">
                                                <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">Detalle Propiedad</h4>
                                                <div>
                                                    <p className="font-bold text-lg text-white">
                                                        {receipt?.lot?.number != null ? `Lote ${safeText(receipt.lot.number)}` : lotId != null ? `Lote #${lotId}` : '—'}
                                                    </p>
                                                    {receiptStage != null && (
                                                        <p className="text-sm text-gray-300">Etapa {receiptStage}</p>
                                                    )}
                                                    {lotMetrajeToShow != null && (
                                                        <p className="text-sm text-gray-300">Superficie: {lotMetrajeToShow} m²</p>
                                                    )}
                                                    <p className="text-xs text-gray-500 mt-2 font-mono">Folio: {safeText(receipt.reservation?.folio)}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Webpay Detalle */}
                                        <div className="border-t border-white/10 p-6 bg-white/5">
                                            <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">Transacción Webpay</h4>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                                <div>
                                                    <p className="text-xs text-gray-500">Orden de Compra</p>
                                                    <p className="font-medium font-mono text-white truncate" title={safeText(receipt.payment?.buy_order)}>{safeText(receipt.payment?.buy_order)}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500">Monto Pagado</p>
                                                    <p className="font-bold text-[#36595F]">
                                                        {(() => {
                                                            const amount = asRecord(receipt.payment)?.amount_clp;
                                                            return typeof amount === 'number' && Number.isFinite(amount) ? formatCurrency(amount) : '—';
                                                        })()}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500">Cod. Autorización</p>
                                                    <p className="font-medium text-white">{safeText(receipt.payment?.authorization_code)}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500">Fecha</p>
                                                    <p className="font-medium text-white">
                                                        {new Date().toLocaleDateString('es-CL')}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-end no-print">
                                <Button variant="outline" onClick={() => window.print()} className="gap-2 border-white/20 hover:bg-white/10 text-white bg-transparent">
                                    <FileText className="w-4 h-4" />
                                    Descargar Comprobante PDF
                                </Button>
                                {reservationId && (
                                    <Button variant="default" asChild className="gap-2 bg-[#36595F] hover:bg-[#2A464B] text-white border-0">
                                        <a href={`/api/contracts/${reservationId}/pdf`} target="_blank" rel="noopener noreferrer">
                                            <FileText className="w-4 h-4" />
                                            Descargar Contrato de Reserva
                                        </a>
                                    </Button>
                                )}
                            </div>
                        </div>

                        <div className="mt-8 rounded-xl border border-blue-500/30 bg-blue-900/20 p-5 no-print">
                            <div className="flex items-start gap-4">
                                <div className="bg-blue-900/50 p-2 rounded-full mt-1">
                                    <FileText className="w-5 h-5 text-blue-300" />
                                </div>
                                <div>
                                    <p className="font-bold text-blue-200 text-lg">Próximos Pasos</p>
                                    <p className="text-blue-300 mt-1">
                                        Hemos enviado un correo con este comprobante y las instrucciones para la firma de escritura.
                                        Nuestro equipo comercial te contactará a la brevedad.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center no-print pb-8">
                        <Button size="lg" onClick={() => router.push('/')} className="gap-2 px-8 shadow-lg hover:shadow-xl transition-all bg-[#36595F] hover:bg-[#2A464B] text-white">
                            <Home className="w-5 h-5" />
                            Volver al Mapa
                        </Button>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default function PagoExitoPage() {
    return (
        <Suspense fallback={<div>Cargando...</div>}>
            <PagoExitoContent />
        </Suspense>
    );
}
