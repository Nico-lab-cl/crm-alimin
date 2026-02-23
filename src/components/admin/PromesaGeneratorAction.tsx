"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export function PromesaGeneratorAction({ reservationId, reservationName }: { reservationId: string, reservationName: string }) {
    const [promesaOpen, setPromesaOpen] = useState(false)
    const [promitente, setPromitente] = useState("cindy") // Default

    const handleGenerate = () => {
        // Build URL parameters
        const url = `/api/contracts/${reservationId}/promesa?rep=${promitente}`;
        window.open(url, "_blank");
        setPromesaOpen(false);
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
                </div>
                <Button onClick={handleGenerate} disabled={!promitente}>
                    Generar Contrato PDF
                </Button>
            </DialogContent>
        </Dialog>
    )
}
