"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Send, Loader2, CheckCircle } from "lucide-react"
import { toast } from "sonner"

export function PromesaGeneratorAction({ reservationId, reservationName }: { reservationId: string, reservationName: string }) {
    const [promesaOpen, setPromesaOpen] = useState(false)
    const [promitente, setPromitente] = useState("cindy") // Default
    const [sending, setSending] = useState(false)
    const [sent, setSent] = useState(false)

    const handleGenerate = () => {
        // Build URL parameters
        const url = `/api/contracts/${reservationId}/promesa?rep=${promitente}`;
        window.open(url, "_blank");
    };

    const handleSendToUser = async () => {
        if (!promitente) return;
        setSending(true);
        try {
            const res = await fetch(`/api/contracts/${reservationId}/send-to-user`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ rep: promitente }),
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.error || "Error al enviar el contrato");
            }

            setSent(true);
            toast.success("✅ Contrato enviado al usuario correctamente");
            setTimeout(() => {
                setPromesaOpen(false);
                setSent(false);
            }, 2000);
        } catch (err: any) {
            toast.error(err.message || "Error al enviar el contrato");
        } finally {
            setSending(false);
        }
    };

    return (
        <Dialog open={promesaOpen} onOpenChange={setPromesaOpen}>
            <DialogTrigger asChild>
                <Button className="w-full text-xs h-8 bg-[#36595F] hover:bg-[#2b4aa9] text-white">
                    Promesa de compra venta
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Generar Promesa: {reservationName}</DialogTitle>
                </DialogHeader>
                <div className="py-4 space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Promitente Vendedor (Firma de Alimin Lomas del Mar SpA):</label>
                        <Select value={promitente} onValueChange={setPromitente}>
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccione representante" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="cindy">Cindy Valeria Gutierrez Gutierrez</SelectItem>
                                <SelectItem value="patricio">Patricio Andrés Escobar Díaz</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex flex-col gap-2 pt-2">
                        {/* Preview PDF */}
                        <Button
                            variant="outline"
                            onClick={handleGenerate}
                            disabled={!promitente}
                            className="w-full"
                        >
                            Vista previa / Descargar PDF
                        </Button>

                        {/* Send to user */}
                        <Button
                            onClick={handleSendToUser}
                            disabled={!promitente || sending || sent}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                        >
                            {sent ? (
                                <>
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Enviado al usuario
                                </>
                            ) : sending ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Generando y enviando...
                                </>
                            ) : (
                                <>
                                    <Send className="w-4 h-4 mr-2" />
                                    Enviar contrato al usuario
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
