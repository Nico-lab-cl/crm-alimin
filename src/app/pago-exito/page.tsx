"use client";

import { useEffect, useMemo, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle2, Home, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
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

                            // Trigger Meta Pixel Purchase Event
                            if (data && typeof window !== 'undefined' && (window as any).fbq) {
                                const receiptData = data as any;
                                const amount = receiptData.payment?.amount_clp || 500000;
                                const lotIdStr = receiptData.lot?.id ? String(receiptData.lot.id) : undefined;
                                const lotName = receiptData.lot?.number ? `Reserva Lote ${receiptData.lot.number}` : 'Reserva Lote';
                                const orderId = receiptData.payment?.buy_order;

                                // Prevent duplicate firing by checking a session flag
                                const eventFlag = `fbq_purchase_${orderId || reservationId}`;
                                if (!sessionStorage.getItem(eventFlag)) {
                                    (window as any).fbq('track', 'Purchase', {
                                        value: amount,
                                        currency: 'CLP',
                                        content_name: lotName,
                                        content_ids: lotIdStr ? [lotIdStr] : undefined,
                                        content_type: 'product',
                                        order_id: orderId
                                    }, { eventID: `reserva_${reservationId}_${orderId || 'unknown'}` });
                                    sessionStorage.setItem(eventFlag, 'true');
                                    console.log('✅ Meta Pixel Purchase fired for:', orderId);
                                }
                            }
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

            <main className="container mx-auto px-4 py-12 flex-grow relative z-10">
                <div className="max-w-3xl mx-auto print-container">
                    {/* Card Container: White background, rounded, shadow */}
                    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden print-area">

                        {/* Card Header: Green, Dark, White Text */}
                        <div className="bg-[#36595F] p-8 text-center text-white relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-full bg-[url('/pattern-opacity.png')] opacity-10" /> {/* Optional subtle pattern if available, else just solid */}

                            <div className="relative z-10">
                                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 mb-6 animate-scale-in backdrop-blur-sm">
                                    <CheckCircle2 className="w-10 h-10 text-white" />
                                </div>

                                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                                    {receipt ? '¡Pago Confirmado!' : 'Procesando...'}
                                </h1>
                                <p className="text-white/90 text-lg">
                                    {receipt
                                        ? 'Tu reserva ha sido registrada con éxito.'
                                        : 'Estamos validando tu pago, por favor espera un momento.'}
                                </p>
                            </div>
                        </div>

                        {/* Card Body: White, Black Text */}
                        <div className="p-8 md:p-10">

                            {/* Summary Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex flex-col items-center text-center">
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Estado</p>
                                    <div className={`px-4 py-1.5 rounded-full text-sm font-bold shadow-sm ${receipt ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-yellow-100 text-yellow-700 border border-yellow-200'}`}>
                                        {receipt ? 'APROBADO' : isLoading ? 'PROCESANDO...' : 'EN VERIFICACIÓN'}
                                    </div>
                                </div>

                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex flex-col items-center text-center">
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Lote Reservado</p>
                                    <p className="text-2xl font-bold text-gray-900">{summaryLotLabel}</p>
                                    {summaryStageLabel && (
                                        <p className="text-sm text-gray-500 font-medium">{summaryStageLabel}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">
                                    Detalles del Comprobante
                                </h3>

                                {isLoading && (
                                    <div className="space-y-3 animate-pulse">
                                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                                    </div>
                                )}

                                {!isLoading && receiptError === 'pending_confirmation' && (
                                    <div className="p-4 bg-yellow-50 text-yellow-800 border border-yellow-200 rounded-lg">
                                        <p className="text-sm font-medium">
                                            Pago procesado, pero aún estamos confirmando la boleta.
                                        </p>
                                        <p className="text-xs mt-1 text-yellow-600">Refresca la página en unos segundos.</p>
                                        <p className="text-xs mt-2 font-mono bg-yellow-100/50 p-1 rounded inline-block text-yellow-800">
                                            ID: {safeText(reservationId)}
                                        </p>
                                    </div>
                                )}

                                {!isLoading && !receiptError && receipt && (
                                    <div className="rounded-xl border border-gray-200 bg-gray-50/50 overflow-hidden">
                                        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200">
                                            {/* Comprador */}
                                            <div className="p-6 space-y-3">
                                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wide">Comprador</h4>
                                                <div className="space-y-1">
                                                    <p className="font-bold text-lg text-gray-900">{safeText(receipt.reservation?.name)}</p>
                                                    <p className="text-sm text-gray-600">{safeText(receipt.reservation?.email)}</p>
                                                    <p className="text-sm text-gray-600">{safeText(receipt.reservation?.phone)}</p>
                                                    <p className="text-sm text-gray-600">RUT: {safeText(receipt.reservation?.rut)}</p>
                                                </div>
                                            </div>

                                            {/* Lote Detalle */}
                                            <div className="p-6 space-y-3">
                                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wide">Propiedad</h4>
                                                <div className="space-y-1">
                                                    <p className="font-bold text-lg text-gray-900">
                                                        {receipt?.lot?.number != null ? `Lote ${safeText(receipt.lot.number)}` : lotId != null ? `Lote #${lotId}` : '—'}
                                                    </p>
                                                    {receiptStage != null && (
                                                        <p className="text-sm text-gray-600">Etapa {receiptStage}</p>
                                                    )}
                                                    {lotMetrajeToShow != null && (
                                                        <p className="text-sm text-gray-600">Superficie: {lotMetrajeToShow} m²</p>
                                                    )}
                                                    <p className="text-xs text-gray-400 mt-2 font-mono">Folio: {safeText(receipt.reservation?.folio)}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Webpay Detalle */}
                                        <div className="border-t border-gray-200 p-6 bg-gray-100/50">
                                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-4">Información de Pago</h4>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-2 text-sm">
                                                <div>
                                                    <p className="text-xs text-gray-500 mb-1">Orden de Compra</p>
                                                    <p className="font-medium font-mono text-gray-900 truncate" title={safeText(receipt.payment?.buy_order)}>{safeText(receipt.payment?.buy_order)}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 mb-1">Monto Pagado</p>
                                                    <p className="font-bold text-[#36595F] text-base">
                                                        {(() => {
                                                            const amount = asRecord(receipt.payment)?.amount_clp;
                                                            return typeof amount === 'number' && Number.isFinite(amount) ? formatCurrency(amount) : '—';
                                                        })()}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 mb-1">Cod. Autorización</p>
                                                    <p className="font-medium text-gray-900">{safeText(receipt.payment?.authorization_code)}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 mb-1">Fecha</p>
                                                    <p className="font-medium text-gray-900">
                                                        {new Date().toLocaleDateString('es-CL')}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-end no-print">
                                <Button variant="outline" onClick={() => window.print()} className="gap-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900">
                                    <FileText className="w-4 h-4" />
                                    Descargar Comprobante PDF
                                </Button>
                                {reservationId && (
                                    /* Download Contract button removed */
                                    null
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 rounded-xl border border-blue-200 bg-white/95 p-6 no-print shadow-lg backdrop-blur-sm">
                        <div className="flex items-start gap-4">
                            <div className="bg-blue-100 p-3 rounded-full mt-1 shrink-0">
                                <FileText className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="font-bold text-gray-900 text-lg">Próximos Pasos</p>
                                <p className="text-gray-600 mt-2 leading-relaxed">
                                    ¡Gracias por tu reserva! Hemos enviado un correo electrónico con este comprobante y las instrucciones detalladas para la firma de escritura.
                                    Nuestro equipo comercial se pondrá en contacto contigo a la brevedad para guiarte en el proceso.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Tutorial Video Section */}
                    <div className="mt-8 no-print">
                        <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Video Tutorial: Siguientes Pasos</h3>
                        <div className="bg-[#36595F] rounded-2xl p-1 shadow-lg overflow-hidden ring-2 ring-[#E0B457]/20 max-w-2xl mx-auto">
                            <div className="bg-black/20 rounded-xl overflow-hidden aspect-video relative">
                                <video
                                    className="w-full h-full object-cover"
                                    controls
                                >
                                    <source src="/alimin-tutorial.mp4" type="video/mp4" />
                                    Tu navegador no soporta el elemento de video.
                                </video>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center no-print mt-8">
                        <Button size="lg" onClick={() => router.push('/')} className="gap-2 px-8 shadow-xl bg-[#36595F] hover:bg-[#2A464B] text-white font-bold h-14 rounded-full">
                            <Home className="w-5 h-5" />
                            Volver al Mapa
                        </Button>
                    </div>
                </div>
            </main>

            <div className="relative z-10">
                <Footer />
            </div>
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
