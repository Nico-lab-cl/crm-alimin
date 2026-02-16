"use client";

import { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type NotificationType = 'contract_pending' | 'lot_purchased';

type Notification = {
    id: string;
    type: NotificationType;
    message: string;
    lotNumber?: string;
    stage?: string;
};

export const NotificationBell = () => {
    const { data: session } = useSession();
    const router = useRouter();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!session?.user) return;

        const fetchNotifications = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('/api/user/notifications');
                if (response.ok) {
                    const data = await response.json();
                    setNotifications(data.notifications || []);
                }
            } catch (error) {
                console.error('Error fetching notifications:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchNotifications();

        // Poll every 30 seconds for new notifications
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, [session?.user]);

    const handleNotificationClick = () => {
        router.push('/user/dashboard');
    };

    const unreadCount = notifications.length;

    if (!session?.user) return null;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative h-10 w-10 hover:bg-white/10 transition-colors"
                >
                    <Bell className="h-5 w-5 text-[#E0B457]" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white animate-pulse">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-80" align="end" forceMount>
                <DropdownMenuLabel className="font-bold text-base">
                    Notificaciones
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                {isLoading ? (
                    <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                        Cargando notificaciones...
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                        No tienes notificaciones pendientes
                    </div>
                ) : (
                    <div className="max-h-[400px] overflow-y-auto">
                        {notifications.map((notification) => (
                            <DropdownMenuItem
                                key={notification.id}
                                className="cursor-pointer p-4 flex flex-col items-start gap-1"
                                onClick={handleNotificationClick}
                            >
                                <div className="flex items-start gap-2 w-full">
                                    <div className="flex h-2 w-2 rounded-full bg-[#E0B457] mt-1.5 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium leading-snug">
                                            {notification.type === 'contract_pending' && '📝 Contrato pendiente de firma'}
                                            {notification.type === 'lot_purchased' && '🎉 ¡Felicitaciones por tu compra!'}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                                            {notification.message}
                                        </p>
                                        {notification.lotNumber && notification.stage && (
                                            <p className="text-xs font-semibold text-primary mt-1">
                                                Lote {notification.lotNumber} - Etapa {notification.stage}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </DropdownMenuItem>
                        ))}
                    </div>
                )}

                {notifications.length > 0 && (
                    <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="cursor-pointer justify-center font-semibold text-primary"
                            onClick={handleNotificationClick}
                        >
                            Ver mis terrenos →
                        </DropdownMenuItem>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
