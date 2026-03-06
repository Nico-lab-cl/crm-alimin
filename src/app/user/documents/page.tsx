"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { FileText, Download, CheckCircle, Clock } from "lucide-react";
import { SignPromesaModal } from "@/components/SignPromesaModal";
import { UserDocumentsList } from "@/components/user/UserDocumentsList";
export interface Reservation {
    id: string;
    lot_id: number;
    status: string;
    created_at: string;
    signed_at: string | null;
    uploaded_contract_url: string | null;
    promesa_signed_at?: string | null;
    lot: {
        number: string;
        stage: number;
    };
    is_legacy?: boolean;
    legacy_uploaded_contracts?: string | null;
    receipts?: any[];
}

export default function UserDocumentsPage() {
    const { data: session, status } = useSession();
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchReservations = () => {
        fetch("/api/user/reservations", { cache: 'no-store' })
            .then(async (res) => {
                if (!res.ok) throw new Error("Error fetching reservations");
                return res.json();
            })
            .then((data) => { setReservations(data); setLoading(false); })
            .catch((err) => { console.error("Failed to fetch documents", err); setLoading(false); });
    };

    useEffect(() => {
        if (status === "authenticated") fetchReservations();
        else if (status === "unauthenticated") setLoading(false);
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
            <div className="container mx-auto p-8 text-center pt-10">
                <h1 className="text-3xl font-bold mb-4">Acceso Denegado</h1>
                <p className="mb-4">Por favor inicia sesión para ver tus documentos.</p>
                <Link href="/login" className="text-blue-600 underline">Ir a Iniciar Sesión</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen relative flex flex-col items-center pt-10 pb-12 px-4 bg-black/95">
            <div className="absolute inset-0 bg-[url('/terreno-bg.JPG')] bg-cover bg-center opacity-20 blur-sm fixed" />

            <div className="container mx-auto relative z-10 max-w-5xl">
                <header className="mb-8 text-center">
                    <h1 className="text-4xl sm:text-5xl font-extrabold mb-3 text-[#36595F] drop-shadow-[0_2px_4px_rgba(255,255,255,0.1)] tracking-tight">
                        Mis Documentos
                    </h1>
                    <p className="text-lg sm:text-xl font-medium text-gray-200 drop-shadow-md">
                        Contratos y documentos legales de tus inversiones.
                    </p>
                </header>

                {/* 48h banner TEMPORARILY DISABLED
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
                */}

                <section>
                    <UserDocumentsList reservations={reservations} />
                </section>
            </div>
        </div>
    );
}
