"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { FileText, Download, CheckCircle, Clock } from "lucide-react";

interface Reservation {
    id: string;
    lot_id: number;
    status: string;
    created_at: string;
    signed_at: string | null;
    uploaded_contract_url: string | null;
    lot: {
        number: string;
        stage: number;
    };
}

export default function UserDocumentsPage() {
    const { data: session, status } = useSession();
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === "authenticated") {
            fetch("/api/user/reservations", { cache: 'no-store' })
                .then(async (res) => {
                    if (!res.ok) throw new Error("Error fetching reservations");
                    return res.json();
                })
                .then((data) => {
                    setReservations(data);
                    setLoading(false);
                })
                .catch((err) => {
                    console.error("Failed to fetch documents", err);
                    setLoading(false);
                });
        } else if (status === "unauthenticated") {
            setLoading(false);
        }
    }, [status]);

    if (status === "loading" || loading) {
        return (
            <div className="container mx-auto pt-10 pb-12 px-4 space-y-4">
                <Skeleton className="h-12 w-1/3 mb-8" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Skeleton className="h-48" />
                    <Skeleton className="h-48" />
                </div>
            </div>
        );
    }

    if (status === "unauthenticated") {
        return (
            <div className="container mx-auto p-8 text-center pt-32">
                <h1 className="text-3xl font-bold mb-4">Acceso Denegado</h1>
                <p className="mb-4">Por favor inicia sesión para ver tus documentos.</p>
                <Link href="/login" className="text-blue-600 underline">Ir a Iniciar Sesión</Link>
            </div>
        )
    }

    return (
        <div className="min-h-screen relative flex flex-col items-center pt-10 pb-12 px-4 bg-black/95">
            <div className="absolute inset-0 bg-[url('/terreno-bg.JPG')] bg-cover bg-center opacity-20 blur-sm fixed" />

            <div className="container mx-auto relative z-10 max-w-5xl">
                <header className="mb-12 text-center">
                    <h1 className="text-5xl font-extrabold mb-4 text-[#36595F] drop-shadow-[0_2px_4px_rgba(255,255,255,0.1)] tracking-tight">
                        Mis Documentos
                    </h1>
                    <p className="text-xl font-medium text-gray-200 drop-shadow-md">
                        Contratos y documentos legales de tus inversiones.
                    </p>
                </header>

                {/* Post-signature banner: signed but compraventa not yet uploaded */}
                {reservations.some(r => r.signed_at && !r.uploaded_contract_url) && (
                    <div className="mb-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <div className="bg-gradient-to-r from-[#36595F]/60 via-[#2b464a]/60 to-[#36595F]/60 border border-[#36595F]/60 text-white px-6 py-4 rounded-2xl shadow-[0_0_20px_rgba(54,89,95,0.2)] backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center gap-3">
                            <span className="text-2xl shrink-0">⚖️</span>
                            <p className="text-sm sm:text-base font-medium leading-snug">
                                <span className="font-bold text-[#E0B457]">Nuestros abogados están trabajando en tu contrato de promesa de compra y venta.</span>{" "}
                                En un plazo de <span className="font-bold">48 horas</span> lo verás reflejado en esta sección.
                            </p>
                        </div>
                    </div>
                )}

                <section>
                    {reservations.length === 0 ? (
                        <Card className="bg-black/40 border-white/10 text-white backdrop-blur-sm">
                            <CardContent className="p-8 text-center text-gray-300">
                                <p>No tienes documentos asociados a tu cuenta aún.</p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {reservations.map((res) => {
                                const hasReserva = !!res.signed_at;
                                const hasCompraventa = !!res.uploaded_contract_url;

                                return (
                                    <Card key={res.id} className="border-white/10 shadow-lg bg-black/60 text-white backdrop-blur-md">
                                        <CardHeader className="bg-[#36595F]/90 text-white rounded-t-lg border-b border-white/10">
                                            <CardTitle className="flex items-center gap-2">
                                                <FileText className="h-5 w-5" />
                                                Lote {res.lot.number} - Etapa {res.lot.stage}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-6 space-y-6">

                                            {/* Contrato de Reserva */}
                                            <div className="space-y-2">
                                                <div className="flex justify-between items-center">
                                                    <h3 className="font-semibold text-gray-200 text-lg">Contrato de Reserva</h3>
                                                    {hasReserva ? (
                                                        <span className="flex items-center text-green-400 text-xs gap-1 bg-green-900/40 px-2 py-1 rounded">
                                                            <CheckCircle className="h-3 w-3" /> Firmado
                                                        </span>
                                                    ) : (
                                                        <span className="flex items-center text-yellow-400 text-xs gap-1 bg-yellow-900/40 px-2 py-1 rounded">
                                                            <Clock className="h-3 w-3" /> Pendiente
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-400">Documento inicial de reserva de lote firmado digitalmente.</p>
                                                {hasReserva && (
                                                    <a
                                                        href={`/api/contracts/${res.id}/pdf`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/30 text-blue-300 rounded text-sm transition-colors"
                                                    >
                                                        <Download className="h-4 w-4" />
                                                        Descargar Copia
                                                    </a>
                                                )}
                                            </div>

                                            <div className="h-px w-full bg-white/10" />

                                            {/* Promesa de Compra Venta */}
                                            <div className="space-y-2">
                                                <div className="flex justify-between items-center">
                                                    <h3 className="font-semibold text-gray-200 text-lg">Contrato de Compraventa</h3>
                                                    {hasCompraventa ? (
                                                        <span className="flex items-center text-green-400 text-xs gap-1 bg-green-900/40 px-2 py-1 rounded">
                                                            <CheckCircle className="h-3 w-3" /> Disponible
                                                        </span>
                                                    ) : (
                                                        <span className="flex items-center text-gray-500 text-xs gap-1 bg-gray-800/40 px-2 py-1 rounded">
                                                            <Clock className="h-3 w-3" /> No disponible aún
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-400">Promesa de compraventa final firmada legalmente.</p>
                                                {hasCompraventa && (
                                                    <a
                                                        href={res.uploaded_contract_url!}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-amber-600/20 hover:bg-amber-600/40 border border-amber-500/30 text-amber-300 rounded text-sm transition-colors"
                                                    >
                                                        <Download className="h-4 w-4" />
                                                        Descargar Contrato
                                                    </a>
                                                )}
                                            </div>

                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
