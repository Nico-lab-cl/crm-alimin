"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { getInstallmentDueDate } from "@/lib/financials";

interface Reservation {
    id: string;
    lot: {
        number: string;
        stage: number;
        area_m2: number;
        price_total_clp: number;
        cuotas: number;
    };
    status: string;
    created_at: string;
    installments_paid: number;
    is_legacy?: boolean;
    is_promo?: boolean;
    legacy_installment_start_date?: string;
}

export default function UserDashboard() {
    const { data: session, status } = useSession();
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === "authenticated") {
            fetch("/api/user/reservations")
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
                    // Could set an error state here to show in UI
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
        <div className="min-h-screen bg-[#FDF9F3] text-[#36595F]">
            <div className="container mx-auto p-8">
                <header className="mb-12">
                    <h1 className="text-4xl font-bold mb-2">Bienvenido, {session?.user?.name}</h1>
                    <p className="text-lg opacity-80">Aquí puedes gestionar tus terrenos y documentos.</p>
                </header>

                <section>
                    <h2 className="text-2xl font-semibold mb-6">Mis Terrenos</h2>

                    {reservations.length === 0 ? (
                        <Card>
                            <CardContent className="p-8 text-center text-[#36595F]/70">
                                <p>No tienes terrenos asociados a tu cuenta aún.</p>
                                <p className="text-sm mt-2">Si ya compraste uno, asegúrate de haber usado este correo electrónico.</p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {reservations.map((res) => (
                                <Card key={res.id} className="border-[#36595F]/20 shadow-md hover:shadow-lg transition-shadow bg-white">
                                    <CardHeader className="bg-[#36595F] text-white rounded-t-lg">
                                        <CardTitle>Lote {res.lot.number}</CardTitle>
                                        <CardDescription className="text-white/80">Etapa {res.lot.stage}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-6 space-y-4">
                                        <div className="flex justify-between items-center border-b pb-2">
                                            <span className="font-medium text-[#36595F]">Estado:</span>
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${res.status === 'paid' ? 'bg-green-100 text-green-800' :
                                                res.status === 'pending_payment' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-gray-100 text-gray-800'
                                                }`}>
                                                {res.status === 'paid' ? 'PAGADO' : res.status.toUpperCase()}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span>Superficie:</span>
                                            <span>{res.lot.area_m2} m²</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span>Valor Total:</span>
                                            <span>${res.lot.price_total_clp?.toLocaleString('es-CL') || 'N/A'}</span>
                                        </div>

                                        {/* Next Payment Info */}
                                        {res.status !== 'paid' && res.lot.cuotas > 0 && res.installments_paid < res.lot.cuotas && (() => {
                                            // Calculate Next Due Date (5th of current or next month)
                                            // Logic: If today <= 10th, show 5th of this month (if not paid?). 
                                            // Actually simpler: 5th of Month (Paid + 1).
                                            // We need acquisition date to be precise, ensuring we align with `getInstallmentDueDate`.
                                            // `res.created_at` is acquisition date.

                                            const customStart = res.legacy_installment_start_date ? new Date(res.legacy_installment_start_date) : null;
                                            const customDueDay = customStart ? customStart.getDate() : null;
                                            const baseDate = customStart || new Date(res.created_at);
                                            const nextInstNum = (res.installments_paid || 0) + 1;
                                            const nextDueDate = getInstallmentDueDate(baseDate, nextInstNum, Boolean(res.is_legacy), customDueDay, Boolean(res.is_promo));

                                            const isUrgent = new Date() > nextDueDate; // If past due

                                            return (
                                                <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 space-y-2 mt-2">
                                                    <div className="flex justify-between items-center text-sm font-semibold text-[#36595F]">
                                                        <span>Próximo Vencimiento:</span>
                                                        <span className={isUrgent ? "text-red-600" : ""}>
                                                            5 de {nextDueDate.toLocaleDateString('es-CL', { month: 'long' })}
                                                        </span>
                                                    </div>
                                                    <div className="text-[10px] text-gray-600 leading-tight">
                                                        <span className="font-bold">Recuerda:</span> Tienes del día 5 al 10 para pagar sin intereses.
                                                        Posterior a eso se aplicará una multa por mora.
                                                    </div>
                                                </div>
                                            );
                                        })()}

                                        <div className="pt-4 space-y-2">
                                            <button className="w-full py-2 px-4 bg-[#36595F] text-white rounded hover:bg-[#2A464B] transition-colors text-sm font-medium">
                                                Ver Contrato
                                            </button>
                                            <button className="w-full py-2 px-4 border border-[#36595F] text-[#36595F] rounded hover:bg-[#36595F]/10 transition-colors text-sm font-medium">
                                                Ver Pagos
                                            </button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </section>
            </div >
        </div >
    );
}
