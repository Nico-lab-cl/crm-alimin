import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Download, CheckCircle, Clock, Folder, Briefcase, Eye, FileSignature, Receipt, CreditCard, X, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UniversalDocumentViewer } from "@/components/shared/UniversalDocumentViewer";

interface Reservation {
    id: string;
    lot_id: number;
    status: string;
    created_at: string;
    signed_at: string | null;
    uploaded_contract_url: string | null;
    promesa_signed_at?: string | null;
    signature_ip?: string | null;
    lot: {
        number: string;
        stage: number;
    };
    is_legacy?: boolean;
    legacy_uploaded_contracts?: string | null;
    manual_documents?: any; // JSON field
    receipts?: any[];
}

export function UserDocumentsList({ reservations }: { reservations: Reservation[] }) {
    const [viewerConfig, setViewerConfig] = useState<{ isOpen: boolean, url: string, name: string, category?: string }>({ 
        isOpen: false, 
        url: '', 
        name: '' 
    });

    if (reservations.length === 0) {
        return (
            <Card className="bg-black/60 border-white/10 text-white backdrop-blur-xl rounded-[2rem] overflow-hidden">
                <CardContent className="p-12 text-center">
                    <div className="bg-white/5 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Folder className="w-8 h-8 text-gray-500" />
                    </div>
                    <p className="text-gray-400 font-black uppercase tracking-widest text-xs">Sin Documentos</p>
                    <p className="text-[11px] text-gray-600 mt-2 uppercase font-medium">No hay registros asociados a esta cuenta aún.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-7xl mx-auto">
            {reservations.map((res) => {
                const isOffline = res.is_legacy || res.signature_ip === 'Firma Offline';

                return (
                    <Card key={res.id} className="border-white/10 bg-black/40 backdrop-blur-2xl rounded-[2.5rem] overflow-hidden transition-all hover:bg-black/60 group">
                        <CardHeader className="bg-gradient-to-br from-[#36595F]/20 to-transparent p-8 border-b border-white/5">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <h2 className="text-white font-black text-2xl tracking-tighter uppercase flex items-center gap-3">
                                        Lote {res.lot.number}
                                    </h2>
                                    <p className="text-[#8eb2b8] font-black text-[10px] uppercase tracking-[0.3em] opacity-80">
                                        Etapa {res.lot.stage} • Proyecto Lomas del Mar
                                    </p>
                                </div>
                                <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                                    <FileText className="h-6 w-6 text-[#8eb2b8]" />
                                </div>
                            </div>
                        </CardHeader>
                        
                        <CardContent className="p-8 space-y-10">
                            {/* ── CONTRATO DE RESERVA ── */}
                            {(() => {
                                // SYNC: Postventa uses ONLY uploaded_contract_url for Contrato de Reserva
                                const hasReserva = !!res.uploaded_contract_url;
                                const reservaUrl = res.uploaded_contract_url || '';
                                const reservaName = 'Contrato de Reserva';

                                return (
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <h3 className="text-white font-black text-xs uppercase tracking-widest">Contrato de Reserva</h3>
                                            {hasReserva ? (
                                                <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                                    <span className="text-green-500 font-black text-[9px] uppercase">Disponible</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-gray-600" />
                                                    <span className="text-gray-500 font-black text-[9px] uppercase">Pendiente</span>
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-[11px] text-gray-500 font-medium leading-relaxed">Documento inicial que garantiza la reserva de su parcela en el proyecto.</p>
                                        {hasReserva && reservaUrl && (
                                            <div className="flex flex-wrap gap-2">
                                                <button
                                                    onClick={() => setViewerConfig({
                                                        isOpen: true,
                                                        url: reservaUrl,
                                                        name: reservaName,
                                                        category: "Documento Legal"
                                                    })}
                                                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#36595F]/10 hover:bg-[#36595F]/20 border border-[#36595F]/30 rounded-xl text-[10px] font-black uppercase tracking-widest text-white transition-all shadow-lg shadow-[#36595F]/5"
                                                >
                                                    <Eye className="h-3 w-3" />
                                                    Visualizar
                                                </button>
                                                <a
                                                    href={reservaUrl}
                                                    download={reservaName}
                                                    className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-[#8eb2b8] transition-all"
                                                >
                                                    <Download className="h-3 w-3" />
                                                    Bajar PDF
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                );
                            })()}

                            {/* ── PROMESA DE COMPRAVENTA ── */}
                            {(() => {
                                // SYNC: Postventa uses legacy_uploaded_contracts for Promesa, for ALL clients
                                let hasPromesa = false;
                                let promesaUrl = '';
                                let promesaName = 'Promesa de Compraventa';

                                if (res.legacy_uploaded_contracts) {
                                    try {
                                        const legacyDocs = typeof res.legacy_uploaded_contracts === 'string' 
                                            ? JSON.parse(res.legacy_uploaded_contracts) 
                                            : res.legacy_uploaded_contracts;
                                        if (Array.isArray(legacyDocs) && legacyDocs.length > 0) {
                                            hasPromesa = true;
                                            promesaUrl = legacyDocs[0].url;
                                            promesaName = legacyDocs[0].name || 'Promesa de Compraventa';
                                        }
                                    } catch (e) {}
                                }

                                return (
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <h3 className="text-white font-black text-xs uppercase tracking-widest">Promesa de Compraventa</h3>
                                            {hasPromesa ? (
                                                <div className="flex items-center gap-2 px-3 py-1 bg-[#36595F]/20 border border-[#36595F]/30 rounded-full">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-[#8eb2b8] animate-pulse" />
                                                    <span className="text-[#8eb2b8] font-black text-[9px] uppercase">Disponible</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-gray-600" />
                                                    <span className="text-gray-500 font-black text-[9px] uppercase">En Preparación</span>
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-[11px] text-gray-500 font-medium leading-relaxed">Documento legal certificado por abogados que asegura la promesa oficial de compra.</p>
                                        {hasPromesa && promesaUrl && (
                                            <div className="flex flex-wrap gap-2">
                                                <button
                                                    onClick={() => setViewerConfig({
                                                        isOpen: true,
                                                        url: promesaUrl,
                                                        name: promesaName,
                                                        category: "Documento Legal"
                                                    })}
                                                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#36595F]/10 hover:bg-[#36595F]/20 border border-[#36595F]/30 rounded-xl text-[10px] font-black uppercase tracking-widest text-white transition-all shadow-lg shadow-[#36595F]/5"
                                                >
                                                    <Eye className="h-3 w-3" />
                                                    Visualizar
                                                </button>
                                                <a
                                                    href={promesaUrl}
                                                    download={promesaName}
                                                    className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-[#8eb2b8] transition-all"
                                                >
                                                    <Download className="h-3 w-3" />
                                                    Bajar PDF
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                );
                            })()}

                            {/* ── Documentos Cargados Manualmente ── */}
                            {(res as any).manual_documents && (() => {
                                const docs = (res as any).manual_documents;
                                const categories = [
                                    { id: 'GASTOS_OPERACIONALES', label: 'Gastos Operacionales', icon: FileSignature, color: 'text-amber-500' },
                                    { id: 'PIE', label: 'Pagos del Pie', icon: CheckCircle, color: 'text-green-500' },
                                    { id: 'CUOTAS', label: 'Recibos de Cuotas', icon: Receipt, color: 'text-blue-500' },
                                    { id: 'CEDULA', label: 'Cédula de Identidad', icon: Briefcase, color: 'text-purple-500' },
                                    { id: 'COMPROBANTE_DOMICILIO', label: 'Comprobante Domicilio', icon: MapPin, color: 'text-teal-500' },
                                    { id: 'OTRO', label: 'Otros Documentos', icon: Folder, color: 'text-gray-400' }
                                ];

                                const docsList = Array.isArray(docs) 
                                    ? docs 
                                    : (typeof docs === 'string' ? JSON.parse(docs) : []);

                                // Add unknown categories dynamically to 'OTRO'
                                const processedDocsList = docsList.map((d: any) => {
                                    if (!categories.find(c => c.id === d.category)) {
                                        return { ...d, originalCategory: d.category, category: 'OTRO' };
                                    }
                                    return d;
                                });

                                return categories.map(cat => {
                                    const catDocs = processedDocsList.filter((d: any) => d.category === cat.id);
                                    if (catDocs.length === 0) return null;

                                    return (
                                        <div key={cat.id} className="space-y-4 pt-8 border-t border-white/5">
                                            <h3 className="text-white font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-2">
                                                <cat.icon className={`h-3 w-3 ${cat.color}`} />
                                                {cat.label}
                                            </h3>
                                            <div className="grid grid-cols-1 gap-3">
                                                {catDocs.map((doc: any, i: number) => {
                                                    const urlStr = doc.url || '';
                                                    const isPdf = urlStr.toLowerCase().includes('pdf');
                                                    const isExcel = urlStr.toLowerCase().includes('.xls') || urlStr.toLowerCase().includes('spreadsheetml');
                                                    const isWord = urlStr.toLowerCase().includes('.doc') || urlStr.toLowerCase().includes('wordprocessingml');
                                                    const isImage = urlStr.includes('image/') || urlStr.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp)$/) || urlStr.toLowerCase().includes('ext=.jpg');

                                                    const getLabel = () => {
                                                        if (isPdf) return "Bajar PDF";
                                                        if (isExcel) return "Bajar Excel";
                                                        if (isWord) return "Bajar Word";
                                                        if (isImage) return "Bajar Imagen";
                                                        return "Descargar";
                                                    };

                                                    const displayName = doc.originalCategory && doc.originalCategory !== 'OTRO' 
                                                        ? `${doc.originalCategory}: ${doc.name}` 
                                                        : doc.name;

                                                    return (
                                                        <div key={i} className="group items-center flex justify-between px-5 py-4 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 rounded-2xl transition-all">
                                                            <div className="flex items-center gap-3">
                                                                <div className="p-2 bg-white/5 rounded-lg group-hover:bg-white/10 transition-colors">
                                                                    {isExcel ? <Briefcase className="h-4 w-4 text-emerald-500" /> :
                                                                     isWord ? <FileText className="h-4 w-4 text-blue-500" /> :
                                                                     isImage ? <FileText className="h-4 w-4 text-amber-500" /> :
                                                                     <FileText className="h-4 w-4 text-gray-400" />}
                                                                </div>
                                                                <span className="text-[11px] font-bold text-gray-400 group-hover:text-white transition-colors truncate max-w-[200px]">{displayName}</span>
                                                            </div>
                                                            <div className="flex gap-4">
                                                                    <button 
                                                                        onClick={() => setViewerConfig({
                                                                            isOpen: true,
                                                                            url: doc.url,
                                                                            name: doc.name,
                                                                            category: cat.label
                                                                        })}
                                                                        className="text-gray-600 hover:text-[#8eb2b8] transition-colors" 
                                                                        title="Visualizar"
                                                                    >
                                                                        <Eye className="h-4 w-4" />
                                                                    </button>
                                                                <a href={doc.url} download={doc.name} className="text-gray-600 hover:text-[#8eb2b8] transition-colors" title={getLabel()}>
                                                                    <Download className="h-4 w-4" />
                                                                </a>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                });
                            })()}

                            {res.receipts && res.receipts.filter((r: any) => r.status === 'APPROVED').length > 0 && (() => {
                                const allApproved = res.receipts.filter((r: any) => r.status === 'APPROVED');
                                // Include all types of approved receipts (PIE, INSTALLMENT, RESERVATION)
                                const validReceipts = allApproved; 

                                return (
                                    <>
                                        {validReceipts.length > 0 && (
                                            <div className="space-y-4 pt-8 border-t border-white/5">
                                                <h3 className="text-white font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-2">
                                                    <CreditCard className="h-3 w-3 text-indigo-500" />
                                                    Historial de Pagos Digitales
                                                </h3>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                    {validReceipts.map((receipt: any) => (
                                                        <div key={receipt.id} className="flex items-center justify-between px-4 py-3 bg-indigo-500/5 hover:bg-indigo-500/10 border border-indigo-500/10 rounded-xl transition-all group/it">
                                                            <div className="flex flex-col">
                                                                <span className="text-[9px] font-black text-indigo-300 uppercase">Recibo #{receipt.id.slice(-4)}</span>
                                                                <span className="text-[8px] text-gray-500 uppercase font-medium">
                                                                    {receipt.scope === 'PIE' ? 'Pago de Pie' : receipt.scope === 'RESERVATION' ? 'Reserva' : 'Cuota Pagada'}
                                                                </span>
                                                            </div>
                                                            <div className="flex gap-3">
                                                                <button 
                                                                    onClick={() => setViewerConfig({
                                                                        isOpen: true,
                                                                        url: `/api/receipt/${receipt.id}/pdf`,
                                                                        name: `Comprobante Oficial #${receipt.id.slice(-4)}`,
                                                                        category: "Recibo de Pago"
                                                                    })}
                                                                    className="text-gray-600 hover:text-indigo-400 transition-colors" 
                                                                    title="Visualizar"
                                                                >
                                                                    <Eye className="h-3.5 w-3.5" />
                                                                </button>
                                                                <a href={`/api/receipt/${receipt.id}/pdf?download=true`} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-indigo-400 transition-colors" title="Descargar">
                                                                    <Download className="h-3.5 w-3.5" />
                                                                </a>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </>
                                );
                            })()}
                        </CardContent>
                    </Card>
                );
            })}

            {/* Universal Document Viewer Integration */}
            <UniversalDocumentViewer 
                {...viewerConfig} 
                onClose={() => setViewerConfig(prev => ({ ...prev, isOpen: false }))}
            />
        </div>
    );
}
