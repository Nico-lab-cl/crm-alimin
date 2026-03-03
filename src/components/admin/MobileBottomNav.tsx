'use client';

import { Map, Wallet, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

export type AdminMobileTab = 'terrenos' | 'pagos' | 'usuarios';

interface MobileBottomNavProps {
    activeTab: AdminMobileTab;
    onTabChange: (tab: AdminMobileTab) => void;
}

const tabs: { id: AdminMobileTab; label: string; icon: React.ElementType }[] = [
    { id: 'terrenos', label: 'Terrenos', icon: Map },
    { id: 'pagos', label: 'Pagos', icon: Wallet },
    { id: 'usuarios', label: 'Usuarios', icon: Users },
];

export function MobileBottomNav({ activeTab, onTabChange }: MobileBottomNavProps) {
    return (
        <nav
            className="
                fixed bottom-0 left-0 right-0 z-50 md:hidden
                bg-gray-950/95 backdrop-blur-xl
                border-t border-white/10
                pb-[env(safe-area-inset-bottom,0px)]
            "
        >
            <div className="flex items-center justify-around h-16 max-w-md mx-auto px-2">
                {tabs.map(({ id, label, icon: Icon }) => {
                    const isActive = activeTab === id;
                    return (
                        <button
                            key={id}
                            onClick={() => onTabChange(id)}
                            className={cn(
                                'flex flex-col items-center justify-center gap-0.5 flex-1 py-2 rounded-xl transition-all duration-200 min-h-[48px] min-w-[48px]',
                                'active:scale-90',
                                isActive
                                    ? 'text-alimin-gold'
                                    : 'text-gray-500 hover:text-gray-300'
                            )}
                        >
                            <div className={cn(
                                'relative flex items-center justify-center w-10 h-7 rounded-full transition-all duration-200',
                                isActive && 'bg-alimin-green/30'
                            )}>
                                <Icon className={cn(
                                    'w-5 h-5 transition-all duration-200',
                                    isActive && 'scale-110'
                                )} />
                                {isActive && (
                                    <span className="absolute inset-0 rounded-full animate-pulse-ring bg-alimin-gold/20 pointer-events-none" />
                                )}
                            </div>
                            <span className={cn(
                                'text-[10px] font-semibold tracking-wide transition-all duration-200',
                                isActive ? 'opacity-100' : 'opacity-60'
                            )}>
                                {label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </nav>
    );
}
