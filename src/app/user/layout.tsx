"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Eye, LogOut } from "lucide-react";
import { useSession } from "next-auth/react";
import { stopImpersonating } from "@/actions/dashboard";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const tabs = [
    { href: "/user/plots", label: "🏡 Terrenos" },
    { href: "/user/documents", label: "📄 Documentos" },
];

export default function UserLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const { data: session } = useSession();

    const handleStopImpersonating = async () => {
        await stopImpersonating();
        toast.success("Regresando a vista administrador...");
        window.location.reload();
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Impersonation Banner (Requested Style) */}
            {(session as any)?.isImpersonating && (
                <div className="fixed top-4 left-4 z-[100] animate-in fade-in slide-in-from-top-2 duration-500">
                    <button
                        onClick={handleStopImpersonating}
                        className="flex items-center gap-2 bg-[#FFC107] hover:bg-[#EBB106] text-black px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-[0_4px_12px_rgba(255,193,7,0.3)] transition-all transform hover:scale-105"
                    >
                        <Eye className="w-3.5 h-3.5" />
                        VOLVER A VISTA ADMIN
                    </button>
                </div>
            )}

            {/* Tab Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
                <div className="container mx-auto px-3 sm:px-6">
                    <div className="flex items-center justify-between h-14">
                        {/* Tabs */}
                        <div className="flex items-center gap-1">
                            {tabs.map((tab) => {
                                const isActive =
                                    pathname === tab.href ||
                                    pathname?.startsWith(tab.href + "/");
                                return (
                                    <Link
                                        key={tab.href}
                                        href={tab.href}
                                        className={`px-3 sm:px-5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 whitespace-nowrap ${isActive
                                                ? "bg-[#36595F] text-white shadow-[0_0_12px_rgba(54,89,95,0.5)]"
                                                : "text-gray-400 hover:text-white hover:bg-white/10"
                                            }`}
                                    >
                                        {tab.label}
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Volver al Sitio */}
                        <Link
                            href="/"
                            className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg border border-[#E0B457]/50 bg-[#36595F]/70 hover:bg-[#36595F] text-[#E0B457] text-xs sm:text-sm font-semibold transition-all duration-200 whitespace-nowrap"
                        >
                            <Home className="w-3.5 h-3.5 shrink-0" />
                            <span className="hidden sm:inline">Volver al Sitio</span>
                            <span className="sm:hidden">Sitio</span>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Page content — offset for nav */}
            <div className="pt-14">
                {children}
            </div>
        </div>
    );
}
