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
    FileText, Download, Trash2, Edit, Map, Snowflake
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { approvePaymentReceipt, rejectPaymentReceipt } from '@/actions/receipts';
import { syncLegacyReceipts, getReservationReceipts, registerPostventaPayment } from '@/actions/postventa';
import { toggleMoraFreeze } from '@/actions/dashboard';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { UniversalDocumentViewer } from "@/components/shared/UniversalDocumentViewer";
import { MoraExplainerCard } from './MoraExplainerCard';
import { ContractUploadAction } from "@/components/admin/ContractUploadAction";
import { exportToExcel } from '@/lib/export-utils';
import { AdminMoraManager } from "@/components/admin/AdminMoraManager"
import { AssignOwnerModal } from "@/components/dashboard/AssignOwnerModal";
import { AdminLotList } from "@/components/dashboard/AdminLotList";

export type PostventaTab = 'mora' | 'ledger' | 'alertas' | 'terrenos';

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
    const [manualAmount, setManualAmount] = useState('');
    const [manualScope, setManualScope] = useState<'PIE' | 'INSTALLMENT' | 'GASTOS_OPERACIONALES'>('INSTALLMENT');
    const [isRegistering, setIsRegistering] = useState(false);
    const ALERTS_PER_PAGE = 10;
    
    const router = useRouter();

    const refreshData = async () => {
        const { invalidatePostventaCache, getFullPostventaData } = await import("@/actions/postventa");
        await invalidatePostventaCache();
        
        if (selectedClientLedger) {
            const res = await getFullPostventaData({ stage: 'ALL' }) as { success?: boolean, data?: any[], error?: string };
            if (res && !res.error && res.data) {
                const updatedClient = res.data.find((c: any) => c.id === selectedClientLedger.id);
                if (updatedClient) {
                    setSelectedClientLedger(updatedClient);
                }
            }
        }
        
        router.refresh();
    };

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

    const handleDeleteDocument = async (reservationId: string, type: string, url?: string, name?: string) => {
        if (!confirm('¿Estás seguro de que deseas eliminar este documento?')) return;
        
        try {
            const res = await fetch(`/api/contracts/${reservationId}/upload`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type, url, name }),
            });

            if (!res.ok) throw new Error("Error al eliminar");
            
            const { invalidatePostventaCache } = await import("@/actions/postventa");
            await invalidatePostventaCache();

            toast.success("Documento eliminado correctamente");
            window.location.reload();
        } catch (error) {
            console.error(error);
            toast.error("No se pudo eliminar el documento");
        }
    };

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(amount);

    const handleExportLedger = (data: any[]) => {
        const headers = [
            { label: 'Cliente', key: 'clientName' },
            { label: 'Lote', key: 'lotNumber' },
            { label: 'Etapa', key: 'lotStage' },
            { label: 'Total Pagado', key: 'totalPaid' },
            { label: 'Pendiente', key: 'pendingBalance' },
            { label: 'Próximo Vencimiento', key: 'displayDueDate' },
            { label: 'Cuotas Pagadas', key: 'paidCuotas' },
            { label: 'Total Cuotas', key: 'totalCuotas' },
            { label: 'Estado', key: 'status' }
        ];

        const exportData = data.map(item => ({
            ...item,
            totalPaid: formatCurrency(item.totalPaid || 0),
            pendingBalance: formatCurrency(item.pendingBalance || 0),
            displayDueDate: item.displayDueDate ? format(new Date(item.displayDueDate), 'dd/MM/yyyy') : 'N/A'
        }));

        exportToExcel(exportData, `Cartera_Postventa_${format(new Date(), 'yyyy-MM-dd')}.csv`, headers);
    };

    const handleExportTerrenos = (data: any[]) => {
        const headers = [
            { label: 'Lote', key: 'number' },
            { label: 'Etapa', key: 'stage' },
            { label: 'Estado', key: 'status' },
            { label: 'Dueño', key: 'ownerName' },
            { label: 'Área m2', key: 'area_m2' },
            { label: 'Precio Total', key: 'price_total_clp' },
            { label: 'Pie', key: 'pie' },
            { label: 'Valor Cuota', key: 'valor_cuota' },
            { label: 'Reserva', key: 'reservation_amount_clp' }
        ];

        const exportData = data.map(lot => ({
            ...lot,
            ownerName: lot.reservations?.[0]?.buyer?.name || '---',
            price_total_clp: formatCurrency(lot.price_total_clp || 0),
            pie: formatCurrency(lot.pie || 0),
            valor_cuota: formatCurrency(lot.valor_cuota || 0),
            reservation_amount_clp: formatCurrency(lot.reservation_amount_clp || 0),
            status: lot.status === 'sold' ? 'Vendido' : 'Disponible'
        }));

        exportToExcel(exportData, `Terrenos_${format(new Date(), 'yyyy-MM-dd')}.csv`, headers);
    };

    const handleExportAlerts = (data: any[]) => {
        const headers = [
            { label: 'Cliente', key: 'clientName' },
            { label: 'Lote', key: 'lotNumber' },
            { label: 'Etapa', key: 'lotStage' },
            { label: 'Estado Pago', key: 'statusLabel' },
            { label: 'Monto Pendiente', key: 'pendingAmount' },
            { label: 'Fecha Vencimiento', key: 'displayDueDate' },
            { label: 'Cuotas Pagadas', key: 'paidCuotas' }
        ];

        const exportData = data.map(alert => {
            const isFrozen = Boolean(alert.isMoraFrozen);
            let statusLabel = 'Al Día';
            if (alert.isLate && !isFrozen) statusLabel = 'Mora';
            if (alert.isGracePeriod && !isFrozen) statusLabel = 'Gracia';
            if (alert.isUpcoming && !isFrozen) statusLabel = 'Próximo';
            if (isFrozen) statusLabel = 'Mora Congelada';

            return {
                ...alert,
                statusLabel,
                pendingAmount: formatCurrency(alert.penaltyAmount || alert.monto_cuota || 0),
                displayDueDate: alert.displayDueDate ? format(new Date(alert.displayDueDate), 'dd/MM/yyyy') : 'N/A',
                paidCuotas: alert.paidCuotas || 0
            };
        });

        exportToExcel(exportData, `Alertas_Postventa_${format(new Date(), 'yyyy-MM-dd')}.csv`, headers);
    };

    const getStatusBadge = (status: string) => {
        if (status === 'PENDING') return <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-[10px]">Pendiente</Badge>;
        if (status === 'APPROVED') return <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-[10px]">Aprobado</Badge>;
        if (status === 'REJECTED') return <Badge variant="destructive" className="text-[10px]">Rechazado</Badge>;
        return null;
    };

    let content;
    if (activeTab === 'terrenos') {
        content = (
            <div className="space-y-4 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 shadow-inner">
                        <Map className="w-8 h-8 text-[#E0B457]" />
                    </div>
                    <div className="flex-1">
                        <h1 className="text-3xl font-black text-white tracking-tight uppercase">
                            Gestión de Terrenos
                        </h1>
                        <p className="text-[#E0B457] text-xs font-bold tracking-[0.2em] uppercase opacity-70">
                            Catastro total y asignaciones
                        </p>
                    </div>
                    <Button 
                        variant="outline"
                        onClick={() => handleExportTerrenos(fullLots)}
                        className="bg-[#E0B457]/10 border-[#E0B457]/20 text-[#E0B457] hover:bg-[#E0B457]/20 font-black text-[10px] uppercase tracking-widest px-6 h-12 rounded-2xl"
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Exportar Excel
                    </Button>
                </div>

                <div className="bg-black/40 backdrop-blur-md rounded-[2rem] p-6 border border-white/10 shadow-xl">
                    <AdminLotList lots={fullLots} />
                </div>
            </div>
        );
    } else if (activeTab === 'ledger') {
        const filteredLedger = ledger.filter(client => {
            // Requirement: Only users with a reserved lot
            if (!client.lotNumber) return false;

            const matchesSearch = !ledgerSearch || 
                (client.clientName || '').toLowerCase().includes(ledgerSearch.toLowerCase()) ||
                String(client.lotNumber || '').includes(ledgerSearch);
            
            const matchesStage = ledgerStage === 'ALL' || Number(client.lotStage) === Number(ledgerStage);
            
            let matchesStatus = true;
            if (ledgerMonth !== 'ALL') {
                const targetDate = new Date(ledgerYear, Number(ledgerMonth) + 1, 0);
                const isPaidAll = client.paidCuotas >= (client.totalCuotas || 1);
                const nextDue = client.nextDueDate ? new Date(client.nextDueDate) : null;
                
                // Matches "Paid" for the target month if next payment is after that month
                const matchesPaid = Boolean(isPaidAll || (nextDue && nextDue > targetDate));

                if (ledgerStatus === 'PAID') matchesStatus = matchesPaid;
                else if (ledgerStatus === 'PENDING') matchesStatus = !matchesPaid;
            } else {
                // Global status filter when "All Months" is selected
                if (ledgerStatus === 'PAID') {
                    matchesStatus = (client.pendingBalance || 0) <= 0 || client.paidCuotas >= (client.totalCuotas || 1);
                } else if (ledgerStatus === 'PENDING') {
                    matchesStatus = (client.pendingBalance || 0) > 0 && client.paidCuotas < (client.totalCuotas || 1);
                }
            }

            return matchesSearch && matchesStage && matchesStatus;
        });

        const totalLedgerPages = Math.ceil(filteredLedger.length / LEDGER_ITEMS_PER_PAGE);
        const paginatedLedger = filteredLedger.slice(
            (ledgerPage - 1) * LEDGER_ITEMS_PER_PAGE,
            ledgerPage * LEDGER_ITEMS_PER_PAGE
        );

        content = (
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

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleExportLedger(filteredLedger)}
                                className="bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 text-[10px] font-black uppercase tracking-widest h-9"
                            >
                                <Download className="w-3.5 h-3.5 mr-2" />
                                Exportar Excel
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
            </div>
        );
    } else if (activeTab === 'alertas') {
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

        content = (
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
                        <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleExportAlerts(filteredAlerts)}
                            className="bg-white/5 border-white/10 text-white hover:bg-white/10 font-bold text-[10px] uppercase tracking-wider px-4 h-10 rounded-xl"
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Exportar
                        </Button>
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
    } else if (activeTab === 'mora') {
        content = (
            <div className="space-y-4 pb-24">
                <MoraExplainerCard soldLots={soldLots} />
            </div>
        );
    } else {
        content = (
            <div className="space-y-4 pb-24">
                {/* Header */}
            </div>
        );
    }

    return (
        <div className="relative">
            {content}

            {/* Global Client Detail Modal */}
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

                                            <Button 
                                                variant={selectedClientLedger.isMoraFrozen ? "destructive" : "outline"} 
                                                size="sm"
                                                onClick={async () => {
                                                    const freeze = !selectedClientLedger.isMoraFrozen;
                                                    const res = await toggleMoraFreeze(selectedClientLedger.id, freeze);
                                                    if (res.error) toast.error(res.error);
                                                    else {
                                                        toast.success(res.message);
                                                        window.location.reload();
                                                    }
                                                }}
                                                className={cn(
                                                    "h-8 text-[9px] font-black uppercase tracking-widest rounded-xl px-4 border-white/5",
                                                    selectedClientLedger.isMoraFrozen 
                                                        ? "bg-red-500/20 text-red-400 hover:bg-red-500/30" 
                                                        : "bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20"
                                                )}
                                            >
                                                <Snowflake className="w-3 h-3 mr-2" />
                                                {selectedClientLedger.isMoraFrozen ? "Activar Mora" : "Congelar Mora"}
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
                                                        {selectedClientLedger.pieStatus}
                                                    </Badge>
                                                ) : (
                                                    <p className={`text-xl font-black ${stat.color || 'text-white'} tabular-nums`}>{stat.value}</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                        {/* Left: Documents Section */}
                                        <div className="bg-white/[0.02] rounded-[2rem] border border-white/5 p-8 flex flex-col gap-6">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="bg-[#8eb2b8]/10 p-2.5 rounded-2xl">
                                                        <Receipt className="w-5 h-5 text-[#8eb2b8]" />
                                                    </div>
                                                    <h3 className="text-lg font-black text-white uppercase tracking-tight">Documentación</h3>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 gap-3">
                                                {(() => {
                                                    const manualDocs = Array.isArray(selectedClientLedger.manual_documents) ? selectedClientLedger.manual_documents : [];
                                                    
                                                    // Define standard categories
                                                    const standardCategories = [
                                                        { id: 'RESERVA', label: 'Contrato de Reserva' },
                                                        { id: 'PROMESA', label: 'Promesa de Compraventa' },
                                                        { id: 'PIE', label: 'Comprobantes de Pie' },
                                                        { id: 'CUOTAS', label: 'Documentos de Cuotas' },
                                                        { id: 'GASTOS_OPERACIONALES', label: 'Gastos Operacionales' }
                                                    ];

                                                    // Map documents to their categories
                                                    const docs = standardCategories.map(cat => {
                                                        let docInfo: any = { label: cat.label, category: cat.id };
                                                        
                                                        if (cat.id === 'RESERVA') {
                                                            docInfo.url = selectedClientLedger.uploaded_contract_url;
                                                            docInfo.date = selectedClientLedger.signed_at;
                                                        } else if (cat.id === 'PROMESA') {
                                                            const parsedLegacy = selectedClientLedger.legacy_uploaded_contracts ? JSON.parse(selectedClientLedger.legacy_uploaded_contracts) : null;
                                                            if (parsedLegacy && parsedLegacy.length > 0) {
                                                                docInfo.url = parsedLegacy[0].url;
                                                                docInfo.name = parsedLegacy[0].name;
                                                            }
                                                        } else {
                                                            // Find matching manual document
                                                            const match = manualDocs.find((d: any) => d.category === cat.id);
                                                            if (match) {
                                                                docInfo.url = match.url;
                                                                docInfo.date = match.uploadedAt;
                                                                docInfo.name = match.name;
                                                            }
                                                        }
                                                        return docInfo;
                                                    });

                                                    // Add other manual documents that don't fit standard categories
                                                    const extraDocs = manualDocs
                                                        .filter((d: any) => !standardCategories.some(cat => cat.id === d.category))
                                                        .map((d: any) => ({ ...d, label: d.name, category: d.category || 'OTRO', isExtra: true }));

                                                    const allDocs = [...docs, ...extraDocs];

                                                    return (
                                                        <>
                                                            {allDocs.map((doc, idx) => (
                                                                <div key={doc.category || idx} className="bg-black/40 border border-white/5 rounded-2xl p-4 flex items-center justify-between group hover:bg-white/5 transition-all">
                                                                    <div className="flex items-center gap-4">
                                                                        <div className="bg-white/5 p-2 rounded-xl group-hover:bg-[#3f6066]/20 transition-all">
                                                                            <FileText className="w-4 h-4 text-gray-500 group-hover:text-[#8eb2b8]" />
                                                                        </div>
                                                                        <div>
                                                                            <p className="text-[10px] font-black text-white uppercase tracking-widest">{doc.label || doc.name}</p>
                                                                            <p className="text-[8px] text-gray-600 font-bold uppercase mt-0.5 tracking-tight">
                                                                                {doc.date ? `Cargado el ${format(new Date(doc.date), 'dd/MM/yyyy')}` : (doc.url ? 'Documento disponible' : 'Pendiente de carga')}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex gap-2">
                                                                        {doc.url ? (
                                                                            <div className="flex gap-2">
                                                                                <button 
                                                                                    onClick={() => setViewerConfig({ isOpen: true, url: doc.url!, name: doc.label || doc.name || 'Documento', category: doc.category })}
                                                                                    className="p-2 bg-[#3f6066]/20 hover:bg-[#3f6066]/30 text-[#8eb2b8] rounded-lg transition-all"
                                                                                    title="Ver"
                                                                                >
                                                                                    <Eye className="w-4 h-4" />
                                                                                </button>
                                                                                <button 
                                                                                    onClick={() => handleDeleteDocument(selectedClientLedger.id, doc.category!, doc.url!, doc.name || doc.label)}
                                                                                    className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-all"
                                                                                    title="Eliminar"
                                                                                >
                                                                                     <Trash2 className="w-4 h-4" />
                                                                                </button>
                                                                            </div>
                                                                        ) : (
                                                                            <ContractUploadAction 
                                                                                reservationId={selectedClientLedger.id} 
                                                                                reservationName={selectedClientLedger.clientName}
                                                                                type={doc.category} 
                                                                                label="Subir"
                                                                                onUploadComplete={() => { toast.success('Cargado'); refreshData(); }}
                                                                            />
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                            
                                                            <div className="mt-4 pt-4 border-t border-white/5">
                                                                <ContractUploadAction 
                                                                    reservationId={selectedClientLedger.id} 
                                                                    reservationName={selectedClientLedger.clientName}
                                                                    label="Subir Otros Documentos"
                                                                    extraCategories={[
                                                                        { id: 'OTRO', label: 'Otro' },
                                                                        { id: 'CEDULA', label: 'Cédula de Identidad' },
                                                                        { id: 'COMPROBANTE_DOMICILIO', label: 'Comprobante Domicilio' }
                                                                    ]}
                                                                    onUploadComplete={() => { toast.success('Cargado'); window.location.reload(); }}
                                                                />
                                                            </div>
                                                        </>
                                                    );
                                                })()}
                                            </div>
                                        </div>

                                        {/* Right: Payment Timeline */}
                                        <div className="bg-white/[0.02] rounded-[2rem] border border-white/5 p-8 flex flex-col gap-6">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="bg-emerald-500/10 p-2.5 rounded-2xl">
                                                        <Clock className="w-5 h-5 text-emerald-400" />
                                                    </div>
                                                    <h3 className="text-lg font-black text-white uppercase tracking-tight">Historial de Pagos</h3>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => setShowPaymentsModal(true)}
                                                    className="text-[9px] font-black text-[#8eb2b8] hover:text-white uppercase tracking-tighter"
                                                >
                                                    Ver Listado <ArrowRight className="w-3.5 h-3.5 ml-2" />
                                                </Button>
                                            </div>

                                            <div className="space-y-4">
                                                {clientReceipts.slice(0, 3).map((r, i) => (
                                                    <div key={i} className="flex gap-4 relative">
                                                        {i < clientReceipts.slice(0, 3).length - 1 && (
                                                            <div className="absolute left-4 top-10 bottom-0 w-px bg-white/5" />
                                                        )}
                                                        <div className={`w-8 h-8 rounded-full border border-white/10 flex items-center justify-center shrink-0 ${r.status === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                                                            <CheckCircle className="w-4 h-4" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex justify-between items-start">
                                                                <p className="text-[10px] font-black text-white uppercase tracking-widest">{formatCurrency(r.amount_clp)}</p>
                                                                <span className="text-[8px] text-gray-600 font-bold tabular-nums">{format(new Date(r.created_at), 'dd/MM/yyyy')}</span>
                                                            </div>
                                                            <p className="text-[8px] text-[#3f6066] font-black uppercase tracking-tight mt-0.5">{r.scope === 'PIE' ? 'Pago de Pie' : 'Abono Cuota'}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                                {clientReceipts.length === 0 && (
                                                    <p className="text-center py-10 text-gray-700 font-black uppercase text-[10px] tracking-widest italic">No hay historial de pagos registrados</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    </>
                                        );
                                    })()}
                                </div>
                            </div>
                            
                            <div className="p-4 bg-black/40 border-t border-white/5 flex justify-end gap-3 z-20">
                                <Button
                                    onClick={() => setSelectedClientLedger(null)}
                                    className="bg-white/5 hover:bg-white/10 text-white font-black uppercase text-[10px] tracking-widest h-10 px-8 rounded-xl border border-white/5"
                                >
                                    Cerrar Expediente
                                </Button>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>

            {/* Global History Modal */}
            <Dialog open={showPaymentsModal} onOpenChange={setShowPaymentsModal}>
                <DialogContent className="max-w-2xl w-[95vw] h-[80vh] bg-[#0a1622] border-white/5 p-0 overflow-hidden flex flex-col rounded-[2.5rem]">
                    <DialogHeader className="p-8 pb-4 border-b border-white/10">
                        <DialogTitle className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
                            <Clock className="w-6 h-6 text-[#8eb2b8]" />
                            Detalle de Movimientos
                        </DialogTitle>
                    </DialogHeader>
                    
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
                        {/* New: Manual Payment Registration Section */}
                        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-4">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="bg-emerald-500/10 p-2 rounded-xl">
                                    <Wallet className="w-4 h-4 text-emerald-400" />
                                </div>
                                <h4 className="text-[11px] font-black text-white uppercase tracking-wider">Registrar Nuevo Pago Manual</h4>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">Monto (CLP)</label>
                                    <Input 
                                        type="number"
                                        placeholder="Ej: 500000"
                                        value={manualAmount}
                                        onChange={(e) => setManualAmount(e.target.value)}
                                        className="bg-black/20 border-white/5 h-10 text-xs text-white placeholder:text-gray-700 font-bold"
                                    />
                                </div>
                                
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">Tipo de Pago</label>
                                    <div className="flex gap-1">
                                        {(['PIE', 'INSTALLMENT', 'GASTOS_OPERACIONALES'] as const).map(s => (
                                            <button
                                                key={s}
                                                onClick={() => setManualScope(s)}
                                                className={`flex-1 h-10 rounded-xl text-[8px] font-black uppercase transition-all border ${
                                                    manualScope === s 
                                                    ? 'bg-[#3f6066] text-white border-[#3f6066]' 
                                                    : 'bg-white/5 text-gray-500 border-white/5 hover:border-white/10'
                                                }`}
                                            >
                                                {s === 'PIE' ? 'Pie' : s === 'INSTALLMENT' ? 'Cuota' : 'Gastos'}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex items-end">
                                    <Button
                                        onClick={async () => {
                                            if (!manualAmount || isRegistering) return;
                                            setIsRegistering(true);
                                            try {
                                                const res = await registerPostventaPayment({
                                                    reservationId: selectedClientLedger.id,
                                                    amount: parseInt(manualAmount),
                                                    scope: manualScope
                                                });
                                                if (res.error) toast.error(res.error);
                                                else {
                                                    toast.success("Pago registrado exitosamente");
                                                    setManualAmount('');
                                                    // Refresh the listing
                                                    setIsLoadingReceipts(true);
                                                    const updatedRes = await getReservationReceipts(selectedClientLedger.id);
                                                    if ('receipts' in updatedRes) setClientReceipts(updatedRes.receipts as any[]);
                                                    setIsLoadingReceipts(false);
                                                }
                                            } catch (e) {
                                                toast.error("Error al procesar el pago");
                                            } finally {
                                                setIsRegistering(false);
                                            }
                                        }}
                                        disabled={!manualAmount || isRegistering}
                                        className="w-full h-10 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 font-black uppercase text-[10px] tracking-widest border border-emerald-500/30 rounded-xl"
                                    >
                                        {isRegistering ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirmar Pago"}
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                                <Clock className="w-3 h-3" /> Historial de Transacciones
                            </h4>
                        {isLoadingReceipts ? (
                            <div className="flex flex-col items-center justify-center py-20 gap-4">
                                <Loader2 className="w-10 h-10 text-[#3f6066] animate-spin" />
                                <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">Cargando transacciones...</p>
                            </div>
                        ) : clientReceipts.length === 0 ? (
                            <div className="text-center py-20 opacity-20">
                                <Receipt className="w-16 h-16 mx-auto mb-4" />
                                <p className="font-black uppercase text-xs">Sin registros</p>
                            </div>
                        ) : (
                            <>
                                <div className="p-3 bg-white/5 rounded-2xl border border-white/5 mb-4">
                                     <p className="text-[8px] text-[#3f6066] font-black uppercase tracking-widest text-center">Mostrando {clientReceipts.length} recibos históricos registrados</p>
                                </div>
                                {clientReceipts.map((p, idx) => (
                                    <div key={idx} className="bg-black/40 border border-white/5 rounded-2xl p-4 flex items-center justify-between group hover:bg-white/5 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="bg-white/5 p-3 rounded-xl">
                                                <CreditCard className="w-5 h-5 text-[#8eb2b8]" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-black text-white uppercase">{formatCurrency(p.amount_clp)}</p>
                                                <p className="text-[9px] text-gray-500 font-bold uppercase mt-0.5 tracking-tight">
                                                    {p.scope === 'PIE' ? 'Pago de Pie' : `${(p.installments_count || 1) > 1 ? p.installments_count + ' Cuotas' : 'Cuota'}`} · {format(new Date(p.created_at), 'dd/MM/yyyy HH:mm')}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {getStatusBadge(p.status)}
                                            <button 
                                                onClick={() => setViewerConfig({ isOpen: true, url: p.receipt_url, name: `Recibo ${format(new Date(p.created_at), 'dd/MM/yyyy')}`, category: 'PAGO' })}
                                                className="p-2 bg-[#3f6066]/20 hover:bg-[#3f6066]/30 text-[#8eb2b8] rounded-lg transition-all"
                                                title="Ver"
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
                                ))}
                            </>
                        )}
                    </div>
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

        {/* Global Reject Dialog (for receipts tab) */}
        <Dialog open={!!rejectingId} onOpenChange={(open) => !open && setRejectingId(null)}>
            <DialogContent className="max-w-[90vw] md:max-w-md bg-[#0a1622] border-white/10">
                <DialogHeader>
                    <DialogTitle>Rechazar Transferencia</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                    <label className="text-sm font-medium mb-2 block text-gray-300">Motivo del rechazo:</label>
                    <Textarea
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="Ej: El monto no corresponde, imagen borrosa..."
                        rows={3}
                        className="bg-black/40 border-white/5"
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
