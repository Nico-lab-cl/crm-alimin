'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent,    DialogHeader, 
    DialogTitle, 
    DialogDescription 
} from "@/components/ui/dialog";
import { Textarea } from '@/components/ui/textarea';
import { 
    Loader2, CheckCircle, XCircle, Eye, MapPin, CreditCard, Clock, Receipt, BookOpen, 
    AlertTriangle, Search, Filter, FileSignature, Gavel, Wallet, CalendarDays, ArrowRight, ShieldAlert, RefreshCw,
    FileText, Download, Trash2, Edit, Map, Snowflake, Calendar as CalendarIcon, UploadCloud, Pencil
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { approvePaymentReceipt, rejectPaymentReceipt, deletePaymentReceipt, editReceiptAmount } from '@/actions/receipts';
import { syncLegacyReceipts, getReservationReceipts, registerPostventaPayment, adjustInstallmentsPaid, condoneMoraInterest } from '@/actions/postventa';
import { toggleMoraFreeze, updateMoraDates } from '@/actions/dashboard';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { UniversalDocumentViewer } from "@/components/shared/UniversalDocumentViewer";
import { MoraExplainerCard } from './MoraExplainerCard';
import { ContractUploadAction } from "@/components/admin/ContractUploadAction";
import { exportToExcel } from '@/lib/export-utils';
import { AdminMoraManager } from "@/components/admin/AdminMoraManager"
import { AssignOwnerModal } from "@/components/dashboard/AssignOwnerModal";
import { AdminLotList } from "@/components/dashboard/AdminLotList";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { PaymentButtons } from "@/components/user/PaymentButtons";
import { SignContractModal } from "@/components/SignContractModal";

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
    const [manualScope, setManualScope] = useState<'PIE' | 'INSTALLMENT' | 'GASTOS_OPERACIONALES' | 'MORA'>('INSTALLMENT');
    const [manualInstallmentNumber, setManualInstallmentNumber] = useState<string>('');
    const [manualInstallmentsCount, setManualInstallmentsCount] = useState<string>('1');
    const [isUserView, setIsUserView] = useState(false);
    const [manualFile, setManualFile] = useState<File | null>(null);
    const [isRegistering, setIsRegistering] = useState(false);

    const [moraStartDate, setMoraStartDate] = useState<Date | undefined>(undefined);
    const [moraEndDate, setMoraEndDate] = useState<Date | undefined>(undefined);
    const [isUpdatingMora, setIsUpdatingMora] = useState(false);

    // Edit Receipt Amount State
    const [editingReceipt, setEditingReceipt] = useState<any | null>(null);
    const [editAmount, setEditAmount] = useState('');
    const [editReason, setEditReason] = useState('');
    const [isEditingAmount, setIsEditingAmount] = useState(false);

    // Adjust Cuotas State
    const [isAdjustingCuotas, setIsAdjustingCuotas] = useState(false);
    const [adjustCuotasValue, setAdjustCuotasValue] = useState('');
    const [adjustCuotasReason, setAdjustCuotasReason] = useState('');
    const [isSubmittingAdjust, setIsSubmittingAdjust] = useState(false);

    // Condone Mora Interest State
    const [condoningInstallment, setCondoningInstallment] = useState<{ number: number; amount: number; monthName: string } | null>(null);
    const [condoneReason, setCondoneReason] = useState('');
    const [isCondoning, setIsCondoning] = useState(false);

    useEffect(() => {
        if (selectedClientLedger) {
            setMoraStartDate(selectedClientLedger.legacy_debt_start_date ? new Date(selectedClientLedger.legacy_debt_start_date) : undefined);
            setMoraEndDate(selectedClientLedger.legacy_debt_end_date ? new Date(selectedClientLedger.legacy_debt_end_date) : undefined);
            setManualInstallmentNumber(String((selectedClientLedger.paidCuotas || 0) + 1));
            setManualInstallmentsCount('1');
        }
    }, [selectedClientLedger]);
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
            
            toast.success("Documento eliminado correctamente");
            refreshData();
        } catch (error) {
            console.error(error);
            toast.error("No se pudo eliminar el documento");
        }
    };

    const handleDeleteReceipt = async (receiptId: string) => {
        if (!confirm('¿Estás seguro de que deseas eliminar este registro de pago? Esto también revertirá el contador de cuotas si aplica.')) return;
        
        try {
            const res = await deletePaymentReceipt(receiptId);
            if (res.error) {
                toast.error(res.error);
                return;
            }
            
            toast.success("Pago eliminado correctamente");
            
            // Refresh history
            if (selectedClientLedger?.id) {
                const updatedRes = await getReservationReceipts(selectedClientLedger.id);
                if (updatedRes.success) setClientReceipts(updatedRes.receipts || []);
            }
            
            refreshData();
        } catch (error) {
            console.error(error);
            toast.error("No se pudo eliminar el pago");
        }
    };

    const handleCondoneMoraInterest = async () => {
        if (!condoningInstallment || !selectedClientLedger?.id || isCondoning) return;
        if (!condoneReason || condoneReason.trim().length < 5) {
            toast.error('Ingresa un motivo (mínimo 5 caracteres)');
            return;
        }
        setIsCondoning(true);
        try {
            const res = await condoneMoraInterest({
                reservationId: selectedClientLedger.id,
                installmentNumber: condoningInstallment.number,
                amount: condoningInstallment.amount,
                reason: condoneReason
            });
            if (res.error) {
                toast.error(res.error);
            } else {
                toast.success(res.message || 'Interés de mora condonado');
                setCondoningInstallment(null);
                setCondoneReason('');
                refreshData();
            }
        } catch (e) {
            toast.error('Error al condonar el interés de mora');
        } finally {
            setIsCondoning(false);
        }
    };

    const handleEditReceiptAmount = async () => {
        if (!editingReceipt || !editAmount || isEditingAmount) return;
        const newAmount = parseInt(editAmount);
        if (isNaN(newAmount) || newAmount <= 0) {
            toast.error('Ingresa un monto válido');
            return;
        }
        setIsEditingAmount(true);
        try {
            const res = await editReceiptAmount(editingReceipt.id, newAmount, editReason);
            if (res.error) {
                toast.error(res.error);
            } else {
                toast.success(res.message || 'Monto actualizado');
                setEditingReceipt(null);
                setEditAmount('');
                setEditReason('');
                // Refresh receipts list
                if (selectedClientLedger?.id) {
                    const updatedRes = await getReservationReceipts(selectedClientLedger.id);
                    if (updatedRes.success) setClientReceipts(updatedRes.receipts || []);
                }
                refreshData();
            }
        } catch (e) {
            toast.error('Error al editar el monto');
        } finally {
            setIsEditingAmount(false);
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
                pendingAmount: formatCurrency((alert.penaltyAmount || alert.monto_cuota || 0) + (alert.pending_amount || 0)),
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
            <div className="space-y-4 pb-24 font-sans text-gray-900 bg-gray-50 min-h-screen -m-4 p-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 shadow-inner">
                        <Map className="w-8 h-8 text-[#E0B457]" />
                    </div>
                    <div className="flex-1">
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase">
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

                <div className="bg-white backdrop-blur-md rounded-[2rem] p-6 border border-gray-200 shadow-sm">
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
            if (ledgerStatus === 'PAID') {
                matchesStatus = client.reservationStatus === 'paid';
            } else if (ledgerStatus === 'PENDING') {
                matchesStatus = client.reservationStatus !== 'paid';
            }

            return matchesSearch && matchesStage && matchesStatus;
        });

        const totalLedgerPages = Math.ceil(filteredLedger.length / LEDGER_ITEMS_PER_PAGE);
        const paginatedLedger = filteredLedger.slice(
            (ledgerPage - 1) * LEDGER_ITEMS_PER_PAGE,
            ledgerPage * LEDGER_ITEMS_PER_PAGE
        );

        content = (
            <div className="space-y-4 pb-24 font-sans text-gray-900 bg-gray-50 min-h-screen -m-4 p-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Header & Controls - Premium Glassmorphism */}
                <div className="bg-white backdrop-blur-xl border border-[#3f6066]/20 p-4 md:p-6 rounded-[2rem] space-y-4 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <BookOpen className="w-24 h-24 text-[#3f6066]" />
                    </div>
                    
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
                        <div className="flex items-center gap-3">
                            <div className="bg-[#3f6066]/20 p-2.5 rounded-2xl border border-[#3f6066]/30">
                                <BookOpen className="w-5 h-5 text-[#4A6E75]" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-gray-900 tracking-tight uppercase">Estado de Cuentas</h2>
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
                                className="bg-[#3f6066]/10 border-[#3f6066]/30 text-[#4A6E75] hover:bg-[#3f6066]/20 text-[10px] font-black uppercase tracking-widest h-9"
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
                                        ? 'bg-[#3f6066] text-gray-900 border-[#3f6066] shadow-[0_0_15px_rgba(63,96,102,0.3)]'
                                        : 'bg-gray-50 text-gray-500 border-gray-200 hover:border-gray-300 hover:shadow-md hover:text-gray-700'
                                        }`}
                                >
                                    {s === 'ALL' ? 'Todas' : `Etapa ${s}`}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Month and Status Filters */}
                    <div className="flex flex-wrap items-center gap-3 relative z-10 py-2 border-t border-gray-200">
                        <div className="flex items-center gap-2 bg-white rounded-2xl p-1 border border-gray-200">
                            <select 
                                value={ledgerStatus}
                                onChange={(e) => { setLedgerStatus(e.target.value as any); setLedgerPage(1); }}
                                className="bg-transparent text-gray-900 text-[10px] font-black uppercase tracking-widest px-3 py-2 outline-none cursor-pointer"
                            >
                                <option value="ALL" className="bg-white">Estado: Todos</option>
                                <option value="PAID" className="bg-white">Pagados</option>
                                <option value="PENDING" className="bg-white">Sin Pagar</option>
                            </select>
                        </div>

                        <div className="flex items-center gap-2 bg-white rounded-2xl p-1 border border-gray-200">
                            <select 
                                value={ledgerMonth}
                                onChange={(e) => { setLedgerMonth(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value)); setLedgerPage(1); }}
                                className="bg-transparent text-gray-900 text-[10px] font-black uppercase tracking-widest px-3 py-2 outline-none cursor-pointer"
                            >
                                <option value="ALL" className="bg-white">Mes: Todos</option>
                                {['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'].map((m, i) => (
                                    <option key={i} value={i} className="bg-white">{m}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-center gap-2 bg-white rounded-2xl p-1 border border-gray-200">
                            <select 
                                value={ledgerYear}
                                onChange={(e) => { setLedgerYear(Number(e.target.value)); setLedgerPage(1); }}
                                className="bg-transparent text-gray-900 text-[10px] font-black uppercase tracking-widest px-3 py-2 outline-none cursor-pointer"
                            >
                                {[2024, 2025, 2026, 2027].map(y => (
                                    <option key={y} value={y} className="bg-white">{y}</option>
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
                            className="bg-white border-gray-200 rounded-2xl pl-11 h-12 text-sm text-gray-900 placeholder:text-gray-400 focus:ring-[#3f6066]/20 focus:border-[#3f6066]/40 transition-all font-medium"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                             {ledgerSearch && (
                                <Button 
                                    size="sm"
                                    onClick={() => setLedgerPage(1)}
                                    className="bg-[#3f6066] text-gray-900 hover:bg-[#3f6066]/80 h-8 rounded-xl text-[9px] font-black uppercase tracking-tighter"
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
                                    className="text-[9px] font-black text-[#3f6066] hover:text-gray-900 uppercase transition-colors h-8"
                                >
                                    Limpiar
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
                
                {/* Optimized Desktop Grid - Reduced Density for Readability */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
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
                                className="bg-white border-2 border-gray-200 p-5 rounded-[2rem] flex flex-col gap-3 relative overflow-hidden transition-all duration-500 hover:border-[#3f6066]/30 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] hover:scale-[1.02] active:scale-[0.98] shadow-sm group cursor-pointer"
                            >
                                <div className="absolute -top-4 -right-4 w-12 h-12 bg-[#3f6066]/5 rounded-full blur-xl group-hover:bg-[#3f6066]/15 transition-all duration-700" />

                                <div className="space-y-1">
                                    <div className="flex justify-between items-start gap-2">
                                        <p className="font-black text-gray-900 text-[11px] md:text-sm leading-tight tracking-tight truncate flex-1 uppercase">{client.clientName}</p>
                                        <Badge variant="outline" className="text-[8px] md:text-[10px] font-black bg-[#3f6066]/10 text-[#4A6E75] border-[#3f6066]/20 px-1.5 py-0 shrink-0 uppercase">
                                            T-{client.lotNumber}
                                        </Badge>
                                    </div>
                                    <p className="text-[8px] md:text-[10px] text-[#3f6066] font-black uppercase tracking-[0.2em] leading-none">Etapa {client.lotStage}</p>
                                </div>

                                <div className="flex items-center gap-2 py-2 border-y border-gray-100">
                                    <div className="flex items-center gap-1.5" title="Contrato Reserva (Auto)">
                                        <CheckCircle className={`w-3 h-3 ${hasReserva ? 'text-emerald-400' : 'text-gray-300'}`} />
                                        <span className={`text-[7px] md:text-[8px] font-black ${hasReserva ? 'text-emerald-400/80' : 'text-gray-300'}`}>RES</span>
                                    </div>
                                    <div className="flex items-center gap-1.5" title="Comprobantes (Auto)">
                                        <Receipt className={`w-3 h-3 ${hasReceipts ? 'text-blue-400' : 'text-gray-300'}`} />
                                        <span className={`text-[7px] md:text-[8px] font-black ${hasReceipts ? 'text-blue-400/80' : 'text-gray-300'}`}>COM</span>
                                    </div>
                                    <div className="flex items-center gap-1.5" title="Promesa (Manual)">
                                        <FileSignature className={`w-3 h-3 ${hasPromesa ? 'text-cyan-400' : 'text-gray-300'}`} />
                                        <span className={`text-[7px] md:text-[8px] font-black ${hasPromesa ? 'text-cyan-400/80' : 'text-gray-300'}`}>PRM</span>
                                    </div>
                                    <div className="flex items-center gap-1.5" title="Gastos (Manual)">
                                        <Gavel className={`w-3 h-3 ${hasGastos ? 'text-amber-400' : 'text-gray-300'}`} />
                                        <span className={`text-[7px] md:text-[8px] font-black ${hasGastos ? 'text-amber-400/80' : 'text-gray-300'}`}>GST</span>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <div className="flex justify-between items-baseline">
                                        <span className="text-[7px] md:text-[8px] text-gray-600 font-black uppercase tracking-widest">Invertido</span>
                                        <span className="text-[11px] md:text-sm text-gray-900 font-black">{formatCurrency(client.totalPaid)}</span>
                                    </div>
                                    <div className="flex justify-between items-baseline">
                                        <span className="text-[7px] md:text-[8px] text-gray-600 font-black uppercase tracking-widest">Próximo</span>
                                        <span className="text-[9px] md:text-[11px] text-[#4A6E75] font-black tabular-nums">
                                            {client.nextDueDate ? format(new Date(client.nextDueDate), 'dd MMM yy', { locale: es }) : 'Finalizado'}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-1 h-1 w-full bg-gray-50 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-[#3f6066] shadow-[0_0_8px_#3f6066] transition-all duration-1000" 
                                        style={{ width: `${(client.paidCuotas / (client.totalCuotas || 1)) * 100}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })}

                    {paginatedLedger.length === 0 && (
                        <div className="col-span-full text-center py-20 bg-gray-50 border border-dashed border-gray-200 rounded-[2rem]">
                            <Search className="w-10 h-10 text-gray-700 mx-auto mb-3 opacity-20" />
                            <p className="text-gray-500 font-black uppercase text-xs tracking-widest">
                                {ledgerSearch ? 'Sin resultados para la búsqueda' : 'No hay clientes registrados'}
                            </p>
                        </div>
                    )}
                </div>

                {/* Pagination - Premium Styled */}
                {totalLedgerPages > 1 && (
                    <div className="flex justify-between items-center bg-white backdrop-blur-xl border border-gray-200 rounded-2xl p-3">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setLedgerPage(ledgerPage - 1)}
                            disabled={ledgerPage === 1}
                            className="text-[10px] font-black uppercase tracking-widest text-[#3f6066] hover:text-gray-900"
                        >
                            <ArrowRight className="w-3 h-3 mr-2 rotate-180" />
                            Anterior
                        </Button>
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] text-gray-600 font-black uppercase tracking-widest">Página</span>
                            <span className="text-sm text-gray-900 font-black px-3 py-1 bg-[#3f6066]/20 rounded-lg border border-[#3f6066]/30">
                                {ledgerPage} <span className="text-[#3f6066] text-xs mx-1">/</span> {totalLedgerPages}
                            </span>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setLedgerPage(ledgerPage + 1)}
                            disabled={ledgerPage === totalLedgerPages}
                            className="text-[10px] font-black uppercase tracking-widest text-[#3f6066] hover:text-gray-900"
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
            <div className="space-y-6 pb-24 font-sans text-gray-900 bg-gray-50 min-h-screen -m-4 p-4">
                {/* Dashboard Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <div className="bg-red-500/20 p-2 rounded-lg">
                                <AlertTriangle className="w-5 h-5 text-red-500" />
                            </div>
                            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Gestión de Clientes</h2>
                        </div>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-[0.2em] ml-11">
                            {format(today, "EEEE d 'de' MMMM 'de' yyyy", { locale: es })}
                        </p>
                    </div>

                    {/* Actions and Badges */}
                    <div className="flex items-center gap-3 self-start md:self-end">
                        <Badge variant="outline" className="md:hidden font-bold bg-gray-50 border-gray-200 text-gray-900 px-3 py-1">
                            {filteredAlerts.length} Clientes Filtrados
                        </Badge>
                        <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleExportAlerts(filteredAlerts)}
                            className="bg-gray-50 border-gray-200 text-gray-900 hover:bg-gray-100 font-bold text-[10px] uppercase tracking-wider px-4 h-10 rounded-xl"
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
                        <div className="hidden lg:block bg-white backdrop-blur-xl border border-gray-200 rounded-2xl p-5 space-y-4 shadow-sm">
                            <div className="flex items-center justify-between">
                                <h3 className="text-gray-900 font-bold text-xs uppercase tracking-wider opacity-60">Panorama General</h3>
                                <Badge className="bg-gray-100 text-[10px]">{stats.total}</Badge>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mt-2">
                                <div className="bg-red-500/5 border border-red-500/10 p-3 rounded-xl transition-colors hover:bg-red-500/10">
                                    <p className="text-red-500 text-[9px] font-black uppercase tracking-tighter mb-1">Mora</p>
                                    <p className="text-gray-900 text-xl font-black">{stats.late}</p>
                                </div>
                                <div className="bg-amber-500/5 border border-amber-500/10 p-3 rounded-xl transition-colors hover:bg-amber-500/10">
                                    <p className="text-amber-500 text-[9px] font-black uppercase tracking-tighter mb-1">Gracia</p>
                                    <p className="text-gray-900 text-xl font-black">{stats.grace}</p>
                                </div>
                                <div className="bg-blue-500/5 border border-blue-500/10 p-3 rounded-xl transition-colors hover:bg-blue-500/10">
                                    <p className="text-blue-500 text-[9px] font-black uppercase tracking-tighter mb-1">Próximo</p>
                                    <p className="text-gray-900 text-xl font-black">{stats.upcoming}</p>
                                </div>
                                <div className="bg-green-500/5 border border-green-500/10 p-3 rounded-xl transition-colors hover:bg-green-500/10">
                                    <p className="text-green-500 text-[9px] font-black uppercase tracking-tighter mb-1">Al Día</p>
                                    <p className="text-gray-900 text-xl font-black">{stats.ok}</p>
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
                                className="bg-white border-gray-200 rounded-2xl pl-11 h-12 text-sm text-gray-900 placeholder:text-gray-400 focus:ring-[#3f6066]/20 focus:border-[#3f6066]/40 transition-all font-medium"
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                {alertSearch && (
                                    <Button 
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => { setAlertSearch(''); setAlertPage(1); }}
                                        className="h-8 text-[9px] font-black text-gray-500 hover:text-gray-900 uppercase"
                                    >
                                        Limpiar
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Filter Sections */}
                        <div className="space-y-6 bg-white lg:bg-transparent p-4 lg:p-0 rounded-2xl border border-gray-200 lg:border-none backdrop-blur-md lg:backdrop-blur-none transition-all">
                            {/* Filter: Status */}
                            <div className="space-y-3">
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">Estado de Pago</p>
                                <div className="flex flex-wrap lg:flex-col gap-2">
                                    {(['ALL', 'LATE', 'GRACE', 'UPCOMING', 'OK'] as const).map(f => (
                                        <button
                                            key={f}
                                            onClick={() => { setAlertFilter(f); setAlertPage(1); }}
                                            className={`px-4 py-2.5 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all border flex items-center gap-2 flex-grow lg:flex-grow-0 cursor-pointer ${alertFilter === f
                                                ? 'bg-[#36595F] text-gray-900 border-[#36595F] shadow-sm shadow-[#36595F]/20 translate-x-1'
                                                : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 hover:border-gray-300'
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
                                                : 'bg-gray-50 text-gray-500 border-gray-200 hover:border-gray-300'
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
                                <span className="text-gray-900 font-black text-sm">{stats.late}</span>
                            </div>
                            <div className="bg-amber-500/10 border border-amber-500/20 px-4 py-2 rounded-lg shrink-0">
                                <span className="text-amber-400 font-bold text-xs uppercase mr-2">Gracia:</span>
                                <span className="text-gray-900 font-black text-sm">{stats.grace}</span>
                            </div>
                            <div className="bg-blue-500/10 border border-blue-500/20 px-4 py-2 rounded-lg shrink-0">
                                <span className="text-blue-400 font-bold text-xs uppercase mr-2">Próximo:</span>
                                <span className="text-gray-900 font-black text-sm">{stats.upcoming}</span>
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

                                let colorClass = 'bg-white border-[#3f6066]/20';
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
                                        className={`${colorClass} p-3 rounded-2xl border backdrop-blur-xl transition-all duration-500 hover:scale-[1.03] active:scale-[0.98] flex flex-col justify-between relative overflow-hidden shadow-sm group cursor-pointer`}
                                        onClick={() => { 
                                            setSelectedClientLedger(alert); 
                                        }}
                                    >
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-start gap-1">
                                                <div className="min-w-0 flex-1">
                                                    <p className="font-black text-gray-900 text-[10px] truncate tracking-tight uppercase leading-none">{alert.clientName}</p>
                                                    <div className="flex items-center gap-1 mt-1">
                                                        <span className="text-[7px] font-black px-1 py-0 rounded bg-[#3f6066]/10 text-[#4A6E75] border border-[#3f6066]/20 uppercase">T-{alert.lotNumber}</span>
                                                        {alert.legacy_installment_start_date ? (
                                                            <span className="text-[7px] font-black px-1 py-0 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase" title="Día de pago de cada mes">
                                                                Día {new Date(alert.legacy_installment_start_date).getDate()}
                                                            </span>
                                                        ) : (
                                                            <span className="text-[7px] font-black px-1 py-0 rounded bg-gray-100 text-gray-500 border border-gray-200 uppercase" title="Día de pago de cada mes">
                                                                Día 5
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <Badge className={`bg-white/80 ${accentClass} border-${accentClass.split('-')[1]}-500/20 text-[7px] font-black uppercase tracking-wider px-1 py-0.5`}>
                                                    {badgeLabel}
                                                </Badge>
                                            </div>

                                            <div className="bg-white rounded-xl p-2 md:p-2.5 border border-gray-200 space-y-1">
                                                {isLate ? (
                                                    <>
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-[6px] text-gray-500 font-black uppercase tracking-widest leading-none">Cuota Base</span>
                                                            <span className="text-[9px] text-gray-900 font-black leading-none">
                                                                {formatCurrency(alert.valor_cuota || 0)}
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-[6px] text-gray-500 font-black uppercase tracking-widest leading-none">Meses Mora</span>
                                                            <span className="text-[8px] text-red-500 font-black truncate max-w-[80px] leading-none" title={alert.overdueInstallments?.map((o: any) => o.monthName).join(', ')}>
                                                                {alert.overdueInstallments && alert.overdueInstallments.length > 0 
                                                                    ? alert.overdueInstallments.map((o: any) => o.monthName).join(', ')
                                                                    : 'Saldo Pend.'}
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-[6px] text-gray-500 font-black uppercase tracking-widest leading-none">Días Atraso</span>
                                                            <span className="text-[9px] text-red-500 font-black leading-none">
                                                                {alert.lateDays} {alert.lateDays === 1 ? 'día' : 'días'}
                                                            </span>
                                                        </div>
                                                        <div className="pt-1 mt-1 border-t border-dashed border-gray-200 flex justify-between items-center">
                                                            <span className="text-[6px] text-[#3f6066] font-black uppercase tracking-widest leading-none">Total Vencido</span>
                                                            <span className="text-[10px] text-red-500 font-black leading-none">
                                                                {formatCurrency(alert.totalOverdueAmount || 0)}
                                                            </span>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-[6px] text-gray-500 font-black uppercase tracking-widest leading-none">Monto</span>
                                                            <span className={`font-black ${accentClass} text-[10px] leading-none`}>
                                                                {isOK ? formatCurrency(alert.cuotasAmount + (alert.pending_amount || 0)) : formatCurrency((alert.monto_cuota || 0) + (alert.pending_amount || 0))}
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-[6px] text-gray-500 font-black uppercase tracking-widest leading-none">Fecha</span>
                                                            <span className="text-[9px] text-gray-900 font-black leading-none">
                                                                {alert.displayDueDate ? format(new Date(alert.displayDueDate), 'dd MMM', { locale: es }) : 'N/A'}
                                                            </span>
                                                        </div>
                                                    </>
                                                )}
                                            </div>

                                            <div className="flex justify-between items-center text-[8px]">
                                                <span className={`${accentClass} font-black uppercase`}>{statusText}</span>
                                                <span className="text-gray-500 font-bold uppercase text-[7px] tracking-tighter">
                                                    {alert.totalCuotas === 0 ? "CONTADO" : `#${alert.paidCuotas + 1}`}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {filteredAlerts.length === 0 && (
                            <div className="text-center py-16 bg-gray-50 border border-dashed border-gray-200 rounded-3xl">
                                <CheckCircle className="w-12 h-12 text-green-500/40 mx-auto mb-4" />
                                <p className="text-gray-600 font-bold text-lg">No hay clientes aquí</p>
                                <p className="text-gray-600 text-sm mt-1 uppercase tracking-widest font-medium">Búsqueda impecable</p>
                            </div>
                        )}

                        {/* Pagination */}
                        {totalAlertPages > 1 && (
                            <div className="flex justify-between items-center bg-white backdrop-blur-xl border border-gray-200 rounded-2xl p-4 mt-8">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setAlertPage(alertPage - 1)}
                                    disabled={alertPage === 1}
                                    className="h-9 px-4 text-[11px] font-black uppercase bg-gray-50 border-gray-200 text-gray-900 hover:bg-gray-100 transition-all cursor-pointer"
                                >
                                    Anterior
                                </Button>
                                <div className="flex flex-col items-center">
                                    <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Página</span>
                                    <span className="text-sm text-gray-900 font-black">{alertPage} <span className="text-gray-600 text-xs">de {totalAlertPages}</span></span>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setAlertPage(alertPage + 1)}
                                    disabled={alertPage === totalAlertPages}
                                    className="h-9 px-4 text-[11px] font-black uppercase bg-gray-50 border-gray-200 text-gray-900 hover:bg-gray-100 transition-all cursor-pointer"
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
            <div className="space-y-4 pb-24 font-sans text-gray-900 bg-gray-50 min-h-screen -m-4 p-4">
                <MoraExplainerCard soldLots={soldLots} />
            </div>
        );
    } else {
        content = (
            <div className="space-y-4 pb-24 font-sans text-gray-900 bg-gray-50 min-h-screen -m-4 p-4">
                {/* Header */}
            </div>
        );
    }

    return (
        <div className="relative">
            {content}

            {/* Global Client Detail Modal */}
            <Dialog open={!!selectedClientLedger} onOpenChange={(open) => !open && setSelectedClientLedger(null)}>
                <DialogContent className="max-w-5xl w-[95vw] h-[90vh] bg-white border-[#3f6066]/20 p-0 overflow-hidden rounded-[2.5rem] shadow-[0_0_80px_rgba(0,0,0,0.8)] flex flex-col">
                    <DialogTitle className="sr-only">Detalles del Cliente</DialogTitle>
                    <DialogDescription className="sr-only">
                        Información detallada del estado de cuenta, cuotas y pagos del cliente.
                    </DialogDescription>
                    {selectedClientLedger && (
                        <>
                            <div className="flex-1 overflow-y-auto no-scrollbar">
                                {/* Modal Header - Brand Immersive */}
                                <div className="bg-gradient-to-br from-[#3f6066]/20 to-transparent p-8 border-b border-gray-200 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-80 h-80 bg-[#3f6066]/10 rounded-full blur-[100px] -mr-40 -mt-40" />
                                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                                        <div className="flex items-center gap-6">
                                            <div className="w-16 h-16 rounded-2xl bg-[#3f6066] flex items-center justify-center shadow-sm shadow-[#3f6066]/20 flex-shrink-0 border border-gray-200">
                                                <span className="text-2xl font-black text-gray-900">
                                                    {selectedClientLedger.clientName?.charAt(0)}
                                                </span>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-3">
                                                    <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight leading-none">{selectedClientLedger.clientName}</h2>
                                                    {selectedClientLedger.is_legacy && (
                                                        <Badge className="bg-amber-500/20 text-amber-500 border-amber-500/30 text-[8px] font-black uppercase">Legacy</Badge>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <Badge className="bg-white/80 text-[#4A6E75] border-[#3f6066]/30 text-[9px] font-black uppercase px-2 py-0.5">Lote {selectedClientLedger.lotNumber}</Badge>
                                                    <Badge className="bg-white/80 text-[#4A6E75] border-[#3f6066]/30 text-[9px] font-black uppercase px-2 py-0.5">Etapa {selectedClientLedger.lotStage}</Badge>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-3">
                                            <div className="bg-white backdrop-blur-md rounded-2xl p-5 border border-gray-200 text-right min-w-[200px] flex flex-col gap-3">
                                                <div>
                                                    <p className="text-[10px] text-[#3f6066] font-black uppercase tracking-[0.2em]">Total Invertido</p>
                                                    <p className="text-3xl font-black text-gray-900 leading-none mt-1.5 tabular-nums">
                                                        {formatCurrency(selectedClientLedger.totalPaid)}
                                                    </p>
                                                </div>
                                                <div className="pt-3 border-t border-gray-200">
                                                    <p className="text-[9px] text-[#3f6066] font-black uppercase tracking-[0.2em]">Valor Total Terreno</p>
                                                    <p className="text-lg font-black text-[#4A6E75] leading-none mt-1 tabular-nums">
                                                        {formatCurrency(selectedClientLedger.totalToPay)}
                                                    </p>
                                                </div>
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
                                                className="h-8 text-[9px] font-black text-[#4A6E75] hover:text-gray-900 uppercase tracking-widest bg-gray-50 hover:bg-[#3f6066]/20 border-gray-200 rounded-xl px-4"
                                            >
                                                <RefreshCw className="w-3 h-3 mr-2" />
                                                Sincronizar Datos
                                            </Button>

                                            <Button 
                                                variant="outline" 
                                                size="sm"
                                                onClick={() => setIsEditModalOpen(true)}
                                                className="h-8 text-[9px] font-black text-[#4A6E75] hover:text-gray-900 uppercase tracking-widest bg-gray-50 hover:bg-[#3f6066]/20 border-gray-200 rounded-xl px-4"
                                            >
                                                <Edit className="w-3 h-3 mr-2" />
                                                Editar Cliente
                                            </Button>

                                            <Button 
                                                variant="outline" 
                                                size="sm"
                                                onClick={() => setIsUserView(!isUserView)}
                                                className={cn(
                                                    "h-8 text-[9px] font-black uppercase tracking-widest border-gray-200 rounded-xl px-4",
                                                    isUserView 
                                                        ? "bg-amber-500 text-black hover:bg-amber-600 border-amber-600" 
                                                        : "bg-gray-50 text-[#4A6E75] hover:bg-[#3f6066]/20"
                                                )}
                                            >
                                                <Eye className="w-3 h-3 mr-2" />
                                                {isUserView ? "Volver a Admin" : "Ver como Usuario"}
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
                                                    "h-8 text-[9px] font-black uppercase tracking-widest rounded-xl px-4 border-gray-200",
                                                    selectedClientLedger.isMoraFrozen 
                                                        ? "bg-red-500/20 text-red-400 hover:bg-red-500/30" 
                                                        : "bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20"
                                                )}
                                            >
                                                <Snowflake className="w-3 h-3 mr-2" />
                                                {selectedClientLedger.isMoraFrozen ? "Activar Mora" : "Congelar Mora"}
                                            </Button>

                                            <div className="bg-white backdrop-blur-md rounded-2xl p-4 border border-gray-200 w-full max-w-[250px] space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <p className="text-[10px] text-[#3f6066] font-black uppercase tracking-widest">Rango de Mora Manual</p>
                                                    <ShieldAlert className="w-3 h-3 text-amber-500" />
                                                </div>
                                                
                                                <div className="space-y-2">
                                                    <div className="space-y-1">
                                                        <p className="text-[8px] text-gray-500 font-bold uppercase ml-1">Inicio</p>
                                                        <Popover>
                                                            <PopoverTrigger asChild>
                                                                <Button variant="outline" size="sm" className="w-full h-8 bg-gray-50 border-gray-200 text-[10px] font-bold text-[#4A6E75] justify-start px-2">
                                                                    <CalendarIcon className="w-3 h-3 mr-2 opacity-50" />
                                                                    {moraStartDate ? format(moraStartDate, 'dd/MM/yy') : "Normal"}
                                                                </Button>
                                                            </PopoverTrigger>
                                                            <PopoverContent className="w-auto p-0 bg-white border-gray-200" align="end">
                                                                <div className="p-2 border-b border-gray-200 flex justify-between items-center">
                                                                    <span className="text-[9px] font-black text-gray-900 uppercase ml-2">Inicio de Mora</span>
                                                                    <Button variant="ghost" size="sm" className="h-6 text-[8px] text-red-400 font-bold" onClick={() => setMoraStartDate(undefined)}>Limpiar</Button>
                                                                </div>
                                                                <Calendar mode="single" selected={moraStartDate} onSelect={setMoraStartDate} initialFocus className="bg-transparent text-gray-900" />
                                                            </PopoverContent>
                                                        </Popover>
                                                    </div>

                                                    <div className="space-y-1">
                                                        <p className="text-[8px] text-gray-500 font-bold uppercase ml-1">Fin (Cierre)</p>
                                                        <Popover>
                                                            <PopoverTrigger asChild>
                                                                <Button variant="outline" size="sm" className="w-full h-8 bg-gray-50 border-gray-200 text-[10px] font-bold text-[#4A6E75] justify-start px-2">
                                                                    <CalendarIcon className="w-3 h-3 mr-2 opacity-50" />
                                                                    {moraEndDate ? format(moraEndDate, 'dd/MM/yy') : "Hasta Hoy"}
                                                                </Button>
                                                            </PopoverTrigger>
                                                            <PopoverContent className="w-auto p-0 bg-white border-gray-200" align="end">
                                                                <div className="p-2 border-b border-gray-200 flex justify-between items-center">
                                                                    <span className="text-[9px] font-black text-gray-900 uppercase ml-2">Término de Mora</span>
                                                                    <Button variant="ghost" size="sm" className="h-6 text-[8px] text-red-400 font-bold" onClick={() => setMoraEndDate(undefined)}>Hasta Hoy</Button>
                                                                </div>
                                                                <Calendar mode="single" selected={moraEndDate} onSelect={setMoraEndDate} initialFocus className="bg-transparent text-gray-900" />
                                                            </PopoverContent>
                                                        </Popover>
                                                    </div>

                                                    <Button 
                                                        onClick={async () => {
                                                            setIsUpdatingMora(true);
                                                            const res = await updateMoraDates(
                                                                selectedClientLedger.id, 
                                                                moraStartDate?.toISOString() || null, 
                                                                moraEndDate?.toISOString() || null
                                                            );
                                                            setIsUpdatingMora(false);
                                                            if (res.error) toast.error(res.error);
                                                            else {
                                                                toast.success(res.message);
                                                                window.location.reload();
                                                            }
                                                        }}
                                                        disabled={isUpdatingMora}
                                                        className="w-full h-8 bg-[#3f6066] hover:bg-[#3f6066]/80 text-gray-900 text-[9px] font-black uppercase tracking-widest rounded-xl mt-2"
                                                    >
                                                        {isUpdatingMora ? <Loader2 className="w-3 h-3 animate-spin" /> : "Guardar Fechas"}
                                                    </Button>
                                                </div>
                                            </div>

                                            {selectedClientLedger.observation && (
                                                <div className="mt-2 w-full max-w-[250px] p-3 rounded-xl bg-[#3f6066]/10 border border-[#3f6066]/30 text-left backdrop-blur-md shadow-inner">
                                                    <p className="text-[9px] font-black text-[#4A6E75] uppercase tracking-widest mb-1 flex items-center gap-1">
                                                        <FileText className="w-3 h-3" />
                                                        Observación
                                                    </p>
                                                    <p className="text-xs text-gray-900/90 leading-relaxed whitespace-pre-wrap">
                                                        {selectedClientLedger.observation}
                                                    </p>
                                                </div>
                                            )}
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
                                            { label: 'Cuotas Pagadas', value: selectedClientLedger.totalCuotas === 0 ? 'Al Contado' : `${selectedClientLedger.paidCuotas} / ${selectedClientLedger.totalCuotas}`, icon: Wallet },
                                            { label: 'Próximo Pago', value: selectedClientLedger.nextDueDate ? format(new Date(selectedClientLedger.nextDueDate), 'dd MMM yy', { locale: es }) : 'N/A', icon: CalendarDays, color: 'text-[#4A6E75]' },
                                            { label: 'Monto Cuota', value: formatCurrency(selectedClientLedger.valor_cuota || 0), icon: CreditCard },
                                            { label: 'Estado Pie', value: selectedClientLedger.pieStatus, badge: true }
                                        ].map((stat, i) => (
                                            <div key={i} className="bg-gray-50 rounded-3xl p-5 border border-gray-200 flex flex-col items-center text-center group hover:bg-[#3f6066]/5 hover:border-[#3f6066]/20 transition-all">
                                                <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest mb-3 flex items-center gap-2">
                                                    {stat.icon && <stat.icon className="w-3.5 h-3.5 text-[#3f6066]" />}
                                                    {stat.label}
                                                </p>
                                                {stat.badge ? (
                                                    <Badge className={`${selectedClientLedger.pieStatus === 'PAID' ? 'bg-emerald-500 shadow-emerald-500/20' : 'bg-amber-500 shadow-amber-500/20'} text-gray-900 font-black text-[10px] px-3 py-1 rounded-xl uppercase`}>
                                                        {selectedClientLedger.pieStatus}
                                                    </Badge>
                                                ) : (
                                                    <p className={`text-xl font-black ${stat.color || 'text-gray-900'} tabular-nums`}>{stat.value}</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    
                                    {/* Discrepancy Alert - installments_paid vs actual receipts */}
                                    {selectedClientLedger.installmentDiscrepancy > 0 && (
                                        <div className="bg-amber-500/5 border-2 border-dashed border-amber-500/30 rounded-2xl p-5 space-y-3">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-amber-500/15 p-2 rounded-xl">
                                                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-xs font-black text-amber-600 uppercase tracking-wider">Discrepancia Detectada</p>
                                                    <p className="text-[10px] text-gray-600 mt-0.5">
                                                        La BD registra <strong className="text-gray-900">{selectedClientLedger.paidCuotas}</strong> cuotas pagadas, pero solo hay <strong className="text-gray-900">{selectedClientLedger.receiptBasedInstallmentCount}</strong> recibos digitales.
                                                        <span className="text-amber-600 font-bold"> ({selectedClientLedger.installmentDiscrepancy} cuotas sin respaldo)</span>
                                                    </p>
                                                </div>
                                            </div>
                                            
                                            {!isAdjustingCuotas ? (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => {
                                                        setIsAdjustingCuotas(true);
                                                        setAdjustCuotasValue(String(selectedClientLedger.receiptBasedInstallmentCount));
                                                        setAdjustCuotasReason('');
                                                    }}
                                                    className="bg-amber-500/10 border-amber-500/30 text-amber-600 hover:bg-amber-500/20 text-[10px] font-black uppercase tracking-widest h-9 rounded-xl w-full"
                                                >
                                                    <Pencil className="w-3 h-3 mr-2" />
                                                    Ajustar Cuotas Pagadas
                                                </Button>
                                            ) : (
                                                <div className="bg-white rounded-xl p-4 border border-gray-200 space-y-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex-1">
                                                            <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest block mb-1">Nuevo valor de cuotas pagadas</label>
                                                            <Input
                                                                type="number"
                                                                min={0}
                                                                max={selectedClientLedger.totalCuotas}
                                                                value={adjustCuotasValue}
                                                                onChange={(e) => setAdjustCuotasValue(e.target.value)}
                                                                className="h-10 text-center text-lg font-black rounded-xl"
                                                            />
                                                        </div>
                                                        <div className="text-center pt-4">
                                                            <p className="text-[8px] text-gray-400 font-bold">de</p>
                                                            <p className="text-sm font-black text-gray-900">{selectedClientLedger.totalCuotas}</p>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest block mb-1">Motivo del ajuste</label>
                                                        <Textarea
                                                            value={adjustCuotasReason}
                                                            onChange={(e) => setAdjustCuotasReason(e.target.value)}
                                                            placeholder="Ej: Corrección migración legacy, solo 4 cuotas fueron pagadas realmente..."
                                                            className="text-xs resize-none rounded-xl"
                                                            rows={2}
                                                        />
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => setIsAdjustingCuotas(false)}
                                                            className="flex-1 h-9 text-[10px] font-black uppercase tracking-widest rounded-xl"
                                                            disabled={isSubmittingAdjust}
                                                        >
                                                            Cancelar
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            onClick={async () => {
                                                                const newVal = parseInt(adjustCuotasValue);
                                                                if (isNaN(newVal) || newVal < 0) {
                                                                    toast.error('Ingresa un número válido');
                                                                    return;
                                                                }
                                                                if (!adjustCuotasReason.trim() || adjustCuotasReason.trim().length < 5) {
                                                                    toast.error('Ingresa un motivo (mínimo 5 caracteres)');
                                                                    return;
                                                                }
                                                                setIsSubmittingAdjust(true);
                                                                try {
                                                                    const res = await adjustInstallmentsPaid({
                                                                        reservationId: selectedClientLedger.id,
                                                                        newCount: newVal,
                                                                        reason: adjustCuotasReason.trim()
                                                                    });
                                                                    if (res.error) {
                                                                        toast.error(res.error);
                                                                    } else {
                                                                        toast.success(res.message || 'Cuotas ajustadas correctamente');
                                                                        setIsAdjustingCuotas(false);
                                                                        refreshData();
                                                                    }
                                                                } catch (e) {
                                                                    toast.error('Error al ajustar cuotas');
                                                                } finally {
                                                                    setIsSubmittingAdjust(false);
                                                                }
                                                            }}
                                                            disabled={isSubmittingAdjust}
                                                            className="flex-1 h-9 bg-amber-500 hover:bg-amber-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl"
                                                        >
                                                            {isSubmittingAdjust ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Confirmar Ajuste'}
                                                        </Button>
                                                    </div>
                                                    <p className="text-[8px] text-gray-400 text-center">
                                                        Este cambio queda registrado en la auditoría del sistema.
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Detalle de Deuda Vencida (Solo si está en Mora) */}
                                    {selectedClientLedger.isLate && (
                                        <div className="bg-red-500/[0.02] border border-red-500/10 rounded-[2rem] p-6 lg:p-8 space-y-6 shadow-sm">
                                            <div className="flex items-center gap-3 border-b border-red-500/10 pb-4">
                                                <div className="bg-red-500/15 p-2.5 rounded-2xl">
                                                    <AlertTriangle className="w-5 h-5 text-red-500" />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">Detalle de Deuda Vencida</h3>
                                                    <p className="text-[10px] text-gray-600 font-bold uppercase mt-0.5 tracking-wider">
                                                        Desglose del saldo atrasado requerido para poner la cuenta al día.
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Resumen de Deuda */}
                                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                                <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
                                                    <p className="text-[8px] text-gray-500 font-black uppercase tracking-widest mb-1.5">Cuotas Base Vencidas</p>
                                                    <p className="text-lg font-black text-gray-900 tabular-nums">
                                                        {formatCurrency(selectedClientLedger.totalOverdueInstallmentsAmount || 0)}
                                                    </p>
                                                </div>
                                                <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
                                                    <p className="text-[8px] text-gray-500 font-black uppercase tracking-widest mb-1.5">Intereses por Mora</p>
                                                    <p className="text-lg font-black text-red-500 tabular-nums">
                                                        {formatCurrency(selectedClientLedger.penaltyAmount || 0)}
                                                    </p>
                                                </div>
                                                {(selectedClientLedger.moraCreditsReal || 0) > 0 && (
                                                    <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 shadow-sm">
                                                        <p className="text-[8px] text-emerald-600 font-black uppercase tracking-widest mb-1.5">Abono a Intereses</p>
                                                        <p className="text-lg font-black text-emerald-600 tabular-nums">
                                                            -{formatCurrency(selectedClientLedger.moraCreditsReal || 0)}
                                                        </p>
                                                    </div>
                                                )}
                                                {(selectedClientLedger.moraCondoned || 0) > 0 && (
                                                    <div className="bg-teal-50 border border-teal-200 rounded-2xl p-4 shadow-sm">
                                                        <p className="text-[8px] text-teal-600 font-black uppercase tracking-widest mb-1.5">Condonado</p>
                                                        <p className="text-lg font-black text-teal-600 tabular-nums">
                                                            -{formatCurrency(selectedClientLedger.moraCondoned || 0)}
                                                        </p>
                                                    </div>
                                                )}
                                                {(selectedClientLedger.residualMoraTotal || 0) > 0 && (
                                                    <div className="bg-red-50 border border-red-200 rounded-2xl p-4 shadow-sm">
                                                        <p className="text-[8px] text-red-600 font-black uppercase tracking-widest mb-1.5">Interés Mora (Cuotas Pagadas)</p>
                                                        <p className="text-lg font-black text-red-600 tabular-nums">
                                                            {formatCurrency(selectedClientLedger.residualMoraTotal || 0)}
                                                        </p>
                                                    </div>
                                                )}
                                                <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
                                                    <p className="text-[8px] text-gray-500 font-black uppercase tracking-widest mb-1.5">Saldo Pendiente Manual</p>
                                                    <p className="text-lg font-black text-gray-900 tabular-nums">
                                                        {formatCurrency(selectedClientLedger.pending_amount || 0)}
                                                    </p>
                                                    {selectedClientLedger.pending_amount_reason && (
                                                        <p className="text-[7px] text-gray-600 font-medium mt-1 truncate" title={selectedClientLedger.pending_amount_reason}>
                                                            Motivo: {selectedClientLedger.pending_amount_reason}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="bg-[#36595F]/10 border border-[#36595F]/20 rounded-2xl p-4 shadow-sm">
                                                    <p className="text-[8px] text-[#3f6066] font-black uppercase tracking-widest mb-1.5">Total Adeudado Vencido</p>
                                                    <p className="text-xl font-black text-red-500 tabular-nums">
                                                        {formatCurrency(selectedClientLedger.totalOverdueAmount || 0)}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Listado de Cuotas Overdue */}
                                            {selectedClientLedger.overdueInstallments && selectedClientLedger.overdueInstallments.length > 0 && (
                                                <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
                                                    <table className="w-full text-left border-collapse">
                                                        <thead>
                                                            <tr className="bg-gray-50/50 border-b border-gray-200">
                                                                <th className="p-3 text-[9px] font-black text-[#3f6066] uppercase tracking-widest text-center">N° Cuota</th>
                                                                <th className="p-3 text-[9px] font-black text-[#3f6066] uppercase tracking-widest">Mes correspondiente</th>
                                                                <th className="p-3 text-[9px] font-black text-[#3f6066] uppercase tracking-widest">Vencimiento</th>
                                                                <th className="p-3 text-[9px] font-black text-[#3f6066] uppercase tracking-widest text-right">Valor Cuota</th>
                                                                <th className="p-3 text-[9px] font-black text-[#3f6066] uppercase tracking-widest text-center">Días de Atraso</th>
                                                                <th className="p-3 text-[9px] font-black text-[#3f6066] uppercase tracking-widest text-right">Interés Mora</th>
                                                                <th className="p-3 text-[9px] font-black text-[#3f6066] uppercase tracking-widest text-center">Acción</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-gray-100 text-xs">
                                                            {selectedClientLedger.overdueInstallments.map((inst: any, idx: number) => (
                                                                <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                                                                    <td className="p-3 font-black text-gray-900 text-center tabular-nums">#{inst.number}</td>
                                                                    <td className="p-3 font-bold text-gray-900 uppercase tracking-tight">{inst.monthName}</td>
                                                                    <td className="p-3 text-gray-600 font-bold tabular-nums">
                                                                        {format(new Date(inst.dueDate), 'dd/MM/yyyy')}
                                                                    </td>
                                                                    <td className="p-3 text-right font-black text-gray-900 tabular-nums">
                                                                        {formatCurrency(inst.amount)}
                                                                    </td>
                                                                    <td className="p-3 text-center text-red-500 font-black tabular-nums">
                                                                        {inst.daysLate} {inst.daysLate === 1 ? 'día' : 'días'}
                                                                    </td>
                                                                    <td className="p-3 text-right text-red-500 font-black tabular-nums">
                                                                        {formatCurrency(inst.interestPenalty)}
                                                                    </td>
                                                                    <td className="p-3 text-center">
                                                                        {inst.capitalPaid && inst.interestPenalty > 0 && (
                                                                            <button
                                                                                onClick={() => setCondoningInstallment({ number: inst.number, amount: inst.interestPenalty, monthName: inst.monthName })}
                                                                                className="text-[9px] font-black uppercase tracking-widest text-emerald-500 hover:text-emerald-600 underline underline-offset-2"
                                                                                title="Condonar interés de mora de esta cuota"
                                                                            >
                                                                                Condonar
                                                                            </button>
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                        {/* Left: Documents Section */}
                                        <div className="bg-white/[0.02] rounded-[2rem] border border-gray-200 p-8 flex flex-col gap-6">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="bg-[#8eb2b8]/10 p-2.5 rounded-2xl">
                                                        <Receipt className="w-5 h-5 text-[#4A6E75]" />
                                                    </div>
                                                    <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">Documentación</h3>
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
                                                            const match = manualDocs.find((d: any) => d.category === cat.id);
                                                            if (match) {
                                                                docInfo.url = match.url;
                                                                docInfo.date = match.uploadedAt;
                                                                docInfo.name = match.name;
                                                            } else {
                                                                const parsedLegacy = selectedClientLedger.legacy_uploaded_contracts ? JSON.parse(selectedClientLedger.legacy_uploaded_contracts) : null;
                                                                if (parsedLegacy && parsedLegacy.length > 0) {
                                                                    docInfo.url = parsedLegacy[0].url;
                                                                    docInfo.name = parsedLegacy[0].name;
                                                                }
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
                                                                <div key={doc.category || idx} className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center justify-between group hover:bg-gray-50 transition-all">
                                                                    <div className="flex items-center gap-4">
                                                                        <div className="bg-gray-50 p-2 rounded-xl group-hover:bg-[#3f6066]/20 transition-all">
                                                                            <FileText className="w-4 h-4 text-gray-500 group-hover:text-[#4A6E75]" />
                                                                        </div>
                                                                        <div>
                                                                            <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest">{doc.label || doc.name}</p>
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
                                                                                    className="p-2 bg-[#3f6066]/20 hover:bg-[#3f6066]/30 text-[#4A6E75] rounded-lg transition-all"
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
                                                            
                                                            <div className="mt-4 pt-4 border-t border-gray-200">
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

                                        {isUserView && (
                                            <div className="md:col-span-2 border-4 border-dashed border-amber-500/30 rounded-[3rem] p-8 bg-amber-50/50 relative overflow-hidden">
                                                <div className="absolute top-4 right-8 flex items-center gap-2">
                                                    <div className="w-2 h-2 bg-amber-500 rounded-full animate-ping" />
                                                    <span className="text-[10px] font-black text-amber-600 uppercase tracking-[0.2em]">Vista de Cliente Activa</span>
                                                </div>
                                                <div className="max-w-4xl mx-auto space-y-8">
                                                    <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-amber-200">
                                                        <h4 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
                                                            <div className="bg-amber-500/10 p-2 rounded-xl">
                                                                <CreditCard className="w-5 h-5 text-amber-600" />
                                                            </div>
                                                            Módulo de Pagos del Cliente
                                                        </h4>
                                                        <PaymentButtons 
                                                            reservationId={selectedClientLedger.id}
                                                            lot={selectedClientLedger.lot}
                                                            reservation={selectedClientLedger}
                                                            acquisitionDate={selectedClientLedger.created_at}
                                                            isAdminView={false}
                                                        />
                                                    </div>
                                                    
                                                    {!selectedClientLedger.signed_at && (
                                                        <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-amber-200">
                                                            <h4 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
                                                                <div className="bg-amber-500/10 p-2 rounded-xl">
                                                                    <FileSignature className="w-5 h-5 text-amber-600" />
                                                                </div>
                                                                Contrato Pendiente de Firma
                                                            </h4>
                                                            <SignContractModal 
                                                                reservationId={selectedClientLedger.id}
                                                                lotNumber={selectedClientLedger.lotNumber}
                                                                lotStage={selectedClientLedger.lotStage}
                                                                onSuccess={() => window.location.reload()}
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                        
                                        {/* Right: Payment Timeline */}
                                        <div className="bg-white/[0.02] rounded-[2rem] border border-gray-200 p-8 flex flex-col gap-6">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="bg-emerald-500/10 p-2.5 rounded-2xl">
                                                        <Clock className="w-5 h-5 text-emerald-400" />
                                                    </div>
                                                    <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">Historial de Pagos</h3>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => setShowPaymentsModal(true)}
                                                    className="text-[9px] font-black text-[#4A6E75] hover:text-gray-900 uppercase tracking-tighter"
                                                >
                                                    Ver Listado <ArrowRight className="w-3.5 h-3.5 ml-2" />
                                                </Button>
                                            </div>

                                            <div className="space-y-4">
                                                {clientReceipts.slice(0, 3).map((r, i) => (
                                                    <div key={i} className="flex gap-4 relative">
                                                        {i < clientReceipts.slice(0, 3).length - 1 && (
                                                            <div className="absolute left-4 top-10 bottom-0 w-px bg-gray-50" />
                                                        )}
                                                        <div className={`w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center shrink-0 ${r.status === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                                                            <CheckCircle className="w-4 h-4" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex justify-between items-start">
                                                                <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest">{formatCurrency(r.amount_clp)}</p>
                                                                <span className="text-[8px] text-gray-600 font-bold tabular-nums">{format(new Date(r.created_at), 'dd/MM/yyyy')}</span>
                                                            </div>
                                                            <p className="text-[8px] text-[#3f6066] font-black uppercase tracking-tight mt-0.5">
                                                                {r.receipt_url === 'CONDONACION_ADMIN' ? 'Condonación de Mora' : r.scope === 'PIE' ? 'Pago de Pie' : r.scope === 'MORA' ? (r.isFullyPaidInterest ? 'Interés Pagado' : 'Abono Interés') : 'Abono Cuota'}
                                                            </p>
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
                            
                            <div className="p-4 bg-white border-t border-gray-200 flex justify-end gap-3 z-20">
                                <Button
                                    onClick={() => setSelectedClientLedger(null)}
                                    className="bg-gray-50 hover:bg-gray-100 text-gray-900 font-black uppercase text-[10px] tracking-widest h-10 px-8 rounded-xl border border-gray-200"
                                >
                                    Cerrar Expediente
                                </Button>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>

        {/* Edit Receipt Amount Modal */}
        <Dialog open={!!editingReceipt} onOpenChange={(open) => { if (!open) { setEditingReceipt(null); setEditAmount(''); setEditReason(''); } }}>
            <DialogContent className="max-w-[90vw] md:max-w-md bg-white border-gray-200 rounded-3xl">
                <DialogHeader>
                    <DialogTitle className="text-gray-900 font-black uppercase tracking-tight flex items-center gap-3">
                        <Pencil className="w-5 h-5 text-amber-400" />
                        Editar Monto de Pago
                    </DialogTitle>
                    <DialogDescription className="text-gray-500 text-xs">
                        Modifica el monto registrado. Se guardará un registro de auditoría con el cambio.
                    </DialogDescription>
                </DialogHeader>
                {editingReceipt && (
                    <div className="py-4 space-y-5">
                        {/* Current info */}
                        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Monto Actual</span>
                                <span className="text-lg font-black text-red-400 line-through tabular-nums">{formatCurrency(editingReceipt.amount_clp)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Tipo</span>
                                <span className="text-[10px] font-bold text-[#4A6E75] uppercase">{editingReceipt.scope === 'PIE' ? 'Pago de Pie' : 'Cuota'}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Fecha</span>
                                <span className="text-[10px] font-bold text-gray-600">{format(new Date(editingReceipt.created_at), 'dd/MM/yyyy HH:mm')}</span>
                            </div>
                        </div>

                        {/* New Amount */}
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">Nuevo Monto (CLP)</label>
                            <Input
                                type="number"
                                placeholder="Ej: 550000"
                                value={editAmount}
                                onChange={(e) => setEditAmount(e.target.value)}
                                className="bg-white/20 border-gray-200 h-12 text-lg text-gray-900 placeholder:text-gray-400 font-black tabular-nums"
                                autoFocus
                            />
                            {editAmount && parseInt(editAmount) !== editingReceipt.amount_clp && (
                                <div className={`text-[10px] font-bold ml-1 ${parseInt(editAmount) > editingReceipt.amount_clp ? 'text-emerald-400' : 'text-red-400'}`}>
                                    {parseInt(editAmount) > editingReceipt.amount_clp ? '▲' : '▼'} Diferencia: {formatCurrency(Math.abs(parseInt(editAmount) - editingReceipt.amount_clp))}
                                </div>
                            )}
                        </div>

                        {/* Reason */}
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">Motivo del Cambio</label>
                            <Textarea
                                placeholder="Ej: Cliente pagó monto completo sin descuento aplicado..."
                                value={editReason}
                                onChange={(e) => setEditReason(e.target.value)}
                                rows={2}
                                className="bg-white/20 border-gray-200 text-xs text-gray-900 placeholder:text-gray-400"
                            />
                        </div>

                        {/* Audit badge */}
                        <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-3 flex items-start gap-2">
                            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                            <p className="text-[9px] text-amber-400/80 font-bold leading-relaxed">
                                Este cambio quedará registrado en el log de auditoría con tu usuario, la fecha y el motivo especificado.
                            </p>
                        </div>
                    </div>
                )}
                <div className="flex flex-col-reverse sm:flex-row justify-end gap-2">
                    <Button
                        variant="outline"
                        onClick={() => { setEditingReceipt(null); setEditAmount(''); setEditReason(''); }}
                        className="min-h-[44px] bg-gray-50 border-gray-200 text-gray-900 hover:bg-gray-100 font-black uppercase text-[10px] tracking-widest rounded-xl"
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleEditReceiptAmount}
                        disabled={isEditingAmount || !editAmount || parseInt(editAmount) === editingReceipt?.amount_clp}
                        className="min-h-[44px] bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/30 font-black uppercase text-[10px] tracking-widest rounded-xl"
                    >
                        {isEditingAmount ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Pencil className="w-4 h-4 mr-2" />}
                        Confirmar Cambio
                    </Button>
                </div>
            </DialogContent>
        </Dialog>

        {/* Condone Mora Interest Modal */}
        <Dialog open={!!condoningInstallment} onOpenChange={(open) => { if (!open) { setCondoningInstallment(null); setCondoneReason(''); } }}>
            <DialogContent className="max-w-[90vw] md:max-w-md bg-white border-gray-200 rounded-3xl">
                <DialogHeader>
                    <DialogTitle className="text-gray-900 font-black uppercase tracking-tight flex items-center gap-3">
                        <Gavel className="w-5 h-5 text-emerald-500" />
                        Condonar Interés de Mora
                    </DialogTitle>
                    <DialogDescription className="text-gray-500 text-xs">
                        Perdona el interés de mora acumulado de esta cuota. Se guardará un registro de auditoría con el motivo.
                    </DialogDescription>
                </DialogHeader>
                {condoningInstallment && (
                    <div className="py-4 space-y-5">
                        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Cuota</span>
                                <span className="text-[10px] font-bold text-[#4A6E75] uppercase">#{condoningInstallment.number} · {condoningInstallment.monthName}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Interés de Mora a Condonar</span>
                                <span className="text-lg font-black text-emerald-500 tabular-nums">{formatCurrency(condoningInstallment.amount)}</span>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">Motivo de la Condonación</label>
                            <Textarea
                                placeholder="Ej: Consenso del equipo de postventa para perdonar la multa..."
                                value={condoneReason}
                                onChange={(e) => setCondoneReason(e.target.value)}
                                rows={2}
                                className="bg-white/20 border-gray-200 text-xs text-gray-900 placeholder:text-gray-400"
                                autoFocus
                            />
                        </div>

                        <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-3 flex items-start gap-2">
                            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                            <p className="text-[9px] text-amber-400/80 font-bold leading-relaxed">
                                Esta condonación quedará registrada en el log de auditoría con tu usuario, la fecha y el motivo. No genera comprobante para el cliente ni afecta otras cuotas.
                            </p>
                        </div>
                    </div>
                )}
                <div className="flex flex-col-reverse sm:flex-row justify-end gap-2">
                    <Button
                        variant="outline"
                        onClick={() => { setCondoningInstallment(null); setCondoneReason(''); }}
                        className="min-h-[44px] bg-gray-50 border-gray-200 text-gray-900 hover:bg-gray-100 font-black uppercase text-[10px] tracking-widest rounded-xl"
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleCondoneMoraInterest}
                        disabled={isCondoning || condoneReason.trim().length < 5}
                        className="min-h-[44px] bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-500 border border-emerald-500/30 font-black uppercase text-[10px] tracking-widest rounded-xl"
                    >
                        {isCondoning ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Gavel className="w-4 h-4 mr-2" />}
                        Confirmar Condonación
                    </Button>
                </div>
            </DialogContent>
        </Dialog>

            {/* Global History Modal */}
            <Dialog open={showPaymentsModal} onOpenChange={setShowPaymentsModal}>
                <DialogContent className="max-w-2xl w-[95vw] h-[80vh] bg-white border-gray-200 p-0 overflow-hidden flex flex-col rounded-[2.5rem]">
                    <DialogHeader className="p-8 pb-4 border-b border-gray-200">
                        <DialogTitle className="text-xl font-black text-gray-900 uppercase tracking-tighter flex items-center gap-3">
                            <Clock className="w-6 h-6 text-[#4A6E75]" />
                            Detalle de Movimientos
                        </DialogTitle>
                    </DialogHeader>
                    
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
                        {/* New: Manual Payment Registration Section */}
                        <div className="bg-gray-50 border border-gray-200 rounded-3xl p-6 space-y-4">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="bg-emerald-500/10 p-2 rounded-xl">
                                    <Wallet className="w-4 h-4 text-emerald-400" />
                                </div>
                                <h4 className="text-[11px] font-black text-gray-900 uppercase tracking-wider">Registrar Nuevo Pago Manual</h4>
                            </div>
                            
                            <div className={cn(
                                "grid grid-cols-1 gap-4",
                                manualScope === 'INSTALLMENT' ? "md:grid-cols-5" : (manualScope === 'MORA' ? "md:grid-cols-4" : "md:grid-cols-3")
                            )}>
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">Monto (CLP)</label>
                                    <Input 
                                        type="number"
                                        placeholder="Ej: 500000"
                                        value={manualAmount}
                                        onChange={(e) => setManualAmount(e.target.value)}
                                        className="bg-white/20 border-gray-200 h-10 text-xs text-gray-900 placeholder:text-gray-400 font-bold"
                                    />
                                </div>
                                
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">Tipo de Pago</label>
                                    <div className="flex gap-1">
                                        {(['PIE', 'INSTALLMENT', 'GASTOS_OPERACIONALES', 'MORA'] as const).map(s => (
                                            <button
                                                key={s}
                                                onClick={() => setManualScope(s)}
                                                className={`flex-1 h-10 rounded-xl text-[8px] font-black uppercase transition-all border ${
                                                    manualScope === s 
                                                    ? (s === 'MORA' ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-[#3f6066] text-gray-900 border-[#3f6066]')
                                                    : 'bg-gray-50 text-gray-500 border-gray-200 hover:border-gray-200'
                                                }`}
                                            >
                                                {s === 'PIE' ? 'Pie' : s === 'INSTALLMENT' ? 'Cuota' : s === 'GASTOS_OPERACIONALES' ? 'Gastos' : 'Abono Interés'}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {manualScope === 'INSTALLMENT' && (
                                    <div className="space-y-1.5">
                                        <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">Cantidad de Cuotas</label>
                                        <select
                                            value={manualInstallmentsCount}
                                            onChange={(e) => setManualInstallmentsCount(e.target.value)}
                                            className="w-full bg-white border border-gray-200 rounded-xl h-10 px-3 text-xs text-gray-900 font-bold focus:outline-none focus:ring-1 focus:ring-[#3f6066]"
                                        >
                                            {Array.from(
                                                { length: Math.max(1, (selectedClientLedger?.totalCuotas || 48) - (selectedClientLedger?.paidCuotas || 0)) },
                                                (_, i) => i + 1
                                            ).map(num => (
                                                <option key={num} value={num}>
                                                    {num} {num === 1 ? 'cuota' : 'cuotas'}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                {(manualScope === 'MORA' || (manualScope === 'INSTALLMENT' && manualInstallmentsCount === '1')) && (
                                    <div className="space-y-1.5">
                                        <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">
                                            {manualScope === 'MORA' ? 'Cuota Asociada al Interés' : 'N° de Cuota'}
                                        </label>
                                        <select
                                            value={manualInstallmentNumber}
                                            onChange={(e) => setManualInstallmentNumber(e.target.value)}
                                            className="w-full bg-white border border-gray-200 rounded-xl h-10 px-3 text-xs text-gray-900 font-bold focus:outline-none focus:ring-1 focus:ring-[#3f6066]"
                                        >
                                            {Array.from({ length: selectedClientLedger?.totalCuotas || 48 }, (_, i) => i + 1).map(num => (
                                                <option key={num} value={num}>
                                                    Cuota {num}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                {manualScope === 'INSTALLMENT' && manualInstallmentsCount !== '1' && (
                                    <div className="space-y-1.5">
                                        <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">Cubrirá</label>
                                        <p className="text-xs font-bold text-emerald-600 h-10 flex items-center px-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                                            Cuotas {(selectedClientLedger?.paidCuotas || 0) + 1} a {(selectedClientLedger?.paidCuotas || 0) + parseInt(manualInstallmentsCount || '1')}
                                        </p>
                                    </div>
                                )}

                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">
                                        Comprobante {manualScope === 'MORA' ? '(Obligatorio)' : '(Opcional)'}
                                    </label>
                                    <div className="relative group">
                                        <input 
                                            type="file"
                                            onChange={(e) => setManualFile(e.target.files?.[0] || null)}
                                            className="hidden"
                                            id="manual-receipt-upload"
                                            accept="image/*,.pdf"
                                        />
                                        <label 
                                            htmlFor="manual-receipt-upload"
                                            className={cn(
                                                "flex items-center gap-2 px-3 h-10 rounded-xl border border-dashed transition-all cursor-pointer text-[10px] font-bold uppercase",
                                                manualFile 
                                                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" 
                                                    : "bg-white/20 border-gray-200 text-gray-500 hover:border-gray-200"
                                            )}
                                        >
                                            <UploadCloud className="w-3.5 h-3.5 shrink-0" />
                                            <span className="truncate">{manualFile ? manualFile.name : "Subir Comprobante"}</span>
                                        </label>
                                    </div>
                                </div>

                                <div className="flex items-end">
                                    <Button
                                        onClick={async () => {
                                            if (!manualAmount || isRegistering) return;
                                            // MORA requires a receipt file
                                            if (manualScope === 'MORA' && !manualFile) {
                                                toast.error('El comprobante es obligatorio para abonos de interés');
                                                return;
                                            }
                                            setIsRegistering(true);
                                            try {
                                                let receiptUrl = 'MANUAL_POSTVENTA';
                                                
                                                if (manualFile) {
                                                    const reader = new FileReader();
                                                    const base64Promise = new Promise<string>((resolve) => {
                                                        reader.onload = () => resolve(reader.result as string);
                                                        reader.readAsDataURL(manualFile);
                                                    });
                                                    receiptUrl = await base64Promise;
                                                }

                                                const res = await registerPostventaPayment({
                                                    reservationId: selectedClientLedger.id,
                                                    amount: parseInt(manualAmount),
                                                    scope: manualScope,
                                                    receiptUrl,
                                                    nominalInstallmentNumber: (manualScope === 'INSTALLMENT' || manualScope === 'MORA') ? parseInt(manualInstallmentNumber) : undefined,
                                                    installmentsCount: manualScope === 'INSTALLMENT' ? parseInt(manualInstallmentsCount || '1') : undefined
                                                });
                                                if (res.error) toast.error(res.error);
                                                else {
                                                    toast.success("Pago registrado exitosamente");
                                                    setManualAmount('');
                                                    setManualFile(null);
                                                    setManualInstallmentsCount('1');
                                                    // Refresh the listing
                                                    setIsLoadingReceipts(true);
                                                    const updatedRes = await getReservationReceipts(selectedClientLedger.id);
                                                    if ('receipts' in updatedRes) setClientReceipts(updatedRes.receipts as any[]);
                                                    setIsLoadingReceipts(false);
                                                    refreshData();
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
                                <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200 mb-4">
                                     <p className="text-[8px] text-[#3f6066] font-black uppercase tracking-widest text-center">Mostrando {clientReceipts.length} recibos históricos registrados</p>
                                </div>
                                {clientReceipts.map((p, idx) => (
                                    <div key={idx} className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center justify-between group hover:bg-gray-50 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="bg-gray-50 p-3 rounded-xl">
                                                <CreditCard className="w-5 h-5 text-[#4A6E75]" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-black text-gray-900 uppercase">{formatCurrency(p.amount_clp)}</p>
                                                <p className="text-[9px] text-gray-500 font-bold uppercase mt-0.5 tracking-tight">
                                                    {p.receipt_url === 'CONDONACION_ADMIN'
                                                        ? `Condonación de Mora${p.nominal_installment_number ? ` (Cuota ${p.nominal_installment_number})` : ''}`
                                                        : p.scope === 'PIE'
                                                            ? 'Pago de Pie'
                                                            : p.scope === 'MORA'
                                                                ? `${p.isFullyPaidInterest ? 'Interés Pagado' : 'Abono Interés'}${p.nominal_installment_number ? ` (Cuota ${p.nominal_installment_number})` : ''}`
                                                                : p.nominal_installment_number
                                                                    ? `Cuota ${p.nominal_installment_number}`
                                                                    : p.nominal_installment_range
                                                                        ? `Cuotas ${p.nominal_installment_range}`
                                                                        : `${(p.installments_count || 1) > 1 ? p.installments_count + ' Cuotas' : 'Cuota'}`} · {format(new Date(p.created_at), 'dd/MM/yyyy HH:mm')}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {getStatusBadge(p.status)}
                                            {p.receipt_url !== 'CONDONACION_ADMIN' && (
                                                <button
                                                    onClick={() => setViewerConfig({ isOpen: true, url: p.receipt_url, name: `Recibo ${format(new Date(p.created_at), 'dd/MM/yyyy')}`, category: 'PAGO' })}
                                                    className="p-2 bg-[#3f6066]/20 hover:bg-[#3f6066]/30 text-[#4A6E75] rounded-lg transition-all"
                                                    title="Ver"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                            )}
                                            <button 
                                                onClick={() => {
                                                    setEditingReceipt(p);
                                                    setEditAmount(String(p.amount_clp));
                                                    setEditReason('');
                                                }}
                                                className="p-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 rounded-lg transition-all"
                                                title="Editar Monto"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            {!p.isAuto && (
                                                <button 
                                                    onClick={() => handleDeleteReceipt(p.id)}
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
                
                <div className="p-4 bg-white/20 border-t border-gray-200">
                    <Button
                        onClick={() => setShowPaymentsModal(false)}
                        className="w-full bg-[#3f6066] hover:bg-[#3f6066]/80 text-gray-900 font-black uppercase text-[10px] tracking-widest h-10 rounded-xl"
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
            <DialogContent className="max-w-[90vw] md:max-w-md bg-white border-gray-200">
                <DialogHeader>
                    <DialogTitle>Rechazar Transferencia</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                    <label className="text-sm font-medium mb-2 block text-gray-700">Motivo del rechazo:</label>
                    <Textarea
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="Ej: El monto no corresponde, imagen borrosa..."
                        rows={3}
                        className="bg-white border-gray-200"
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
