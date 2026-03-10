import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Download, CheckCircle, Clock, Folder } from "lucide-react";

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

                            {/* ── Documentos Físicos (Offline) ── */}
                            {res.is_legacy && res.legacy_uploaded_contracts && (() => {
                                try {
                                    const docs = JSON.parse(res.legacy_uploaded_contracts);
                                    if (!docs || docs.length === 0) return null;
                                    return (
                                        <>
                                            <div className="h-px w-full bg-white/10" />
                                            <div className="space-y-3 pt-2">
                                                <h3 className="font-semibold text-gray-200 text-base">Documentos Físicos (Offline)</h3>
                                                <p className="text-xs text-gray-400">Contratos firmados presencialmente y respaldados en digital por la inmobiliaria.</p>
                                                {docs.map((doc: any, i: number) => (
                                                    <a
                                                        key={i}
                                                        href={doc.url}
                                                        download={doc.name}
                                                        className="mt-2 text-center block w-full py-2 px-4 bg-indigo-600/20 hover:bg-indigo-600/40 border border-indigo-500/30 text-indigo-300 rounded text-sm transition-colors"
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

                            {/* ── Recibos de Pago (Otros) y Cuotas ── */}
                            {res.receipts && res.receipts.filter((r: any) => r.status === 'APPROVED').length > 0 && (() => {
                                const allApproved = res.receipts.filter((r: any) => r.status === 'APPROVED');
                                const installmentReceipts = allApproved.filter((r: any) => r.scope === 'INSTALLMENT' || r.scope === 'CUOTA');
                                const otherReceipts = allApproved.filter((r: any) => r.scope !== 'INSTALLMENT' && r.scope !== 'CUOTA');

                                return (
                                    <>
                                        {/* Other Receipts (Pie, Reservation, etc) */}
                                        {otherReceipts.length > 0 && (
                                            <>
                                                <div className="h-px w-full bg-white/10 my-4" />
                                                <div className="space-y-3">
                                                    <div className="flex justify-between items-center">
                                                        <h3 className="font-semibold text-gray-200 text-base">Otros Comprobantes</h3>
                                                        <span className="flex items-center text-green-400 text-xs gap-1 bg-green-900/40 px-2 py-1 rounded">
                                                            <CheckCircle className="h-3 w-3" /> Aprobados
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-col gap-2 mt-3">
                                                        {otherReceipts.map((receipt: any) => {
                                                            const isPie = receipt.scope === 'PIE';
                                                            const label = isPie ? "Pago de Pie" : "Pago de Reserva";
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
                                                                        <span className="text-xs text-gray-500">
                                                                            {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(receipt.amount_clp)}
                                                                        </span>
                                                                    </div>
                                                                    <Download className="h-4 w-4 text-gray-400" />
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
                                                <div className="h-px w-full bg-white/10 my-4" />
                                                <div className="space-y-3">
                                                    <div className="flex justify-between items-center bg-[#36595F]/20 border border-[#36595F]/40 p-3 rounded-lg">
                                                        <div className="flex items-center gap-2">
                                                            <Folder className="h-5 w-5 text-amber-400 fill-amber-400/20" />
                                                            <h3 className="font-semibold text-gray-200 text-base">Carpeta de Cuotas</h3>
                                                        </div>
                                                        <span className="text-[#84b9c1] text-xs font-bold bg-[#36595F]/30 px-2 py-1 rounded-full">
                                                            {installmentReceipts.length} recibos
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-gray-400">Recibos oficiales de las cuotas mensuales que has pagado.</p>

                                                    <div className="flex flex-col gap-2 mt-3 pl-4 border-l-2 border-white/5 ml-2">
                                                        {installmentReceipts.map((receipt: any) => {
                                                            const label = `Cuota(s) Pagada(s) - ${receipt.installments_count || 1} Cuota(s)`;
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
                                                                        <span className="text-xs text-gray-500">
                                                                            {new Date(receipt.created_at).toLocaleDateString('es-CL')} • {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(receipt.amount_clp)}
                                                                        </span>
                                                                    </div>
                                                                    <Download className="h-4 w-4 text-gray-400" />
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
