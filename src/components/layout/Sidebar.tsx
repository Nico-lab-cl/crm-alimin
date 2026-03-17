"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    KanbanSquare,
    Settings,
    Megaphone,
    Database,
    Waves,
    Sun,
    Globe,
    Mail,
} from "lucide-react";

// Facebook icon (SVG inline since lucide doesn't have it)
function FacebookIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
    );
}

function InstagramIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
    );
}

// ── Section divider ──────────────────────────────────────────
type NavSection = {
    label?: string;
    items: {
        name: string;
        href: string;
        icon: React.ComponentType<{ className?: string }>;
        badge?: React.ReactNode;
        external?: boolean;
        desktopOnly?: boolean;
    }[];
};

const sections: NavSection[] = [
    {
        items: [
            { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
            { name: "Pipeline", href: "/dashboard/pipeline", icon: KanbanSquare },
        ],
    },
    {
        label: "Bases de datos",
        items: [
            { name: "Lomas del Mar", href: "/dashboard/contacts", icon: Database },
            { name: "Arena y Sol", href: "/dashboard/arena-y-sol", icon: Waves },
            { name: "Libertad y Alegría", href: "/dashboard/libertad-y-alegria", icon: Sun },
            { name: "Aliminspa.cl", href: "/dashboard/web", icon: Globe },
        ],
    },
    {
        label: "Marketing",
        items: [
            {
                name: "Anuncios",
                href: "/dashboard/anuncios",
                icon: Megaphone,
                badge: (
                    <span className="flex items-center gap-1 ml-auto">
                        <FacebookIcon className="h-3.5 w-3.5 text-blue-300" />
                        <InstagramIcon className="h-3.5 w-3.5 text-pink-300" />
                    </span>
                ),
            },
            {
                name: "Email Marketing",
                href: "/dashboard/marketing",
                icon: Mail,
                desktopOnly: true,
            },
        ],
    },
    {
        items: [
            { name: "Ajustes", href: "/dashboard/settings", icon: Settings },
        ],
    },
];

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
}

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
    const pathname = usePathname();

    return (
        <div className="flex h-full flex-grow flex-col overflow-y-auto bg-[var(--alimin-green)] pt-5 pb-4 shadow-lg">
            {/* Logo */}
            <div className="flex flex-shrink-0 items-center px-6 mb-4 mt-2">
                <img src="/logo.png" alt="Alimin Logo" className="h-10 w-auto brightness-0 invert" />
            </div>

            <div className="mt-6 flex flex-1 flex-col px-3">
                <nav className="flex-1 space-y-5">
                    {sections.map((section, si) => (
                        <div key={si}>
                            {section.label && (
                                <p className="px-3 mb-1 text-[10px] font-bold uppercase tracking-widest text-white/40">
                                    {section.label}
                                </p>
                            )}
                            <div className="space-y-0.5">
                                {section.items.map((item) => {
                                    const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                                    return (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            onClick={onNavigate}
                                            className={classNames(
                                                isActive
                                                    ? "text-[var(--alimin-gold)] border-l-4 border-[var(--alimin-gold)] pl-3 bg-white/5"
                                                    : "text-white/80 hover:bg-black/10 hover:text-white pl-4 border-l-4 border-transparent",
                                                item.desktopOnly ? "hidden lg:flex" : "flex",
                                                "group items-center rounded-r-md py-2.5 pr-3 text-sm font-semibold transition-all"
                                            )}
                                        >
                                            <item.icon
                                                className={classNames(
                                                    isActive ? "text-[var(--alimin-gold)]" : "text-white/60 group-hover:text-white",
                                                    "mr-3 h-4.5 w-4.5 flex-shrink-0 transition-colors h-5 w-5"
                                                )}
                                                aria-hidden="true"
                                            />
                                            <span className="flex-1">{item.name}</span>
                                            {item.badge}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </nav>
            </div>
        </div>
    );
}
