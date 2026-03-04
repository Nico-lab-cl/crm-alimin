'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, CheckCircle, XCircle, Eye, MapPin, CreditCard, Clock, Receipt } from 'lucide-react';
import { approvePaymentReceipt, rejectPaymentReceipt } from '@/actions/receipts';
import { toast } from 'sonner';
import { MoraExplainerCard } from './MoraExplainerCard';

export type PostventaTab = 'recibos' | 'mora';

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
}

export function PostventaMobileDashboard({ initialReceipts, soldLots, activeTab }: PostventaMobileDashboardProps) {
    const [receipts, setReceipts] = useState(initialReceipts);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [rejectingId, setRejectingId] = useState<string | null>(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [isProcessing, setIsProcessing] = useState<string | null>(null);
    const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING');

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
