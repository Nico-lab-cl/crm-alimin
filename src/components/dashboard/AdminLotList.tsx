'use client'

import { useState } from 'react'
import { Lot } from '@prisma/client'
import { updateLotStatus, triggerLegacyWorkflow } from '@/actions/dashboard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Loader2, UserPlus, User } from 'lucide-react'
import { toast } from 'sonner'
import { AssignOwnerModal } from './AssignOwnerModal'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

type LotWithReservation = Lot & {
    reservations?: {
        id: string;
        buyer: { name: string; email: string } | null;
        signed_at: Date | null;
        is_legacy?: boolean;
        workflow_activated?: boolean;
    }[]
}

type AdminLotListProps = {
    lots: LotWithReservation[]
}

export const AdminLotList = ({ lots: initialLots }: AdminLotListProps) => {
    const [lots, setLots] = useState(initialLots)
    const [filter, setFilter] = useState('')
    const [selectedStage, setSelectedStage] = useState<string>('all')
    const [loadingIds, setLoadingIds] = useState<Set<number>>(new Set())
    const [assignModal, setAssignModal] = useState<{ open: boolean, lotId: number | null, lotNumber: string | null }>({
        open: false,
        lotId: null,
        lotNumber: null
    })

    // Get unique stages for the filter dropdown
    const stages = Array.from(new Set(lots.map(l => l.stage).filter(Boolean))).sort((a, b) => (a as number) - (b as number))

    const handleStatusChange = async (lotId: number, newStatus: string) => {
        setLoadingIds(prev => new Set(prev).add(lotId))

        const res = await updateLotStatus(lotId, newStatus)

        if (res.success) {
            setLots(prev => prev.map(l => l.id === lotId ? { ...l, status: newStatus } : l))
            toast.success(`Lote ${lotId} actualizado a ${newStatus.toUpperCase()}`)
        } else {
            toast.error("Error al actualizar estado")
        }

        setLoadingIds(prev => {
            const next = new Set(prev)
            next.delete(lotId)
            return next
        })
    }

    const filteredLots = lots.filter(lot => {
        const matchesText = lot.number?.toString().toLowerCase().includes(filter.toLowerCase()) ||
            lot.stage?.toString().includes(filter)
        const matchesStage = selectedStage === 'all' || lot.stage?.toString() === selectedStage
        return matchesText && matchesStage
    }).sort((a, b) => {
        // Sort by Stage first (Low to High)
        if ((a.stage || 0) !== (b.stage || 0)) {
            return (a.stage || 0) - (b.stage || 0)
        }
        // Then by Lot Number (Low to High), handling string numbers
        const numA = parseInt(a.number || '0')
        const numB = parseInt(b.number || '0')
        return numA - numB
    })

    return (
        <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4 items-center bg-white/5 p-4 rounded-xl border border-white/10">
                <div className="flex items-center gap-2 w-full md:w-auto flex-1">
                    <Search className="w-5 h-5 text-gray-400" />
                    <Input
                        placeholder="Buscar por número..."
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="bg-transparent border-none text-white focus-visible:ring-0 placeholder:text-gray-500 w-full"
                    />
                </div>

                <div className="w-full md:w-48">
                    <Select value={selectedStage} onValueChange={setSelectedStage}>
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                            <SelectValue placeholder="Filtrar por Etapa" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900 border-white/10 text-white">
                            <SelectItem value="all">Todas las Etapas</SelectItem>
                            {stages.map(stage => (
                                <SelectItem key={stage} value={String(stage)}>
                                    Etapa {stage}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {filteredLots.map(lot => {
                    // Admin only distinguishes between sold and available.
                    // 'reserved' is a transient state for the public map only — show as available here.
                    const isSold = lot.status === 'sold'
                    const isLoading = loadingIds.has(lot.id)

                    // Check if sold/reserved lot has an owner
                    const owner = lot.reservations?.[0]?.buyer
                    const hasOwner = !!owner

                    return (
                        <div
                            key={lot.id}
                            className={`
                                relative p-3 rounded-xl border transition-all duration-200 flex flex-col items-center gap-2
                                ${isSold
                                    ? 'bg-red-900/20 border-red-500/30 hover:bg-red-900/30'
                                    : 'bg-green-900/20 border-green-500/30 hover:bg-green-900/30'
                                }
                            `}
                        >
                            <div className="text-center">
                                <span className={`text-xs uppercase font-bold tracking-wider ${isSold ? 'text-red-400' : 'text-green-400'}`}>
                                    {isSold ? 'VENDIDO' : 'DISPONIBLE'}
                                </span>
                                <p className="text-white font-bold text-lg">
                                    Lote {lot.number}
                                </p>
                                <p className="text-white/50 text-xs">
                                    Etapa {lot.stage}
                                </p>
                                {(lot.cuotas && lot.cuotas > 0) ? (
                                    <div className="mt-2 text-[10px] text-gray-400 space-y-0.5">
                                        <div className="flex justify-between">
                                            <span>Cuotas ({((lot.cuotas || 0) - 1)}):</span>
                                            <span className="text-white font-medium">
                                                {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(lot.valor_cuota || 0)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Última Cuota:</span>
                                            <span className="text-white font-medium">
                                                {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(lot.last_installment_amount || 0)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Pie:</span>
                                            <span className="text-white font-medium">
                                                {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(lot.pie || 0)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Reserva:</span>
                                            <span className="text-white font-medium">
                                                {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(lot.reservation_amount_clp || 0)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between pt-0.5 border-t border-white/10 mt-0.5">
                                            <span>Total:</span>
                                            <span className="text-[#E0B457] font-medium">
                                                {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(
                                                    (((lot.cuotas || 0) - 1) * (lot.valor_cuota || 0)) +
                                                    (lot.last_installment_amount || 0) +
                                                    (lot.pie || 0)
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                ) : null}
                            </div>

                            <div className="w-full pt-2 border-t border-white/5">
                                <Select
                                    defaultValue={lot.status}
                                    onValueChange={(val) => handleStatusChange(lot.id, val)}
                                    disabled={isLoading}
                                >
                                    <SelectTrigger className="h-7 text-xs bg-white/5 border-white/10 text-white">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="available">Disponible</SelectItem>
                                        <SelectItem value="sold">Vendido</SelectItem>
                                    </SelectContent>
                                </Select>

                                {/* Show Owner if exists, or Assign Button if Sold/Reserved but no owner */}
                                {hasOwner ? (
                                    <div className="flex flex-col items-center gap-1 mt-1 font-bold">
                                        <div className="flex items-center gap-1 text-[10px] text-gray-400" title={owner?.email}>
                                            <User className="w-3 h-3" />
                                            <span className="truncate max-w-[120px]">{owner?.name?.split(' ')[0]}</span>
                                        </div>
                                        {/* If it's a legacy user without an active workflow, we offer the activation button */}
                                        {lot.reservations?.[0]?.is_legacy && !lot.reservations?.[0]?.workflow_activated && (
                                            <div className="w-full px-1">
                                                <Button
                                                    size="sm"
                                                    onClick={async () => {
                                                        if (!lot.reservations?.[0]?.id) return;
                                                        if (!confirm("¿Estás seguro de activar el Workflow? Esto activará al cliente en la base de datos de Aliman y enviará su correo de bienvenida.")) return;

                                                        setLoadingIds(prev => new Set(prev).add(lot.id));
                                                        try {
                                                            // We must import triggerLegacyWorkflow at the top of the file
                                                            const res = await triggerLegacyWorkflow(lot.reservations[0].id);
                                                            if (res.success) {
                                                                toast.success(res.message);
                                                                window.location.reload();
                                                            } else {
                                                                toast.error(res.error || "Error al activar el workflow");
                                                            }
                                                        } finally {
                                                            setLoadingIds(prev => {
                                                                const next = new Set(prev);
                                                                next.delete(lot.id);
                                                                return next;
                                                            });
                                                        }
                                                    }}
                                                    disabled={isLoading}
                                                    className="w-full h-6 text-[10px] bg-blue-600 hover:bg-blue-700 text-white mt-1 gap-1"
                                                >
                                                    🚀 Activar
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                ) : isSold ? (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="w-full mt-1 h-6 text-[10px] text-[#E0B457] hover:text-[#d4aa52] hover:bg-white/5"
                                        onClick={() => setAssignModal({ open: true, lotId: lot.id, lotNumber: lot.number })}
                                    >
                                        <UserPlus className="w-3 h-3 mr-1" />
                                        Asignar Dueño
                                    </Button>
                                ) : null}
                            </div>
                        </div>
                    )
                })}
            </div>

            <AssignOwnerModal
                lotId={assignModal.lotId}
                lotNumber={assignModal.lotNumber}
                open={assignModal.open}
                onOpenChange={(open) => setAssignModal(prev => ({ ...prev, open }))}
                onSuccess={() => {
                    // Ideally refresh data, for now we rely on revalidatePath from action and maybe router.refresh() 
                    // typically triggers a re-render if using server components, but here we have local state `lots`.
                    // We should really force a refresh or update local state...
                    // For simplicity, we can reload the page or just accept that revalidatePath handles the next visit.
                    // A better UX would be to emit an event or router.refresh()
                    window.location.reload()
                }}
            />
            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.2);
                }
            `}</style>
        </div>
    )
}
