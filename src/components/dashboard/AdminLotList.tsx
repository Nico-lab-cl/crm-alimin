'use client'

import { useState } from 'react'
import { Lot } from '@prisma/client'
import { updateLotStatus, triggerLegacyWorkflow } from '@/actions/dashboard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Loader2, UserPlus, User, ChevronLeft, ChevronRight } from 'lucide-react'
import { toast } from 'sonner'
import { AssignOwnerModal } from './AssignOwnerModal'
import { LotBottomSheet } from '@/components/admin/LotBottomSheet'
import { useSyncStatus } from '@/components/admin/SyncProvider'
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

    // Mobile Bottom Sheet state
    const [selectedLot, setSelectedLot] = useState<LotWithReservation | null>(null)
    const [bottomSheetOpen, setBottomSheetOpen] = useState(false)

    const { startSync, endSync } = useSyncStatus()

    // Pagination
    const LOTS_PER_PAGE = 18
    const [currentPage, setCurrentPage] = useState(1)

    // Get unique stages for the filter dropdown
    const stages = Array.from(new Set(lots.map(l => l.stage).filter(Boolean))).sort((a, b) => (a as number) - (b as number))

    const handleStatusChange = async (lotId: number, newStatus: string) => {
        // Optimistic update
        setLots(prev => prev.map(l => l.id === lotId ? { ...l, status: newStatus } : l))

        setLoadingIds(prev => new Set(prev).add(lotId))
        const syncId = startSync()

        try {
            const res = await updateLotStatus(lotId, newStatus)

            if (res.success) {
                toast.success(`Terreno ${lotId} actualizado a ${newStatus === 'sold' ? 'VENDIDO' : 'DISPONIBLE'}`)
            } else {
                // Rollback
                setLots(prev => prev.map(l => l.id === lotId ? { ...l, status: l.status === newStatus ? (newStatus === 'sold' ? 'available' : 'sold') : l.status } : l))
                toast.error("Error al actualizar estado")
            }
        } catch {
            toast.error("Error de conexión")
        } finally {
            endSync(syncId)
            setLoadingIds(prev => {
                const next = new Set(prev)
                next.delete(lotId)
                return next
            })
        }
    }

    // Optimistic handler for bottom sheet
    const handleOptimisticStatusChange = (lotId: number, newStatus: string) => {
        setLots(prev => prev.map(l => l.id === lotId ? { ...l, status: newStatus } : l))
        // Also update the selectedLot if it's the one changing
        setSelectedLot(prev => prev && prev.id === lotId ? { ...prev, status: newStatus } : prev)
    }

    const handleOpenBottomSheet = (lot: LotWithReservation) => {
        setSelectedLot(lot)
        setBottomSheetOpen(true)
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

    // Reset page when filter/stage changes
    const handleFilterChange = (value: string) => {
        setFilter(value)
        setCurrentPage(1)
    }
    const handleStageChange = (value: string) => {
        setSelectedStage(value)
        setCurrentPage(1)
    }

    // Pagination calculations
    const totalPages = Math.ceil(filteredLots.length / LOTS_PER_PAGE)
    const paginatedLots = filteredLots.slice((currentPage - 1) * LOTS_PER_PAGE, currentPage * LOTS_PER_PAGE)

    return (
        <div className="space-y-4 overflow-x-hidden max-w-full">
            <div className="flex flex-col md:flex-row gap-3 md:gap-4 items-center bg-white/5 p-3 md:p-4 rounded-xl border border-white/10">
                <div className="flex items-center gap-2 w-full md:w-auto flex-1">
                    <Search className="w-5 h-5 text-gray-400" />
                    <Input
                        placeholder="Buscar terreno..."
                        value={filter}
                        onChange={(e) => handleFilterChange(e.target.value)}
                        className="bg-transparent border-none text-white focus-visible:ring-0 placeholder:text-gray-500 w-full"
                    />
                </div>

                <div className="w-full md:w-48">
                    <Select value={selectedStage} onValueChange={handleStageChange}>
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

            {/* Counter */}
            <p className="text-[11px] text-gray-500 font-medium px-1">
                {filteredLots.length} terreno{filteredLots.length !== 1 ? 's' : ''}
                {totalPages > 1 && ` · Pág ${currentPage} de ${totalPages}`}
            </p>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-3">
                {paginatedLots.map(lot => {
                    const isSold = lot.status === 'sold'
                    const isLoading = loadingIds.has(lot.id)
                    const owner = lot.reservations?.[0]?.buyer
                    const hasOwner = !!owner

                    return (
                        <div
                            key={lot.id}
                            onClick={() => {
                                // On mobile, open bottom sheet
                                if (window.innerWidth < 768) {
                                    handleOpenBottomSheet(lot)
                                }
                            }}
                            className={`
                                relative p-2 md:p-3 rounded-xl border transition-all duration-200 flex flex-col items-center gap-1.5 md:gap-2
                                ${isSold
                                    ? 'bg-red-900/20 border-red-500/30 hover:bg-red-900/30'
                                    : 'bg-green-900/20 border-green-500/30 hover:bg-green-900/30'
                                }
                                md:cursor-default cursor-pointer active:scale-[0.97] md:active:scale-100
                            `}
                        >
                            <div className="text-center">
                                <span className={`text-[10px] md:text-xs uppercase font-bold tracking-wider ${isSold ? 'text-red-400' : 'text-green-400'}`}>
                                    {isSold ? 'VENDIDO' : 'DISPONIBLE'}
                                </span>
                                <p className="text-white font-bold text-sm md:text-lg">
                                    Terreno {lot.number}
                                </p>
                                <p className="text-white/50 text-[10px] md:text-xs">
                                    Etapa {lot.stage}
                                </p>
                                {/* Desktop: Show financial details inline */}
                                <div className="hidden md:block">
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
                            </div>

                            {/* Desktop: Show inline controls */}
                            <div className="w-full pt-1.5 md:pt-2 border-t border-white/5 hidden md:block">
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

                                {hasOwner ? (
                                    <div className="flex flex-col items-center gap-1 mt-1 font-bold">
                                        <div className="flex items-center gap-1 text-[10px] text-gray-400" title={owner?.email}>
                                            <User className="w-3 h-3" />
                                            <span className="truncate max-w-[120px]">{owner?.name?.split(' ')[0]}</span>
                                        </div>
                                        {lot.reservations?.[0]?.is_legacy && !lot.reservations?.[0]?.workflow_activated && (
                                            <div className="w-full px-1">
                                                <Button
                                                    size="sm"
                                                    onClick={async () => {
                                                        if (!lot.reservations?.[0]?.id) return;
                                                        if (!confirm("¿Estás seguro de activar el Workflow? Esto activará al cliente en la base de datos de Aliman y enviará su correo de bienvenida.")) return;

                                                        setLoadingIds(prev => new Set(prev).add(lot.id));
                                                        try {
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

                            {/* Mobile: Show owner badge or status icon */}
                            <div className="md:hidden w-full text-center">
                                {hasOwner ? (
                                    <div className="flex items-center justify-center gap-1 text-[10px] text-gray-400">
                                        <User className="w-3 h-3" />
                                        <span className="truncate max-w-[60px]">{owner?.name?.split(' ')[0]}</span>
                                    </div>
                                ) : isSold ? (
                                    <div className="text-[10px] text-alimin-gold font-medium">
                                        Sin dueño
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between gap-3 pt-2 pb-4">
                    <button
                        onClick={() => { setCurrentPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        disabled={currentPage === 1}
                        className="flex items-center justify-center gap-1 min-h-[44px] px-4 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-bold disabled:opacity-30 disabled:cursor-not-allowed active:scale-[0.95] transition-all"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Anterior
                    </button>
                    <span className="text-xs text-gray-400 font-mono">
                        {currentPage}/{totalPages}
                    </span>
                    <button
                        onClick={() => { setCurrentPage(p => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        disabled={currentPage === totalPages}
                        className="flex items-center justify-center gap-1 min-h-[44px] px-4 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-bold disabled:opacity-30 disabled:cursor-not-allowed active:scale-[0.95] transition-all"
                    >
                        Siguiente
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Mobile Bottom Sheet */}
            <LotBottomSheet
                lot={selectedLot}
                open={bottomSheetOpen}
                onOpenChange={setBottomSheetOpen}
                onStatusChange={handleOptimisticStatusChange}
                onAssignOwner={(lotId, lotNumber) => {
                    setAssignModal({ open: true, lotId, lotNumber })
                }}
            />

            <AssignOwnerModal
                lotId={assignModal.lotId}
                lotNumber={assignModal.lotNumber}
                open={assignModal.open}
                onOpenChange={(open) => setAssignModal(prev => ({ ...prev, open }))}
                onSuccess={() => {
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
