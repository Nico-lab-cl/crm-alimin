"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

interface Reservation {
    id: string;
    lot: {
        id: number;
        number: string;
        stage: number;
        area_m2: number;
        price_total_clp: number;
        pie: number | null;
        reservation_amount_clp: number | null;
        cuotas: number | null;
        valor_cuota: number | null;
        last_installment_amount: number | null;
    };
    status: string;
    pie_status: string | null;
    installments_paid: number | null;
    created_at: string;
    signed_at?: string | null;
    signature_ip?: string | null;
    uploaded_contract_url?: string | null;
    is_legacy?: boolean;
    is_promo?: boolean;
    legacy_uploaded_contracts?: string | null;
    legacy_debt_start_date?: string | null;
    legacy_installment_start_date?: string | null;
    legacy_installment_ranges?: any;
    receipts?: any[];
}

import { SignContractModal } from "@/components/SignContractModal";
import { PaymentButtons } from "@/components/user/PaymentButtons";

export default function UserPlotsPage() {
    const { data: session, status } = useSession();
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === "authenticated") {
            fetch(`/api/user/reservations?t=${Date.now()}`, { cache: 'no-store' })
                .then(async (res) => {
                    if (!res.ok) {
                        const errorData = await res.json().catch(() => ({}));
                        throw new Error(errorData.details || errorData.error || `Error ${res.status}`);
                    }
                    return res.json();
                })
                .then((data) => {
                    setReservations(data);
                    setLoading(false);
                })
                .catch((err) => {
                    console.error("Failed to fetch reservations", err);
                    setLoading(false);
                });
        } else if (status === "unauthenticated") {
            setLoading(false);
        }
    }, [status]);

    if (status === "loading" || loading) {
        return (
            <div className="container mx-auto p-8 space-y-4">
                <Skeleton className="h-12 w-1/3" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Skeleton className="h-64" />
                    <Skeleton className="h-64" />
                </div>
            </div>
        );
    }

    if (status === "unauthenticated") {
        return (
            <div className="container mx-auto p-8 text-center bg-[#FDF9F3] text-[#36595F]">
                <h1 className="text-3xl font-bold mb-4">Acceso Denegado</h1>
                <p className="mb-4">Por favor inicia sesión para ver tus terrenos.</p>
                <Link href="/login" className="text-blue-600 underline">Ir a Iniciar Sesión</Link>
            </div>
        )
    }

    return (
        <div className="min-h-screen relative flex flex-col items-center pt-10 pb-12 px-4 bg-black/95">
            <div className="absolute inset-0 bg-[url('/terreno-bg.JPG')] bg-cover bg-center opacity-20 blur-sm fixed" />

            <div className="container mx-auto relative z-10">
                <header className="mb-12 text-center">
                    <h1 className="text-5xl font-extrabold mb-4 text-[#36595F] drop-shadow-[0_2px_4px_rgba(255,255,255,0.1)] tracking-tight">
                        Mis Terrenos
                    </h1>
                    <p className="text-xl font-medium text-gray-200 drop-shadow-md mb-8">
                        Gestiona tus inversiones en Lomas del Mar.
                    </p>

                    <div className="inline-block animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
                        <div className="bg-gradient-to-r from-amber-900/40 via-yellow-900/40 to-amber-900/40 border border-amber-500/30 text-amber-100 px-8 py-4 rounded-[2rem] shadow-[0_0_20px_rgba(251,191,36,0.15)] backdrop-blur-md relative mx-auto max-w-2xl">
                            <p className="font-medium flex flex-col md:flex-row items-center gap-2 justify-center text-center">
                                <span className="text-xl filter drop-shadow-lg">✨</span>
                                <span>Al firmar el contrato, nuestro equipo te contactará en las próximas 48 horas. Gracias por preferirnos.</span>
                                <span className="text-xl filter drop-shadow-lg">✨</span>
                            </p>
                        </div>
                    </div>
                </header>

                {/* Post-signature banner: signed but compraventa not yet uploaded TEMPORARILY DISABLED
                {reservations.some(r => r.signed_at && !r.uploaded_contract_url) && (
                    <div className="mb-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <div className="bg-gradient-to-r from-[#36595F]/60 via-[#2b464a]/60 to-[#36595F]/60 border border-[#36595F]/60 text-white px-6 py-4 rounded-2xl shadow-[0_0_20px_rgba(54,89,95,0.2)] backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center gap-3">
                            <span className="text-2xl shrink-0">⚖️</span>
                            <p className="text-sm sm:text-base font-medium leading-snug">
                                <span className="font-bold text-[#E0B457]">Nuestros abogados están trabajando en tu contrato de promesa de compra y venta.</span>{" "}
                                En un plazo de <span className="font-bold">48 horas</span> lo verás en la sección de{" "}
                                <a href="/user/documents" className="underline underline-offset-2 hover:text-[#E0B457] transition-colors">Documentos</a>.
                            </p>
                        </div>
                    </div>
                )}
                */}

                <section>
                    {reservations.length === 0 ? (
                        <Card className="bg-black/40 border-white/10 text-white backdrop-blur-sm">
                            <CardContent className="p-8 text-center text-gray-300">
                                <p>No tienes terrenos asociados a tu cuenta aún.</p>
                                <p className="text-sm mt-2">Si ya compraste uno, asegúrate de haber usado este correo electrónico.</p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {reservations.map((res) => (
                                <Card key={res.id} className="border-white/10 shadow-lg hover:shadow-xl transition-shadow bg-black/60 text-white backdrop-blur-md">
                                    <CardHeader className="bg-[#36595F]/90 text-white rounded-t-lg border-b border-white/10">
                                        <CardTitle>Lote {res.lot.number}</CardTitle>
                                        <CardDescription className="text-white/80">Etapa {res.lot.stage}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-6 space-y-4">
                                        <div className="flex justify-between items-center border-b border-white/10 pb-2">
                                            <span className="font-medium text-[#36595F]">Estado:</span>
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${res.status === 'paid' ? 'bg-green-900/50 text-green-400 border border-green-500/30' :
                                                res.status === 'pending_payment' ? 'bg-yellow-900/50 text-yellow-400 border border-yellow-500/30' :
                                                    'bg-gray-800 text-gray-400 border border-gray-600/30'
                                                }`}>
                                                {res.status === 'paid' ? 'PAGADO' : res.status.toUpperCase()}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm text-gray-300">
                                            <span>Superficie:</span>
                                            <span>{res.lot.area_m2} m²</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm text-gray-300">
                                            <span>Valor Total:</span>
                                            <span>${res.lot.price_total_clp?.toLocaleString('es-CL') || 'N/A'}</span>
                                        </div>

                                        <div className="space-y-3 pt-2">
                                            {/* Base Contract button removed as requested */}

                                            {res.signed_at && res.signature_ip !== 'Firma Offline' ? (
                                                <a
                                                    href={`/api/contracts/${res.id}/pdf`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="w-full py-2 px-4 bg-green-900/30 text-green-400 border border-green-500/30 rounded text-center text-sm font-bold flex items-center justify-center gap-2 hover:bg-green-900/50 transition-colors cursor-pointer"
                                                >
                                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                                    Firmado Digitalmente (Ver)
                                                </a>
                                            ) : (res.is_legacy || res.signature_ip === 'Firma Offline') ? null : (
                                                <SignContractModal
                                                    reservationId={res.id}
                                                    lotNumber={res.lot.number}
                                                    lotStage={res.lot.stage}
                                                    onSuccess={() => {
                                                        window.location.reload();
                                                    }}
                                                />
                                            )}

                                            {res.is_legacy && res.legacy_uploaded_contracts && (typeof res.legacy_uploaded_contracts === 'string' ? JSON.parse(res.legacy_uploaded_contracts) : res.legacy_uploaded_contracts)?.length > 0 && (
                                                <div className="space-y-2 pb-2">
                                                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Documentos Físicos (Offline)</h4>
                                                    {(typeof res.legacy_uploaded_contracts === 'string' ? JSON.parse(res.legacy_uploaded_contracts) : res.legacy_uploaded_contracts).map((doc: any, i: number) => (
                                                        <a
                                                            key={i}
                                                            href={doc.url}
                                                            download={doc.name}
                                                            className="w-full py-2 px-4 bg-indigo-900/30 text-indigo-400 border border-indigo-500/30 rounded text-center text-sm flex items-center justify-center gap-2 hover:bg-indigo-900/50 transition-colors cursor-pointer"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-download"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></svg>
                                                            Descargar {doc.name.replace(".pdf", "")}
                                                        </a>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Manual Documents (Receipts / Operating Expenses) */}
                                            {(() => {
                                                const rawManual = (res as any).manual_documents;
                                                const manualList = Array.isArray(rawManual) 
                                                    ? rawManual 
                                                    : (typeof rawManual === 'string' ? JSON.parse(rawManual) : []);
                                                
                                                if (manualList.length === 0) return null;

                                                return (
                                                    <div className="space-y-2 pb-2 mt-2 pt-2 border-t border-white/5">
                                                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Documentos Adjuntos</h4>
                                                        {manualList.map((doc: any, i: number) => (
                                                            <a
                                                                key={i}
                                                                href={doc.url}
                                                                download={doc.name}
                                                                className="w-full py-2 px-4 bg-white/5 text-gray-400 border border-white/10 rounded-xl text-center text-xs flex items-center justify-between hover:bg-white/10 transition-colors cursor-pointer group"
                                                            >
                                                                <span className="truncate max-w-[180px]">{doc.name}</span>
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-50 group-hover:opacity-100 transition-opacity"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></svg>
                                                            </a>
                                                        ))}
                                                    </div>
                                                );
                                            })()}



                                            <PaymentButtons
                                                reservationId={res.id}
                                                lot={res.lot}
                                                reservation={{
                                                    pie_status: res.pie_status,
                                                    installments_paid: res.installments_paid,
                                                    is_legacy: res.is_legacy,
                                                    is_promo: res.is_promo,
                                                    legacy_debt_start_date: res.legacy_debt_start_date,
                                                    legacy_installment_start_date: res.legacy_installment_start_date,
                                                    legacy_installment_ranges: res.legacy_installment_ranges,
                                                    receipts: res.receipts
                                                }}
                                                acquisitionDate={res.created_at}
                                            />

                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
