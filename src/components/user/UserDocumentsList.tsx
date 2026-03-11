import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Download, CheckCircle, Clock, Folder, Briefcase } from "lucide-react";

interface Reservation {
    id: string;
    lot_id: number;
    status: string;
    created_at: string;
    signed_at: string | null;
    uploaded_contract_url: string | null;
    promesa_signed_at?: string | null;
    lot: {
        number: string;
        stage: number;
    };
    is_legacy?: boolean;
    legacy_uploaded_contracts?: string | null;
    receipts?: any[];
}

export function UserDocumentsList({ reservations }: { reservations: Reservation[] }) {
    if (reservations.length === 0) {
        return (
            <Card className="bg-black/40 border-white/10 text-white backdrop-blur-sm">
                <CardContent className="p-8 text-center text-gray-300">
                    <p>No hay documentos asociados a esta cuenta aún.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl mx-auto">
            {reservations.map((res) => {
                const hasReserva = !!res.signed_at;
                const hasCompraventa = !!res.uploaded_contract_url;
                const promesaSigned = !!(res as any).promesa_signed_at;

                return (
                    <Card key={res.id} className="border-white/10 shadow-lg bg-black/60 text-white backdrop-blur-md">
                        <CardHeader className="bg-[#36595F]/90 text-white rounded-t-lg border-b border-white/10">
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                Lote {res.lot.number} — Etapa {res.lot.stage}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">

                            {/* ── Contrato de Reserva ── */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-semibold text-gray-200 text-base">Contrato de Reserva</h3>
                                    {hasReserva ? (
                                        <span className="flex items-center text-green-400 text-xs gap-1 bg-green-900/40 px-2 py-1 rounded">
                                            <CheckCircle className="h-3 w-3" /> Firmado
                                        </span>
                                    ) : (
                                        <span className="flex items-center text-yellow-400 text-xs gap-1 bg-yellow-900/40 px-2 py-1 rounded">
                                            <Clock className="h-3 w-3" /> Pendiente
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-gray-400">Documento inicial de reserva firmado digitalmente.</p>
                                {hasReserva && (
                                    <a
                                        href={`/api/contracts/${res.id}/pdf`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/30 text-blue-300 rounded text-sm transition-colors"
                                    >
                                        <Download className="h-4 w-4" />
                                        Descargar Contrato de Reserva
                                    </a>
                                )}
                            </div>

                            {/* ── Promesa de Compra Venta ── */}
                            <div className="space-y-2 mt-6">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-semibold text-gray-200 text-base">Promesa de Compraventa</h3>
                                    {hasCompraventa ? (
                                        <span className="flex items-center text-green-400 text-xs gap-1 bg-green-900/40 px-2 py-1 rounded">
                                            <CheckCircle className="h-3 w-3" /> Disponible
                                        </span>
                                    ) : (
                                        <span className="flex items-center text-yellow-400 text-xs gap-1 bg-yellow-900/40 px-2 py-1 rounded">
                                            <Clock className="h-3 w-3" /> Pendiente
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-gray-400">Documento legal firmado por ambas partes que asegura la promesa de compra.</p>
                                {hasCompraventa && (
                                    <a
                                        href={res.uploaded_contract_url!}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-indigo-600/20 hover:bg-indigo-600/40 border border-indigo-500/30 text-indigo-300 rounded text-sm transition-colors"
                                    >
                                        <Download className="h-4 w-4" />
                                        Ver Promesa Oficial
                                    </a>
                                )}
                            </div>

                            {/* ── Documentos Cargados Manualmente (Gastos, Pie, etc) ── */}
                            {(res as any).manual_documents && (() => {
                                const docs = (res as any).manual_documents;
                                const categories = [
                                    { id: 'GASTOS_OPERACIONALES', label: 'Gastos Operacionales', icon: FileText, color: 'text-amber-400' },
                                    { id: 'COMPROBANTE_PIE', label: 'Comprobantes de Pie', icon: CheckCircle, color: 'text-green-400' },
                                    { id: 'COMPROBANTE_CUOTA', label: 'Comprobantes de Cuotas', icon: FileText, color: 'text-blue-400' }
                                ];

                                return categories.map(cat => {
                                    const catDocs = Array.isArray(docs) ? docs.filter((d: any) => d.category === cat.id) : [];
                                    if (catDocs.length === 0) return null;

                                    return (
                                        <div key={cat.id} className="space-y-3 mt-6 pt-4 border-t border-white/5">
                                            <div className="flex justify-between items-center">
                                                <h3 className="font-semibold text-gray-200 text-base flex items-center gap-2">
                                                    <cat.icon className={`h-4 w-4 ${cat.color}`} />
                                                    {cat.label}
                                                </h3>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                {catDocs.map((doc: any, i: number) => (
                                                    <a
                                                        key={i}
                                                        href={doc.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="w-full flex items-center justify-between px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm transition-colors"
                                                    >
                                                        <span className="text-gray-300">{doc.name}</span>
                                                        <Download className="h-4 w-4 text-gray-500" />
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                });
                            })()}

                            {/* ── Documentos Físicos (Legacy/Offline Originales) ── */}
                            {res.legacy_uploaded_contracts && (() => {
                                try {
                                    const docs = JSON.parse(res.legacy_uploaded_contracts);
                                    if (!Array.isArray(docs) || docs.length === 0) return null;
                                    
                                    return (
                                        <>
                                            <div className="h-px w-full bg-white/10 my-6" />
                                            <div className="space-y-3">
                                                <h3 className="font-semibold text-gray-200 text-base flex items-center gap-2">
                                                    <Briefcase className="h-4 w-4 text-indigo-400" />
                                                    Contratos Físicos Originales
                                                </h3>
                                                <p className="text-[10px] text-gray-400">Escaneos de documentos firmados presencialmente.</p>
                                                {docs.map((doc: any, i: number) => (
                                                    <a
                                                        key={i}
                                                        href={doc.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="mt-2 text-center block w-full py-2 px-4 bg-indigo-600/10 hover:bg-indigo-600/20 border border-indigo-500/20 text-indigo-300 rounded text-sm transition-colors font-medium"
                                                    >
                                                        Descargar {doc.name.replace(".pdf", "")}
                                                    </a>
                                                ))}
                                            </div>
                                        </>
                                    );
                                } catch (e) {
                                    return null;
                                }
                            })()}

                            {/* ── Comprobantes de Pago Automáticos ── */}
                            {res.receipts && res.receipts.filter((r: any) => r.status === 'APPROVED').length > 0 && (() => {
                                const allApproved = res.receipts.filter((r: any) => r.status === 'APPROVED');
                                const installmentReceipts = allApproved.filter((r: any) => r.scope === 'INSTALLMENT' || r.scope === 'CUOTA');
                                const otherReceipts = allApproved.filter((r: any) => r.scope !== 'INSTALLMENT' && r.scope !== 'CUOTA');

                                return (
                                    <>
                                        {/* Other Receipts (Pie, Reservation, etc via Payment Gateway) */}
                                        {otherReceipts.length > 0 && (
                                            <>
                                                <div className="h-px w-full bg-white/10 my-6" />
                                                <div className="space-y-3">
                                                    <h3 className="font-semibold text-gray-200 text-base">Comprobantes de Pago Web</h3>
                                                    <div className="flex flex-col gap-2">
                                                        {otherReceipts.map((receipt: any) => {
                                                            const isPie = receipt.scope === 'PIE';
                                                            const label = isPie ? "Pago de Pie (Webpay)" : "Reserva (Webpay)";
                                                            return (
                                                                <a
                                                                    key={receipt.id}
                                                                    href={`/api/receipt/${receipt.id}/pdf`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="w-full flex items-center justify-between px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm transition-colors"
                                                                >
                                                                    <div className="flex flex-col">
                                                                        <span className="text-gray-200 font-medium">{label}</span>
                                                                        <span className="text-[10px] text-gray-500">
                                                                            {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(receipt.amount_clp)}
                                                                        </span>
                                                                    </div>
                                                                    <Download className="h-3 w-3 text-gray-500" />
                                                                </a>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            </>
                                        )}

                                        {/* Installment Folder */}
                                        {installmentReceipts.length > 0 && (
                                            <>
                                                <div className="h-px w-full bg-white/10 my-6" />
                                                <div className="space-y-3">
                                                    <div className="flex items-center gap-2">
                                                        <Folder className="h-4 w-4 text-indigo-400" />
                                                        <h3 className="font-semibold text-gray-200 text-base">Historial de Cuotas</h3>
                                                    </div>
                                                    <div className="grid grid-cols-1 gap-2">
                                                        {installmentReceipts.map((receipt: any) => {
                                                            const label = `Cuota(s) Pagada(s) (${receipt.installments_count || 1})`;
                                                            return (
                                                                <a
                                                                    key={receipt.id}
                                                                    href={`/api/receipt/${receipt.id}/pdf`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="w-full flex items-center justify-between px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-xs transition-colors"
                                                                >
                                                                    <span className="text-gray-400 font-medium">{label}</span>
                                                                    <Download className="h-3 w-3 text-gray-600" />
                                                                </a>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </>
                                );
                            })()}

                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}
