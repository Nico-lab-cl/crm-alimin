"use client";

import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, CheckCircle, XCircle, Eye } from "lucide-react";
import { approvePaymentReceipt, rejectPaymentReceipt } from "@/actions/receipts";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

export default function ReceiptsClient({ initialReceipts }: { initialReceipts: any[] }) {
    const [receipts, setReceipts] = useState(initialReceipts);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [rejectingId, setRejectingId] = useState<string | null>(null);
    const [rejectionReason, setRejectionReason] = useState("");
    const [isProcessing, setIsProcessing] = useState<string | null>(null);

    const pendingCount = receipts.filter(r => r.status === 'PENDING').length;

    const handleApprove = async (id: string) => {
        setIsProcessing(id);
        try {
            await approvePaymentReceipt(id);
            setReceipts(prev => prev.map(r => r.id === id ? { ...r, status: 'APPROVED' } : r));
            toast.success("Pago verificado y aprobado existosamente.");
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

    return (
        <div className="bg-white rounded-lg shadow border p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold flex gap-2">
                    Comprobantes
                    {pendingCount > 0 && (
                        <Badge variant="destructive" className="ml-2 font-bold">{pendingCount} Pendientes</Badge>
                    )}
                </h2>
            </div>

            <div className="rounded-md border overflow-x-auto">
                <Table>
                    <TableHeader className="bg-gray-50">
                        <TableRow>
                            <TableHead>Fecha</TableHead>
                            <TableHead>Cliente</TableHead>
                            <TableHead>Lote</TableHead>
                            <TableHead>Tipo</TableHead>
                            <TableHead>Monto</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {receipts.map((receipt) => (
                            <TableRow key={receipt.id}>
                                <TableCell className="whitespace-nowrap">
                                    {format(new Date(receipt.created_at), "dd MMM yyyy, HH:mm", { locale: es })}
                                </TableCell>
                                <TableCell>
                                    <div className="font-medium text-sm">
                                        {receipt.reservation.buyer?.nombre} {receipt.reservation.buyer?.apellidos}
                                    </div>
                                    <div className="text-xs text-gray-500">{receipt.reservation.buyer?.rut}</div>
                                </TableCell>
                                <TableCell>
                                    Etapa {receipt.reservation.lot?.stage} - Lote {receipt.reservation.lot?.number}
                                </TableCell>
                                <TableCell>
                                    {receipt.scope === 'PIE' ? (
                                        <Badge className="bg-blue-100 text-blue-800 border min-w-[70px] text-center">Pie</Badge>
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
                                    {receipt.status === 'PENDING' && <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pendiente</Badge>}
                                    {receipt.status === 'APPROVED' && <Badge className="bg-green-100 text-green-800">Aprobado</Badge>}
                                    {receipt.status === 'REJECTED' && <Badge variant="destructive">Rechazado</Badge>}
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setSelectedImage(receipt.receipt_url)}
                                            title="Ver Comprobante"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </Button>

                                        {receipt.status === 'PENDING' && (
                                            <>
                                                <Button
                                                    variant="default"
                                                    size="sm"
                                                    className="bg-green-600 hover:bg-green-700 text-white"
                                                    onClick={() => handleApprove(receipt.id)}
                                                    disabled={isProcessing === receipt.id}
                                                >
                                                    {isProcessing === receipt.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4 mr-1" />}
                                                    Aprobar
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => setRejectingId(receipt.id)}
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
                        {receipts.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                                    No hay comprobantes de pago subidos aún.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Image Viewer Dialog */}
            <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
                <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black/5">
                    <DialogHeader className="p-4 bg-white border-b absolute top-0 w-full z-10 hidden">
                        <DialogTitle>Comprobante de Transferencia</DialogTitle>
                    </DialogHeader>
                    {selectedImage && (
                        <div className="w-full h-[80vh] flex items-center justify-center bg-gray-900 overflow-auto">
                            {selectedImage.startsWith('data:application/pdf') ? (
                                <iframe src={selectedImage} className="w-full h-full" />
                            ) : (
                                <img src={selectedImage} alt="Comprobante" className="max-w-full max-h-full object-contain" />
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Reject Reason Dialog */}
            <Dialog open={!!rejectingId} onOpenChange={(open) => !open && setRejectingId(null)}>
                <DialogContent>
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
                    <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setRejectingId(null)}>Cancelar</Button>
                        <Button variant="destructive" onClick={() => rejectingId && handleReject(rejectingId)} disabled={isProcessing === rejectingId}>
                            {isProcessing === rejectingId ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                            Confirmar Rechazo
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
