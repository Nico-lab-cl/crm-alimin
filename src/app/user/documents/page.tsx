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
    manual_documents?: any;
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
            <div className="min-h-screen bg-black pt-20 px-8 flex flex-col items-center">
                <Skeleton className="h-10 w-64 bg-white/5 rounded-full mb-12" />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-7xl">
                    <Skeleton className="h-96 bg-white/5 rounded-[2.5rem]" />
                    <Skeleton className="h-96 bg-white/5 rounded-[2.5rem]" />
                </div>
            </div>
        );
    }

    if (status === "unauthenticated") {
        return (
            <div className="min-h-screen bg-black flex flex-center items-center justify-center p-8">
                <div className="max-w-md w-full bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[2rem] text-center space-y-6">
                    <h1 className="text-white font-black text-2xl uppercase tracking-tighter">Acceso Denegado</h1>
                    <p className="text-gray-500 text-sm font-medium">Por favor inicia sesión para visualizar sus documentos legales y financieros.</p>
                    <Link href="/login" className="block w-full py-4 bg-[#36595F] text-white rounded-2xl font-black uppercase text-[11px] tracking-widest hover:bg-[#36595F]/80 transition-all">
                        Ir a Iniciar Sesión
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen relative flex flex-col items-center pt-20 pb-24 px-6 bg-black">
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#36595F]/10 blur-[120px] rounded-full opacity-50" />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#36595F]/5 blur-[120px] rounded-full opacity-30" />
            </div>

            <div className="container mx-auto relative z-10 max-w-7xl">
                <header className="mb-20 space-y-4">
                    <div className="flex items-center gap-3 mb-2 opacity-50">
                        <div className="h-px w-8 bg-[#8eb2b8]" />
                        <span className="text-[10px] font-black text-[#8eb2b8] uppercase tracking-[0.4em]">Expediente Digital</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-[0.9]">
                        Mis <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8eb2b8] to-[#36595F]">Documentos</span>
                    </h1>
                    <p className="max-w-xl text-gray-500 font-medium text-sm md:text-base leading-relaxed pt-2">
                        Acceda de forma segura a sus contratos de reserva, promesas de compraventa y el historial completo de sus transacciones financieras.
                    </p>
                </header>

                <section className="animate-in fade-in slide-in-from-bottom-5 duration-700">
                    <UserDocumentsList reservations={reservations} />
                </section>
            </div>
        </div>
    );
}
