"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Users, Plus, BarChart3, Menu } from "lucide-react";

export default function BottomNavBar() {
    const pathname = usePathname();

    const navItems = [
        { icon: LayoutGrid, label: "Panel", href: "/dashboard", active: pathname === "/dashboard" },
        { icon: Users, label: "Leads", href: "/dashboard/contacts", active: pathname.startsWith("/dashboard/contacts") },
        { icon: BarChart3, label: "Ventas", href: "/dashboard/pipeline", active: pathname.startsWith("/dashboard/pipeline") },
        { icon: Menu, label: "Menú", href: "#", onClick: () => {
            // Trigger mobile sidebar if needed
            const btn = document.getElementById('mobile-menu-button');
            if (btn) btn.click();
        }},
    ];

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#121212]/95 backdrop-blur-xl border-t border-white/5">
            <div className="pb-safe pt-2">
                <div className="flex items-center justify-around px-4 h-16 relative">
                    {/* Add Button (Center) */}
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                        <button 
                            className="h-14 w-14 rounded-full bg-[var(--alimin-gold)] text-white shadow-lg shadow-[var(--alimin-gold)]/40 flex items-center justify-center transition-transform active:scale-95 border-4 border-[#121212]"
                            onClick={() => alert('Próximamente: Crear Nuevo Lead')}
                        >
                            <Plus className="h-8 w-8 text-black" />
                        </button>
                    </div>

                    {/* Nav Items */}
                    {navItems.slice(0, 2).map((item) => (
                        <Link 
                            key={item.label}
                            href={item.href}
                            className={`flex flex-col items-center gap-1 min-w-[64px] ${item.active ? 'text-[var(--alimin-gold)]' : 'text-gray-500'}`}
                        >
                            <item.icon className="h-5 w-5" />
                            <span className="text-[10px] font-bold tracking-tight uppercase">{item.label}</span>
                        </Link>
                    ))}

                    <div className="w-14" /> {/* Spacer for FAB */}

                    {navItems.slice(2).map((item) => (
                        item.href === "#" ? (
                             <button 
                                key={item.label}
                                onClick={item.onClick}
                                className={`flex flex-col items-center gap-1 min-w-[64px] ${item.active ? 'text-[var(--alimin-gold)]' : 'text-gray-500'}`}
                            >
                                <item.icon className="h-5 w-5" />
                                <span className="text-[10px] font-bold tracking-tight uppercase">{item.label}</span>
                            </button>
                        ) : (
                            <Link 
                                key={item.label}
                                href={item.href}
                                className={`flex flex-col items-center gap-1 min-w-[64px] ${item.active ? 'text-[var(--alimin-gold)]' : 'text-gray-500'}`}
                            >
                                <item.icon className="h-5 w-5" />
                                <span className="text-[10px] font-bold tracking-tight uppercase">{item.label}</span>
                            </Link>
                        )
                    ))}
                </div>
            </div>
        </div>
    );
}
