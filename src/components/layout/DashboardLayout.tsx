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
                    <Sidebar collapsible="icon">
                        <SidebarHeader className="h-14 flex items-center justify-center border-b">
                            {/* LOGO AREA */}
                            <div className="flex items-center gap-2 font-bold text-[#36595F]">
                                <span className="truncate">Lomas del Mar</span>
                            </div>
                        </SidebarHeader>
                        <SidebarContent>
                            <SidebarMenu className="p-2 gap-2">
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild isActive={pathname === (role === "ADMIN" ? "/admin/dashboard" : "/seller/dashboard")} tooltip="Dashboard">
                                        <Link href={role === "ADMIN" ? "/admin/dashboard" : "/seller/dashboard"}>
                                            <BarChart />
                                            <span>Dashboard</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>

                                {role === "ADMIN" && (
                                    <SidebarMenuItem>
                                        <SidebarMenuButton asChild isActive={pathname === "/admin/receipts"} tooltip="Verificación de Pagos">
                                            <Link href="/admin/receipts">
                                                <CheckCircle />
                                                <span>Verificación de Pagos</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )}

                                {role === "SELLER" && (
                                    <SidebarMenuItem>
                                        <SidebarMenuButton asChild isActive={pathname === "/seller/new-lead"} tooltip="Nuevo Cliente">
                                            <Link href="/seller/new-lead">
                                                <FileText />
                                                <span>Nuevo Cliente</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )}
                            </SidebarMenu>
                        </SidebarContent>
                        <SidebarFooter className="p-2 border-t gap-2">
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild tooltip="Volver al Sitio">
                                        <Link href="/">
                                            <Home />
                                            <span>Volver al Sitio</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                <SidebarMenuItem>
                                    <SidebarMenuButton onClick={() => signOut({ callbackUrl: '/login' })} tooltip="Cerrar Sesión">
                                        <LogOut />
                                        <span>Cerrar Sesión</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarFooter>
                        <SidebarRail />
                    </Sidebar>
                </div>
                <SidebarInset>
                    {/* Desktop header */}
                    <header className="hidden md:flex h-14 items-center gap-2 border-b bg-background px-4">
                        <SidebarTrigger />
                        <div className="flex-1">
                            <h1 className="text-lg font-semibold text-foreground">
                                {role === "ADMIN" ? "Panel de Administración" : "Panel de Vendedor"}
                            </h1>
                        </div>
                    </header>
                    {/* Sync indicator (mobile only) */}
                    {role === "ADMIN" && <SyncIndicator />}
                    {/* Content area — extra bottom padding on mobile for bottom nav */}
                    <div className="flex-1 overflow-auto p-4 md:p-6 bg-muted/20 pb-24 md:pb-6">
                        {children}
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </SyncProvider>
    )
}
