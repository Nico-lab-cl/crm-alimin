'use client';

import { useState } from 'react';
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
    DrawerFooter,
    DrawerClose,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Lock, Unlock, UserPlus, Loader2, MapPin, Maximize2 } from 'lucide-react';
import { updateLotStatus } from '@/actions/dashboard';
import { toast } from 'sonner';
import { useSyncStatus } from './SyncProvider';
import { cn } from '@/lib/utils';

interface LotData {
    id: number;
    number: string | null;
    stage: number | null;
    area_m2: number | null;
    price_total_clp: number | null;
    status: string;
    pie: number | null;
    cuotas: number | null;
    valor_cuota: number | null;
    reservations?: {
        id: string;
        buyer: { name: string; email: string } | null;
        signed_at: Date | null;
        is_legacy?: boolean;
        workflow_activated?: boolean;
    }[];
}

interface LotBottomSheetProps {
    lot: LotData | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onStatusChange: (lotId: number, newStatus: string) => void;
    onAssignOwner: (lotId: number, lotNumber: string | null) => void;
}

const CLP = (value: number) =>
    new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(value);

export function LotBottomSheet({ lot, open, onOpenChange, onStatusChange, onAssignOwner }: LotBottomSheetProps) {
    const [isToggling, setIsToggling] = useState(false);
    const { startSync, endSync } = useSyncStatus();

    if (!lot) return null;

    const isSold = lot.status === 'sold';
    const isBlocked = lot.status === 'blocked';
    const isReserved = lot.status === 'reserved';
    const owner = lot.reservations?.[0]?.buyer;
    const hasOwner = !!owner;

    const handleToggleStatus = async () => {
        // Toggle between available and blocked if not sold
        const newStatus = isBlocked ? 'available' : 'blocked';
        setIsToggling(true);

        // Optimistic: update UI immediately
        onStatusChange(lot.id, newStatus);

        const syncId = startSync();
        try {
            const res = await updateLotStatus(lot.id, newStatus);
            if (res.success) {
                toast.success(`Terreno ${lot.number} ${newStatus === 'blocked' ? 'bloqueado' : 'desbloqueado'}`);
            } else {
                // Rollback
                onStatusChange(lot.id, lot.status);
                toast.error(res.error || 'Error al actualizar');
            }
        } catch {
            onStatusChange(lot.id, lot.status);
            toast.error('Error de conexión');
        } finally {
            endSync(syncId);
            setIsToggling(false);
        }
    };

    return (
        <Drawer open={open} onOpenChange={onOpenChange}>
            <DrawerContent className="bg-gray-950 border-white/10 text-white max-h-[85vh]">
                <DrawerHeader className="text-left pb-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className={cn(
                                'w-12 h-12 rounded-xl flex items-center justify-center text-lg font-black',
                                (isSold || isBlocked)
                                    ? 'bg-red-900/40 text-red-400 border border-red-500/30'
                                    : 'bg-green-900/40 text-green-400 border border-green-500/30'
                            )}>
                                {lot.number}
                            </div>
                            <div>
                                <DrawerTitle className="text-white text-lg">
                                    Terreno {lot.number}
                                </DrawerTitle>
                                <DrawerDescription className="text-gray-400 text-sm">
                                    Etapa {lot.stage} · {lot.area_m2}m²
                                </DrawerDescription>
                            </div>
                        </div>
                        <span className={cn(
                            'px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider',
                            (isSold || isBlocked)
                                ? 'bg-red-900/30 text-red-400 border border-red-500/20'
                                : 'bg-green-900/30 text-green-400 border border-green-500/20'
                        )}>
                            {isBlocked ? 'Bloqueado' : (isSold ? 'Vendido' : 'Disponible')}
                        </span>
                    </div>
                </DrawerHeader>

                <div className="px-4 py-3 space-y-4 overflow-y-auto">
                    {/* Financial Info */}
                    {lot.price_total_clp && (
                        <div className="bg-white/5 rounded-xl p-3 border border-white/5 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Precio Total</span>
                                <span className="font-semibold text-alimin-gold">{CLP(lot.price_total_clp)}</span>
                            </div>
                            {lot.pie && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Pie</span>
                                    <span className="text-white">{CLP(lot.pie)}</span>
                                </div>
                            )}
                            {lot.cuotas && lot.valor_cuota && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Cuotas ({lot.cuotas})</span>
                                    <span className="text-white">{CLP(lot.valor_cuota)}/mes</span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Owner Info */}
                    {hasOwner && (
                        <div className="bg-alimin-green/10 rounded-xl p-3 border border-alimin-green/20">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-alimin-green flex items-center justify-center text-alimin-gold font-bold text-lg">
                                    {owner?.name?.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p className="font-semibold text-white text-sm">{owner?.name}</p>
                                    <p className="text-gray-400 text-xs">{owner?.email}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Quick Actions */}
                    <div className="space-y-3">
                        {!isSold && (
                            <Button
                                onClick={handleToggleStatus}
                                disabled={isToggling}
                                className={cn(
                                    'w-full h-12 text-base font-bold rounded-xl transition-all duration-200',
                                    'active:scale-[0.98]',
                                    isBlocked
                                        ? 'bg-green-600 hover:bg-green-700 text-white'
                                        : 'bg-red-600 hover:bg-red-700 text-white'
                                )}
                            >
                                {isToggling ? (
                                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                ) : isBlocked ? (
                                    <Unlock className="w-5 h-5 mr-2" />
                                ) : (
                                    <Lock className="w-5 h-5 mr-2" />
                                )}
                                {isBlocked ? 'Desbloquear Terreno' : 'Bloquear Terreno'}
                            </Button>
                        )}

                        {/* Show Assign Owner if sold but no owner */}
                        {isSold && !hasOwner && (
                            <Button
                                onClick={() => {
                                    onAssignOwner(lot.id, lot.number);
                                    onOpenChange(false);
                                }}
                                className="w-full h-12 text-base font-bold rounded-xl bg-alimin-gold hover:bg-[#d4aa52] text-alimin-green active:scale-[0.98] transition-all duration-200"
                            >
                                <UserPlus className="w-5 h-5 mr-2" />
                                Asignar Dueño
                            </Button>
                        )}
                    </div>
                </div>

                <DrawerFooter className="pt-2">
                    <DrawerClose asChild>
                        <Button variant="ghost" className="text-gray-400 hover:text-white hover:bg-white/5 h-11">
                            Cerrar
                        </Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}
