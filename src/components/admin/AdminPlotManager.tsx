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
import { SignContractModal } from "@/components/SignContractModal";
import { toast } from "sonner";
import { triggerLegacyWorkflow, removeLegacyLotOwner } from "@/actions/dashboard";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { ContractUploadAction } from "@/components/admin/ContractUploadAction";
import { AssignOwnerModal } from "@/components/dashboard/AssignOwnerModal";
import { cn } from "@/lib/utils";
import { calculateTotalInterest, calculateDailyInterest, getInstallmentDueDate } from '@/lib/financials';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { UserDocumentsList } from "@/components/user/UserDocumentsList";

interface AdminPlotManagerProps {
    reservations: any[]; // Using any for simplicity with Prisma includes, or define tight type
    allClients: any[];
    userId: string;
    initialUserName: string;
}

export function AdminPlotManager({ reservations, allClients, userId, initialUserName }: AdminPlotManagerProps) {
    const [simulatedDate, setSimulatedDate] = useState<Date | undefined>(undefined); // Start Date (Inicio Mora)
    const [comparisonDate, setComparisonDate] = useState<Date | undefined>(undefined); // End Date (Fin Mora)
    const [isTriggering, setIsTriggering] = useState<string | null>(null);

    const [isUserView, setIsUserView] = useState(false);

    // Edit Modal State
    const [editingReservation, setEditingReservation] = useState<any | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const handleClearSimulation = () => {
        setSimulatedDate(undefined);
        setComparisonDate(undefined);
    };

    const handleTriggerWorkflow = async (reservationId: string) => {
        if (!confirm("¿Estás seguro de activar el Workflow? Esto enviará un correo de bienvenida al cliente con su clave y notificará la venta a n8n.")) return;

        setIsTriggering(reservationId);
        try {
            const res = await triggerLegacyWorkflow(reservationId);
            if (res.success) {
                toast.success(res.message);
                window.location.reload();
            } else {
                toast.error(res.error || "Ocurrió un error");
            }
        } catch (e) {
            toast.error("Error de servidor");
        } finally {
            setIsTriggering(null);
        }
    };

    const handleDeleteLegacyOwner = async (reservationId: string) => {
        if (!confirm("⚠️ PELIGRO: ¿Estás seguro de ELIMINAR esta asignación?\n\nEsto borrará al cliente del lote permanentemente y reseteará los valores financieros. NO SE PUEDE DESHACER.")) return;

        try {
            const res = await removeLegacyLotOwner(reservationId);
            if (res.success) {
                toast.success(res.message);
                window.location.reload();
            } else {
                toast.error(res.error || "Ocurrió un error al eliminar");
            }
        } catch (e) {
            toast.error("Error de servidor al eliminar asignación");
        }
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

                        {isUserView && (
                            <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                <div className="bg-gradient-to-r from-amber-900/40 via-yellow-900/40 to-amber-900/40 border border-amber-500/30 text-amber-100 px-8 py-4 rounded-[2rem] shadow-[0_0_20px_rgba(251,191,36,0.15)] backdrop-blur-md relative max-w-2xl">
                                    <p className="font-medium flex flex-col md:flex-row items-center gap-2 justify-center text-center">
                                        <span className="text-xl filter drop-shadow-lg">✨</span>
                                        <span>Al firmar el contrato, nuestro equipo te contactará en las próximas 48 horas. Gracias por preferirnos.</span>
                                        <span className="text-xl filter drop-shadow-lg">✨</span>
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Simulation Logic - HIDDEN IN USER VIEW */}
                        {!isUserView && (
                            <div className="mt-4 flex flex-col gap-3">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-300 font-bold bg-[#36595F] px-2 py-1 rounded">Simulador de Intereses</span>
                                    {(simulatedDate || comparisonDate) && (
                                        <Button
                                            variant="ghost"
                                            onClick={handleClearSimulation}
                                            className="h-8 text-xs text-red-400 hover:text-red-300 hover:bg-red-900/20"
                                        >
                                            Limpiar
                                        </Button>
                                    )}
                                </div>

                                <div className="bg-black/40 rounded-xl p-4 border border-white/10 inline-block">
                                    <label className="text-xs text-gray-400 block mb-2 font-medium">
                                        Simula la tasa de interés: selecciona fecha de inicio y fin
                                    </label>
                                    <Calendar
                                        mode="range"
                                        selected={simulatedDate && comparisonDate ? { from: simulatedDate, to: comparisonDate } : simulatedDate ? { from: simulatedDate, to: undefined } : undefined}
                                        onSelect={(range) => {
                                            setSimulatedDate(range?.from);
                                            setComparisonDate(range?.to);
                                        }}
                                        defaultMonth={new Date('2026-03-11T00:00:00-03:00')}
                                        disabled={{ before: new Date('2026-03-11T00:00:00-03:00') }}
                                        numberOfMonths={1}
                                        className="rounded-xl border border-white/10 bg-white/5 text-white"
                                        classNames={{
                                            months: "flex flex-col space-y-4",
                                            month: "space-y-3",
                                            caption: "flex justify-center pt-1 relative items-center",
                                            caption_label: "text-sm font-bold text-white",
                                            nav: "space-x-1 flex items-center",
                                            nav_button: "h-8 w-8 bg-white/10 border border-white/10 rounded-lg p-0 opacity-70 hover:opacity-100 hover:bg-white/20 inline-flex items-center justify-center transition-colors",
                                            nav_button_previous: "absolute left-1",
                                            nav_button_next: "absolute right-1",
                                            table: "w-full border-collapse",
                                            head_row: "flex",
                                            head_cell: "text-gray-500 rounded-md w-9 font-medium text-[0.7rem] uppercase",
                                            row: "flex w-full mt-1",
                                            cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected])]:bg-[#36595F]/20 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md",
                                            day: "h-9 w-9 p-0 font-normal rounded-lg hover:bg-[#36595F]/30 transition-colors inline-flex items-center justify-center cursor-pointer text-gray-300 hover:text-white",
                                            day_selected: "bg-[#36595F] text-white font-bold hover:bg-[#36595F]/90",
                                            day_today: "bg-white/10 text-white font-bold",
                                            day_outside: "text-gray-700 opacity-40",
                                            day_disabled: "text-gray-700 opacity-20 cursor-not-allowed hover:bg-transparent",
                                            day_range_middle: "bg-[#36595F]/15 text-[#36595F] rounded-none",
                                            day_range_end: "rounded-r-lg",
                                            day_hidden: "invisible",
                                        }}
                                    />
                                    {simulatedDate && (
                                        <p className="text-center text-xs text-gray-400 mt-2">
                                            <span className="text-white font-semibold">{format(simulatedDate, "PPP", { locale: es })}</span>
                                            {comparisonDate ? (
                                                <> → <span className="text-white font-semibold">{format(comparisonDate, "PPP", { locale: es })}</span></>
                                            ) : (
                                                <span className="text-gray-500 ml-1">— selecciona la fecha fin</span>
                                            )}
                                        </p>
                                    )}
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

                                        // -----------------------------------------------------------------
                                        // LEGACY DEBT CALCULATION
                                        // -----------------------------------------------------------------
                                         const effectiveIsLegacy = res.is_legacy || !!res.legacy_debt_start_date;
                                         if (effectiveIsLegacy && res.legacy_debt_start_date) {
                                             const debtStart = new Date(res.legacy_debt_start_date);
                                             debtStart.setHours(0, 0, 0, 0);
 
                                             // Only calculate if the simulation End Date is after the Debt Start Date
                                             if (end > debtStart) {
                                                 const calculationEnd = res.legacy_debt_end_date && new Date(res.legacy_debt_end_date) < end 
                                                     ? new Date(res.legacy_debt_end_date) 
                                                     : end;
                                                 
                                                 const diffTime = calculationEnd.getTime() - debtStart.getTime();
                                                 const lateDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
 
                                                 if (lateDays > 0) {
                                                     const totalPrice = res.lot.price_total_clp || 0;
                                                     const lotAreaM2 = res.lot.area_m2 || 200;
                                                     const dailyInterest = calculateDailyInterest(totalPrice, lotAreaM2);
                                                     totalInterestAccrued += dailyInterest * lateDays;
                                                     lateInstallmentsCount++;
                                                 }
                                             }
                                             return; 
                                         }

                                        // -----------------------------------------------------------------
                                        // STANDARD DIGITAL PURCHASE CALCULATION
                                        // -----------------------------------------------------------------
                                        for (let i = paidCuotas + 1; i <= totalCuotas; i++) {
                                            // Calculate Due Date
                                            const customStart = res.legacy_installment_start_date ? new Date(res.legacy_installment_start_date) : null;
                                            const customDueDay = customStart ? customStart.getDate() : null;
                                            const acquisitionDate = customStart ? customStart.toISOString() : (res.created_at as any);
                                            const dueDate = getInstallmentDueDate(acquisitionDate, i, Boolean(res.is_legacy), customDueDay, Boolean(res.is_promo));
                                            
                                            // Grace Period
                                            const graceEnd = new Date(dueDate);
                                            graceEnd.setDate(dueDate.getDate() + 5);
                                            graceEnd.setHours(23, 59, 59, 999);
                                            const isLate = new Date() > graceEnd;

                                            const totalPrice = res.lot.price_total_clp || 0;
                                            const lotAreaM2 = res.lot.area_m2 || 200;

                                            // Usage: calculateTotalInterest(totalPrice, area, dueDate, isLegacy, comparisonDate)
                                            const interestForThisInstallment = calculateTotalInterest(
                                                totalPrice,
                                                lotAreaM2,
                                                dueDate,
                                                Boolean(res.is_legacy),
                                                end
                                            );

                                            if (interestForThisInstallment > 0) {
                                                totalInterestAccrued += interestForThisInstallment;
                                                lateInstallmentsCount++;
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

            <Tabs defaultValue="plots" className="w-full">
                <TabsList className="mb-6 bg-white/5 border border-white/10 p-1">
                    <TabsTrigger value="plots" className="data-[state=active]:bg-[#36595F] data-[state=active]:text-white">
                        Gestión de Terrenos
                    </TabsTrigger>
                    <TabsTrigger value="documents" className="data-[state=active]:bg-[#36595F] data-[state=active]:text-white">
                        Documentos del Usuario
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="plots">
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
                                                    <div className="flex items-center gap-2">
                                                        <CardTitle>Lote {res.lot.number}</CardTitle>
                                                        {!isUserView && res.is_promo && (
                                                            <span className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/50 px-2 py-0.5 rounded-full text-[10px] font-black tracking-widest uppercase shadow-[0_0_10px_rgba(234,179,8,0.2)]">
                                                                Promoción
                                                            </span>
                                                        )}
                                                    </div>
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

                                            {/* Legacy Offline Indicator */}
                                            {res.is_legacy && (
                                                <div className="flex flex-col gap-1 mt-2">
                                                    <div className="text-xs bg-indigo-900/40 text-indigo-300 border border-indigo-500/30 px-2 py-1.5 rounded flex items-center gap-2">
                                                        <span>📁 Venta Offline</span>
                                                        <span className="font-bold opacity-70 ml-auto">
                                                            (Cuotas pagadas: {res.installments_paid} de {res.lot.cuotas})
                                                        </span>
                                                    </div>

                                                    {res.legacy_debt_start_date && (
                                                        <div className="text-[10px] bg-red-900/30 text-red-400 px-2 py-1 rounded border border-red-900/50">
                                                            ⚠️ Cliente traspasado con deuda: {new Date(res.legacy_debt_start_date).toLocaleDateString('es-CL')}
                                                            {res.legacy_debt_end_date && ` hasta ${new Date(res.legacy_debt_end_date).toLocaleDateString('es-CL')}`}
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {!isUserView && (
                                                <div className="pt-2">
                                                    <ContractUploadAction
                                                        reservationId={res.id}
                                                        reservationName={res.buyer?.name || "Cliente"}
                                                        label={res.is_legacy ? "Subir Documento Físico (PDF)" : "Subir Documento Adicional (PDF)"}
                                                        type="legacy"
                                                        onUploadComplete={() => {
                                                            toast.success("Documento subido correctamente.");
                                                            window.location.reload();
                                                        }}
                                                    />
                                                    {res.legacy_uploaded_contracts && JSON.parse(res.legacy_uploaded_contracts).length > 0 && (
                                                        <div className="mt-2 text-xs text-gray-400">
                                                            📄 {JSON.parse(res.legacy_uploaded_contracts).length} documento(s) subido(s).
                                                        </div>
                                                    )}

                                                    <div className="flex gap-2 mt-3 pt-3 border-t border-white/10">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="w-full text-xs bg-black/20 text-gray-300 border-white/20 hover:bg-white/10"
                                                            onClick={() => {
                                                                setEditingReservation(res);
                                                                setIsEditModalOpen(true);
                                                            }}
                                                        >
                                                            ✏️ Editar
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="w-full text-xs bg-red-900/20 text-red-400 border-red-500/30 hover:bg-red-900/50 hover:text-red-300"
                                                            onClick={() => handleDeleteLegacyOwner(res.id)}
                                                        >
                                                            🗑️ Eliminar
                                                        </Button>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="space-y-3 pt-2 mt-auto">
                                                {res.is_legacy ? null : res.signed_at ? (
                                                    <a
                                                        href={`/api/contracts/${res.id}/pdf`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="w-full py-2 px-4 bg-green-900/30 text-green-400 border border-green-500/30 rounded text-center text-sm font-bold flex items-center justify-center gap-2 hover:bg-green-900/50 transition-colors cursor-pointer"
                                                    >
                                                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                                        Firmado Digitalmente (Ver)
                                                    </a>
                                                ) : isUserView ? (
                                                    <SignContractModal
                                                        reservationId={res.id}
                                                        lotNumber={res.lot.number}
                                                        lotStage={res.lot.stage}
                                                        onSuccess={() => {
                                                            // Optional: Refresh data without full reload to keep view mode?
                                                            // For now, simpler to just let it be.
                                                            window.location.reload();
                                                        }}
                                                    />
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

                                                {!isUserView && res.is_legacy && !res.workflow_activated && (
                                                    <Button
                                                        onClick={() => handleTriggerWorkflow(res.id)}
                                                        disabled={isTriggering === res.id}
                                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 mt-2 gap-2"
                                                    >
                                                        {isTriggering === res.id ? (
                                                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                                        ) : "🚀"}
                                                        Activar Workflow y Accesos
                                                    </Button>
                                                )}

                                                <PaymentButtons
                                                    reservationId={res.id}
                                                    lot={res.lot}
                                                    reservation={{
                                                        pie_status: res.pie_status,
                                                        installments_paid: res.installments_paid,
                                                        is_legacy: res.is_legacy,
                                                        is_promo: res.is_promo,
                                                        legacy_debt_start_date: res.legacy_debt_start_date,
                                                        legacy_debt_end_date: res.legacy_debt_end_date,
                                                        legacy_installment_start_date: res.legacy_installment_start_date,
                                                        legacy_installment_ranges: res.legacy_installment_ranges,
                                                        receipts: res.receipts
                                                    }}
                                                    acquisitionDate={res.created_at}
                                                    isAdminView={!isUserView}
                                                    simulatedDate={simulatedDate}
                                                    comparisonDate={comparisonDate}
                                                />

                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </section>
                </TabsContent>

                <TabsContent value="documents">
                    <UserDocumentsList reservations={reservations} />
                </TabsContent>
            </Tabs>

            {/* Edit Modal Injection */}
            {editingReservation && (
                <AssignOwnerModal
                    lotId={editingReservation.lot.id}
                    lotNumber={editingReservation.lot.number}
                    open={isEditModalOpen}
                    onOpenChange={setIsEditModalOpen}
                    onSuccess={() => {
                        setIsEditModalOpen(false);
                        window.location.reload();
                    }}
                    existingReservation={editingReservation}
                />
            )}
        </div>
    );
}
