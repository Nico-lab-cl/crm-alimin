'use client';

import { Map, Wallet, Users, Receipt, Calculator, BookOpen, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PostventaTab } from './PostventaMobileDashboard';

export type AdminMobileTab = 'terrenos' | 'pagos' | 'usuarios';

interface MobileBottomNavProps {
    activeTab: AdminMobileTab | PostventaTab;
    onTabChange: (tab: any) => void;
    isPostventa?: boolean;
}

const adminTabs: { id: AdminMobileTab | PostventaTab; label: string; icon: React.ElementType }[] = [
    { id: 'terrenos', label: 'Terrenos', icon: Map },
    { id: 'usuarios', label: 'Usuarios', icon: Users },
];

const postventaTabs: { id: PostventaTab; label: string; icon: React.ElementType }[] = [
    { id: 'terrenos', label: 'Terrenos', icon: Map },
    { id: 'ledger', label: 'Cuentas', icon: BookOpen },
    { id: 'alertas', label: 'Alertas', icon: AlertTriangle },
    { id: 'mora', label: 'Simular', icon: Calculator },
];

export function MobileBottomNav({ activeTab, onTabChange, isPostventa = false }: MobileBottomNavProps) {
    const tabs = isPostventa ? postventaTabs : adminTabs;

    return (
        <nav
            className="
                fixed bottom-0 left-0 right-0 z-50 md:hidden
                bg-[#0a0a0a] border-t border-white/10
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
                                'flex flex-col items-center justify-center gap-0.5 flex-1 py-2 rounded-xl transition-colors duration-100 min-h-[48px] min-w-[48px]',
                                'active:scale-90',
                                isActive
                                    ? 'text-alimin-gold'
                                    : 'text-gray-500 hover:text-gray-300'
                            )}
                        >
                            <div className={cn(
                                'flex items-center justify-center w-10 h-7 rounded-full transition-colors duration-100',
                                isActive && 'bg-alimin-green/30'
                            )}>
                                <Icon className="w-5 h-5" />
                            </div>
                            <span className={cn(
                                'text-[10px] font-semibold tracking-wide',
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
