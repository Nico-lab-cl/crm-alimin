'use client'

import { useState } from 'react'
import { Lot } from '@prisma/client'
import { updateLotStatus } from '@/actions/dashboard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

type AdminLotListProps = {
    lots: Lot[]
}

export const AdminLotList = ({ lots: initialLots }: AdminLotListProps) => {
    const [lots, setLots] = useState(initialLots)
    const [filter, setFilter] = useState('')
    const [loadingIds, setLoadingIds] = useState<Set<number>>(new Set())

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
                            </div>
                        </div>
                    )
                })}
            </div>
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
