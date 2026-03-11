'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check, ChevronsUpDown, ShieldAlert, ShieldCheck, Snowflake } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { toggleMoraFreeze } from '@/actions/dashboard';
import { useRouter } from 'next/navigation';

interface UserData {
    id: string;
    name: string;
    email: string;
    purchases: any[];
}

interface AdminMoraManagerProps {
    users: UserData[];
}

export function AdminMoraManager({ users }: AdminMoraManagerProps) {
    const [open, setOpen] = useState(false);
    const [comboOpen, setComboOpen] = useState(false);
    const [selectedReservationId, setSelectedReservationId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    // Flatten reservations for the combobox
    const allReservations = users.flatMap(u => 
        u.purchases.map(p => ({
            userId: u.id,
            userName: u.name,
            userEmail: u.email,
            reservationId: p.id,
            lotNumber: p.lot?.number || 'N/A',
            isMoraFrozen: Boolean(p.mora_frozen)
        }))
    );

    const frozenReservations = allReservations.filter(r => r.isMoraFrozen);
    const normalReservations = allReservations.filter(r => !r.isMoraFrozen);

    const selectedRes = allReservations.find(r => r.reservationId === selectedReservationId);

    const handleToggleMora = async (freeze: boolean) => {
        if (!selectedReservationId) return;
        setIsLoading(true);
        const res = await toggleMoraFreeze(selectedReservationId, freeze);
        setIsLoading(false);
        if (res.error) {
            toast.error(res.error);
        } else {
            toast.success(res.message);
            router.refresh();
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="border-cyan-500/30 text-cyan-500 hover:bg-cyan-500/10">
                    <Snowflake className="w-4 h-4 mr-2" />
                    Gestor de Mora
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Congelar / Eximir de Mora</DialogTitle>
                    <DialogDescription>
                        Selecciona un cliente para excluirlo temporalmente del cálculo de intereses por mora y notificaciones de cobro. Ideal para clientes sin promesa firmada.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4">
                    <Popover open={comboOpen} onOpenChange={setComboOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={comboOpen}
                                className="w-full justify-between"
                            >
                                {selectedRes
                                    ? `${selectedRes.userName} (Lote ${selectedRes.lotNumber})`
                                    : "Buscar cliente o lote..."}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                            <Command>
                                <CommandInput placeholder="Buscar por nombre..." />
                                <CommandList>
                                    <CommandEmpty>No se encontró ningún cliente.</CommandEmpty>
                                    {frozenReservations.length > 0 && (
                                        <CommandGroup heading="Clientes Exentos (Mora Congelada)">
                                            {frozenReservations.map((res) => (
                                                <CommandItem
                                                    key={res.reservationId}
                                                    value={res.userName}
                                                    onSelect={() => {
                                                        setSelectedReservationId(res.reservationId);
                                                        setComboOpen(false);
                                                    }}
                                                >
                                                    <Check
                                                        className={cn(
                                                            "mr-2 h-4 w-4 text-cyan-500",
                                                            selectedReservationId === res.reservationId ? "opacity-100" : "opacity-0"
                                                        )}
                                                    />
                                                    <div className="flex flex-col">
                                                        <span>{res.userName}</span>
                                                        <span className="text-xs text-cyan-600">Lote {res.lotNumber} | {res.userEmail}</span>
                                                    </div>
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    )}

                                    {normalReservations.length > 0 && (
                                        <CommandGroup heading="Sistema Normal de Mora">
                                            {normalReservations.map((res) => (
                                                <CommandItem
                                                    key={res.reservationId}
                                                    value={res.userName}
                                                    onSelect={() => {
                                                        setSelectedReservationId(res.reservationId);
                                                        setComboOpen(false);
                                                    }}
                                                >
                                                    <Check
                                                        className={cn(
                                                            "mr-2 h-4 w-4",
                                                            selectedReservationId === res.reservationId ? "opacity-100" : "opacity-0"
                                                        )}
                                                    />
                                                    <div className="flex flex-col">
                                                        <span>{res.userName}</span>
                                                        <span className="text-xs text-gray-500">Lote {res.lotNumber} | {res.userEmail}</span>
                                                    </div>
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    )}
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>

                    {selectedRes && (
                        <div className="mt-6 space-y-4">
                            <div className={cn("p-4 rounded border flex items-start gap-4 transition-colors", selectedRes.isMoraFrozen ? "bg-cyan-50 border-cyan-200 text-cyan-800" : "bg-orange-50 border-orange-200 text-orange-800")}>
                                {selectedRes.isMoraFrozen ? <ShieldCheck className="w-8 h-8 shrink-0 text-cyan-500" /> : <ShieldAlert className="w-8 h-8 shrink-0 text-orange-500" />}
                                <div>
                                    <p className="font-bold text-sm">
                                        {selectedRes.isMoraFrozen ? "Mora Congelada / Cliente Exento" : "Sistema Normal de Mora"}
                                    </p>
                                    <p className="text-xs mt-1 opacity-90">
                                        {selectedRes.isMoraFrozen 
                                            ? "Este sistema no le cobrará penalizaciones ni le enviará notificaciones al cliente. Su mora figurará en $0." 
                                            : "Las reglas de mora, interés diario y notificaciones de cobro automáticas están vigentes."}
                                    </p>
                                </div>
                            </div>

                            <Button 
                                className="w-full font-bold"
                                disabled={isLoading}
                                variant={selectedRes.isMoraFrozen ? "destructive" : "default"}
                                onClick={() => handleToggleMora(!selectedRes.isMoraFrozen)}
                            >
                                {isLoading ? "Aplicando..." : (selectedRes.isMoraFrozen ? "Volver a Normalidad (Activar Mora)" : "Congelar Mora (Eximir Cliente)")}
                            </Button>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
