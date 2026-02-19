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
    const [simulatedDate, setSimulatedDate] = useState<Date | undefined>(undefined); // Start Date (Inicio Mora)
    const [comparisonDate, setComparisonDate] = useState<Date | undefined>(undefined); // End Date (Fin Mora)

    const [isUserView, setIsUserView] = useState(false);

    const handleClearSimulation = () => {
        setSimulatedDate(undefined);
        setComparisonDate(undefined);
    };

    return (
        <div className="container mx-auto relative z-10">
            <header className="mb-12">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                    <div>
                        <div className="flex gap-2 mb-2">
                            {!isUserView && (
                                <div className="inline-block px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-500 border border-yellow-500/50 text-sm font-bold">
                                    MODO VISTA ADMIN
                                </div>
                            )}
                            <Button
                                variant="outline"
                                onClick={() => setIsUserView(!isUserView)}
                                className={cn(
                                    "h-7 text-xs font-bold border-white/20",
                                    isUserView
                                        ? "bg-yellow-500 text-black hover:bg-yellow-400 border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.5)]" // Active Style
                                        : "bg-white/5 text-white hover:bg-white/10"
                                )}
                            >
                                {isUserView ? "👁️ VOLVER A VISTA ADMIN" : "👤 VER COMO USUARIO"}
                            </Button>
                        </div>

                        <h1 className="text-4xl font-extrabold text-[#36595F] drop-shadow-[0_2px_4px_rgba(255,255,255,0.1)] tracking-tight">
                            {isUserView ? `Bienvenido, ${initialUserName}` : `Gestión de: ${initialUserName}`}
                        </h1>

                        {/* Simulation Logic - HIDDEN IN USER VIEW */}
                        {!isUserView && (
                            <div className="mt-4 flex flex-col gap-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-300 font-bold bg-[#36595F] px-2 py-1 rounded">Simulador de Intereses Manual</span>
                                    {(simulatedDate || comparisonDate) && (
                                        <Button
                                            variant="ghost"
                                            onClick={handleClearSimulation}
                                            className="h-8 text-xs text-red-400 hover:text-red-300 hover:bg-red-900/20"
                                        >
                                            Limpiar Filtros
                                        </Button>
                                    )}
                                </div>

                                <div className="flex items-center gap-4 bg-black/40 p-3 rounded-lg border border-white/10">
                                    <div className="space-y-1">
                                        <label className="text-xs text-gray-400 block">Inicio Mora (Desde)</label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-[200px] justify-start text-left font-normal bg-black/20 border-white/10 text-white hover:bg-white/5 hover:text-white h-9",
                                                        !simulatedDate && "text-muted-foreground"
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {simulatedDate ? format(simulatedDate, "PPP", { locale: es }) : <span>Seleccionar Inicio</span>}
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
                                    </div>

                                    <span className="text-gray-500 mt-4">➜</span>

                                    <div className="space-y-1">
                                        <label className="text-xs text-gray-400 block">Fin Mora (Hasta/Pago)</label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-[200px] justify-start text-left font-normal bg-black/20 border-white/10 text-white hover:bg-white/5 hover:text-white h-9",
                                                        !comparisonDate && "text-muted-foreground"
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {comparisonDate ? format(comparisonDate, "PPP", { locale: es }) : <span>Seleccionar Fin</span>}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0 bg-gray-900 border-white/10 text-white">
                                                <Calendar
                                                    mode="single"
                                                    selected={comparisonDate}
                                                    onSelect={setComparisonDate}
                                                    initialFocus
                                                    className="bg-gray-900 text-white"
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                </div>

                                {(simulatedDate && comparisonDate) && (() => {
                                    const start = new Date(simulatedDate);
                                    const end = new Date(comparisonDate);
                                    start.setHours(0, 0, 0, 0);
                                    end.setHours(0, 0, 0, 0);

                                    // Calculate Total Interest Accrued for ALL unpaid installments
                                    let totalInterestAccrued = 0;
                                    let lateInstallmentsCount = 0;

                                    reservations.forEach(res => {
                                        if (res.status === 'paid') return;

                                        const totalCuotas = res.lot.cuotas || 0;
                                        const paidCuotas = res.installments_paid || 0;
                                        if (paidCuotas >= totalCuotas) return;

                                        const valorCuota = res.lot.valor_cuota || 0;
                                        const lastInstallmentPrice = res.lot.last_installment_amount || valorCuota;
                                        const acquisitionDate = new Date(res.created_at);

                                        for (let i = paidCuotas + 1; i <= totalCuotas; i++) {
                                            // Calculate Due Date
                                            const dueDate = new Date(acquisitionDate);
                                            dueDate.setMonth(dueDate.getMonth() + i);
                                            dueDate.setDate(5);
                                            dueDate.setHours(0, 0, 0, 0);

                                            // Grace Period
                                            const graceEnd = new Date(dueDate);
                                            graceEnd.setDate(10);
                                            graceEnd.setHours(23, 59, 59, 999);

                                            if (end > graceEnd) {
                                                const diffTime = end.getTime() - graceEnd.getTime();
                                                const lateDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                                                if (lateDays > 0) {
                                                    let amount = valorCuota;
                                                    if (i === totalCuotas) amount = lastInstallmentPrice;

                                                    let factor = 0.027785496;
                                                    if (totalCuotas >= 77) factor = 0.0227324392;

                                                    totalInterestAccrued += Math.round(amount * factor) * lateDays;
                                                    lateInstallmentsCount++;
                                                }
                                            }
                                        }
                                    });

                                    if (totalInterestAccrued === 0) return null;

                                    return (
                                        <div className="bg-[#36595F]/20 border border-[#36595F] rounded p-3 text-center min-w-[200px]">
                                            <p className="text-[#36595F] font-bold text-xs uppercase mb-1">
                                                Deuda Total Morosa
                                                <span className="block text-[10px] opacity-70 font-normal normal-case">
                                                    (Calculada al {end.toLocaleDateString('es-CL')})
                                                </span>
                                            </p>
                                            <p className="text-2xl font-black text-red-500">
                                                {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(totalInterestAccrued)}
                                            </p>
                                            <p className="text-[10px] text-gray-500 mt-1">
                                                {lateInstallmentsCount > 0
                                                    ? `Acumulada en ${lateInstallmentsCount} cuotas vencidas`
                                                    : "Sin cuotas vencidas a la fecha"}
                                            </p>
                                        </div>
                                    );
                                })()}
                            </div>
                        )}
                    </div>

                    {/* User Navigator / Search - HIDDEN IN USER VIEW */}
                    {!isUserView && (
                        <div className="w-full md:w-auto">
                            <UserNavigator users={allClients} />
                        </div>
                    )}
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
                                            isAdminView={!isUserView}
                                            simulatedDate={simulatedDate}
                                            comparisonDate={comparisonDate} // Pass End Date
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
