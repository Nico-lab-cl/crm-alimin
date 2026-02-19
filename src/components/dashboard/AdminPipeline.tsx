"use client"

import { useState } from "react"
import { Reservation, Lot, User } from "@prisma/client"
import { AdminPipelineCard } from "./AdminPipelineCard"
import { updatePipelineStage, assignSeller } from "@/actions/dashboard"
import { toast } from "sonner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type ReservationWithDetails = Reservation & {
    lot: Lot
    buyer: User | null
    seller: User | null
}

const STAGES = [
    { id: "RESERVA_PAGADA", label: "Reserva", color: "bg-blue-100 text-blue-800 border-blue-200" },
    { id: "CONTRATO_FIRMADO", label: "Contrato de Reserva Firmado", color: "bg-amber-100 text-amber-800 border-amber-200" },
    { id: "PIE_PAGADO", label: "Pie Pagado", color: "bg-purple-100 text-purple-800 border-purple-200" },
    { id: "PAGO_CUOTAS", label: "Pago de Cuotas", color: "bg-indigo-100 text-indigo-800 border-indigo-200" },
    { id: "VENTA_CERRADA", label: "Venta Cerrada", color: "bg-green-100 text-green-800 border-green-200" },
]

/**
 * Determines the effective pipeline stage based on reservation data.
 * Auto-placement rules:
 * - If installments_paid > 0 → PAGO_CUOTAS
 * - If pie_status === 'PAID' → PIE_PAGADO
 * - If signed_at is set → CONTRATO_FIRMADO
 * - Otherwise → use the stored pipeline_stage (default: RESERVA_PAGADA)
 */
function getEffectiveStage(r: ReservationWithDetails & { signed_at?: Date | null }): string {
    // Return the database stage as source of truth to allow manual movement (back/forward)
    // Auto-advancement now happens via webhooks and contract signing actions updating this field.
    return r.pipeline_stage || "RESERVA_PAGADA"
}

export function AdminPipeline({ initialData, sellers }: { initialData: ReservationWithDetails[], sellers: any[] }) {
    const [reservations, setReservations] = useState(initialData)
    const [selectedSeller, setSelectedSeller] = useState<string>("ALL")

    const handleMove = async (id: string, newStage: string) => {
        setReservations(prev => prev.map(r => r.id === id ? { ...r, pipeline_stage: newStage } : r))
        const result = await updatePipelineStage(id, newStage)
        if (result.error) {
            toast.error(result.error)
            setReservations(initialData)
        } else {
            toast.success("Etapa actualizada")
        }
    }

    const handleAssign = async (id: string, sellerId: string) => {
        const result = await assignSeller(id, sellerId)
        if (result.error) {
            toast.error(result.error)
        } else {
            toast.success("Vendedor reasignado")
            setReservations(prev => prev.map(r => r.id === id ? { ...r, seller_id: sellerId, seller: sellers.find(s => s.id === sellerId) } : r))
        }
    }

    const filteredReservations = selectedSeller === "ALL"
        ? reservations
        : reservations.filter(r => r.seller_id === selectedSeller)

    return (
        <div className="h-full flex flex-col gap-4">
            <div className="flex justify-end bg-white p-2 rounded shadow-sm">
                <Select value={selectedSeller} onValueChange={setSelectedSeller}>
                    <SelectTrigger className="w-[220px]">
                        <SelectValue placeholder="Filtrar por vendedor" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">Todos los vendedores</SelectItem>
                        {sellers.map(s => (
                            <SelectItem key={s.id} value={s.id}>{s.name || s.email}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* 5-column grid optimized for large screens */}
            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-3 h-full">
                {STAGES.map(stage => {
                    const items = filteredReservations.filter(r => getEffectiveStage(r as any) === stage.id)
                    return (
                        <div key={stage.id} className="flex flex-col gap-3 bg-gray-50/70 rounded-xl p-3 min-h-[600px] border border-gray-100 shadow-sm">
                            <div className={`p-3 rounded-lg font-semibold text-sm flex justify-between items-center border ${stage.color}`}>
                                <span className="leading-tight">{stage.label}</span>
                                <span className="bg-white/60 px-2 py-0.5 rounded-full text-xs font-bold ml-2 shrink-0">
                                    {items.length}
                                </span>
                            </div>
                            <div className="flex flex-col gap-3 overflow-y-auto flex-1 pr-0.5">
                                {items.map(item => (
                                    <AdminPipelineCard
                                        key={item.id}
                                        reservation={item}
                                        onMove={(newStage) => handleMove(item.id, newStage)}
                                        sellers={sellers}
                                        onAssign={(sellerId) => handleAssign(item.id, sellerId)}
                                    />
                                ))}
                                {items.length === 0 && (
                                    <div className="flex-1 flex items-center justify-center text-xs text-gray-400 italic py-8">
                                        Sin registros
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
