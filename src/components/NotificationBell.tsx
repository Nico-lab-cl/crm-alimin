"use client";

import { useEffect, useState, useCallback } from 'react';
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

const DISMISSED_KEY = 'alimin_dismissed_notifications';

type NotificationType = 'contract_pending' | 'lot_purchased' | 'payment_due' | string;

type Notification = {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    lotNumber?: string;
    stage?: string;
    db?: boolean; // true = stored in DB, must call API to dismiss
};

const getDismissed = (): string[] => {
    try {
        const raw = localStorage.getItem(DISMISSED_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
};

const addDismissed = (id: string) => {
    try {
        const dismissed = getDismissed();
        if (!dismissed.includes(id)) {
            dismissed.push(id);
            localStorage.setItem(DISMISSED_KEY, JSON.stringify(dismissed));
        }
    } catch {
        // ignore
    }
};

export const NotificationBell = () => {
    const { data: session } = useSession();
    const router = useRouter();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchNotifications = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/user/notifications', { cache: 'no-store' });
            if (response.ok) {
                const data = await response.json();
                const allNotifications: Notification[] = data.notifications || [];
                // Filter out locally dismissed (for dynamic notifications)
                const dismissed = getDismissed();
                const active = allNotifications.filter(n => !dismissed.includes(n.id));
                setNotifications(active);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!session?.user) return;

        fetchNotifications();

        // Poll every 60 seconds for new notifications
        const interval = setInterval(fetchNotifications, 60000);
        return () => clearInterval(interval);
    }, [session?.user, fetchNotifications]);

    const dismissNotification = useCallback(async (notification: Notification) => {
        if (notification.db) {
            // Mark as read in DB
            await fetch('/api/user/notifications', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: notification.id }),
            }).catch(console.error);
        } else {
            // Dismiss locally for dynamic notifications
            addDismissed(notification.id);
        }
        setNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, []);

    const handleNotificationClick = async (notification: Notification) => {
        await dismissNotification(notification);
        router.push('/user/plots');
    };

    const handleViewAll = async () => {
        // Dismiss all current notifications
        for (const n of notifications) {
            await dismissNotification(n);
        }
        router.push('/user/plots');
    };

    const unreadCount = notifications.length;

    if (!session?.user) return null;

    const getNotificationIcon = (type: string) => {
        if (type === 'payment_due') return '💳';
        if (type === 'contract_pending') return '📝';
        if (type === 'lot_purchased') return '🎉';
        return '🔔';
    };

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
                                onClick={() => handleNotificationClick(notification)}
                            >
                                <div className="flex items-start gap-2 w-full">
                                    <div className="flex h-2 w-2 rounded-full bg-[#E0B457] mt-1.5 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium leading-snug">
                                            {notification.title || `${getNotificationIcon(notification.type)} Notificación`}
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
                            onClick={handleViewAll}
                        >
                            Ver mis terrenos →
                        </DropdownMenuItem>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
