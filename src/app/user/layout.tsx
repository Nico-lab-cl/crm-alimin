"use client";

import { BackToSiteButton } from "@/components/BackToSiteButton";
import Link from "next/link";
import { usePathname } from "next/navigation";

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

    return (
        <div className="min-h-screen bg-background">
            {/* Tab Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10 pt-safe">
                <div className="container mx-auto px-4">
                    <div className="flex items-center gap-1 h-14">
                        {tabs.map((tab) => {
                            const isActive = pathname === tab.href || pathname?.startsWith(tab.href + "/");
                            return (
                                <Link
                                    key={tab.href}
                                    href={tab.href}
                                    className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${isActive
                                            ? "bg-[#36595F] text-white shadow-[0_0_12px_rgba(54,89,95,0.5)]"
                                            : "text-gray-400 hover:text-white hover:bg-white/10"
                                        }`}
                                >
                                    {tab.label}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </nav>

            {/* Page content — offset for nav */}
            <div className="pt-14">
                {children}
            </div>

            <BackToSiteButton />
        </div>
    );
}
