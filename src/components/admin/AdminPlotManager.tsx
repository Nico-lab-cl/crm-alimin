'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PaymentButtons } from "@/components/user/PaymentButtons";
import { UserNavigator } from "@/components/admin/UserNavigator";
// import { InterestSimulator } from "@/components/admin/InterestSimulator"; // User might still want the dedicated tool, or this replaces it? Keeping it accessible is safer.
import { ArrowLeft, FileDown, User, Calendar as CalendarIcon } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface AdminPlotManagerProps {
    reservations: any[]; // Using any for simplicity with Prisma includes, or define tight type
    allClients: any[];
    userId: string;
    initialUserName: string;
}

export function AdminPlotManager({ reservations, allClients, userId, initialUserName }: AdminPlotManagerProps) {
    const [simulatedDate, setSimulatedDate] = useState<Date | undefined>(undefined);

    const handleClearSimulation = () => {
        setSimulatedDate(undefined);
    };

    return (
        <div className="container mx-auto relative z-10">
            <header className="mb-12">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                    <div>
                        <div className="inline-block px-3 py-1 mb-2 rounded-full bg-yellow-500/20 text-yellow-500 border border-yellow-500/50 text-sm font-bold">
                            MODO VISTA ADMIN
                        </div>
                        <h1 className="text-4xl font-extrabold text-[#36595F] drop-shadow-[0_2px_4px_rgba(255,255,255,0.1)] tracking-tight">
                            Gestión de: {initialUserName}
                        </h1>

                        {/* Simulation Logic */}
                        <div className="mt-4 flex items-center gap-4">
                            <div className="flex items-center gap-2 bg-black/40 p-2 rounded-lg border border-white/10">
                                <span className="text-sm text-gray-300">Simular Fecha Actual:</span>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-[240px] justify-start text-left font-normal bg-black/20 border-white/10 text-white hover:bg-white/5 hover:text-white h-8",
                                                !simulatedDate && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {simulatedDate ? format(simulatedDate, "PPP", { locale: es }) : <span>Fecha Real (Hoy)</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0 bg-gray-900 border-white/10 text-white">
                                        <Calendar
                                            mode="single"
                                            selected={simulatedDate}
                                            onSelect={setSimulatedDate}
                                            initialFocus
                                            className="bg-gray-900 text-white"
                                        />
                                    </PopoverContent>
                                </Popover>
                                {simulatedDate && (
                                    <Button
                                        variant="ghost"
                                        onClick={handleClearSimulation}
                                        className="h-8 text-xs text-red-400 hover:text-red-300 hover:bg-red-900/20"
                                    >
                                        Limpiar
                                    </Button>
                                )}
                            </div>
                            {/* <InterestSimulator /> Maybe keep this nearby if needed? User implied this replaces it. Limiting clutter. */}
                        </div>
                    </div>

                    {/* User Navigator / Search */}
                    <div className="w-full md:w-auto">
                        <UserNavigator users={allClients} />
                    </div>
                </div>
            </header>

            <section>
                {reservations.length === 0 ? (
                    <Card className="bg-black/40 border-white/10 text-white backdrop-blur-sm">
                        <CardContent className="p-8 text-center text-gray-300">
                            <p>Este usuario no tiene terrenos PAGADOS o CONFIRMADOS.</p>
                            <p className="text-sm text-gray-500 mt-2">Solo se muestran ventas cerradas.</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {reservations.map((res) => (
                            <Card key={res.id} className="border-white/10 shadow-lg hover:shadow-xl transition-shadow bg-black/60 text-white backdrop-blur-md flex flex-col">
                                <CardHeader className="bg-[#36595F]/90 text-white rounded-t-lg border-b border-white/10">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle>Lote {res.lot.number}</CardTitle>
                                            <CardDescription className="text-white/80">Etapa {res.lot.stage}</CardDescription>
                                        </div>
                                        <div className="bg-black/20 px-2 py-1 rounded text-xs flex items-center gap-1" title="Propietario">
                                            <User className="w-3 h-3" />
                                            <span className="max-w-[100px] truncate">{res.buyer?.name || 'Sin nombre'}</span>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-6 space-y-4 flex-1 flex flex-col">
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

                                    <div className="space-y-3 pt-2 mt-auto">
                                        {res.signed_at ? (
                                            <a
                                                href={`/api/contracts/${res.id}/pdf`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-full py-2 px-4 bg-green-900/30 text-green-400 border border-green-500/30 rounded text-center text-sm font-bold flex items-center justify-center gap-2 hover:bg-green-900/50 transition-colors cursor-pointer"
                                            >
                                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                                Firmado Digitalmente (Ver)
                                            </a>
                                        ) : (
                                            <a
                                                href={`/api/contracts/${res.id}/pdf`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-full py-2 px-4 bg-gray-800/50 text-gray-400 border border-gray-700/50 rounded text-center text-sm flex items-center justify-center gap-2 hover:bg-gray-800 hover:text-gray-300 transition-colors cursor-pointer"
                                                title="Descargar contrato pendiente"
                                            >
                                                <FileDown className="w-4 h-4" />
                                                Contrato Pendiente (Descargar)
                                            </a>
                                        )}

                                        <PaymentButtons
                                            reservationId={res.id}
                                            lot={res.lot}
                                            reservation={{
                                                pie_status: res.pie_status,
                                                installments_paid: res.installments_paid
                                            }}
                                            acquisitionDate={res.created_at}
                                            isAdminView={true}
                                            simulatedDate={simulatedDate} // Pass the simulation!
                                        />

                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
