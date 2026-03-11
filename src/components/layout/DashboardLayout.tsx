"use client"

import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter, SidebarTrigger, SidebarRail, SidebarInset } from "@/components/ui/sidebar"
import { Home, BarChart, LogOut, FileText, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { SyncProvider } from "@/components/admin/SyncProvider"
import { SyncIndicator } from "@/components/admin/SyncIndicator"

export function DashboardLayout({ children, role }: { children: React.ReactNode, role: "ADMIN" | "SELLER" }) {
    const pathname = usePathname()

    return (
        <SyncProvider>
            <SidebarProvider>
                {/* Sidebar: hidden on mobile, visible on md+ */}
                <div className="hidden md:contents">
                    <Sidebar collapsible="icon" className="border-r border-white/5 bg-[#0a0a0a]">
                        <SidebarHeader className="h-20 flex items-center justify-center border-b border-white/5 bg-[#0a0a0a]">
                            {/* LOGO AREA */}
                            <div className="flex flex-col items-center gap-0.5">
                                <span className="text-[10px] font-black text-[#8eb2b8] uppercase tracking-[0.4em] opacity-50">Inmobiliaria</span>
                                <span className="font-black text-xl text-white tracking-tighter uppercase">Alimin</span>
                            </div>
                        </SidebarHeader>
                        <SidebarContent className="bg-[#0a0a0a] pt-6">
                            <SidebarMenu className="px-4 gap-3">
                                <SidebarMenuItem>
                                    <SidebarMenuButton 
                                        asChild 
                                        isActive={pathname === (role === "ADMIN" ? "/admin/dashboard" : "/seller/dashboard")} 
                                        tooltip="Dashboard"
                                        className={`h-12 rounded-xl transition-all ${pathname === (role === "ADMIN" ? "/admin/dashboard" : "/seller/dashboard") 
                                            ? 'bg-[#36595F] text-white shadow-lg shadow-[#36595F]/20' 
                                            : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                                    >
                                        <Link href={role === "ADMIN" ? "/admin/dashboard" : "/seller/dashboard"}>
                                            <BarChart className="w-5 h-5" />
                                            <span className="font-bold text-xs uppercase tracking-widest">Dashboard</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>

                                {role === "ADMIN" && (
                                    <SidebarMenuItem>
                                        <SidebarMenuButton 
                                            asChild 
                                            isActive={pathname === "/admin/receipts"} 
                                            tooltip="Verificación de Pagos"
                                            className={`h-12 rounded-xl transition-all ${pathname === "/admin/receipts" 
                                                ? 'bg-[#36595F] text-white shadow-lg shadow-[#36595F]/20' 
                                                : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                                        >
                                            <Link href="/admin/receipts">
                                                <CheckCircle className="w-5 h-5" />
                                                <span className="font-bold text-xs uppercase tracking-widest">Pagos</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )}

                                {role === "SELLER" && (
                                    <SidebarMenuItem>
                                        <SidebarMenuButton 
                                            asChild 
                                            isActive={pathname === "/seller/new-lead"} 
                                            tooltip="Nuevo Cliente"
                                            className={`h-12 rounded-xl transition-all ${pathname === "/seller/new-lead" 
                                                ? 'bg-[#36595F] text-white shadow-lg shadow-[#36595F]/20' 
                                                : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                                        >
                                            <Link href="/seller/new-lead">
                                                <FileText className="w-5 h-5" />
                                                <span className="font-bold text-xs uppercase tracking-widest">Nuevo Lead</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )}
                            </SidebarMenu>
                        </SidebarContent>
                        <SidebarFooter className="p-4 border-t border-white/5 bg-[#0a0a0a] gap-4">
                            <SidebarMenu className="gap-2">
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild tooltip="Volver al Sitio" className="h-10 text-gray-500 hover:text-white transition-colors">
                                        <Link href="/">
                                            <Home className="w-4 h-4" />
                                            <span className="text-[10px] font-bold uppercase tracking-widest">Sitio Web</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                <SidebarMenuItem>
                                    <SidebarMenuButton onClick={() => signOut({ callbackUrl: '/login' })} tooltip="Cerrar Sesión" className="h-10 text-red-500/60 hover:text-red-500 transition-colors">
                                        <LogOut className="w-4 h-4" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest">Cerrar Sesión</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarFooter>
                        <SidebarRail />
                    </Sidebar>
                </div>
                <SidebarInset className="bg-black">
                    {/* Desktop header */}
                    <header className="hidden md:flex h-20 items-center justify-between gap-2 border-b border-white/5 bg-[#0a0a0a] px-8">
                        <div className="flex items-center gap-4">
                            <SidebarTrigger className="text-gray-500 hover:text-white" />
                            <div className="h-4 w-px bg-white/10 mx-2" />
                            <h1 className="text-xs font-black text-[#8eb2b8] uppercase tracking-[0.3em]">
                                {role === "ADMIN" ? "Panel de Gestión Administrativa" : "Módulo de Ventas"}
                            </h1>
                        </div>
                        <div className="flex items-center gap-4">
                            <SyncIndicator />
                        </div>
                    </header>
                    {/* Content area */}
                    <div className="flex-1 overflow-auto p-8 md:p-12 bg-black pb-24 md:pb-12">
                        {children}
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </SyncProvider>
    )
}
