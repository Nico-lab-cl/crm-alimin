'use client'

import { useState } from 'react'
import { Lot } from '@prisma/client'
import { updateLotStatus } from '@/actions/dashboard'
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
    }[]
}

type AdminLotListProps = {
    lots: LotWithReservation[]
}

export const AdminLotList = ({ lots: initialLots }: AdminLotListProps) => {
    const [lots, setLots] = useState(initialLots)
    const [filter, setFilter] = useState('')
    const [loadingIds, setLoadingIds] = useState<Set<number>>(new Set())
    const [assignModal, setAssignModal] = useState<{ open: boolean, lotId: number | null, lotNumber: string | null }>({
        open: false,
        lotId: null,
        lotNumber: null
    })

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

    const filteredLots = lots.filter(lot =>
        lot.number?.toString().toLowerCase().includes(filter.toLowerCase()) ||
        lot.stage?.toString().includes(filter)
    )

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 bg-white/5 p-2 rounded-lg border border-white/10">
                <Search className="w-5 h-5 text-gray-400" />
                <Input
                    placeholder="Buscar por número o etapa..."
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="bg-transparent border-none text-white focus-visible:ring-0 placeholder:text-gray-500"
                />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {filteredLots.map(lot => {
                    const isSold = lot.status === 'sold'
                    const isReserved = lot.status === 'reserved'
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
                                    : isReserved
                                        ? 'bg-yellow-900/20 border-yellow-500/30'
                                        : 'bg-green-900/20 border-green-500/30 hover:bg-green-900/30'
                                }
                            `}
                        >
                            <div className="text-center">
                                <span className={`text-xs uppercase font-bold tracking-wider ${isSold ? 'text-red-400' : isReserved ? 'text-yellow-400' : 'text-green-400'
                                    }`}>
                                    {isSold ? 'VENDIDO' : isReserved ? 'RESERVADO' : 'DISPONIBLE'}
                                </span>
                                <p className="text-white font-bold text-lg">
                                    Lote {lot.number}
                                </p>
                                <p className="text-white/50 text-xs">
                                    Etapa {lot.stage}
                                </p>
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
                                        <SelectItem value="reserved">Reservado</SelectItem>
                                    </SelectContent>
                                </Select>

                                {/* Show Owner if exists, or Assign Button if Sold/Reserved but no owner */}
                                {hasOwner ? (
                                    <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-1 justify-center" title={owner?.email}>
                                        <User className="w-3 h-3" />
                                        <span className="truncate max-w-[120px]">{owner?.name?.split(' ')[0]}</span>
                                    </div>
                                ) : (isSold || isReserved) ? (
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
