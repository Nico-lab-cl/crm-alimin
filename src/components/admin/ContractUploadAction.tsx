"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, UploadCloud, CheckCircle } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

export function ContractUploadAction({
    reservationId,
    reservationName,
    onUploadComplete,
    label,
    type,
    fileName,
    extraCategories
}: {
    reservationId: string,
    reservationName: string,
    onUploadComplete?: () => void,
    label?: string,
    type?: string,
    fileName?: string,
    extraCategories?: { id: string, label: string }[]
}) {
    const [open, setOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [selectedType, setSelectedType] = useState(type);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const allowedTypes = [
            "application/pdf",
            "image/jpeg",
            "image/png",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/vnd.ms-excel",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        ];

        if (!allowedTypes.includes(file.type)) {
            setError("Formato no permitido. Sube PDF, Imagen, Word o Excel.");
            return;
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            setError("El archivo es muy grande. El límite es 5MB.");
            return;
        }

        setError(null);
        setIsUploading(true);

        try {
            // Convert to Base64
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = async () => {
                const base64 = reader.result as string;

                const res = await fetch(`/api/contracts/${reservationId}/upload`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        fileData: base64,
                        type: selectedType || undefined,
                        fileName: fileName || file.name
                    }),
                });

                if (!res.ok) {
                    throw new Error("Error al subir el documento");
                }

                setSuccess(true);
                setTimeout(() => {
                    setOpen(false);
                    setSuccess(false);
                    if (onUploadComplete) onUploadComplete();
                }, 2000);
            };

        } catch (err) {
            console.error(err);
            setError("Ocurrió un error al subir el archivo.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="w-full mt-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border-blue-500/30">
                    <UploadCloud className="w-4 h-4 mr-2" />
                    {label || "Subir Contrato Firmado"}
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 text-white border-gray-800">
                <DialogHeader>
                    <DialogTitle>Subir Contrato - {reservationName}</DialogTitle>
                    <DialogDescription className="text-gray-400">
                        Sube el documento físico (PDF, Imagen, Word o Excel). Esto lo hará visible para el cliente en su portal. (Máx 5MB).
                    </DialogDescription>
                </DialogHeader>

                {extraCategories && extraCategories.length > 0 && (
                    <div className="px-6 py-2 space-y-2">
                        <label className="text-[10px] font-black text-[#3f6066] uppercase tracking-widest">Tipo de documento</label>
                        <div className="flex flex-wrap gap-2">
                            {extraCategories.map((cat: any) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedType(cat.id)}
                                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all border ${
                                        selectedType === cat.id 
                                        ? 'bg-[#3f6066] text-white border-[#3f6066] shadow-lg shadow-[#3f6066]/20' 
                                        : 'bg-white/5 text-gray-500 border-white/10 hover:border-[#3f6066]/40'
                                    }`}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-700 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors">
                    {success ? (
                        <div className="flex flex-col items-center text-green-400">
                            <CheckCircle className="w-12 h-12 mb-2" />
                            <p className="font-medium">¡Documento subido con éxito!</p>
                        </div>
                    ) : isUploading ? (
                        <div className="flex flex-col items-center text-blue-400">
                            <Loader2 className="w-8 h-8 mb-2 animate-spin" />
                            <p className="font-medium">Subiendo y guardando documento...</p>
                        </div>
                    ) : (
                        <label className="flex flex-col items-center w-full cursor-pointer">
                            <UploadCloud className="w-12 h-12 mb-2 text-gray-400" />
                            <span className="text-sm text-gray-300 font-medium">Haz Clic para seleccionar un archivo</span>
                            <div className="text-[10px] text-gray-500 mt-1">PDF, JPG, PNG, Word o Excel</div>
                            <input
                                type="file"
                                accept=".pdf,image/*,.doc,.docx,.xls,.xlsx"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                        </label>
                    )}
                </div>

                {error && <p className="text-sm text-red-500 text-center mt-2 font-medium">{error}</p>}

            </DialogContent>
        </Dialog>
    );
}
