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
            <DrawerContent className="bg-white border-t border-gray-200 text-gray-900 max-h-[85vh]">
                <DrawerHeader className="text-left pb-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className={cn(
                                'w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-black',
                                (isSold || isBlocked)
                                    ? 'bg-red-50 text-red-500 border border-red-200'
                                    : 'bg-emerald-50 text-emerald-500 border border-emerald-200'
                            )}>
                                {lot.number}
                            </div>
                            <div>
                                <DrawerTitle className="text-gray-900 text-lg font-black uppercase tracking-tight">
                                    Terreno {lot.number}
                                </DrawerTitle>
                                <DrawerDescription className="text-gray-500 text-[10px] font-black uppercase tracking-widest">
                                    Etapa {lot.stage} · {lot.area_m2}m²
                                </DrawerDescription>
                            </div>
                        </div>
                        <span className={cn(
                            'px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border',
                            (isSold || isBlocked)
                                ? 'bg-red-50 text-red-600 border-red-200'
                                : 'bg-emerald-50 text-emerald-600 border-emerald-200'
                        )}>
                            {isBlocked ? 'Bloqueado' : (isSold ? 'Vendido' : 'Disponible')}
                        </span>
                    </div>
                </DrawerHeader>

                <div className="px-4 py-3 space-y-4 overflow-y-auto">
                    {/* Financial Info */}
                    {lot.price_total_clp && (
                        <div className="bg-gray-50 rounded-[2rem] p-5 border border-gray-100 space-y-3">
                            <div className="flex justify-between text-xs items-center">
                                <span className="text-gray-500 font-black uppercase tracking-widest">Precio Total</span>
                                <span className="font-black text-gray-900 text-base">{CLP(lot.price_total_clp)}</span>
                            </div>
                            <div className="h-px bg-gray-200/50" />
                            {lot.pie && (
                                <div className="flex justify-between text-xs items-center">
                                    <span className="text-gray-500 font-black uppercase tracking-widest">Pie</span>
                                    <span className="text-gray-900 font-bold">{CLP(lot.pie)}</span>
                                </div>
                            )}
                            {lot.cuotas && lot.valor_cuota && (
                                <div className="flex justify-between text-xs items-center">
                                    <span className="text-gray-500 font-black uppercase tracking-widest">Cuotas ({lot.cuotas})</span>
                                    <span className="text-gray-900 font-bold">{CLP(lot.valor_cuota)}/mes</span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Owner Info */}
                    {hasOwner && (
                        <div className="bg-[#3f6066]/5 rounded-[2rem] p-5 border border-[#3f6066]/10">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-[#3f6066]/20 flex items-center justify-center text-[#4A6E75] font-black text-xl border border-[#3f6066]/30">
                                    {owner?.name?.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-black text-gray-900 text-sm uppercase truncate">{owner?.name}</p>
                                    <p className="text-gray-500 text-[10px] font-bold truncate">{owner?.email}</p>
                                </div>
                            </div>
                            
                            {/* Ver como Usuario button for mobile */}
                            <Button
                                onClick={() => {
                                    // In the dashboard, we can't easily impersonate from here without state lifting
                                    // But we can redirect or show instructions
                                    toast.info("Para ver como usuario, ve a la pestaña 'Estado de Cuentas' y selecciona al cliente.");
                                }}
                                variant="outline"
                                className="w-full mt-4 h-10 text-[10px] font-black uppercase tracking-widest rounded-xl bg-white border-gray-200 text-[#4A6E75] hover:bg-gray-50"
                            >
                                <Maximize2 className="w-4 h-4 mr-2" />
                                Ver Ficha Completa
                            </Button>
                        </div>
                    )}

                    {/* Quick Actions */}
                    <div className="space-y-3 pt-2">
                        {!isSold && (
                            <Button
                                onClick={handleToggleStatus}
                                disabled={isToggling}
                                className={cn(
                                    'w-full h-12 text-xs font-black uppercase tracking-widest rounded-2xl transition-all duration-300 shadow-sm',
                                    'active:scale-[0.98]',
                                    isBlocked
                                        ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-200'
                                        : 'bg-red-500 hover:bg-red-600 text-white shadow-red-200'
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
                                className="w-full h-12 text-xs font-black uppercase tracking-widest rounded-2xl bg-amber-400 hover:bg-amber-500 text-black active:scale-[0.98] transition-all duration-300 shadow-sm shadow-amber-200"
                            >
                                <UserPlus className="w-5 h-5 mr-2" />
                                Asignar Dueño
                            </Button>
                        )}
                    </div>
                </div>

                <DrawerFooter className="pt-2 pb-8">
                    <DrawerClose asChild>
                        <Button variant="ghost" className="text-gray-500 font-black uppercase text-[10px] tracking-widest hover:bg-gray-100 h-11 rounded-xl">
                            Cerrar
                        </Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}
