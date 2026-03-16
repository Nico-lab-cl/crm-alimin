'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { 
    Loader2, CheckCircle, XCircle, Eye, MapPin, CreditCard, Clock, Receipt, BookOpen, 
    AlertTriangle, Search, Filter, FileSignature, Gavel, Wallet, CalendarDays, ArrowRight, ShieldAlert, RefreshCw,
    FileText, Download, Trash2, Edit
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { approvePaymentReceipt, rejectPaymentReceipt } from '@/actions/receipts';
import { syncLegacyReceipts, getReservationReceipts } from '@/actions/postventa';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { UniversalDocumentViewer } from "@/components/shared/UniversalDocumentViewer";
import { MoraExplainerCard } from './MoraExplainerCard';
import { ContractUploadAction } from "@/components/admin/ContractUploadAction";
import { AdminMoraManager } from "@/components/admin/AdminMoraManager"
import { AssignOwnerModal } from "@/components/dashboard/AssignOwnerModal";
import { AdminLotList } from "@/components/dashboard/AdminLotList";

export type PostventaTab = 'recibos' | 'mora' | 'ledger' | 'alertas' | 'terrenos';

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
    onTabChange?: (tab: PostventaTab) => void;
    stats?: { total: number, late: number, grace: number, upcoming: number, ok: number };
    stage?: string | number;
    fullLots?: any[];
}

export function PostventaMobileDashboard({ 
    initialReceipts, 
    soldLots, 
    activeTab, 
    ledger = [], 
    debtAlerts = [], 
    users = [],
    onTabChange,
    stats = { total: 0, late: 0, grace: 0, upcoming: 0, ok: 0 },
    stage = 'ALL',
    fullLots = []
}: PostventaMobileDashboardProps) {
    const [receipts, setReceipts] = useState(initialReceipts);
    const [rejectingId, setRejectingId] = useState<string | null>(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [isProcessing, setIsProcessing] = useState<string | null>(null);
    const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING');

    const [ledgerPage, setLedgerPage] = useState(1);
    const [ledgerSearch, setLedgerSearch] = useState('');
    const [ledgerStage, setLedgerStage] = useState<number | 'ALL'>('ALL');
    const [ledgerStatus, setLedgerStatus] = useState<'ALL' | 'PAID' | 'PENDING'>('ALL');
    const [ledgerMonth, setLedgerMonth] = useState<number | 'ALL'>(new Date().getMonth());
    const [ledgerYear, setLedgerYear] = useState<number>(new Date().getFullYear());
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const LEDGER_ITEMS_PER_PAGE = 20;

    const [alertFilter, setAlertFilter] = useState<'ALL' | 'UPCOMING' | 'GRACE' | 'LATE' | 'OK'>('ALL');
    const [selectedClientLedger, setSelectedClientLedger] = useState<any | null>(null);
    const [showPaymentsModal, setShowPaymentsModal] = useState(false);
    const [viewerConfig, setViewerConfig] = useState<{ isOpen: boolean, url: string, name: string, category?: string }>({ 
        isOpen: false, 
        url: '', 
        name: '' 
    });

    const [alertStage, setAlertStage] = useState<number | 'ALL'>('ALL');
    const [alertSearch, setAlertSearch] = useState('');
    const [alertPage, setAlertPage] = useState(1);
    const [clientReceipts, setClientReceipts] = useState<any[]>([]);
    const [isLoadingReceipts, setIsLoadingReceipts] = useState(false);
    const ALERTS_PER_PAGE = 10;

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

    useEffect(() => {
        if (selectedClientLedger?.id) {
            setIsLoadingReceipts(true);
            setClientReceipts([]);
            getReservationReceipts(selectedClientLedger.id).then(res => {
                if (res.success) {
                    setClientReceipts(res.receipts || []);
                }
            }).finally(() => {
                setIsLoadingReceipts(false);
            });
        }
    }, [selectedClientLedger?.id]);

    const handleDeleteDocument = async (reservationId: string, type: string, url?: string) => {
        if (!confirm('¿Estás seguro de que deseas eliminar este documento?')) return;
        
        try {
            const res = await fetch(`/api/contracts/${reservationId}/upload`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type, url }),
            });

            if (!res.ok) throw new Error("Error al eliminar");
            
            toast.success("Documento eliminado correctamente");
            window.location.reload();
        } catch (error) {
            console.error(error);
            toast.error("No se pudo eliminar el documento");
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

    if (activeTab === 'terrenos') {
        return (
            <div className="space-y-4 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="bg-[#0a1622]/60 backdrop-blur-xl border border-[#3f6066]/20 p-4 md:p-6 rounded-[2rem] space-y-4 shadow-2xl relative overflow-hidden">
                    <div className="flex items-center gap-3">
                        <div className="bg-[#3f6066]/20 p-2.5 rounded-2xl border border-[#3f6066]/30">
                            <MapPin className="w-5 h-5 text-[#8eb2b8]" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-white tracking-tight uppercase">Gestión de Terrenos</h2>
                            <p className="text-[10px] text-[#3f6066] font-black uppercase tracking-widest">Vista para Postventa</p>
                        </div>
                    </div>
                </div>

                <div className="bg-black/40 backdrop-blur-md rounded-[2rem] p-6 border border-white/10 shadow-xl">
                    <AdminLotList lots={fullLots} />
                </div>
            </div>
        );
    }

    if (activeTab === 'ledger') {
        const filteredLedger = ledger.filter(client => {
            const matchesSearch = !ledgerSearch || 
                client.clientName?.toLowerCase().includes(ledgerSearch.toLowerCase()) ||
                client.lotNumber?.includes(ledgerSearch);
            
            const matchesStage = ledgerStage === 'ALL' || Number(client.lotStage) === Number(ledgerStage);
            
            let matchesMonth = true;
            if (ledgerMonth !== 'ALL') {
                const targetDate = new Date(ledgerYear, Number(ledgerMonth) + 1, 0); // Last day of selected month
                const isPaidAll = client.paidCuotas >= (client.totalCuotas || 1);
                
                // Professional logic: 
                // A client has "paid March" if their next payment is in April (or later)
                // OR if they have already paid all their installments.
                const nextDue = client.nextDueDate ? new Date(client.nextDueDate) : null;
                const matchesPaid = Boolean(isPaidAll || (nextDue && nextDue > targetDate));

                if (ledgerStatus === 'PAID') matchesMonth = matchesPaid;
                else if (ledgerStatus === 'PENDING') matchesMonth = !matchesPaid;
            }

            return matchesSearch && matchesStage && matchesMonth;
        });

        const totalLedgerPages = Math.ceil(filteredLedger.length / LEDGER_ITEMS_PER_PAGE);
        const paginatedLedger = filteredLedger.slice(
            (ledgerPage - 1) * LEDGER_ITEMS_PER_PAGE,
            ledgerPage * LEDGER_ITEMS_PER_PAGE
        );

        return (
            <div className="space-y-4 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Header & Controls - Premium Glassmorphism */}
                <div className="bg-[#0a1622]/60 backdrop-blur-xl border border-[#3f6066]/20 p-4 md:p-6 rounded-[2rem] space-y-4 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <BookOpen className="w-24 h-24 text-[#3f6066]" />
                    </div>
                    
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
                        <div className="flex items-center gap-3">
                            <div className="bg-[#3f6066]/20 p-2.5 rounded-2xl border border-[#3f6066]/30">
                                <BookOpen className="w-5 h-5 text-[#8eb2b8]" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-white tracking-tight uppercase">Estado de Cuentas</h2>
                                <p className="text-[10px] text-[#3f6066] font-black uppercase tracking-widest">Cartera de Clientes Postventa</p>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={async () => {
                                    const res = await syncLegacyReceipts();
                                    if ('error' in res) toast.error(res.error);
                                    else {
                                        toast.success(`Sincronización completada: ${res.syncedCount} recibos generados.`);
                                        window.location.reload();
                                    }
                                }}
                                className="bg-[#3f6066]/10 border-[#3f6066]/30 text-[#8eb2b8] hover:bg-[#3f6066]/20 text-[10px] font-black uppercase tracking-widest h-9"
                            >
                                <Clock className="w-3.5 h-3.5 mr-2" />
                                Sincronizar Recibos
                            </Button>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                            {(['ALL', 1, 2, 3, 4] as const).map(s => (
                                <button
                                    key={s}
                                    onClick={() => { setLedgerStage(s); setLedgerPage(1); }}
                                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border shrink-0 cursor-pointer ${ledgerStage === s
                                        ? 'bg-[#3f6066] text-white border-[#3f6066] shadow-[0_0_15px_rgba(63,96,102,0.3)]'
                                        : 'bg-white/5 text-gray-500 border-white/5 hover:border-[#3f6066]/40 hover:text-gray-300'
                                        }`}
                                >
                                    {s === 'ALL' ? 'Todas' : `Etapa ${s}`}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Month and Status Filters */}
                    <div className="flex flex-wrap items-center gap-3 relative z-10 py-2 border-t border-white/5">
                        <div className="flex items-center gap-2 bg-black/40 rounded-2xl p-1 border border-white/5">
                            <select 
                                value={ledgerStatus}
                                onChange={(e) => { setLedgerStatus(e.target.value as any); setLedgerPage(1); }}
                                className="bg-transparent text-white text-[10px] font-black uppercase tracking-widest px-3 py-2 outline-none cursor-pointer"
                            >
                                <option value="ALL" className="bg-[#0a1622]">Estado: Todos</option>
                                <option value="PAID" className="bg-[#0a1622]">Pagados</option>
                                <option value="PENDING" className="bg-[#0a1622]">Sin Pagar</option>
                            </select>
                        </div>

                        <div className="flex items-center gap-2 bg-black/40 rounded-2xl p-1 border border-white/5">
                            <select 
                                value={ledgerMonth}
                                onChange={(e) => { setLedgerMonth(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value)); setLedgerPage(1); }}
                                className="bg-transparent text-white text-[10px] font-black uppercase tracking-widest px-3 py-2 outline-none cursor-pointer"
                            >
                                <option value="ALL" className="bg-[#0a1622]">Mes: Todos</option>
                                {['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'].map((m, i) => (
                                    <option key={i} value={i} className="bg-[#0a1622]">{m}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-center gap-2 bg-black/40 rounded-2xl p-1 border border-white/5">
                            <select 
                                value={ledgerYear}
                                onChange={(e) => { setLedgerYear(Number(e.target.value)); setLedgerPage(1); }}
                                className="bg-transparent text-white text-[10px] font-black uppercase tracking-widest px-3 py-2 outline-none cursor-pointer"
                            >
                                {[2024, 2025, 2026, 2027].map(y => (
                                    <option key={y} value={y} className="bg-[#0a1622]">{y}</option>
                                ))}
                            </select>
                        </div>

                        {ledgerMonth !== 'ALL' && (
                            <span className="text-[10px] text-[#3f6066] font-black uppercase tracking-tight ml-auto hidden md:block">
                                Filtrando pagos de {['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'][Number(ledgerMonth)]} {ledgerYear}
                            </span>
                        )}
                    </div>

                    <div className="relative group z-10">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-[#3f6066] transition-colors" />
                        <Input 
                            placeholder="Buscar por nombre o número de lote..." 
                            value={ledgerSearch}
                            onChange={(e) => setLedgerSearch(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') setLedgerPage(1);
                            }}
                            className="bg-black/60 border-white/5 rounded-2xl pl-11 h-12 text-sm text-white placeholder:text-gray-700 focus:ring-[#3f6066]/20 focus:border-[#3f6066]/40 transition-all font-medium"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                             {ledgerSearch && (
                                <Button 
                                    size="sm"
                                    onClick={() => setLedgerPage(1)}
                                    className="bg-[#3f6066] text-white hover:bg-[#3f6066]/80 h-8 rounded-xl text-[9px] font-black uppercase tracking-tighter"
                                >
                                    <Search className="w-3 h-3 mr-1.5" />
                                    Buscar
                                </Button>
                             )}
                            {ledgerSearch && (
                                <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => { setLedgerSearch(''); setLedgerPage(1); }}
                                    className="text-[9px] font-black text-[#3f6066] hover:text-white uppercase transition-colors h-8"
                                >
                                    Limpiar
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Optimized Desktop Grid - Reduced Density for Readability */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                    {paginatedLedger.map(client => {
                        const hasReserva = !!client.signed_at;
                        const hasReceipts = client.receipts && client.receipts.length > 0;
                        const hasPromesa = !!client.uploaded_contract_url;
                        const manualDocs = Array.isArray(client.manual_documents) ? client.manual_documents : [];
                        const hasGastos = manualDocs.some((d: any) => d.category === 'GASTOS_OPERACIONALES');

                        return (
                            <div 
                                key={client.id} 
                                onClick={() => setSelectedClientLedger(client)}
                                className="bg-[#0a1622]/80 backdrop-blur-xl border border-[#3f6066]/10 p-4 md:p-5 rounded-2xl flex flex-col gap-3 relative overflow-hidden transition-all duration-500 hover:border-[#3f6066]/40 hover:scale-[1.02] active:scale-[0.98] shadow-2xl group cursor-pointer"
                            >
                                <div className="absolute -top-4 -right-4 w-12 h-12 bg-[#3f6066]/5 rounded-full blur-xl group-hover:bg-[#3f6066]/15 transition-all duration-700" />

                                <div className="space-y-1">
                                    <div className="flex justify-between items-start gap-2">
                                        <p className="font-black text-white text-[11px] md:text-sm leading-tight tracking-tight truncate flex-1 uppercase">{client.clientName}</p>
                                        <Badge variant="outline" className="text-[8px] md:text-[10px] font-black bg-[#3f6066]/10 text-[#8eb2b8] border-[#3f6066]/20 px-1.5 py-0 shrink-0 uppercase">
                                            T-{client.lotNumber}
                                        </Badge>
                                    </div>
                                    <p className="text-[8px] md:text-[10px] text-[#3f6066] font-black uppercase tracking-[0.2em] leading-none">Etapa {client.lotStage}</p>
                                </div>

                                <div className="flex items-center gap-2 py-2 border-y border-white/5">
                                    <div className="flex items-center gap-1.5" title="Contrato Reserva (Auto)">
                                        <CheckCircle className={`w-3 h-3 ${hasReserva ? 'text-emerald-400' : 'text-gray-800'}`} />
                                        <span className={`text-[7px] md:text-[8px] font-black ${hasReserva ? 'text-emerald-400/80' : 'text-gray-800'}`}>RES</span>
                                    </div>
                                    <div className="flex items-center gap-1.5" title="Comprobantes (Auto)">
                                        <Receipt className={`w-3 h-3 ${hasReceipts ? 'text-blue-400' : 'text-gray-800'}`} />
                                        <span className={`text-[7px] md:text-[8px] font-black ${hasReceipts ? 'text-blue-400/80' : 'text-gray-800'}`}>COM</span>
                                    </div>
                                    <div className="flex items-center gap-1.5" title="Promesa (Manual)">
                                        <FileSignature className={`w-3 h-3 ${hasPromesa ? 'text-cyan-400' : 'text-gray-800'}`} />
                                        <span className={`text-[7px] md:text-[8px] font-black ${hasPromesa ? 'text-cyan-400/80' : 'text-gray-800'}`}>PRM</span>
                                    </div>
                                    <div className="flex items-center gap-1.5" title="Gastos (Manual)">
                                        <Gavel className={`w-3 h-3 ${hasGastos ? 'text-amber-400' : 'text-gray-800'}`} />
                                        <span className={`text-[7px] md:text-[8px] font-black ${hasGastos ? 'text-amber-400/80' : 'text-gray-800'}`}>GST</span>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <div className="flex justify-between items-baseline">
                                        <span className="text-[7px] md:text-[8px] text-gray-600 font-black uppercase tracking-widest">Invertido</span>
                                        <span className="text-[11px] md:text-sm text-white font-black">{formatCurrency(client.totalPaid)}</span>
                                    </div>
                                    <div className="flex justify-between items-baseline">
                                        <span className="text-[7px] md:text-[8px] text-gray-600 font-black uppercase tracking-widest">Próximo</span>
                                        <span className="text-[9px] md:text-[11px] text-[#8eb2b8] font-black tabular-nums">
                                            {client.nextDueDate ? format(new Date(client.nextDueDate), 'dd MMM yy', { locale: es }) : 'Finalizado'}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-1 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-[#3f6066] shadow-[0_0_8px_#3f6066] transition-all duration-1000" 
                                        style={{ width: `${(client.paidCuotas / (client.totalCuotas || 1)) * 100}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })}

                    {paginatedLedger.length === 0 && (
                        <div className="col-span-full text-center py-20 bg-white/5 border border-dashed border-white/10 rounded-[2rem]">
                            <Search className="w-10 h-10 text-gray-700 mx-auto mb-3 opacity-20" />
                            <p className="text-gray-500 font-black uppercase text-xs tracking-widest">
                                {ledgerSearch ? 'Sin resultados para la búsqueda' : 'No hay clientes registrados'}
                            </p>
                        </div>
                    )}
                </div>

                {/* Pagination - Premium Styled */}
                {totalLedgerPages > 1 && (
                    <div className="flex justify-between items-center bg-[#0a1622]/60 backdrop-blur-xl border border-white/5 rounded-2xl p-3">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setLedgerPage(ledgerPage - 1)}
                            disabled={ledgerPage === 1}
                            className="text-[10px] font-black uppercase tracking-widest text-[#3f6066] hover:text-white"
                        >
                            <ArrowRight className="w-3 h-3 mr-2 rotate-180" />
                            Anterior
                        </Button>
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] text-gray-600 font-black uppercase tracking-widest">Página</span>
                            <span className="text-sm text-white font-black px-3 py-1 bg-[#3f6066]/20 rounded-lg border border-[#3f6066]/30">
                                {ledgerPage} <span className="text-[#3f6066] text-xs mx-1">/</span> {totalLedgerPages}
                            </span>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setLedgerPage(ledgerPage + 1)}
                            disabled={ledgerPage === totalLedgerPages}
                            className="text-[10px] font-black uppercase tracking-widest text-[#3f6066] hover:text-white"
                        >
                            Siguiente
                            <ArrowRight className="w-3 h-3 ml-2" />
                        </Button>
                    </div>
                )}

                {/* Main Client Detail Modal - The SINGLE source of truth */}
                <Dialog open={!!selectedClientLedger} onOpenChange={(open) => !open && setSelectedClientLedger(null)}>
                    <DialogContent className="max-w-5xl w-[95vw] h-[90vh] bg-[#0a1622] border-[#3f6066]/20 p-0 overflow-hidden rounded-[2.5rem] shadow-[0_0_80px_rgba(0,0,0,0.8)] flex flex-col">
                        {selectedClientLedger && (
                            <>
                                <div className="flex-1 overflow-y-auto no-scrollbar">
                                    {/* Modal Header - Brand Immersive */}
                                    <div className="bg-gradient-to-br from-[#3f6066]/20 to-transparent p-8 border-b border-white/5 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-80 h-80 bg-[#3f6066]/10 rounded-full blur-[100px] -mr-40 -mt-40" />
                                        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                                            <div className="flex items-center gap-6">
                                                <div className="w-16 h-16 rounded-2xl bg-[#3f6066] flex items-center justify-center shadow-2xl shadow-[#3f6066]/20 flex-shrink-0 border border-white/10">
                                                    <span className="text-2xl font-black text-white">
                                                        {selectedClientLedger.clientName?.charAt(0)}
                                                    </span>
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-3">
                                                        <h2 className="text-2xl font-black text-white uppercase tracking-tight leading-none">{selectedClientLedger.clientName}</h2>
                                                        {selectedClientLedger.is_legacy && (
                                                            <Badge className="bg-amber-500/20 text-amber-500 border-amber-500/30 text-[8px] font-black uppercase">Legacy</Badge>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <Badge className="bg-black/50 text-[#8eb2b8] border-[#3f6066]/30 text-[9px] font-black uppercase px-2 py-0.5">Lote {selectedClientLedger.lotNumber}</Badge>
                                                        <Badge className="bg-black/50 text-[#8eb2b8] border-[#3f6066]/30 text-[9px] font-black uppercase px-2 py-0.5">Etapa {selectedClientLedger.lotStage}</Badge>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end gap-3">
                                                <div className="bg-black/40 backdrop-blur-md rounded-2xl p-5 border border-white/5 text-right min-w-[200px]">
                                                    <p className="text-[10px] text-[#3f6066] font-black uppercase tracking-[0.2em]">Total Invertido</p>
                                                    <p className="text-3xl font-black text-white leading-none mt-1.5 tabular-nums">
                                                        {formatCurrency(selectedClientLedger.totalPaid)}
                                                    </p>
                                                </div>
                                                <Button 
                                                    variant="outline" 
                                                    size="sm"
                                                    onClick={async (e) => {
                                                        e.stopPropagation();
                                                        const res = await syncLegacyReceipts();
                                                        if ('error' in res) toast.error(res.error);
                                                        else {
                                                            toast.success(`Sincronización completada: ${res.syncedCount} recibos.`);
                                                            window.location.reload();
                                                        }
                                                    }}
                                                    className="h-8 text-[9px] font-black text-[#8eb2b8] hover:text-white uppercase tracking-widest bg-white/5 hover:bg-[#3f6066]/20 border-white/5 rounded-xl px-4"
                                                >
                                                    <RefreshCw className="w-3 h-3 mr-2" />
                                                    Sincronizar Datos
                                                </Button>

                                                <Button 
                                                    variant="outline" 
                                                    size="sm"
                                                    onClick={() => setIsEditModalOpen(true)}
                                                    className="h-8 text-[9px] font-black text-[#8eb2b8] hover:text-white uppercase tracking-widest bg-white/5 hover:bg-[#3f6066]/20 border-white/5 rounded-xl px-4"
                                                >
                                                    <Edit className="w-3 h-3 mr-2" />
                                                    Editar Cliente
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-8 space-y-10">
                                        {/* Core Stats - High Visibility Grid */}
                                        {(() => {
                                            const isOffline = selectedClientLedger.is_legacy || selectedClientLedger.signatureIp === 'Firma Offline';
                                            return (
                                                <>
                                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                                            {[
                                                { label: 'Cuotas Pagadas', value: `${selectedClientLedger.paidCuotas} / ${selectedClientLedger.totalCuotas}`, icon: Wallet },
                                                { label: 'Próximo Pago', value: selectedClientLedger.nextDueDate ? format(new Date(selectedClientLedger.nextDueDate), 'dd MMM yy', { locale: es }) : 'N/A', icon: CalendarDays, color: 'text-[#8eb2b8]' },
                                                { label: 'Monto Cuota', value: formatCurrency(selectedClientLedger.valor_cuota || 0), icon: CreditCard },
                                                { label: 'Estado Pie', value: selectedClientLedger.pieStatus, badge: true }
                                            ].map((stat, i) => (
                                                <div key={i} className="bg-white/5 rounded-3xl p-5 border border-white/5 flex flex-col items-center text-center group hover:bg-[#3f6066]/5 hover:border-[#3f6066]/20 transition-all">
                                                    <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest mb-3 flex items-center gap-2">
                                                        {stat.icon && <stat.icon className="w-3.5 h-3.5 text-[#3f6066]" />}
                                                        {stat.label}
                                                    </p>
                                                    {stat.badge ? (
                                                        <Badge className={`${selectedClientLedger.pieStatus === 'PAID' ? 'bg-emerald-500 shadow-emerald-500/20' : 'bg-amber-500 shadow-amber-500/20'} text-white font-black text-[10px] px-3 py-1 rounded-xl uppercase`}>
                                                            {stat.value}
                                                        </Badge>
                                                    ) : (
                                                        <p className={`text-xl font-black text-white ${stat.color || ''} leading-none`}>{stat.value}</p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>

                                        {/* Documentation Section - Interactive Grid */}
                                        <div className="space-y-6">
                                            <div className="flex items-center gap-4">
                                                <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#3f6066]/20 to-transparent" />
                                                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] px-4 whitespace-nowrap">Expediente Digital</h3>
                                                <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#3f6066]/20 to-transparent" />
                                            </div>
                                            
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                                                {/* Item: Promesa */}
                                                <div className="bg-white/[0.03] rounded-3xl p-6 border border-white/5 flex flex-col group hover:bg-white/[0.08] transition-all">
                                                    <div className="flex justify-between items-start mb-6">
                                                        <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                                                            <FileSignature className="w-6 h-6 text-blue-400" />
                                                        </div>                                            
                                                        <div className="flex gap-2">
                                                            <Button
                                                                size="icon"
                                                                variant="ghost"
                                                                disabled={!selectedClientLedger.uploaded_contract_url}
                                                                onClick={() => setViewerConfig({
                                                                    isOpen: true,
                                                                    url: selectedClientLedger.uploaded_contract_url,
                                                                    name: "Promesa de Compraventa",
                                                                    category: "Documento Legal"
                                                                })}
                                                                className="h-10 w-10 bg-white/5 hover:bg-white/10 text-white rounded-xl"
                                                            >
                                                                <Eye className="w-5 h-5" />
                                                            </Button>
                                                            {selectedClientLedger.uploaded_contract_url && (
                                                                <Button
                                                                    size="icon"
                                                                    variant="ghost"
                                                                    onClick={() => handleDeleteDocument(selectedClientLedger.id, 'promesa')}
                                                                    className="h-10 w-10 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-all"
                                                                >
                                                                    <Trash2 className="w-5 h-5" />
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex-1 mb-6">
                                                        <p className="text-white font-black text-sm uppercase tracking-tight">Promesa de Compra</p>
                                                        <p className="text-[9px] text-gray-500 font-black uppercase mt-1">Status: {selectedClientLedger.uploaded_contract_url ? 'Cargado' : 'Pendiente'}</p>
                                                    </div>
                                                    <ContractUploadAction 
                                                        reservationId={selectedClientLedger.id} 
                                                        reservationName={selectedClientLedger.clientName}
                                                        label={selectedClientLedger.uploaded_contract_url ? "Actualizar" : "Subir PDF"}
                                                        onUploadComplete={() => toast.success("Expediente actualizado")}
                                                    />
                                                </div>

                                                {/* Item: Reserva PDF / Manual Reserva for Offline */}
                                                {!isOffline ? (
                                                    <div className="bg-white/[0.03] rounded-3xl p-6 border border-white/5 flex flex-col group hover:bg-white/[0.08] transition-all">
                                                        <div className="flex justify-between items-start mb-6">
                                                            <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                                                                <FileText className="w-6 h-6 text-emerald-400" />
                                                            </div>
                                                            <Button
                                                                size="icon"
                                                                variant="ghost"
                                                                onClick={() => setViewerConfig({
                                                                    isOpen: true,
                                                                    url: `/api/contracts/${selectedClientLedger.id}/pdf`,
                                                                    name: "Contrato de Reserva",
                                                                    category: "Documento Sistema"
                                                                })}
                                                                className="h-10 w-10 bg-white/5 hover:bg-white/10 text-white rounded-xl"
                                                            >
                                                                <Eye className="w-5 h-5" />
                                                            </Button>
                                                        </div>
                                                        <div className="flex-1 mb-6">
                                                            <p className="text-white font-black text-sm uppercase tracking-tight">Reserva Digital</p>
                                                            <p className="text-[9px] text-gray-500 font-black uppercase mt-1">Generado por Alimin</p>
                                                        </div>
                                                        <Button 
                                                            variant="outline" 
                                                            size="sm"
                                                            onClick={() => window.open(`/api/contracts/${selectedClientLedger.id}/pdf?download=true`, '_blank')}
                                                            className="w-full h-11 text-[10px] font-black uppercase border-white/5 bg-white/5 hover:bg-emerald-500/10 hover:text-emerald-400 rounded-2xl transition-all"
                                                        >
                                                            <Download className="w-4 h-4 mr-2" />
                                                            Bajar PDF
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <div className="bg-amber-900/10 rounded-3xl p-6 border border-amber-500/20 flex flex-col group hover:bg-amber-900/20 transition-all">
                                                        <div className="flex justify-between items-start mb-6">
                                                            <div className="p-3 bg-amber-500/20 rounded-2xl border border-amber-500/30">
                                                                <FileText className="w-6 h-6 text-amber-500" />
                                                            </div>
                                                            {(() => {
                                                                let legacyDocs = [];
                                                                if (selectedClientLedger.legacy_uploaded_contracts) {
                                                                    try {
                                                                        legacyDocs = typeof selectedClientLedger.legacy_uploaded_contracts === 'string' 
                                                                            ? JSON.parse(selectedClientLedger.legacy_uploaded_contracts) 
                                                                            : selectedClientLedger.legacy_uploaded_contracts;
                                                                    } catch (e) {}
                                                                }

                                                                if (!Array.isArray(legacyDocs) || legacyDocs.length === 0) {
                                                                    return <Badge variant="outline" className="text-amber-500 border-amber-500/30 font-black text-[7px] uppercase">Falta Archivo</Badge>;
                                                                }
                                                                
                                                                return (
                                                                    <div className="flex flex-col gap-2 w-full">
                                                                        {legacyDocs.map((doc: any, i: number) => (
                                                                            <div key={i} className="flex items-center justify-between p-2 bg-white/5 rounded-xl border border-white/5 group/file">
                                                                                <span className="text-[10px] font-bold text-gray-400 truncate max-w-[100px] group-hover/file:text-white transition-colors">{doc.name}</span>
                                                                                <div className="flex gap-1">
                                                                                    <Button
                                                                                        size="icon"
                                                                                        variant="ghost"
                                                                                        onClick={() => setViewerConfig({
                                                                                            isOpen: true,
                                                                                            url: doc.url,
                                                                                            name: doc.name,
                                                                                            category: "Contrato Manual"
                                                                                        })}
                                                                                        className="h-8 w-8 bg-white/5 hover:bg-white/10 text-white rounded-lg"
                                                                                    >
                                                                                        <Eye className="w-4 h-4" />
                                                                                    </Button>
                                                                                    <Button
                                                                                        size="icon"
                                                                                        variant="ghost"
                                                                                        onClick={() => handleDeleteDocument(selectedClientLedger.id, 'legacy', doc.url)}
                                                                                        className="h-8 w-8 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-all"
                                                                                    >
                                                                                        <Trash2 className="w-4 h-4" />
                                                                                    </Button>
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                );
                                                            })()}
                                                        </div>
                                                        <div className="flex-1 mb-6">
                                                            <p className="text-amber-500 font-black text-sm uppercase tracking-tight">Reserva Offline</p>
                                                            <p className="text-[9px] text-gray-400 font-black uppercase mt-1">Manual / Escaneado</p>
                                                        </div>
                                                        <ContractUploadAction 
                                                            reservationId={selectedClientLedger.id} 
                                                            reservationName={selectedClientLedger.clientName}
                                                            type="legacy"
                                                            label={selectedClientLedger.legacy_uploaded_contracts?.length > 0 ? "Actualizar" : "Subir Reserva"}
                                                            onUploadComplete={() => toast.success("Reserva física actualizada")}
                                                        />
                                                    </div>
                                                )}

                                                {/* Item: Gastos Op */}
                                                <div className="bg-white/[0.03] rounded-3xl p-6 border border-white/5 flex flex-col group hover:bg-white/[0.08] transition-all">
                                                    <div className="flex justify-between items-start mb-6">
                                                        <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/20">
                                                            <Gavel className="w-6 h-6 text-amber-500" />
                                                        </div>
                                                        {(() => {
                                                            const doc = Array.isArray(selectedClientLedger.manual_documents) ? selectedClientLedger.manual_documents.find((d: any) => d.category === 'GASTOS_OPERACIONALES') : null;
                                                            if (doc) {
                                                                return (
                                                                    <div className="flex gap-2">
                                                                        <Button 
                                                                            size="icon"
                                                                            variant="ghost"
                                                                            onClick={() => setViewerConfig({
                                                                                isOpen: true,
                                                                                url: doc.url,
                                                                                name: "Gastos Operacionales",
                                                                                category: "Legal"
                                                                            })}
                                                                            className="h-10 w-10 bg-white/5 hover:bg-white/10 text-white rounded-xl"
                                                                        >
                                                                            <Eye className="w-5 h-5" />
                                                                        </Button>
                                                                        <Button 
                                                                            size="icon"
                                                                            variant="ghost"
                                                                            onClick={() => handleDeleteDocument(selectedClientLedger.id, 'GASTOS_OPERACIONALES', doc.url)}
                                                                            className="h-10 w-10 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-all"
                                                                        >
                                                                            <Trash2 className="w-5 h-5" />
                                                                        </Button>
                                                                    </div>
                                                                );
                                                            }
                                                            return <Badge variant="outline" className="text-gray-600 border-gray-800 font-black text-[7px] uppercase">Pendiente</Badge>;
                                                        })()}
                                                    </div>
                                                    <div className="flex-1 mb-6">
                                                        <p className="text-white font-black text-sm uppercase tracking-tight">Gastos Op.</p>
                                                        <p className="text-[9px] text-gray-500 font-black uppercase mt-1">Comprobante Notarial</p>
                                                    </div>
                                                    <ContractUploadAction 
                                                        reservationId={selectedClientLedger.id} 
                                                        reservationName={selectedClientLedger.clientName}
                                                        type="GASTOS_OPERACIONALES"
                                                        label="Registrar"
                                                        onUploadComplete={() => toast.success("Expediente actualizado")}
                                                    />
                                                </div>

                                                {/* Item: Pagos Externos */}
                                                <div className="bg-white/[0.03] rounded-3xl p-6 border border-white/5 flex flex-col group hover:bg-white/[0.08] transition-all">
                                                    <div className="flex justify-between items-start mb-6">
                                                        <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
                                                            <Wallet className="w-6 h-6 text-indigo-400" />
                                                        </div>
                                                        <Button 
                                                            size="icon"
                                                            variant="ghost"
                                                            onClick={() => setShowPaymentsModal(true)}
                                                            className="h-10 w-10 bg-white/5 hover:bg-white/10 text-white rounded-xl"
                                                        >
                                                            <Eye className="w-5 h-5" />
                                                        </Button>
                                                    </div>
                                                    <div className="flex-1 mb-6">
                                                        <p className="text-white font-black text-sm uppercase tracking-tight">Pagos Externos</p>
                                                        <p className="text-[9px] text-gray-500 font-black uppercase mt-1">Comprobantes Manuales</p>
                                                    </div>
                                                    <ContractUploadAction 
                                                        reservationId={selectedClientLedger.id} 
                                                        reservationName={selectedClientLedger.clientName}
                                                        type="COMPROBANTE_CUOTA"
                                                        label="Cargar Pago"
                                                        onUploadComplete={() => toast.success("Pago registrado")}
                                                        extraCategories={[
                                                            { id: 'COMPROBANTE_PIE', label: 'Pago de Pie' },
                                                            { id: 'COMPROBANTE_CUOTA', label: 'Pago de Cuota' }
                                                        ]}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Mora Control Panel - Immersive Dark Mode */}
                                        <div className="bg-black/60 rounded-[2.5rem] p-10 border border-red-500/10 relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:scale-125 transition-all duration-1000 grayscale">
                                                <ShieldAlert className="w-64 h-64 text-red-500" />
                                            </div>
                                            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center gap-10">
                                                <div className="flex-1 space-y-4">
                                                    <h3 className="text-[10px] font-black text-red-500/60 uppercase tracking-[0.4em] flex items-center gap-2">
                                                        <Clock className="w-4 h-4 text-red-500" />
                                                        Gestión de Morosidad
                                                    </h3>
                                                    <p className="text-white font-black text-2xl uppercase tracking-tight">Exención y Congelación</p>
                                                    <p className="text-[11px] text-gray-500 leading-relaxed font-medium max-w-xl">
                                                        Controla la aplicación de multas automáticas e intereses diarios. Congelar la mora eximirá al cliente de notificaciones de cobranza y mantendrá su deuda en $0 temporalmente.
                                                    </p>
                                                </div>
                                                <div className="shrink-0">
                                                    <AdminMoraManager users={users} />
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                );
                            })()}
                        </div>
                                
                                <div className="p-12 pt-0 flex justify-center">
                                    <Button 
                                        variant="ghost" 
                                        onClick={() => setSelectedClientLedger(null)} 
                                        className="w-full sm:w-auto px-20 h-16 rounded-3xl text-xs font-black uppercase tracking-[0.5em] text-gray-600 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 transition-all shadow-2xl hover:shadow-[#3f6066]/10"
                                    >
                                        Cerrar Expediente
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
                
                {/* Payments Detail Modal - Focused View */}
                <Dialog open={showPaymentsModal} onOpenChange={setShowPaymentsModal}>
                    <DialogContent className="max-w-sm bg-[#0a1622] border-[#3f6066]/20 p-0 overflow-hidden rounded-[2rem] shadow-2xl">
                        <DialogHeader className="p-5 bg-[#3f6066]/10 border-b border-white/5">
                            <DialogTitle className="flex items-center gap-2 text-white font-black uppercase tracking-tight text-sm">
                                <Wallet className="w-4 h-4 text-[#8eb2b8]" />
                                Historial de Pagos
                            </DialogTitle>
                        </DialogHeader>
                        
                        <div className="p-5 max-h-[50vh] overflow-y-auto no-scrollbar space-y-3">
                            {(() => {
                                if (!selectedClientLedger) return null;
                                const manual = Array.isArray(selectedClientLedger.manual_documents) 
                                    ? selectedClientLedger.manual_documents.filter((d: any) => d.category === 'COMPROBANTE_CUOTA' || d.category === 'COMPROBANTE_PIE')
                                    : [];
                                const auto = clientReceipts.filter((r: any) => r.status === 'APPROVED');
                                
                                if (isLoadingReceipts) {
                                    return (
                                        <div className="flex flex-col items-center justify-center py-12 space-y-3 opacity-50">
                                            <Loader2 className="w-8 h-8 animate-spin text-[#8eb2b8]" />
                                            <p className="text-[10px] font-black uppercase tracking-tighter">Cargando recibos...</p>
                                        </div>
                                    );
                                }
                                
                                const all = [
                                    ...manual.map((m: any) => ({ 
                                        name: m.name, 
                                        url: m.url, 
                                        type: m.category === 'COMPROBANTE_PIE' ? 'PIE' : 'CUOTA', 
                                        category: m.category,
                                        isAuto: false,
                                        date: m.uploadedAt ? new Date(m.uploadedAt) : new Date()
                                    })),
                                    ...auto.map((a: any) => ({ 
                                        name: `Comprobante Oficial #${a.id.slice(-4)}`, 
                                        url: `/api/receipt/${a.id}/pdf`, 
                                        type: a.scope, 
                                        isAuto: true,
                                        date: new Date(a.processed_at || a.created_at)
                                    }))
                                ].sort((a, b) => b.date.getTime() - a.date.getTime());

                                const hasAuto = auto.length > 0;

                                return (
                                    <>
                                        {!hasAuto && all.length > 0 && (
                                            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 mb-4">
                                                <p className="text-[9px] text-amber-500 font-black uppercase leading-tight">
                                                    Nota: No se han generado comprobantes PDF oficiales todavía. 
                                                    Usa el botón "Sincronizar" para crearlos.
                                                </p>
                                            </div>
                                        )}
                                        {all.length === 0 ? (
                                            <div className="text-center py-8 opacity-30">
                                                <Receipt className="w-8 h-8 mx-auto mb-2" />
                                                <p className="text-[10px] font-black uppercase">Sin registros</p>
                                            </div>
                                        ) : (
                                            all.map((p, idx) => (
                                                <div key={idx} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 group hover:bg-white/10 transition-all">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`p-2 rounded-lg ${p.type === 'PIE' ? 'bg-amber-500/10' : 'bg-blue-500/10'}`}>
                                                            <Receipt className={`w-3.5 h-3.5 ${p.type === 'PIE' ? 'text-amber-500' : 'text-blue-400'}`} />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-[10px] font-black text-white leading-tight uppercase truncate max-w-[120px]">{p.name}</p>
                                                            <div className="flex items-center gap-2 mt-0.5">
                                                                <span className={`text-[6px] font-black uppercase px-1 rounded ${p.type === 'PIE' ? 'bg-amber-500/20 text-amber-500' : 'bg-blue-500/20 text-blue-400'}`}>
                                                                    {p.type === 'PIE' ? 'Pie' : 'Cuota'}
                                                                </span>
                                                                <span className="text-[6px] text-gray-500 font-bold uppercase">{format(p.date, 'dd MMM yy', { locale: es })}</span>
                                                                {p.isAuto ? (
                                                                    <span className="text-[6px] text-emerald-500 font-black uppercase bg-emerald-500/10 px-1 rounded">PDF Oficial</span>
                                                                ) : (
                                                                    <span className="text-[6px] text-gray-600 font-bold uppercase">Manual</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                                                           <div className="flex gap-1">
                                                                    <button
                                                                        onClick={() => setViewerConfig({
                                                                            isOpen: true,
                                                                            url: p.url,
                                                                            name: p.name,
                                                                            category: p.type === 'PIE' ? 'Pago Pie' : 'Cuota'
                                                                        })}
                                                                        className="p-2 bg-[#3f6066]/20 hover:bg-[#3f6066]/40 text-[#8eb2b8] rounded-lg transition-all"
                                                                        title="Visualizar"
                                                                    >
                                                                        <Eye className="w-4 h-4" />
                                                                    </button>
                                                                    {!p.isAuto && (
                                                                        <button
                                                                            onClick={() => handleDeleteDocument(selectedClientLedger.id, p.category, p.url)}
                                                                            className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-all"
                                                                            title="Eliminar"
                                                                        >
                                                                            <Trash2 className="w-4 h-4" />
                                                                        </button>
                                                                    )}
                                                                </div>
                                                </div>
                                            ))
                                        )}
                                    </>
                                );
                            })()}
                        </div>
                        
                        <div className="p-4 bg-black/20 border-t border-white/5">
                            <Button
                                onClick={() => setShowPaymentsModal(false)}
                                className="w-full bg-[#3f6066] hover:bg-[#3f6066]/80 text-white font-black uppercase text-[10px] tracking-widest h-10 rounded-xl"
                            >
                                Cerrar Historial
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>

                <UniversalDocumentViewer 
                    {...viewerConfig} 
                    onClose={() => setViewerConfig(prev => ({ ...prev, isOpen: false }))}
                />

                {selectedClientLedger && (
                    <AssignOwnerModal
                        open={isEditModalOpen}
                        onOpenChange={setIsEditModalOpen}
                        lotId={selectedClientLedger.lotId}
                        lotNumber={selectedClientLedger.lotNumber}
                        existingReservation={selectedClientLedger}
                        onSuccess={() => {
                            toast.success("Cliente actualizado exitosamente");
                            window.location.reload();
                        }}
                    />
                )}
            </div>
        );
    }

    if (activeTab === 'alertas') {
        const filteredAlerts = debtAlerts.filter(alert => {
            const matchesStage = alertStage === 'ALL' || alert.lotStage === alertStage;
            const matchesStatus = alertFilter === 'ALL' || alert.status === alertFilter;
            const matchesSearch = !alertSearch || 
                (alert.name || alert.clientName || '').toLowerCase().includes(alertSearch.toLowerCase()) ||
                (alert.lotNumber?.toString() || '').includes(alertSearch);
            return matchesStage && matchesStatus && matchesSearch;
        });

        const totalAlertPages = Math.ceil(filteredAlerts.length / ALERTS_PER_PAGE);
        const paginatedAlerts = filteredAlerts.slice(
            (alertPage - 1) * ALERTS_PER_PAGE,
            alertPage * ALERTS_PER_PAGE
        );

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

                        {/* Universal Search in Alertas Tab */}
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-[#3f6066] transition-colors" />
                            <Input 
                                placeholder="Buscar cliente..." 
                                value={alertSearch}
                                onChange={(e) => { setAlertSearch(e.target.value); setAlertPage(1); }}
                                className="bg-[#1a1a1a]/40 border-white/5 rounded-2xl pl-11 h-12 text-sm text-white placeholder:text-gray-700 focus:ring-[#3f6066]/20 focus:border-[#3f6066]/40 transition-all font-medium"
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                {alertSearch && (
                                    <Button 
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => { setAlertSearch(''); setAlertPage(1); }}
                                        className="h-8 text-[9px] font-black text-gray-500 hover:text-white uppercase"
                                    >
                                        Limpiar
                                    </Button>
                                )}
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
                                            onClick={() => { setAlertStage(s); setAlertPage(1); }}
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
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3">
                            {paginatedAlerts.map((alert: any) => {
                                const isLate = alert.isLate && !alert.isMoraFrozen;
                                const isGrace = alert.isGracePeriod && !alert.isMoraFrozen;
                                const isUpcoming = alert.isUpcoming && !alert.isMoraFrozen;
                                const isFrozen = Boolean(alert.isMoraFrozen);
                                const isOK = alert.isUpToDate || isFrozen;

                                let colorClass = 'bg-[#0a1622]/80 border-[#3f6066]/20';
                                if (isLate) colorClass = 'bg-red-500/5 border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]';
                                if (isGrace) colorClass = 'bg-amber-500/5 border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]';
                                if (isUpcoming) colorClass = 'bg-blue-500/5 border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]';

                                let accentClass = 'text-green-400';
                                let statusText = 'Al Día';
                                let badgeLabel = 'Al Día';
                                if (isLate) { accentClass = 'text-red-400'; statusText = 'Atrasado'; badgeLabel = 'Mora'; }
                                if (isGrace) { accentClass = 'text-amber-400'; statusText = 'Gracia'; badgeLabel = 'Gracia'; }
                                if (isUpcoming) { accentClass = 'text-blue-400'; statusText = 'Próximo'; badgeLabel = 'Próximo'; }
                                if (isFrozen) { accentClass = 'text-emerald-400'; statusText = 'Mora Congelada'; badgeLabel = 'Frozen'; }

                                return (
                                    <div 
                                        key={alert.id} 
                                        className={`${colorClass} p-3 rounded-2xl border backdrop-blur-xl transition-all duration-500 hover:scale-[1.03] active:scale-[0.98] flex flex-col justify-between relative overflow-hidden shadow-2xl group cursor-pointer`}
                                        onClick={() => { 
                                            setSelectedClientLedger(alert); 
                                            onTabChange?.('ledger'); 
                                        }}
                                    >
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-start gap-1">
                                                <div className="min-w-0 flex-1">
                                                    <p className="font-black text-white text-[10px] truncate tracking-tight uppercase leading-none">{alert.clientName}</p>
                                                    <div className="flex items-center gap-1 mt-1">
                                                        <span className="text-[7px] font-black px-1 py-0 rounded bg-[#3f6066]/10 text-[#8eb2b8] border border-[#3f6066]/20 uppercase">T-{alert.lotNumber}</span>
                                                    </div>
                                                </div>
                                                <Badge className={`bg-black/50 ${accentClass} border-${accentClass.split('-')[1]}-500/20 text-[7px] font-black uppercase tracking-wider px-1 py-0.5`}>
                                                    {badgeLabel}
                                                </Badge>
                                            </div>

                                            <div className="bg-black/40 rounded-xl p-2.5 border border-white/5 space-y-1">
                                                <div className="flex justify-between">
                                                    <span className="text-[6px] text-gray-500 font-black uppercase tracking-widest">Monto</span>
                                                    <span className={`font-black ${accentClass} text-[10px]`}>
                                                        {isOK ? formatCurrency(alert.cuotasAmount) : formatCurrency(isLate ? alert.penaltyAmount : (alert.monto_cuota || 0))}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-[6px] text-gray-500 font-black uppercase tracking-widest">Fecha</span>
                                                    <span className="text-[9px] text-white font-black">
                                                        {alert.displayDueDate ? format(new Date(alert.displayDueDate), 'dd MMM', { locale: es }) : 'N/A'}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex justify-between items-center text-[8px]">
                                                <span className={`${accentClass} font-black uppercase`}>{statusText}</span>
                                                <span className="text-gray-500 font-bold uppercase text-[7px] tracking-tighter">#{alert.paidCuotas + 1}</span>
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
                                    onClick={() => setAlertPage(alertPage - 1)}
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
                                    onClick={() => setAlertPage(alertPage + 1)}
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
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <Receipt className="w-5 h-5 text-alimin-gold" />
                    <h2 className="text-lg font-bold text-white uppercase tracking-tight">Recibos por Aprobar</h2>
                    {pendingCount > 0 && (
                        <Badge variant="destructive" className="bg-red-500/20 text-red-500 border-red-500/30 text-[10px] font-bold animate-pulse">
                            {pendingCount}
                        </Badge>
                    )}
                </div>
                
                <div className="relative group w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-[#3f6066] transition-colors" />
                    <Input 
                        placeholder="Buscar por lote o nombre..." 
                        value={ledgerSearch}
                        onChange={(e) => { setLedgerSearch(e.target.value); setLedgerPage(1); }}
                        className="bg-white/5 border-white/10 rounded-xl pl-9 h-10 text-sm text-white placeholder:text-gray-600 focus:ring-alimin-gold/20 focus:border-alimin-gold/40 transition-all font-medium"
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                        {ledgerSearch && (
                            <Button 
                                size="sm"
                                onClick={() => setLedgerPage(1)}
                                className="bg-alimin-gold text-black hover:bg-alimin-gold/80 h-7 rounded-lg text-[9px] font-bold px-2"
                            >
                                Buscar
                            </Button>
                        )}
                    </div>
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
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-3">
                {filteredReceipts.map(receipt => (
                    <div
                        key={receipt.id}
                        className={`rounded-2xl border p-4 space-y-3 backdrop-blur-xl transition-all duration-500 hover:scale-[1.02] active:scale-[0.98] flex flex-col justify-between shadow-2xl group ${receipt.status === 'PENDING'
                            ? 'bg-amber-500/5 border-amber-500/20'
                            : receipt.status === 'APPROVED'
                                ? 'bg-[#3f6066]/5 border-[#3f6066]/20'
                                : 'bg-red-500/5 border-red-500/20'
                            }`}
                    >
                        <div className="flex items-start justify-between gap-1.5">
                            <div className="min-w-0">
                                <p className="font-black text-white text-[11px] truncate tracking-tight uppercase">
                                    {receipt.reservation?.buyer?.name || 'Sin nombre'}
                                </p>
                                <p className="text-[7px] text-[#3f6066] font-black uppercase tracking-widest leading-none mt-1">
                                    T-{receipt.reservation?.lot?.number} · E{receipt.reservation?.lot?.stage}
                                </p>
                            </div>
                            {getStatusBadge(receipt.status)}
                        </div>

                        <div className="bg-black/40 rounded-xl p-2.5 border border-white/5 space-y-1.5">
                            <div className="flex justify-between items-center">
                                <span className="text-[6px] text-gray-500 font-black uppercase tracking-widest">Monto</span>
                                <span className="text-sm font-black text-white">{formatCurrency(receipt.amount_clp)}</span>
                            </div>
                            <div className="flex justify-between items-center pt-1 border-t border-white/5">
                                <span className="text-[6px] text-gray-500 font-black uppercase tracking-widest">Concepto</span>
                                <span className="text-[8px] font-black text-[#8eb2b8] uppercase">
                                    {receipt.scope === 'PIE' ? 'Pago de Pie' : `${(receipt.installments_count || 1) > 1 ? (receipt.installments_count || 1) + ' Cuotas' : 'Cuota'}`}
                                </span>
                            </div>
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
                                onClick={() => setViewerConfig({
                                    isOpen: true,
                                    url: receipt.receipt_url,
                                    name: `Recibo #${receipt.id.slice(-4)}`,
                                    category: receipt.reservation?.buyer?.name
                                })}
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

                {/* Universal Document Viewer Integration */}
                <UniversalDocumentViewer
                    {...viewerConfig}
                    onClose={() => setViewerConfig(prev => ({ ...prev, isOpen: false }))}
                />
            </div>

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

            {selectedClientLedger && (
                <AssignOwnerModal
                    open={isEditModalOpen}
                    onOpenChange={setIsEditModalOpen}
                    lotId={selectedClientLedger.lotId}
                    lotNumber={selectedClientLedger.lotNumber}
                    existingReservation={selectedClientLedger}
                    onSuccess={() => {
                        toast.success("Cliente actualizado exitosamente");
                        window.location.reload();
                    }}
                />
            )}
        </div>
    );
}
