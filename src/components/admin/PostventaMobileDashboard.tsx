'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { 
    Loader2, CheckCircle, XCircle, Eye, MapPin, CreditCard, Clock, Receipt, BookOpen, 
    AlertTriangle, Search, Filter, FileSignature, Gavel, Wallet, CalendarDays, ArrowRight, ShieldAlert 
} from 'lucide-react';
import { Input } from '@/components/ui/input';
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
    onTabChange?: (tab: PostventaTab) => void;
}

export function PostventaMobileDashboard({ 
    initialReceipts, 
    soldLots, 
    activeTab, 
    ledger = [], 
    debtAlerts = [], 
    users = [],
    onTabChange 
}: PostventaMobileDashboardProps) {
    const [receipts, setReceipts] = useState(initialReceipts);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [rejectingId, setRejectingId] = useState<string | null>(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [isProcessing, setIsProcessing] = useState<string | null>(null);
    const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING');

    const [ledgerPage, setLedgerPage] = useState(1);
    const [ledgerStage, setLedgerStage] = useState<'ALL' | 1 | 2 | 3 | 4>('ALL');
    const [ledgerSearch, setLedgerSearch] = useState('');
    const [selectedClientLedger, setSelectedClientLedger] = useState<any | null>(null);
    const ledgerItemsPerPage = 20; // Increased density

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
        const filteredLedger = ledger.filter(client => {
            const matchesStage = ledgerStage === 'ALL' || client.lotStage === ledgerStage;
            const matchesSearch = client.clientName.toLowerCase().includes(ledgerSearch.toLowerCase()) || 
                                client.lotNumber?.includes(ledgerSearch);
            return matchesStage && matchesSearch;
        });

        const totalLedgerPages = Math.ceil(filteredLedger.length / ledgerItemsPerPage);
        const paginatedLedger = filteredLedger.slice((ledgerPage - 1) * ledgerItemsPerPage, ledgerPage * ledgerItemsPerPage);

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
                        
                        <div className="flex flex-wrap gap-2">
                            {(['ALL', 1, 2, 3, 4] as const).map(s => (
                                <button
                                    key={s}
                                    onClick={() => { setLedgerStage(s as any); setLedgerPage(1); }}
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

                    <div className="relative group z-10">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-[#3f6066] transition-colors" />
                        <Input 
                            placeholder="Buscar por nombre o número de lote..." 
                            value={ledgerSearch}
                            onChange={(e) => { setLedgerSearch(e.target.value); setLedgerPage(1); }}
                            className="bg-black/60 border-white/5 rounded-2xl pl-11 h-12 text-sm text-white placeholder:text-gray-700 focus:ring-[#3f6066]/20 focus:border-[#3f6066]/40 transition-all font-medium"
                        />
                        {ledgerSearch && (
                            <Button 
                                variant="ghost" 
                                onClick={() => setLedgerSearch('')}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-[#3f6066] hover:text-white uppercase transition-colors"
                            >
                                Limpiar
                            </Button>
                        )}
                    </div>
                </div>

                {/* High Density Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2">
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
                                className="bg-[#0a1622]/80 backdrop-blur-xl border border-[#3f6066]/10 p-3 rounded-2xl flex flex-col gap-2 relative overflow-hidden transition-all duration-500 hover:border-[#3f6066]/40 hover:scale-[1.02] active:scale-[0.98] shadow-2xl group cursor-pointer"
                            >
                                <div className="absolute -top-4 -right-4 w-12 h-12 bg-[#3f6066]/5 rounded-full blur-xl group-hover:bg-[#3f6066]/15 transition-all duration-700" />

                                <div className="space-y-0.5">
                                    <div className="flex justify-between items-start gap-1">
                                        <p className="font-black text-white text-[10px] leading-tight tracking-tight truncate flex-1 uppercase">{client.clientName}</p>
                                        <Badge variant="outline" className="text-[7px] font-black bg-[#3f6066]/10 text-[#8eb2b8] border-[#3f6066]/20 px-1 py-0 shrink-0 uppercase">
                                            T-{client.lotNumber}
                                        </Badge>
                                    </div>
                                    <p className="text-[7px] text-[#3f6066] font-black uppercase tracking-[0.2em] leading-none">Etapa {client.lotStage}</p>
                                </div>

                                <div className="flex items-center gap-1.5 py-1 border-y border-white/5">
                                    <div className="flex items-center gap-1" title="Contrato Reserva (Auto)">
                                        <CheckCircle className={`w-2 h-2 ${hasReserva ? 'text-emerald-400' : 'text-gray-800'}`} />
                                        <span className={`text-[5px] font-black ${hasReserva ? 'text-emerald-400/80' : 'text-gray-800'}`}>RES</span>
                                    </div>
                                    <div className="flex items-center gap-1" title="Comprobantes (Auto)">
                                        <Receipt className={`w-2 h-2 ${hasReceipts ? 'text-blue-400' : 'text-gray-800'}`} />
                                        <span className={`text-[5px] font-black ${hasReceipts ? 'text-blue-400/80' : 'text-gray-800'}`}>COM</span>
                                    </div>
                                    <div className="flex items-center gap-1" title="Promesa (Manual)">
                                        <FileSignature className={`w-2 h-2 ${hasPromesa ? 'text-cyan-400' : 'text-gray-800'}`} />
                                        <span className={`text-[5px] font-black ${hasPromesa ? 'text-cyan-400/80' : 'text-gray-800'}`}>PRM</span>
                                    </div>
                                    <div className="flex items-center gap-1" title="Gastos (Manual)">
                                        <Gavel className={`w-2 h-2 ${hasGastos ? 'text-amber-400' : 'text-gray-800'}`} />
                                        <span className={`text-[5px] font-black ${hasGastos ? 'text-amber-400/80' : 'text-gray-800'}`}>GST</span>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <div className="flex justify-between items-baseline">
                                        <span className="text-[6px] text-gray-600 font-black uppercase tracking-widest">Total</span>
                                        <span className="text-[10px] text-white font-black">{formatCurrency(client.totalPaid)}</span>
                                    </div>
                                    <div className="flex justify-between items-baseline">
                                        <span className="text-[6px] text-gray-600 font-black uppercase tracking-widest">Next</span>
                                        <span className="text-[8px] text-[#8eb2b8] font-black">
                                            {client.nextDueDate ? format(new Date(client.nextDueDate), 'dd MMM', { locale: es }) : 'N/A'}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-0.5 h-0.5 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-[#3f6066] shadow-[0_0_8px_#3f6066] transition-all duration-1000" 
                                        style={{ width: `${(client.paidCuotas / (client.totalCuotas || 1)) * 100}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })}

                    {filteredLedger.length === 0 && (
                        <div className="col-span-full text-center py-20 bg-white/5 border border-dashed border-white/10 rounded-[2rem]">
                            <Search className="w-10 h-10 text-gray-700 mx-auto mb-3 opacity-20" />
                            <p className="text-gray-500 font-black uppercase text-xs tracking-widest">Sin resultados</p>
                        </div>
                    )}
                </div>

                {/* Pagination - Premium Styled */}
                {totalLedgerPages > 1 && (
                    <div className="flex justify-between items-center bg-[#0a1622]/60 backdrop-blur-xl border border-white/5 rounded-2xl p-3">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => { setLedgerPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
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
                            onClick={() => { setLedgerPage(p => Math.min(totalLedgerPages, p + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
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
                    <DialogContent className="max-w-[95vw] sm:max-w-3xl bg-[#0a1622] border-[#3f6066]/20 p-0 overflow-hidden rounded-[2.5rem] shadow-[0_0_80px_rgba(0,0,0,0.8)]">
                        {selectedClientLedger && (
                            <div className="flex flex-col h-[85vh] sm:h-auto overflow-y-auto no-scrollbar">
                                {/* Modal Header - Brand Immersive */}
                                <div className="bg-[#3f6066]/10 p-8 border-b border-white/5 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#3f6066]/10 rounded-full blur-[100px] -mr-32 -mt-32" />
                                    <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-3">
                                                <h2 className="text-3xl font-black text-white uppercase tracking-tight leading-none">{selectedClientLedger.clientName}</h2>
                                                {selectedClientLedger.is_legacy && (
                                                    <Badge className="bg-amber-500/20 text-amber-500 border-amber-500/30 text-[8px] font-black uppercase tracking-tighter">Legacy</Badge>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="bg-[#3f6066] text-white px-4 py-1.5 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-[#3f6066]/20">
                                                    Terreno {selectedClientLedger.lotNumber}
                                                </div>
                                                <span className="text-[10px] text-[#8eb2b8] font-black uppercase tracking-[0.3em]">Etapa {selectedClientLedger.lotStage}</span>
                                            </div>
                                        </div>
                                        <div className="bg-black/40 backdrop-blur-md rounded-2xl p-4 border border-white/5 text-right flex flex-col justify-center">
                                            <p className="text-[10px] text-[#3f6066] font-black uppercase tracking-[0.2em]">Total Invertido</p>
                                            <p className="text-3xl font-black text-white leading-none mt-1.5 tabular-nums">
                                                {formatCurrency(selectedClientLedger.totalPaid)}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8 space-y-8">
                                    {/* Core Stats - High Visibility */}
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                        {[
                                            { label: 'Cuotas Pagadas', value: `${selectedClientLedger.paidCuotas} / ${selectedClientLedger.totalCuotas}`, icon: Wallet },
                                            { label: 'Próximo Pago', value: selectedClientLedger.nextDueDate ? format(new Date(selectedClientLedger.nextDueDate), 'dd MMM yy', { locale: es }) : 'N/A', icon: CalendarDays, color: 'text-[#8eb2b8]' },
                                            { label: 'Monto Cuota', value: formatCurrency(selectedClientLedger.valor_cuota || 0), icon: CreditCard },
                                            { label: 'Estado Pie', value: selectedClientLedger.pieStatus, badge: true }
                                        ].map((stat, i) => (
                                            <div key={i} className="bg-white/5 rounded-[1.5rem] p-5 border border-white/5 flex flex-col justify-between group hover:border-[#3f6066]/30 transition-all">
                                                <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest mb-3 flex items-center gap-2">
                                                    {stat.icon && <stat.icon className="w-3 h-3 text-[#3f6066]" />}
                                                    {stat.label}
                                                </p>
                                                {stat.badge ? (
                                                    <Badge className={`${selectedClientLedger.pieStatus === 'PAID' ? 'bg-emerald-500 shadow-emerald-500/20' : 'bg-amber-500 shadow-amber-500/20'} text-white font-black text-[10px] px-3 py-1 rounded-lg uppercase tracking-wider`}>
                                                        {stat.value}
                                                    </Badge>
                                                ) : (
                                                    <p className={`text-lg font-black text-white ${stat.color || ''} leading-none`}>{stat.value}</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Documentation Section - Interactive Grid */}
                                    <div className="space-y-5">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] flex items-center gap-3">
                                                <div className="w-2 h-2 rounded-full bg-[#3f6066] shadow-[0_0_10px_#3f6066]" />
                                                Expediente Digital
                                            </h3>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {/* Item: Promesa */}
                                            <div className="bg-white/5 rounded-2xl p-5 border border-white/5 flex flex-col h-full group">
                                                <div className="flex justify-between items-start mb-6">
                                                    <div className="p-2.5 bg-[#3f6066]/10 rounded-xl border border-[#3f6066]/20">
                                                        <FileSignature className="w-5 h-5 text-[#8eb2b8]" />
                                                    </div>
                                                    {selectedClientLedger.uploaded_contract_url ? (
                                                        <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 font-black text-[8px] uppercase">Cargado</Badge>
                                                    ) : (
                                                        <Badge variant="outline" className="text-gray-600 border-gray-800 font-black text-[8px] uppercase">Pendiente</Badge>
                                                    )}
                                                </div>
                                                <div className="flex-1 mb-6">
                                                    <p className="text-white font-black text-sm uppercase tracking-tight">Promesa de Compra</p>
                                                    <p className="text-[9px] text-gray-500 font-black uppercase mt-1">Contrato Legal Firmado</p>
                                                </div>
                                                <ContractUploadAction 
                                                    reservationId={selectedClientLedger.id} 
                                                    reservationName={selectedClientLedger.clientName}
                                                    label={selectedClientLedger.uploaded_contract_url ? "Actualizar Archivo" : "Subir PDF Firmado"}
                                                    onUploadComplete={() => toast.success("Expediente actualizado")}
                                                />
                                            </div>

                                            {/* Item: Gastos Op */}
                                            <div className="bg-white/5 rounded-2xl p-5 border border-white/5 flex flex-col h-full group">
                                                <div className="flex justify-between items-start mb-6">
                                                    <div className="p-2.5 bg-[#3f6066]/10 rounded-xl border border-[#3f6066]/20">
                                                        <Gavel className="w-5 h-5 text-[#8eb2b8]" />
                                                    </div>
                                                    {Array.isArray(selectedClientLedger.manual_documents) && selectedClientLedger.manual_documents.some((d: any) => d.category === 'GASTOS_OPERACIONALES') ? (
                                                        <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 font-black text-[8px] uppercase">Cargado</Badge>
                                                    ) : (
                                                        <Badge variant="outline" className="text-gray-600 border-gray-800 font-black text-[8px] uppercase">Pendiente</Badge>
                                                    )}
                                                </div>
                                                <div className="flex-1 mb-6">
                                                    <p className="text-white font-black text-sm uppercase tracking-tight">Gastos Operacionales</p>
                                                    <p className="text-[9px] text-gray-500 font-black uppercase mt-1">Comprobante Notarial</p>
                                                </div>
                                                <ContractUploadAction 
                                                    reservationId={selectedClientLedger.id} 
                                                    reservationName={selectedClientLedger.clientName}
                                                    type="GASTOS_OPERACIONALES"
                                                    label="Registrar Gastos"
                                                    onUploadComplete={() => toast.success("Expediente actualizado")}
                                                />
                                            </div>

                                            {/* Item: Pagos Manuales */}
                                            <div className="bg-white/5 rounded-2xl p-5 border border-white/5 flex flex-col h-full group sm:col-span-2 lg:col-span-1">
                                                <div className="flex justify-between items-start mb-6">
                                                    <div className="p-2.5 bg-[#3f6066]/10 rounded-xl border border-[#3f6066]/20">
                                                        <Wallet className="w-5 h-5 text-[#8eb2b8]" />
                                                    </div>
                                                    <Badge className="bg-[#3f6066]/10 text-[#8eb2b8] border-[#3f6066]/20 font-black text-[8px] uppercase">Registro Manual</Badge>
                                                </div>
                                                <div className="flex-1 mb-6">
                                                    <p className="text-white font-black text-sm uppercase tracking-tight">Pagos Externos</p>
                                                    <p className="text-[9px] text-gray-500 font-black uppercase mt-1">Transferencias / Efectivo</p>
                                                </div>
                                                <ContractUploadAction 
                                                    reservationId={selectedClientLedger.id} 
                                                    reservationName={selectedClientLedger.clientName}
                                                    type="COMPROBANTE_CUOTA"
                                                    label="Cargar Comprobante"
                                                    onUploadComplete={() => toast.success("Pago registrado")}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Mora Control Panel - Immersive Dark Mode */}
                                    <div className="bg-black/60 rounded-[2rem] p-8 border border-red-500/10 relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:scale-125 transition-all duration-1000 grayscale">
                                            <ShieldAlert className="w-48 h-48 text-red-500" />
                                        </div>
                                        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center gap-8">
                                            <div className="flex-1 space-y-3">
                                                <h3 className="text-xs font-black text-red-500/60 uppercase tracking-[0.3em] flex items-center gap-2">
                                                    <Clock className="w-4 h-4" />
                                                    Gestión de Morosidad
                                                </h3>
                                                <p className="text-white font-black text-lg uppercase tracking-tight">Exención y Congelación de Intereses</p>
                                                <p className="text-[11px] text-gray-500 leading-relaxed font-medium max-w-lg">
                                                    Controla la aplicación de multas automáticas e intereses diarios. Congelar la mora eximirá al cliente de notificaciones de cobranza y mantendrá su deuda en $0 temporalmente.
                                                </p>
                                            </div>
                                            <div className="shrink-0">
                                                <AdminMoraManager users={users} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="p-8 pt-0 flex justify-center">
                                    <Button 
                                        variant="ghost" 
                                        onClick={() => setSelectedClientLedger(null)} 
                                        className="w-full sm:w-auto px-12 h-12 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-gray-600 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 transition-all"
                                    >
                                        Cerrar Vista Detallada
                                    </Button>
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        );
    }

    if (activeTab === 'alertas') {
        const filteredAlerts = debtAlerts.filter(alert => {
            const isFrozen = Boolean(alert.isMoraFrozen);
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
            late: debtAlerts.filter(a => a.isLate && !a.isMoraFrozen).length,
            grace: debtAlerts.filter(a => a.isGracePeriod && !a.isMoraFrozen).length,
            upcoming: debtAlerts.filter(a => a.isUpcoming && !a.isMoraFrozen).length,
            ok: debtAlerts.filter(a => a.isUpToDate || a.isMoraFrozen).length
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
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3">
                            {paginatedAlerts.map(alert => {
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
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-3">
                {filteredReceipts.map(receipt => (
                    <div
                        key={receipt.id}
                        className={`rounded-2xl border p-4 space-y-3 backdrop-blur-xl transition-all duration-500 hover:scale-[1.02] active:scale-[0.98] flex flex-col justify-between shadow-2xl group ${receipt.status === 'PENDING'
                            ? 'bg-amber-500/5 border-amber-500/20'
                            : receipt.status === 'APPROVED'
                                ? 'bg-[#3f6066]/5 border-[#3f6066]/20'
                                : '@bg-red-500/5 border-red-500/20'
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
