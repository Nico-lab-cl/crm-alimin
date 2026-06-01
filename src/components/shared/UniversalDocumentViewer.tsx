"use client";

import { useState, useEffect } from "react";
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
    Download, 
    Maximize2, 
    X, 
    FileText, 
    Image as ImageIcon, 
    Loader2, 
    Eye,
    Receipt
} from "lucide-react";
import { formatReceiptUrl } from "@/lib/utils";

interface UniversalDocumentViewerProps {
    isOpen: boolean;
    onClose: () => void;
    url: string;
    name: string;
    category?: string;
}

export function UniversalDocumentViewer({ 
    isOpen, 
    onClose, 
    url: rawUrl, 
    name,
    category 
}: UniversalDocumentViewerProps) {
    const [blobUrl, setBlobUrl] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const url = formatReceiptUrl(rawUrl);

    const isPdf = url?.toLowerCase().includes('.pdf') || 
                  url?.startsWith('data:application/pdf') || 
                  url?.includes('/pdf');
    const isImage = url?.includes('image/') || url?.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp)$/);
    const isBase64 = url?.startsWith('data:');

    useEffect(() => {
        if (isOpen && isPdf && isBase64) {
            setIsGenerating(true);
            try {
                // Large Base64 to Blob URL for iframe stability
                const byteString = atob(url.split(',')[1]);
                const mimeString = url.split(',')[0].split(':')[1].split(';')[0];
                const ab = new ArrayBuffer(byteString.length);
                const ia = new Uint8Array(ab);
                for (let i = 0; i < byteString.length; i++) {
                    ia[i] = byteString.charCodeAt(i);
                }
                const blob = new Blob([ab], { type: mimeString });
                const bUrl = URL.createObjectURL(blob);
                setBlobUrl(bUrl);
            } catch (e) {
                console.error("Error creating blob URL:", e);
            } finally {
                setIsGenerating(false);
            }
        }

        return () => {
            if (blobUrl) {
                URL.revokeObjectURL(blobUrl);
            }
        };
    }, [isOpen, url, isPdf, isBase64]);

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = url;
        let downloadName = name || 'documento';
        if (url.startsWith('data:application/pdf') && !downloadName.toLowerCase().endsWith('.pdf')) {
            downloadName += '.pdf';
        } else if (url.startsWith('data:image/') && !/\.(jpg|jpeg|png|gif|webp)$/i.test(downloadName)) {
            const ext = url.split(';')[0].split('/')[1] || 'jpg';
            downloadName += `.${ext}`;
        }
        link.download = downloadName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl w-[95vw] h-[90vh] bg-[#0a1622] border-[#3f6066]/20 p-0 overflow-hidden rounded-[2.5rem] shadow-2xl flex flex-col">
                <DialogHeader className="p-6 bg-[#3f6066]/10 border-b border-white/5 flex flex-row items-center justify-between shrink-0">
                    <div className="flex items-center gap-4">
                        <div className={`p-2.5 rounded-xl ${isPdf ? 'bg-red-500/10' : 'bg-blue-500/10'}`}>
                            {isPdf ? <FileText className="w-5 h-5 text-red-500" /> : <ImageIcon className="w-5 h-5 text-blue-500" />}
                        </div>
                        <div>
                            <DialogTitle className="text-white font-black uppercase tracking-tight text-base truncate max-w-[200px] sm:max-w-md">
                                {name}
                            </DialogTitle>
                            <p className="text-[10px] text-gray-500 font-black uppercase mt-0.5 tracking-widest">
                                {category?.replace(/_/g, ' ') || 'Documento Comercial'}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 pr-8">
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={handleDownload}
                            className="h-9 px-4 bg-white/5 hover:bg-white/10 text-[#8eb2b8] font-black uppercase text-[10px] tracking-widest rounded-xl transition-all"
                        >
                            <Download className="w-3.5 h-3.5 mr-2" />
                            Bajar
                        </Button>
                    </div>
                </DialogHeader>

                <div className="flex-1 bg-black/20 relative overflow-hidden flex items-center justify-center p-4">
                    {isGenerating ? (
                        <div className="flex flex-col items-center gap-4">
                            <Loader2 className="w-10 h-10 text-[#3f6066] animate-spin" />
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Procesando Documento...</p>
                        </div>
                    ) : isPdf ? (
                        <iframe 
                            src={blobUrl || url} 
                            className="w-full h-full rounded-xl border-0 shadow-2xl bg-white"
                            title={name}
                        />
                    ) : isImage ? (
                        <div className="w-full h-full flex items-center justify-center overflow-auto no-scrollbar">
                             <img 
                                src={url} 
                                alt={name} 
                                className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
                            />
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-6 text-center max-w-xs">
                            <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center">
                                <FileText className="w-10 h-10 text-gray-600" />
                            </div>
                            <div className="space-y-2">
                                <p className="text-white font-black uppercase tracking-tight">Previsualización no disponible</p>
                                <p className="text-[10px] text-gray-500 font-medium leading-relaxed">
                                    Este formato de archivo no se puede ver directamente en el navegador. Por favor descárgalo para revisarlo.
                                </p>
                            </div>
                            <Button 
                                onClick={handleDownload}
                                className="bg-[#3f6066] hover:bg-[#3f6066]/80 text-white font-black uppercase text-[10px] tracking-widest h-12 px-8 rounded-2xl"
                            >
                                Descargar Archivo
                            </Button>
                        </div>
                    )}
                </div>
                
                <div className="p-4 bg-black/40 border-t border-white/5 flex justify-center shrink-0">
                    <Button 
                        onClick={onClose}
                        variant="ghost"
                        className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600 hover:text-white transition-all"
                    >
                        Cerrar Vista
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
