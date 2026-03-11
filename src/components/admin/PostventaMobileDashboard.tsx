'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, CheckCircle, XCircle, Eye, MapPin, CreditCard, Clock, Receipt, BookOpen, AlertTriangle } from 'lucide-react';
import { approvePaymentReceipt, rejectPaymentReceipt } from '@/actions/receipts';
import { toast } from 'sonner';
import { MoraExplainerCard } from './MoraExplainerCard';
import { ContractUploadAction } from "@/components/admin/ContractUploadAction";
import { AdminMoraManager } from "@/components/admin/AdminMoraManager"

export type PostventaTab = 'recibos' | 'mora' | 'ledger' | 'alertas';

interface SoldLot {
    id: number;
    number: string | null;
    stage: number | null;
    area_m2: number | null;
    price_total_clp: number | null;
}

interface PostventaMobileDashboardProps {
    initialReceipts: any[];
    soldLots: SoldLot[];
    activeTab: PostventaTab;
    ledger?: any[];
    debtAlerts?: any[];
    users?: any[];
}

export function PostventaMobileDashboard({ initialReceipts, soldLots, activeTab, ledger = [], debtAlerts = [], users = [] }: PostventaMobileDashboardProps) {
    const [receipts, setReceipts] = useState(initialReceipts);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [rejectingId, setRejectingId] = useState<string | null>(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [isProcessing, setIsProcessing] = useState<string | null>(null);
    const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING');

    const [ledgerPage, setLedgerPage] = useState(1);
    const [ledgerStage, setLedgerStage] = useState<'ALL' | 1 | 2 | 3 | 4>('ALL');
    const [selectedClientLedger, setSelectedClientLedger] = useState<any | null>(null);
    const ledgerItemsPerPage = 10;

    const [alertFilter, setAlertFilter] = useState<'ALL' | 'UPCOMING' | 'GRACE' | 'LATE' | 'OK'>('ALL');
    const [alertStage, setAlertStage] = useState<'ALL' | 1 | 2 | 3 | 4>('ALL');
    const [alertPage, setAlertPage] = useState(1);
    const alertsPerPage = 10;

    const today = new Date();

    const pendingCount = receipts.filter(r => r.status === 'PENDING').length;

    const filteredReceipts = filter === 'ALL'
        ? receipts
        : receipts.filter(r => r.status === filter);

    const handleApprove = async (id: string) => {
        setIsProcessing(id);
        try {
            await approvePaymentReceipt(id);
            setReceipts(prev => prev.map(r => r.id === id ? { ...r, status: 'APPROVED' } : r));
            toast.success('Pago verificado y aprobado.');
        } catch (error) {
            toast.error('Error al aprobar el pago');
        } finally {
            setIsProcessing(null);
        }
    };

    const handleReject = async (id: string) => {
        if (!rejectionReason.trim()) {
            toast.error('Debes indicar un motivo de rechazo');
            return;
        }
        setIsProcessing(id);
        try {
            await rejectPaymentReceipt(id, rejectionReason);
            setReceipts(prev => prev.map(r => r.id === id ? { ...r, status: 'REJECTED', rejection_reason: rejectionReason } : r));
            setRejectingId(null);
            setRejectionReason('');
            toast.success('Transferencia rechazada.');
        } catch (error) {
            toast.error('Error al rechazar el pago');
        } finally {
            setIsProcessing(null);
        }
    };

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(amount);

    const getStatusBadge = (status: string) => {
        if (status === 'PENDING') return <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-[10px]">Pendiente</Badge>;
        if (status === 'APPROVED') return <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-[10px]">Aprobado</Badge>;
        if (status === 'REJECTED') return <Badge variant="destructive" className="text-[10px]">Rechazado</Badge>;
        return null;
    };

    if (activeTab === 'ledger') {
        const filteredLedger = ledger.filter(client => ledgerStage === 'ALL' || client.lotStage === ledgerStage);
        const totalLedgerPages = Math.ceil(filteredLedger.length / ledgerItemsPerPage);
        const paginatedLedger = filteredLedger.slice((ledgerPage - 1) * ledgerItemsPerPage, ledgerPage * ledgerItemsPerPage);

        return (
            <div className="space-y-4 pb-24">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-indigo-400" />
                        <h2 className="text-lg font-bold text-white">Estado de Cuentas</h2>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {(['ALL', 1, 2, 3, 4] as const).map(s => (
                            <button
                                key={s}
                                onClick={() => { setLedgerStage(s as any); setLedgerPage(1); }}
                                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all border shrink-0 cursor-pointer ${ledgerStage === s
                                    ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30'
                                    : 'bg-white/5 text-gray-500 border-white/5 hover:border-white/20'
                                    }`}
                            >
                                {s === 'ALL' ? 'Todas las Etapas' : `Etapa ${s}`}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 4xl:grid-cols-5 gap-5 mt-4">
                    {paginatedLedger.map(client => (
                        <div key={client.id} className="bg-[#1a1a1a]/40 backdrop-blur-xl border border-white/10 p-6 rounded-[2rem] space-y-5 relative overflow-hidden transition-all duration-500 hover:border-indigo-500/30 hover:scale-[1.02] active:scale-[0.98] shadow-2xl group">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-bl-full -z-10 group-hover:bg-indigo-500/10 transition-colors" />

                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-black text-white text-base tracking-tight">{client.clientName}</p>
                                    <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest mt-0.5">Lote T-{client.lotNumber}</p>
                                </div>
                                <div className="text-right">
                                    <Button variant="outline" size="sm" onClick={() => setSelectedClientLedger(client)} className="text-[10px] h-8 font-black uppercase tracking-tight bg-indigo-500/10 text-indigo-400 border-indigo-500/20 hover:bg-indigo-500/30 hover:text-indigo-200 cursor-pointer">
                                        <Eye className="w-3.5 h-3.5 mr-1.5" />
                                        Detalles
                                    </Button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-black/40 p-3 rounded-xl border border-white/5">
                                    <p className="text-gray-500 mb-1 text-[9px] font-black uppercase tracking-widest leading-none">Total Pagado</p>
                                    <p className="font-black text-white text-sm">{formatCurrency(client.totalPaid)}</p>
                                </div>
                                <div className="bg-black/40 p-3 rounded-xl border border-white/5">
                                    <p className="text-gray-500 mb-1 text-[9px] font-black uppercase tracking-widest leading-none">Progreso</p>
                                    <p className="font-black text-white text-sm">{client.paidCuotas} / {client.totalCuotas || 0}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                    {ledger.length === 0 && (
                        <div className="col-span-full text-center py-16 bg-white/5 border border-dashed border-white/10 rounded-2xl">
                            <BookOpen className="w-10 h-10 text-gray-700 mx-auto mb-3" />
                            <p className="text-gray-500 font-bold">No hay cuentas activas</p>
                        </div>
                    )}
                </div>

                {totalLedgerPages > 1 && (
                    <div className="flex justify-between items-center bg-black/40 border border-white/10 rounded-xl p-3 mt-6">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setLedgerPage(p => Math.max(1, p - 1))}
                            disabled={ledgerPage === 1}
                            className="bg-white/5 border-white/10 text-white hover:bg-white/10"
                        >
                            Anterior
                        </Button>
                        <span className="text-xs text-gray-400 font-medium">Página {ledgerPage} de {totalLedgerPages}</span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setLedgerPage(p => Math.min(totalLedgerPages, p + 1))}
                            disabled={ledgerPage === totalLedgerPages}
                            className="bg-white/5 border-white/10 text-white hover:bg-white/10"
                        >
                            Siguiente
                        </Button>
                    </div>
                )}

                {/* Modal for Client Ledger details */}
                <Dialog open={!!selectedClientLedger} onOpenChange={(open) => !open && setSelectedClientLedger(null)}>
                    <DialogContent className="max-w-[90vw] md:max-w-md bg-gray-900 border-white/10">
                        <DialogHeader>
                            <DialogTitle className="text-indigo-400">Detalle: {selectedClientLedger?.clientName}</DialogTitle>
                        </DialogHeader>
                        {selectedClientLedger && (
                            <div className="space-y-4 py-2">
                                <div className="bg-black/40 rounded-xl p-4 border border-white/5 space-y-2">
                                    <p className="text-sm font-semibold border-b border-white/10 pb-2 mb-2 text-white">Resumen General</p>
                                    <div className="flex justify-between text-xs">
                                        <span className="text-gray-400">Terreno:</span>
                                        <span className="font-bold text-white">Lote {selectedClientLedger.lotNumber}</span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                        <span className="text-gray-400">Total a Pagar:</span>
                                        <span className="font-bold text-white">{formatCurrency(selectedClientLedger.totalToPay)}</span>
                                    </div>
                                    <div className="flex justify-between text-xs text-green-400 mt-2">
                                        <span>Total Pagado:</span>
                                        <span className="font-bold">{formatCurrency(selectedClientLedger.totalPaid)}</span>
                                    </div>
                                </div>

                                <div className="bg-black/40 rounded-xl p-4 border border-white/5 space-y-2">
                                    <p className="text-sm font-semibold border-b border-white/10 pb-2 mb-2 text-white">Desglose de lo Pagado</p>
                                    <div className="flex justify-between text-xs">
                                        <span className="text-gray-400">Por Reserva:</span>
                                        <span className="font-medium text-white">{formatCurrency(selectedClientLedger.reservaAmount || 0)}</span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                        <span className="text-gray-400">Por Pie:</span>
                                        <span className="font-medium text-white">{formatCurrency(selectedClientLedger.pieAmount || 0)}</span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                        <span className="text-gray-400">Por Cuotas (Gral):</span>
                                        <span className="font-medium text-white">{formatCurrency(selectedClientLedger.cuotasAmount || 0)}</span>
                                    </div>
                                </div>

                                <div className="bg-black/40 rounded-xl p-4 border border-white/5 space-y-2">
                                    <p className="text-sm font-semibold border-b border-white/10 pb-2 mb-2 text-white">Progreso</p>
                                    <div className="flex justify-between text-xs">
                                        <span className="text-gray-400">Pie Pagado:</span>
                                        <span className="font-medium text-white">{selectedClientLedger.pieStatus === 'PAID' ? 'Sí' : 'No'}</span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                        <span className="text-gray-400">Cuota del Mes:</span>
                                        <span className="font-medium text-white">
                                            {selectedClientLedger.paidCuotas < (selectedClientLedger.totalCuotas || 0) ? selectedClientLedger.paidCuotas + 1 : selectedClientLedger.paidCuotas} de {selectedClientLedger.totalCuotas || 0}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-xs mt-2">
                                        <span className="text-gray-400">Suma Pagada (Cuotas):</span>
                                        <span className="font-bold text-green-400">{formatCurrency(selectedClientLedger.cuotasAmount || 0)}</span>
                                    </div>
                                    <div className="flex justify-between text-xs mt-2">
                                        <span className="text-gray-400">Próximo Vencimiento:</span>
                                        <span className="font-medium text-yellow-400">{selectedClientLedger.nextDueDate ? format(new Date(selectedClientLedger.nextDueDate), 'dd MMM yyyy', { locale: es }) : 'N/A'}</span>
                                    </div>
                                </div>

                                <div className="bg-black/40 rounded-xl p-4 border border-white/5 space-y-3">
                                    <p className="text-sm font-semibold border-b border-white/10 pb-2 mb-2 text-white">Documentos Legales</p>
                                    
                                    {selectedClientLedger.uploaded_contract_url ? (
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="text-green-400 font-medium flex items-center gap-1.5"><CheckCircle className="w-4 h-4" /> Promesa Subida</span>
                                                <a href={selectedClientLedger.uploaded_contract_url} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 underline font-semibold">Ver Documento</a>
                                            </div>
                                            <p className="text-[10px] text-gray-400 leading-tight">La promesa de compraventa ya fue subida y está disponible para el cliente.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            <p className="text-[10px] text-gray-400 leading-tight block mb-2">Aún no se ha subido la promesa de compraventa. Sube el documento firmado en formato PDF para que el cliente lo vea en su portal.</p>
                                            <ContractUploadAction 
                                                reservationId={selectedClientLedger.id} 
                                                reservationName={selectedClientLedger.clientName} 
                                                onUploadComplete={() => {
                                                    toast.success("Promesa subida correctamente. Actualiza la pestaña para verla en el historial.");
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                        <div className="flex justify-end pt-2">
                            <Button variant="outline" onClick={() => setSelectedClientLedger(null)} className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                                Cerrar
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        );
    }

    if (activeTab === 'alertas') {
        const filteredAlerts = debtAlerts.filter(alert => {
            const isFrozen = Boolean(alert.mora_frozen);
            const matchesStage = alertStage === 'ALL' || alert.lotStage === alertStage;
            const matchesStatus = alertFilter === 'ALL' ||
                (alertFilter === 'UPCOMING' && alert.isUpcoming && !isFrozen) ||
                (alertFilter === 'GRACE' && alert.isGracePeriod && !isFrozen) ||
                (alertFilter === 'LATE' && alert.isLate && !isFrozen) ||
                (alertFilter === 'OK' && (alert.isUpToDate || isFrozen));
            return matchesStage && matchesStatus;
        });

        const totalAlertPages = Math.ceil(filteredAlerts.length / alertsPerPage);
        const paginatedAlerts = filteredAlerts.slice((alertPage - 1) * alertsPerPage, alertPage * alertsPerPage);

        const stats = {
            total: debtAlerts.length,
            late: debtAlerts.filter(a => a.isLate).length,
            grace: debtAlerts.filter(a => a.isGracePeriod).length,
            upcoming: debtAlerts.filter(a => a.isUpcoming).length,
            ok: debtAlerts.filter(a => a.isUpToDate).length
        };

        return (
            <div className="space-y-6 pb-24">
                {/* Dashboard Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <div className="bg-red-500/20 p-2 rounded-lg">
                                <AlertTriangle className="w-5 h-5 text-red-500" />
                            </div>
                            <h2 className="text-2xl font-black text-white tracking-tight">Gestión de Clientes</h2>
                        </div>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-[0.2em] ml-11">
                            {format(today, "EEEE d 'de' MMMM 'de' yyyy", { locale: es })}
                        </p>
                    </div>

                    {/* Actions and Badges */}
                    <div className="flex items-center gap-3 self-start md:self-end">
                        <Badge variant="outline" className="md:hidden font-bold bg-white/5 border-white/10 text-white px-3 py-1">
                            {filteredAlerts.length} Clientes Filtrados
                        </Badge>
                        <AdminMoraManager users={users} />
                    </div>
                </div>

                <div className="lg:grid lg:grid-cols-[280px_1fr] lg:gap-8 items-start">
                    {/* Sidebar / Filters Panel */}
                    <aside className="space-y-6 lg:sticky lg:top-4 z-20">
                        {/* Summary Stats Card (Desktop Only) */}
                        <div className="hidden lg:block bg-[#1a1a1a]/60 backdrop-blur-xl border border-white/10 rounded-2xl p-5 space-y-4 shadow-2xl">
                            <div className="flex items-center justify-between">
                                <h3 className="text-white font-bold text-xs uppercase tracking-wider opacity-60">Panorama General</h3>
                                <Badge className="bg-white/10 text-[10px]">{stats.total}</Badge>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mt-2">
                                <div className="bg-red-500/5 border border-red-500/10 p-3 rounded-xl transition-colors hover:bg-red-500/10">
                                    <p className="text-red-500 text-[9px] font-black uppercase tracking-tighter mb-1">Mora</p>
                                    <p className="text-white text-xl font-black">{stats.late}</p>
                                </div>
                                <div className="bg-amber-500/5 border border-amber-500/10 p-3 rounded-xl transition-colors hover:bg-amber-500/10">
                                    <p className="text-amber-500 text-[9px] font-black uppercase tracking-tighter mb-1">Gracia</p>
                                    <p className="text-white text-xl font-black">{stats.grace}</p>
                                </div>
                                <div className="bg-blue-500/5 border border-blue-500/10 p-3 rounded-xl transition-colors hover:bg-blue-500/10">
                                    <p className="text-blue-500 text-[9px] font-black uppercase tracking-tighter mb-1">Próximo</p>
                                    <p className="text-white text-xl font-black">{stats.upcoming}</p>
                                </div>
                                <div className="bg-green-500/5 border border-green-500/10 p-3 rounded-xl transition-colors hover:bg-green-500/10">
                                    <p className="text-green-500 text-[9px] font-black uppercase tracking-tighter mb-1">Al Día</p>
                                    <p className="text-white text-xl font-black">{stats.ok}</p>
                                </div>
                            </div>
                        </div>

                        {/* Filter Sections */}
                        <div className="space-y-6 bg-[#1a1a1a]/40 lg:bg-transparent p-4 lg:p-0 rounded-2xl border border-white/5 lg:border-none backdrop-blur-md lg:backdrop-blur-none transition-all">
                            {/* Filter: Status */}
                            <div className="space-y-3">
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">Estado de Pago</p>
                                <div className="flex flex-wrap lg:flex-col gap-2">
                                    {(['ALL', 'LATE', 'GRACE', 'UPCOMING', 'OK'] as const).map(f => (
                                        <button
                                            key={f}
                                            onClick={() => { setAlertFilter(f); setAlertPage(1); }}
                                            className={`px-4 py-2.5 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all border flex items-center gap-2 flex-grow lg:flex-grow-0 cursor-pointer ${alertFilter === f
                                                ? 'bg-[#36595F] text-white border-[#36595F] shadow-lg shadow-[#36595F]/20 translate-x-1'
                                                : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:border-white/20'
                                                }`}
                                        >
                                            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{
                                                backgroundColor: f === 'LATE' ? '#ef4444' : f === 'GRACE' ? '#f59e0b' : f === 'UPCOMING' ? '#3b82f6' : f === 'OK' ? '#22c55e' : 'white',
                                                visibility: f === 'ALL' ? 'hidden' : 'visible'
                                            }} />
                                            {f === 'ALL' ? 'Todos los Clientes' : f === 'LATE' ? 'En Mora' : f === 'GRACE' ? 'Periodo Gracia' : f === 'UPCOMING' ? 'Próximos Venc' : 'Al Día'}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Filter: Stage */}
                            <div className="space-y-3">
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">Filtrar por Etapa</p>
                                <div className="flex flex-wrap gap-2">
                                    {(['ALL', 1, 2, 3, 4] as const).map(s => (
                                        <button
                                            key={s}
                                            onClick={() => { setAlertStage(s as any); setAlertPage(1); }}
                                            className={`px-4 py-2.5 rounded-xl text-[11px] font-bold transition-all border shrink-0 cursor-pointer ${alertStage === s
                                                ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30'
                                                : 'bg-white/5 text-gray-500 border-white/5 hover:border-white/20'
                                                }`}
                                        >
                                            {s === 'ALL' ? 'Todas' : `Etapa ${s}`}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content Area */}
                    <main className="space-y-6">
                        {/* Summary Row (Mobile Only) */}
                        <div className="lg:hidden flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                            <div className="bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-lg shrink-0">
                                <span className="text-red-400 font-bold text-xs uppercase mr-2">Mora:</span>
                                <span className="text-white font-black text-sm">{stats.late}</span>
                            </div>
                            <div className="bg-amber-500/10 border border-amber-500/20 px-4 py-2 rounded-lg shrink-0">
                                <span className="text-amber-400 font-bold text-xs uppercase mr-2">Gracia:</span>
                                <span className="text-white font-black text-sm">{stats.grace}</span>
                            </div>
                            <div className="bg-blue-500/10 border border-blue-500/20 px-4 py-2 rounded-lg shrink-0">
                                <span className="text-blue-400 font-bold text-xs uppercase mr-2">Próximo:</span>
                                <span className="text-white font-black text-sm">{stats.upcoming}</span>
                            </div>
                        </div>

                        {/* Alerts Cards Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 4xl:grid-cols-5 gap-5">
                            {paginatedAlerts.map(alert => {
                                const isGrace = alert.isGracePeriod && !alert.isMoraFrozen;
                                const isUpcoming = alert.isUpcoming && !alert.isMoraFrozen;
                                const isLate = alert.isLate && !alert.isMoraFrozen;
                                const isOK = alert.isUpToDate || alert.isMoraFrozen;

                                let colorClass = 'bg-red-500/5 hover:bg-red-500/10 border-red-500/20 group';
                                let accentClass = 'text-red-400';
                                let circleClass = 'bg-red-500/10';
                                let badgeLabel = 'Atrasado';
                                let statusText = `${alert.lateDays} días de mora`;

                                if (isOK) {
                                    colorClass = 'bg-green-500/5 hover:bg-green-500/10 border-green-500/20 group';
                                    accentClass = 'text-green-400';
                                    circleClass = 'bg-green-500/10';
                                    badgeLabel = 'Al Día';
                                    statusText = 'Pagos correctos';
                                } else if (isUpcoming) {
                                    colorClass = 'bg-blue-500/5 hover:bg-blue-500/10 border-blue-500/20 group';
                                    accentClass = 'text-blue-400';
                                    circleClass = 'bg-blue-500/10';
                                    badgeLabel = 'Próximo';
                                    statusText = 'Vencimiento cercano';
                                } else if (isGrace) {
                                    colorClass = 'bg-amber-500/5 hover:bg-amber-500/10 border-amber-500/20 group';
                                    accentClass = 'text-amber-400';
                                    circleClass = 'bg-amber-500/10';
                                    badgeLabel = 'Periodo Gracia';
                                    statusText = 'Pendiente (Sin multa)';
                                }

                                return (
                                    <div key={alert.id} className={`${colorClass} p-6 rounded-[2rem] border backdrop-blur-xl transition-all duration-500 hover:scale-[1.02] active:scale-[0.98] flex flex-col justify-between relative overflow-hidden shadow-2xl group`}>
                                        <div className={`absolute top-0 right-0 w-32 h-32 ${circleClass} rounded-bl-full -z-10 opacity-40 transition-transform group-hover:scale-110`} />

                                        <div className="space-y-4">
                                            <div className="flex justify-between items-start">
                                                <div className="min-w-0 pr-2">
                                                    <p className="font-black text-white text-base truncate tracking-tight">{alert.clientName}</p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-gray-300 uppercase`}>T-{alert.lotNumber}</span>
                                                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-gray-300 uppercase`}>Etapa {alert.lotStage}</span>
                                                    </div>
                                                </div>
                                                <Badge className={`bg-black/50 ${accentClass} border-${accentClass.split('-')[1]}-500/30 text-[9px] font-black uppercase tracking-wider px-2 py-1`}>
                                                    {badgeLabel}
                                                </Badge>
                                            </div>

                                            <p className={`text-[11px] ${accentClass} font-bold uppercase tracking-widest mt-2`}>
                                                {statusText}
                                            </p>

                                            <div className={`grid grid-cols-2 gap-3 bg-black/40 rounded-xl p-4 border border-white/5`}>
                                                <div className="space-y-1">
                                                    <p className="text-[9px] text-gray-500 uppercase font-black tracking-widest">
                                                        {isUpcoming ? 'Próximo' : isGrace ? 'Por Pagar' : isOK ? 'Invertido' : 'Interest'}
                                                    </p>
                                                    <p className={`font-black ${accentClass} text-sm leading-tight`}>
                                                        {isOK
                                                            ? formatCurrency(alert.cuotasAmount)
                                                            : isUpcoming || isGrace
                                                                ? formatCurrency(alert.monto_cuota || 0)
                                                                : formatCurrency(alert.penaltyAmount)
                                                        }
                                                    </p>
                                                </div>
                                                <div className="text-right space-y-1">
                                                    <p className="text-[9px] text-gray-500 uppercase font-black tracking-widest">
                                                        {isOK ? 'Progreso' : isUpcoming ? 'Vence' : 'Fecha'}
                                                    </p>
                                                    <p className="font-black text-white text-sm leading-tight">
                                                        {isOK
                                                            ? `${alert.paidCuotas} / ${alert.totalCuotas}`
                                                            : alert.displayDueDate ? format(new Date(alert.displayDueDate), 'dd MMM yy', { locale: es }) : 'N/A'
                                                        }
                                                    </p>
                                                </div>

                                                {isOK && (
                                                    <div className="col-span-2 mt-1 pt-3 border-t border-white/5 flex justify-between items-center">
                                                        <div className="flex flex-col">
                                                            <p className="text-[8px] text-gray-400 uppercase font-black tracking-tighter">Próxima</p>
                                                            <p className="text-[10px] font-black text-green-400">Cuota #{alert.paidCuotas + 1}</p>
                                                        </div>
                                                        <div className="flex flex-col text-right">
                                                            <p className="text-[8px] text-gray-400 uppercase font-black tracking-tighter">Mes</p>
                                                            <p className="text-[10px] font-black text-white truncate">
                                                                {alert.displayDueDate ? format(new Date(alert.displayDueDate), 'MMMM', { locale: es }).toUpperCase() : 'N/A'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {filteredAlerts.length === 0 && (
                            <div className="text-center py-16 bg-white/5 border border-dashed border-white/10 rounded-3xl">
                                <CheckCircle className="w-12 h-12 text-green-500/40 mx-auto mb-4" />
                                <p className="text-gray-400 font-bold text-lg">No hay clientes aquí</p>
                                <p className="text-gray-600 text-sm mt-1 uppercase tracking-widest font-medium">Búsqueda impecable</p>
                            </div>
                        )}

                        {/* Pagination */}
                        {totalAlertPages > 1 && (
                            <div className="flex justify-between items-center bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-4 mt-8">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => { setAlertPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                    disabled={alertPage === 1}
                                    className="h-9 px-4 text-[11px] font-black uppercase bg-white/5 border-white/10 text-white hover:bg-white/10 transition-all cursor-pointer"
                                >
                                    Anterior
                                </Button>
                                <div className="flex flex-col items-center">
                                    <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Página</span>
                                    <span className="text-sm text-white font-black">{alertPage} <span className="text-gray-600 text-xs">de {totalAlertPages}</span></span>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => { setAlertPage(p => Math.min(totalAlertPages, p + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                    disabled={alertPage === totalAlertPages}
                                    className="h-9 px-4 text-[11px] font-black uppercase bg-white/5 border-white/10 text-white hover:bg-white/10 transition-all cursor-pointer"
                                >
                                    Siguiente
                                </Button>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        );
    }

    if (activeTab === 'mora') {
        return (
            <div className="space-y-4 pb-24">
                <MoraExplainerCard soldLots={soldLots} />
            </div>
        );
    }

    // Receipts view
    return (
        <div className="space-y-4 pb-24">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Receipt className="w-5 h-5 text-alimin-gold" />
                    <h2 className="text-lg font-bold text-white">Recibos</h2>
                    {pendingCount > 0 && (
                        <Badge variant="destructive" className="text-[10px] font-bold animate-pulse">
                            {pendingCount}
                        </Badge>
                    )}
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
                {(['PENDING', 'ALL', 'APPROVED', 'REJECTED'] as const).map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${filter === f
                            ? 'bg-[#36595F] text-white'
                            : 'bg-white/5 text-gray-400 hover:bg-white/10'
                            }`}
                    >
                        {f === 'PENDING' ? `Pendientes (${pendingCount})` : f === 'ALL' ? 'Todos' : f === 'APPROVED' ? 'Aprobados' : 'Rechazados'}
                    </button>
                ))}
            </div>

            {/* Receipt Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 4xl:grid-cols-5 gap-5">
                {filteredReceipts.map(receipt => (
                    <div
                        key={receipt.id}
                        className={`rounded-[2rem] border p-6 space-y-5 backdrop-blur-xl transition-all duration-500 hover:scale-[1.02] active:scale-[0.98] flex flex-col justify-between shadow-2xl group ${receipt.status === 'PENDING'
                            ? 'bg-yellow-500/5 border-yellow-500/20'
                            : receipt.status === 'APPROVED'
                                ? 'bg-green-500/5 border-green-500/20'
                                : receipt.status === 'REJECTED'
                                    ? 'bg-red-500/5 border-red-500/20'
                                    : 'bg-white/5 border-white/10'
                            }`}
                    >
                        {/* Client + Status */}
                        <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                                <p className="font-black text-white text-base truncate tracking-tight">
                                    {receipt.reservation?.buyer?.name || 'Sin nombre'}
                                </p>
                                <p className="text-[11px] text-gray-500 truncate font-medium">
                                    {receipt.reservation?.buyer?.email}
                                </p>
                            </div>
                            <div className="shrink-0">
                                {getStatusBadge(receipt.status)}
                            </div>
                        </div>

                        {/* Info Row - Improved styling */}
                        <div className="grid grid-cols-1 gap-2 border-t border-b border-white/5 py-4">
                            <div className="flex items-center justify-between">
                                <span className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                                    <MapPin className="w-3 h-3 text-indigo-400" />
                                    Ubicación
                                </span>
                                <span className="text-xs font-bold text-white uppercase">
                                    T-{receipt.reservation?.lot?.number} · E{receipt.reservation?.lot?.stage}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                                    <CreditCard className="w-3 h-3 text-indigo-400" />
                                    Concepto
                                </span>
                                <span className="text-xs font-bold text-white uppercase">
                                    {receipt.scope === 'PIE' ? 'Pago de Pie' : `${(receipt.installments_count || 1) > 1 ? (receipt.installments_count || 1) + ' Cuotas' : 'Cuota Mensual'}`}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                                    <Clock className="w-3 h-3 text-indigo-400" />
                                    Fecha
                                </span>
                                <span className="text-xs font-bold text-white uppercase">
                                    {format(new Date(receipt.created_at), 'dd MMM yy, HH:mm', { locale: es })}
                                </span>
                            </div>
                        </div>

                        {/* Amount - Premium highlight */}
                        <div className="flex items-center justify-between bg-black/40 rounded-xl px-4 py-3 border border-white/5">
                            <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Monto</span>
                            <span className="text-xl font-black text-white">{formatCurrency(receipt.amount_clp)}</span>
                        </div>

                        {/* Rejection Reason */}
                        {receipt.rejection_reason && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                                <p className="text-[11px] text-red-500 font-bold uppercase tracking-tight mb-1">Motivo de Rechazo</p>
                                <p className="text-xs text-red-100/70 font-medium italic">
                                    "{receipt.rejection_reason}"
                                </p>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-2 pt-2">
                            <button
                                onClick={() => setSelectedImage(receipt.receipt_url)}
                                className="flex items-center justify-center gap-1.5 flex-1 min-h-[44px] rounded-lg bg-white/10 text-white text-xs font-semibold hover:bg-white/20 transition-colors active:scale-[0.97]"
                            >
                                <Eye className="w-4 h-4" />
                                Ver
                            </button>

                            {receipt.status === 'PENDING' && (
                                <>
                                    <button
                                        onClick={() => handleApprove(receipt.id)}
                                        disabled={isProcessing === receipt.id}
                                        className="flex items-center justify-center gap-1.5 flex-1 min-h-[44px] rounded-lg bg-green-600 text-white text-xs font-semibold hover:bg-green-700 transition-colors active:scale-[0.97] disabled:opacity-50"
                                    >
                                        {isProcessing === receipt.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                                        Aprobar
                                    </button>
                                    <button
                                        onClick={() => setRejectingId(receipt.id)}
                                        disabled={isProcessing === receipt.id}
                                        className="flex items-center justify-center gap-1.5 flex-1 min-h-[44px] rounded-lg bg-red-600 text-white text-xs font-semibold hover:bg-red-700 transition-colors active:scale-[0.97] disabled:opacity-50"
                                    >
                                        <XCircle className="w-4 h-4" />
                                        Rechazar
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                ))}

                {filteredReceipts.length === 0 && (
                    <div className="p-8 text-center text-gray-500 text-sm">
                        {filter === 'PENDING' ? 'No hay comprobantes pendientes 🎉' : 'No hay comprobantes en esta categoría.'}
                    </div>
                )}
            </div>

            {/* Image Viewer */}
            <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
                <DialogContent className="max-w-[95vw] md:max-w-4xl p-0 overflow-hidden bg-black/5">
                    <DialogHeader className="p-4 bg-white border-b absolute top-0 w-full z-10 hidden">
                        <DialogTitle>Comprobante</DialogTitle>
                    </DialogHeader>
                    {selectedImage && (
                        <div className="w-full h-[70vh] flex items-center justify-center bg-gray-900 overflow-auto">
                            {selectedImage.startsWith('data:application/pdf') ? (
                                <iframe src={selectedImage} className="w-full h-full" />
                            ) : (
                                <img src={selectedImage} alt="Comprobante" className="max-w-full max-h-full object-contain" />
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Reject Dialog */}
            <Dialog open={!!rejectingId} onOpenChange={(open) => !open && setRejectingId(null)}>
                <DialogContent className="max-w-[90vw] md:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Rechazar Transferencia</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <label className="text-sm font-medium mb-2 block">Motivo del rechazo:</label>
                        <Textarea
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            placeholder="Ej: El monto no corresponde, imagen borrosa..."
                            rows={3}
                        />
                    </div>
                    <div className="flex flex-col-reverse sm:flex-row justify-end gap-2">
                        <Button variant="outline" onClick={() => setRejectingId(null)} className="min-h-[44px]">Cancelar</Button>
                        <Button variant="destructive" onClick={() => rejectingId && handleReject(rejectingId)} disabled={isProcessing === rejectingId} className="min-h-[44px]">
                            {isProcessing === rejectingId ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                            Confirmar Rechazo
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
