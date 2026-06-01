"use client";

import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, CheckCircle, XCircle, Eye, MapPin, CreditCard, Clock, Download, ChevronLeft, ChevronRight, Filter, FileText } from "lucide-react";
import { approvePaymentReceipt, rejectPaymentReceipt } from "@/actions/receipts";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";

interface ReceiptsClientProps {
    initialReceipts: any[];
    totalPages: number;
    currentPage: number;
    currentStatus: string;
    initialPendingCount: number;
    initialTab: string;
}

export default function ReceiptsClient({ 
    initialReceipts,
    totalPages,
    currentPage,
    currentStatus,
    initialPendingCount,
    initialTab
}: ReceiptsClientProps) {
    const router = useRouter();
    const [receipts, setReceipts] = useState(initialReceipts);
    const [selectedReceipt, setSelectedReceipt] = useState<{ id: string, url: string, status: string } | null>(null);
    const [rejectingId, setRejectingId] = useState<string | null>(null);
    const [rejectionReason, setRejectionReason] = useState("");
    const [isProcessing, setIsProcessing] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<string>(initialTab || "pagos");
    const [pendingCount, setPendingCount] = useState(initialPendingCount || 0);

    const navigate = (page: number, status: string, tab: string = activeTab) => {
        router.push(`/admin/receipts?page=${page}&status=${status}&tab=${tab}`);
        setTimeout(() => {
            router.refresh();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 100);
    };

    const handleApprove = async (id: string) => {
        setIsProcessing(id);
        try {
            await approvePaymentReceipt(id);
            setReceipts(prev => prev.map(r => r.id === id ? { ...r, status: 'APPROVED' } : r));
            setPendingCount(prev => Math.max(0, prev - 1));
            toast.success("Pago verificado y aprobado exitosamente.");
        } catch (error) {
            console.error(error);
            toast.error("Error al aprobar el pago");
        } finally {
            setIsProcessing(null);
        }
    };

    const handleReject = async (id: string) => {
        if (!rejectionReason.trim()) {
            toast.error("Debes indicar un motivo de rechazo");
            return;
        }
        setIsProcessing(id);
        try {
            await rejectPaymentReceipt(id, rejectionReason);
            setReceipts(prev => prev.map(r => r.id === id ? { ...r, status: 'REJECTED', rejection_reason: rejectionReason } : r));
            setPendingCount(prev => Math.max(0, prev - 1));
            setRejectingId(null);
            setRejectionReason("");
            toast.success("Transferencia bancaria rechazada.");
        } catch (error) {
            console.error(error);
            toast.error("Error al rechazar el pago");
        } finally {
            setIsProcessing(null);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(amount);
    };

    const getStatusBadge = (status: string) => {
        if (status === 'PENDING') return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 text-[10px]">Pendiente</Badge>;
        if (status === 'APPROVED') return <Badge className="bg-green-100 text-green-800 text-[10px]">Aprobado</Badge>;
        if (status === 'REJECTED') return <Badge variant="destructive" className="text-[10px]">Rechazado</Badge>;
        return null;
    };

    return (
        <div className="bg-white rounded-lg shadow border p-3 md:p-6">
            <div className="flex flex-col md:flex-row justify-between items-center mb-4 md:mb-6 gap-4">
                <h2 className="text-lg md:text-xl font-bold flex gap-2 items-center w-full md:w-auto">
                    Comprobantes
                    {pendingCount > 0 && (
                        <Badge variant="destructive" className="ml-1 font-bold text-[10px] md:text-xs">{pendingCount} Pendientes</Badge>
                    )}
                </h2>

                <div className="flex items-center gap-2 w-full md:w-auto">
                   <Select 
                     value={currentStatus} 
                     onValueChange={(val) => navigate(1, val)}
                   >
                       <SelectTrigger className="w-full md:w-[180px] bg-gray-50">
                           <div className="flex items-center gap-2">
                               <Filter className="w-4 h-4 text-gray-500" />
                               <SelectValue placeholder="Estado" />
                           </div>
                       </SelectTrigger>
                       <SelectContent>
                           <SelectItem value="ALL">Todos</SelectItem>
                           <SelectItem value="PENDING">Pendientes</SelectItem>
                           <SelectItem value="APPROVED">Aprobados</SelectItem>
                           <SelectItem value="REJECTED">Rechazados</SelectItem>
                       </SelectContent>
                   </Select>
                </div>
            </div>

            <Tabs 
                value={activeTab} 
                onValueChange={(val) => {
                    setActiveTab(val);
                    navigate(1, currentStatus, val);
                }} 
                className="w-full"
            >
                <TabsList className="mb-4">
                    <TabsTrigger value="pagos">Pagos (Pie / Cuotas)</TabsTrigger>
                    <TabsTrigger value="reservas">Reservas Manuales</TabsTrigger>
                </TabsList>

                <TabsContent value="pagos" className="mt-0">
                    <ReceiptsTable 
                        data={receipts} 
                        onView={(id: string, url: string, status: string) => setSelectedReceipt({ id, url, status })}
                        onApprove={handleApprove}
                        onReject={(id: string) => setRejectingId(id)}
                        isProcessing={isProcessing}
                    />
                </TabsContent>

                <TabsContent value="reservas" className="mt-0">
                    <ReceiptsTable 
                        data={receipts} 
                        onView={(id: string, url: string, status: string) => setSelectedReceipt({ id, url, status })}
                        onApprove={handleApprove}
                        onReject={(id: string) => setRejectingId(id)}
                        isProcessing={isProcessing}
                    />
                </TabsContent>
            </Tabs>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between gap-3 pt-6 border-t mt-6">
                    <Button
                        variant="outline"
                        onClick={() => navigate(currentPage - 1, currentStatus)}
                        disabled={currentPage === 1}
                        className="flex-1 md:flex-none min-h-[44px]"
                    >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Anterior
                    </Button>
                    <span className="text-sm font-medium text-gray-500">
                        {currentPage} / {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        onClick={() => navigate(currentPage + 1, currentStatus)}
                        disabled={currentPage === totalPages}
                        className="flex-1 md:flex-none min-h-[44px]"
                    >
                        Siguiente
                        <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                </div>
            )}

            {/* Image Viewer Dialog */}
            <Dialog open={!!selectedReceipt} onOpenChange={() => setSelectedReceipt(null)}>
                <DialogContent className="max-w-[95vw] md:max-w-4xl p-0 overflow-hidden bg-black/5 border-none">
                    {selectedReceipt && (() => {
                        const { id, url, status } = selectedReceipt;
                        const isPlaceholder = !url || url === 'LEGACY_SYNC' || url.includes('MANUAL');
                        
                        // If it's a placeholder AND the receipt is approved, show the digitally generated PDF
                        if (isPlaceholder && status === 'APPROVED') {
                            return (
                                <div className="w-full h-[70vh] md:h-[80vh] flex flex-col items-center justify-center bg-white overflow-hidden rounded-2xl relative">
                                    <iframe src={`/api/receipt/${id}/pdf`} className="w-full h-full border-0" />
                                    <Button 
                                        variant="ghost" 
                                        size="icon"
                                        className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-[#0a1622] rounded-full border border-black/10 shadow-lg z-50"
                                        onClick={() => setSelectedReceipt(null)}
                                        title="Cerrar"
                                    >
                                        <XCircle className="w-8 h-8" />
                                    </Button>
                                </div>
                            );
                        }

                        // Placeholder but not approved (rare, but handle gracefully)
                        if (isPlaceholder) {
                            return (
                                <div className="w-full h-[70vh] md:h-[80vh] flex flex-col items-center justify-center bg-[#0a1622] overflow-auto border border-white/10 rounded-2xl relative">
                                    <div className="flex flex-col items-center justify-center text-center p-8 text-gray-400 gap-4">
                                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center">
                                            <FileText className="w-8 h-8 text-white/50" />
                                        </div>
                                        <h3 className="text-xl font-bold text-white uppercase tracking-tight">Registro Manual</h3>
                                        <p className="max-w-md text-sm leading-relaxed">
                                            Este abono fue registrado manualmente desde el panel de administración o importado desde el sistema legado.<br/>
                                            <span className="font-semibold text-white/70">No existe documento físico adjunto.</span>
                                        </p>
                                    </div>
                                    <Button 
                                        variant="ghost" 
                                        size="icon"
                                        className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white rounded-full border border-white/10"
                                        onClick={() => setSelectedReceipt(null)}
                                    >
                                        <XCircle className="w-6 h-6" />
                                    </Button>
                                </div>
                            );
                        }

                        // Fix raw base64 missing data prefix
                        let finalUrl = url;
                        if (!url.startsWith('http') && !url.startsWith('data:') && !url.startsWith('/api') && url.length > 100) {
                            if (url.startsWith('JVBERi')) {
                                finalUrl = `data:application/pdf;base64,${url}`;
                            } else {
                                finalUrl = `data:image/jpeg;base64,${url}`;
                            }
                        }

                        const isPdfData = finalUrl.startsWith('data:application/pdf') || finalUrl.includes('/pdf') || finalUrl.endsWith('.pdf');

                        return (
                            <div className="w-full h-[70vh] md:h-[80vh] flex flex-col items-center justify-center bg-[#0a1622] overflow-auto border border-white/10 rounded-2xl relative">
                                {isPdfData ? (
                                    <iframe src={finalUrl} className="w-full h-full bg-white border-0" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center p-4">
                                        <img src={finalUrl} alt="Comprobante" className="max-w-full max-h-full object-contain rounded-xl shadow-2xl" />
                                    </div>
                                )}
                                
                                <Button 
                                    variant="ghost" 
                                    size="icon"
                                    className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white rounded-full border border-white/10"
                                    onClick={() => setSelectedReceipt(null)}
                                >
                                    <XCircle className="w-8 h-8" />
                                </Button>
                            </div>
                        );
                    })()}
                </DialogContent>
            </Dialog>

            {/* Reject Reason Dialog */}
            <Dialog open={!!rejectingId} onOpenChange={(open) => !open && setRejectingId(null)}>
                <DialogContent className="max-w-[90vw] md:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Rechazar Transferencia</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <label className="text-sm font-medium mb-2 block">Motivo del rechazo (visible para el cliente):</label>
                        <Textarea
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            placeholder="Ej: El monto transferido no corresponde, la imagen es borrosa..."
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

function ReceiptsTable({ data, onView, onApprove, onReject, isProcessing }: any) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(amount);
    };

    const getStatusBadge = (status: string) => {
        if (status === 'PENDING') return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 text-[10px]">Pendiente</Badge>;
        if (status === 'APPROVED') return <Badge className="bg-green-100 text-green-800 text-[10px]">Aprobado</Badge>;
        if (status === 'REJECTED') return <Badge variant="destructive" className="text-[10px]">Rechazado</Badge>;
        return null;
    };

    return (
        <>
            {/* ===== DESKTOP TABLE (md+) ===== */}
            <div className="hidden md:block rounded-md border overflow-x-auto">
                <Table>
                    <TableHeader className="bg-gray-50">
                        <TableRow>
                            <TableHead>Fecha</TableHead>
                            <TableHead>Cliente</TableHead>
                            <TableHead>Terreno</TableHead>
                            <TableHead>Tipo</TableHead>
                            <TableHead>Monto</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((receipt: any) => (
                            <TableRow key={receipt.id}>
                                <TableCell className="whitespace-nowrap">
                                    {format(new Date(receipt.created_at), "dd MMM yyyy, HH:mm", { locale: es })}
                                </TableCell>
                                <TableCell>
                                    <div className="font-medium text-sm">
                                        {receipt.reservation?.buyer?.name}
                                    </div>
                                    <div className="text-xs text-gray-500">{receipt.reservation?.buyer?.email}</div>
                                </TableCell>
                                <TableCell>
                                    Etapa {receipt.reservation?.lot?.stage} - Terreno {receipt.reservation?.lot?.number}
                                </TableCell>
                                <TableCell>
                                    {receipt.scope === 'PIE' ? (
                                        <Badge className="bg-blue-100 text-blue-800 border min-w-[70px] text-center">Pie</Badge>
                                    ) : receipt.scope === 'RESERVATION' ? (
                                        <Badge className="bg-amber-100 text-amber-800 border min-w-[70px] text-center">Reserva</Badge>
                                    ) : (
                                        <Badge className="bg-purple-100 text-purple-800 border min-w-[70px] text-center">
                                            {receipt.installments_count > 1 ? `${receipt.installments_count} Cuotas` : '1 Cuota'}
                                        </Badge>
                                    )}
                                </TableCell>
                                <TableCell className="font-semibold whitespace-nowrap">
                                    {formatCurrency(receipt.amount_clp)}
                                </TableCell>
                                <TableCell>
                                    {getStatusBadge(receipt.status)}
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => onView(receipt.id, receipt.receipt_url || '', receipt.status)}
                                            title="Ver Comprobante Subido"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </Button>
                                        
                                        {receipt.receipt_url && receipt.receipt_url !== 'LEGACY_SYNC' && !receipt.receipt_url.includes('MANUAL') && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                asChild
                                                title="Descargar Comprobante Subido"
                                            >
                                                <a href={receipt.receipt_url} download target="_blank" rel="noopener noreferrer">
                                                    <Download className="w-4 h-4" />
                                                </a>
                                            </Button>
                                        )}

                                        {receipt.status === 'APPROVED' && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="border-green-500/30 bg-green-50 hover:bg-green-100 text-green-700 hover:text-green-800"
                                                title="Descargar PDF Generado"
                                                asChild
                                            >
                                                <a href={`/api/receipt/${receipt.id}/pdf`} target="_blank" rel="noopener noreferrer">
                                                    <Download className="w-4 h-4" />
                                                </a>
                                            </Button>
                                        )}

                                        {receipt.status === 'PENDING' && (
                                            <>
                                                <Button
                                                    variant="default"
                                                    size="sm"
                                                    className="bg-green-600 hover:bg-green-700 text-white"
                                                    onClick={() => onApprove(receipt.id)}
                                                    disabled={isProcessing === receipt.id}
                                                >
                                                    {isProcessing === receipt.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4 mr-1" />}
                                                    Aprobar
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => onReject(receipt.id)}
                                                    disabled={isProcessing === receipt.id}
                                                >
                                                    <XCircle className="w-4 h-4 mr-1" />
                                                    Rechazar
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                    {receipt.rejection_reason && (
                                        <div className="text-xs text-red-500 mt-1 max-w-[150px] truncate text-right float-right" title={receipt.rejection_reason}>
                                            {receipt.rejection_reason}
                                        </div>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                        {data.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                                    No hay comprobantes para mostrar.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* ===== MOBILE CARD LIST (<md) ===== */}
            <div className="md:hidden space-y-3">
                {data.map((receipt: any) => (
                    <div
                        key={receipt.id}
                        className={`rounded-xl border p-4 space-y-3 transition-colors ${receipt.status === 'PENDING'
                            ? 'bg-yellow-50/50 border-yellow-200'
                            : receipt.status === 'APPROVED'
                                ? 'bg-green-50/30 border-green-200'
                                : receipt.status === 'REJECTED'
                                    ? 'bg-red-50/30 border-red-200'
                                    : 'bg-gray-50 border-gray-200'
                            }`}
                    >
                        {/* Top Row: Client + Status */}
                        <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                                <p className="font-bold text-gray-900 text-sm truncate">
                                    {receipt.reservation?.buyer?.name || 'Sin nombre'}
                                </p>
                                <p className="text-[11px] text-gray-500 truncate">
                                    {receipt.reservation?.buyer?.email}
                                </p>
                            </div>
                            {getStatusBadge(receipt.status)}
                        </div>

                        {/* Info Row */}
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600">
                            <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-gray-400" />
                                T-{receipt.reservation?.lot?.number} · Etapa {receipt.reservation?.lot?.stage}
                            </span>
                            <span className="flex items-center gap-1">
                                <CreditCard className="w-3 h-3 text-gray-400" />
                                {receipt.scope === 'PIE' ? 'Pie' : receipt.scope === 'RESERVATION' ? 'Reserva' : `${receipt.installments_count > 1 ? receipt.installments_count + ' Cuotas' : '1 Cuota'}`}
                            </span>
                            <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3 text-gray-400" />
                                {format(new Date(receipt.created_at), "dd MMM, HH:mm", { locale: es })}
                            </span>
                        </div>

                        {/* Amount */}
                        <div className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border">
                            <span className="text-xs text-gray-500">Monto</span>
                            <span className="text-base font-bold text-gray-900">{formatCurrency(receipt.amount_clp)}</span>
                        </div>

                        {/* Rejection Reason */}
                        {receipt.rejection_reason && (
                            <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                                <p className="text-xs text-red-600">
                                    <span className="font-semibold">Motivo: </span>
                                    {receipt.rejection_reason}
                                </p>
                            </div>
                        )}

                        {/* Action Buttons — 44px min height */}
                        <div className="flex gap-2 text-center">
                            <button
                                onClick={() => onView(receipt.id, receipt.receipt_url || '', receipt.status)}
                                className="flex items-center justify-center gap-1.5 flex-1 min-h-[44px] rounded-lg bg-gray-100 text-gray-700 text-xs font-semibold hover:bg-gray-200 transition-colors active:scale-[0.97]"
                                title="Ver Comprobante Subido"
                            >
                                <Eye className="w-4 h-4" />
                                Img
                            </button>

                            {receipt.status === 'APPROVED' && (
                                <a
                                    href={`/api/receipt/${receipt.id}/pdf`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-1.5 flex-1 min-h-[44px] rounded-lg bg-green-50 text-green-700 border border-green-200 text-xs font-semibold hover:bg-green-100 transition-colors active:scale-[0.97]"
                                    title="Descargar PDF Generado"
                                >
                                    <Download className="w-4 h-4" />
                                    PDF
                                </a>
                            )}

                            {receipt.status === 'PENDING' && (
                                <>
                                    <button
                                        onClick={() => onApprove(receipt.id)}
                                        disabled={isProcessing === receipt.id}
                                        className="flex items-center justify-center gap-1.5 flex-1 min-h-[44px] rounded-lg bg-green-600 text-white text-xs font-semibold hover:bg-green-700 transition-colors active:scale-[0.97] disabled:opacity-50"
                                    >
                                        {isProcessing === receipt.id ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <CheckCircle className="w-4 h-4" />
                                        )}
                                        Aprobar
                                    </button>
                                    <button
                                        onClick={() => onReject(receipt.id)}
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
                {data.length === 0 && (
                    <div className="p-8 text-center text-gray-500 text-sm">
                        No hay comprobantes para mostrar.
                    </div>
                )}
            </div>
        </>
    );
}
