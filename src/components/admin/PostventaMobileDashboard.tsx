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
}

export function PostventaMobileDashboard({ initialReceipts, soldLots, activeTab, ledger = [], debtAlerts = [] }: PostventaMobileDashboardProps) {
    const [receipts, setReceipts] = useState(initialReceipts);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [rejectingId, setRejectingId] = useState<string | null>(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [isProcessing, setIsProcessing] = useState<string | null>(null);
    const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING');

    const [ledgerPage, setLedgerPage] = useState(1);
    const [selectedClientLedger, setSelectedClientLedger] = useState<any | null>(null);
    const ledgerItemsPerPage = 10;

    const [alertFilter, setAlertFilter] = useState<'ALL' | 'UPCOMING' | 'GRACE' | 'LATE' | 'PIE' | 'OK'>('ALL');
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
        const totalLedgerPages = Math.ceil(ledger.length / ledgerItemsPerPage);
        const paginatedLedger = ledger.slice((ledgerPage - 1) * ledgerItemsPerPage, ledgerPage * ledgerItemsPerPage);

        return (
            <div className="space-y-4 pb-24">
                <div className="flex items-center gap-2 mb-4">
                    <BookOpen className="w-5 h-5 text-indigo-400" />
                    <h2 className="text-lg font-bold text-white">Estado de Cuentas</h2>
                </div>

                <div className="space-y-3">
                    {paginatedLedger.map(client => (
                        <div key={client.id} className="bg-white/5 border border-white/10 p-4 rounded-xl space-y-3 relative overflow-hidden">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-bold text-white text-sm">{client.clientName}</p>
                                    <p className="text-xs text-indigo-300 font-medium">T-{client.lotNumber}</p>
                                </div>
                                <div className="text-right">
                                    <Button variant="outline" size="sm" onClick={() => setSelectedClientLedger(client)} className="text-xs h-8 bg-indigo-500/10 text-indigo-400 border-indigo-500/20 hover:bg-indigo-500/30 hover:text-indigo-200">
                                        <Eye className="w-3 h-3 mr-1" />
                                        Ver Detalles
                                    </Button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <div className="bg-black/40 p-2.5 rounded-lg border border-white/5">
                                    <p className="text-gray-500 mb-0.5 text-[10px] uppercase">Total Pagado</p>
                                    <p className="font-semibold text-white">{formatCurrency(client.totalPaid)}</p>
                                </div>
                                <div className="bg-black/40 p-2.5 rounded-lg border border-white/5">
                                    <p className="text-gray-500 mb-0.5 text-[10px] uppercase">Progreso Cuotas</p>
                                    <p className="font-semibold text-white">{client.paidCuotas} / {client.totalCuotas || 0}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                    {ledger.length === 0 && (
                        <div className="text-center p-8 text-gray-500 text-sm">No hay cuentas activas.</div>
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
                                        <span className="text-gray-400">Cuotas Pagadas:</span>
                                        <span className="font-medium text-white">{selectedClientLedger.paidCuotas} de {selectedClientLedger.totalCuotas || 0}</span>
                                    </div>
                                    <div className="flex justify-between text-xs mt-2">
                                        <span className="text-gray-400">Próximo Vencimiento:</span>
                                        <span className="font-medium text-yellow-400">{selectedClientLedger.nextDueDate ? format(new Date(selectedClientLedger.nextDueDate), 'dd MMM yyyy', { locale: es }) : 'N/A'}</span>
                                    </div>
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
            const matchesStage = alertStage === 'ALL' || alert.lotStage === alertStage;
            const matchesStatus = alertFilter === 'ALL' ||
                (alertFilter === 'UPCOMING' && alert.isUpcoming) ||
                (alertFilter === 'GRACE' && alert.isGracePeriod) ||
                (alertFilter === 'LATE' && alert.isLate) ||
                (alertFilter === 'PIE' && alert.isPieDebt) ||
                (alertFilter === 'OK' && alert.isUpToDate);
            return matchesStage && matchesStatus;
        });

        const totalAlertPages = Math.ceil(filteredAlerts.length / alertsPerPage);
        const paginatedAlerts = filteredAlerts.slice((alertPage - 1) * alertsPerPage, alertPage * alertsPerPage);

        return (
            <div className="space-y-4 pb-24">
                <div className="flex flex-col gap-1 mb-4">
                    <div className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                        <h2 className="text-lg font-bold text-white">Gestión de Clientes</h2>
                        {filteredAlerts.length > 0 && (
                            <Badge variant="outline" className="ml-auto font-bold bg-white/5 border-white/10 text-white">{filteredAlerts.length} total</Badge>
                        )}
                    </div>
                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest mt-1">
                        Hoy: {format(today, "EEEE d 'de' MMMM 'de' yyyy", { locale: es })}
                    </p>
                </div>

                {/* Filters Row 1: Status */}
                <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                    {(['ALL', 'LATE', 'GRACE', 'PIE', 'UPCOMING', 'OK'] as const).map(f => (
                        <button
                            key={f}
                            onClick={() => { setAlertFilter(f); setAlertPage(1); }}
                            className={`px-3 py-1.5 rounded-full text-[10px] font-bold whitespace-nowrap transition-all border ${alertFilter === f ? 'bg-[#36595F] text-white border-[#36595F]' : 'bg-white/5 text-gray-400 border-white/10'
                                }`}
                        >
                            {f === 'ALL' ? 'Todos' : f === 'LATE' ? '🚩 Mora' : f === 'GRACE' ? '⌛ Gracia' : f === 'PIE' ? '🟣 Pie' : f === 'UPCOMING' ? '🔵 Próximos' : '✅ Al Día'}
                        </button>
                    ))}
                </div>

                {/* Filters Row 2: Stages */}
                <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                    {(['ALL', 1, 2, 3, 4] as const).map(s => (
                        <button
                            key={s}
                            onClick={() => { setAlertStage(s as any); setAlertPage(1); }}
                            className={`px-3 py-1 text-[10px] font-bold whitespace-nowrap transition-all border rounded-lg ${alertStage === s ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' : 'bg-white/5 text-gray-500 border-white/5'
                                }`}
                        >
                            {s === 'ALL' ? 'Todas las Etapas' : `Etapa ${s}`}
                        </button>
                    ))}
                </div>

                {/* Alerts Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                    {paginatedAlerts.map(alert => {
                        const isGrace = alert.isGracePeriod;
                        const isPie = alert.isPieDebt;
                        const isUpcoming = alert.isUpcoming;
                        const isLate = alert.isLate;
                        const isOK = alert.isUpToDate;

                        let colorClass = 'bg-red-500/10 border-red-500/20';
                        let accentClass = 'text-red-400';
                        let circleClass = 'bg-red-500/10';
                        let badgeLabel = 'Atrasado'; // Red (11+)
                        let statusText = `${alert.lateDays} días de atraso`;

                        if (isOK) {
                            colorClass = 'bg-green-500/10 border-green-500/20';
                            accentClass = 'text-green-400';
                            circleClass = 'bg-green-500/10';
                            badgeLabel = 'Al Día';
                            statusText = 'Pagos correctos';
                        } else if (isUpcoming) {
                            colorClass = 'bg-blue-500/10 border-blue-500/20';
                            accentClass = 'text-blue-400';
                            circleClass = 'bg-blue-500/10';
                            badgeLabel = 'Próximo';
                            statusText = 'Vencimiento cercano';
                        } else if (isPie) {
                            colorClass = 'bg-purple-500/10 border-purple-500/20';
                            accentClass = 'text-purple-400';
                            circleClass = 'bg-purple-500/10';
                            badgeLabel = 'Pendiente Pie';
                            statusText = alert.lateDays > 0 ? `${alert.lateDays} d. atraso Pie` : 'Saldo Pie pendiente';
                        } else if (isGrace) {
                            colorClass = 'bg-amber-500/10 border-amber-500/20';
                            accentClass = 'text-amber-400';
                            circleClass = 'bg-amber-500/10';
                            badgeLabel = 'Periodo Gracia';
                            statusText = 'Pendiente (Sin multa)';
                        }

                        return (
                            <div key={alert.id} className={`${colorClass} p-4 rounded-xl space-y-3 relative overflow-hidden flex flex-col justify-between transition-all hover:border-white/20`}>
                                <div className={`absolute top-0 right-0 w-24 h-24 ${circleClass} rounded-bl-full -z-10 opacity-50`} />

                                <div className="space-y-3">
                                    <div className="flex justify-between items-start">
                                        <div className="min-w-0 pr-2">
                                            <p className="font-bold text-white text-sm truncate">{alert.clientName}</p>
                                            <p className={`text-[10px] ${accentClass} font-medium`}>
                                                T-{alert.lotNumber} (Etapa {alert.lotStage}) · {statusText}
                                            </p>
                                        </div>
                                        <Badge className={`${colorClass.replace('bg-', 'bg-').replace('/10', '/30')} ${accentClass} border-${accentClass.split('-')[0]}-500/30 text-[10px] font-bold shrink-0`}>
                                            {badgeLabel}
                                        </Badge>
                                    </div>

                                    <div className={`flex items-center justify-between bg-black/40 rounded-lg p-3 border ${colorClass.split(' ')[1]}`}>
                                        <div>
                                            <p className="text-[9px] text-gray-400 uppercase tracking-wider mb-0.5">
                                                {isUpcoming ? 'A pagar' : isPie ? 'Saldo Pie' : isGrace ? 'A Pagar' : isOK ? 'Total Pagado' : 'Multa Calculada'}
                                            </p>
                                            <p className={`font-bold ${accentClass} text-sm`}>
                                                {isOK
                                                    ? formatCurrency(alert.cuotasAmount)
                                                    : isUpcoming || isGrace
                                                        ? formatCurrency(alert.monto_cuota || 0)
                                                        : formatCurrency(isPie ? (alert.totalToPay * 0.2 - alert.pieAmount) : alert.penaltyAmount)
                                                }
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[9px] text-gray-400 uppercase tracking-wider mb-0.5">
                                                {isOK ? 'Progreso' : isUpcoming ? 'Vence el' : 'Venció el'}
                                            </p>
                                            <p className="font-semibold text-white text-xs">
                                                {isOK
                                                    ? `${alert.paidCuotas} de ${alert.totalCuotas}`
                                                    : alert.displayDueDate ? format(new Date(alert.displayDueDate), 'dd MMM yyyy', { locale: es }) : 'N/A'
                                                }
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {filteredAlerts.length === 0 && (
                    <div className="text-center p-8 bg-white/5 border border-white/10 rounded-xl mt-8">
                        <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-3" />
                        <p className="text-gray-400 font-medium text-sm">No hay clientes en esta categoría.</p>
                    </div>
                )}

                {totalAlertPages > 1 && (
                    <div className="flex justify-between items-center bg-black/40 border border-white/10 rounded-xl p-3 mt-6">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setAlertPage(p => Math.max(1, p - 1))}
                            disabled={alertPage === 1}
                            className="h-8 text-[10px] bg-white/5 border-white/10 text-white"
                        >
                            Anterior
                        </Button>
                        <span className="text-[10px] text-gray-400 font-medium">Página {alertPage} de {totalAlertPages}</span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setAlertPage(p => Math.min(totalAlertPages, p + 1))}
                            disabled={alertPage === totalAlertPages}
                            className="h-8 text-[10px] bg-white/5 border-white/10 text-white"
                        >
                            Siguiente
                        </Button>
                    </div>
                )}
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
            <div className="flex gap-2 overflow-x-auto pb-1">
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

            {/* Receipt Cards */}
            <div className="space-y-3">
                {filteredReceipts.map(receipt => (
                    <div
                        key={receipt.id}
                        className={`rounded-xl border p-4 space-y-3 transition-colors ${receipt.status === 'PENDING'
                            ? 'bg-yellow-500/5 border-yellow-500/20'
                            : receipt.status === 'APPROVED'
                                ? 'bg-green-500/5 border-green-500/20'
                                : receipt.status === 'REJECTED'
                                    ? 'bg-red-500/5 border-red-500/20'
                                    : 'bg-white/5 border-white/10'
                            }`}
                    >
                        {/* Client + Status */}
                        <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                                <p className="font-bold text-white text-sm truncate">
                                    {receipt.reservation?.buyer?.name || 'Sin nombre'}
                                </p>
                                <p className="text-[11px] text-gray-400 truncate">
                                    {receipt.reservation?.buyer?.email}
                                </p>
                            </div>
                            {getStatusBadge(receipt.status)}
                        </div>

                        {/* Info Row */}
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400">
                            <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                T-{receipt.reservation?.lot?.number} · Etapa {receipt.reservation?.lot?.stage}
                            </span>
                            <span className="flex items-center gap-1">
                                <CreditCard className="w-3 h-3" />
                                {receipt.scope === 'PIE' ? 'Pie' : `${(receipt.installments_count || 1) > 1 ? (receipt.installments_count || 1) + ' Cuotas' : '1 Cuota'}`}
                            </span>
                            <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {format(new Date(receipt.created_at), 'dd MMM, HH:mm', { locale: es })}
                            </span>
                        </div>

                        {/* Amount */}
                        <div className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2 border border-white/10">
                            <span className="text-xs text-gray-500">Monto</span>
                            <span className="text-base font-bold text-white">{formatCurrency(receipt.amount_clp)}</span>
                        </div>

                        {/* Rejection Reason */}
                        {receipt.rejection_reason && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                                <p className="text-xs text-red-400">
                                    <span className="font-semibold">Motivo: </span>
                                    {receipt.rejection_reason}
                                </p>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-2">
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
