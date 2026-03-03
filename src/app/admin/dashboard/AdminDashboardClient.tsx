'use client'

import { useState } from 'react'
import { AdminPipeline } from "@/components/dashboard/AdminPipeline"
import { AdminLotList } from "@/components/dashboard/AdminLotList"
import { AdminUserList } from "@/components/dashboard/AdminUserList"
import { AdminLogs } from "@/components/dashboard/AdminLogs"
import { MobileBottomNav, type AdminMobileTab } from "@/components/admin/MobileBottomNav"
import { MobilePaymentDashboard } from "@/components/admin/MobilePaymentDashboard"
import { OnboardingTour } from "@/components/admin/OnboardingTour"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface AdminDashboardClientProps {
    pipelineData: any
    sellers: any[]
    lots: any[]
    users: any[]
    paymentStats: {
        totalLots: number
        soldLots: number
        lotsWithPiePaid: number
        lotsWithPiePending: number
        totalInstallmentsPaid: number
    }
}

export function AdminDashboardClient({
    pipelineData,
    sellers,
    lots,
    users,
    paymentStats,
}: AdminDashboardClientProps) {
    const [mobileTab, setMobileTab] = useState<AdminMobileTab>('terrenos')

    // Map mobile tabs to desktop tab values
    const mobileToDesktop: Record<AdminMobileTab, string> = {
        terrenos: 'lots',
        pagos: 'pipeline', // show pipeline on desktop, custom on mobile
        usuarios: 'users',
    }

    return (
        <>
            <div className="min-h-screen bg-black/95 relative w-full pt-4 md:pt-8 px-2 md:px-4 pb-12">
                <div className="absolute inset-0 bg-[url('/terreno-bg.JPG')] bg-cover bg-center opacity-20 blur-sm fixed" />

                <div className="relative z-10 max-w-[1800px] mx-auto space-y-4 md:space-y-8">
                    {/* Desktop header */}
                    <div className="hidden md:flex items-center justify-between">
                        <h2 className="text-3xl font-black text-white bg-white/5 backdrop-blur-md px-6 py-3 rounded-xl border border-white/10 shadow-xl">
                            Panel de Administración
                        </h2>
                    </div>

                    {/* Mobile header */}
                    <div className="flex md:hidden items-center justify-between pt-1 pb-2">
                        <h2 className="text-xl font-black text-white">
                            Admin
                        </h2>
                        <span className="text-xs text-gray-500 font-medium">
                            Lomas del Mar
                        </span>
                    </div>

                    {/* ===== DESKTOP VIEW (md+) ===== */}
                    <div className="hidden md:block">
                        <Tabs defaultValue="pipeline" className="w-full">
                            <TabsList className="grid w-full grid-cols-4 bg-white/10 p-1 rounded-xl border border-white/5">
                                <TabsTrigger value="pipeline" className="data-[state=active]:bg-[#36595F] data-[state=active]:text-white text-gray-300 font-bold">
                                    Ventas y Pipeline
                                </TabsTrigger>
                                <TabsTrigger value="lots" className="data-[state=active]:bg-[#36595F] data-[state=active]:text-white text-gray-300 font-bold">
                                    Gestión de Terrenos
                                </TabsTrigger>
                                <TabsTrigger value="users" className="data-[state=active]:bg-[#36595F] data-[state=active]:text-white text-gray-300 font-bold">
                                    Usuarios
                                </TabsTrigger>
                                <TabsTrigger value="logs" className="data-[state=active]:bg-[#36595F] data-[state=active]:text-white text-gray-300 font-bold">
                                    Registros
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="pipeline" className="mt-6">
                                <div className="bg-white/95 rounded-xl p-4 shadow-xl border border-white/10">
                                    <AdminPipeline
                                        initialData={pipelineData}
                                        sellers={sellers}
                                    />
                                </div>
                            </TabsContent>

                            <TabsContent value="lots" className="mt-6">
                                <div className="bg-black/40 backdrop-blur-md rounded-xl p-6 border border-white/10 shadow-xl">
                                    <h3 className="text-xl font-bold text-white mb-4">Control de Disponibilidad</h3>
                                    <AdminLotList lots={lots} />
                                </div>
                            </TabsContent>

                            <TabsContent value="users" className="mt-6">
                                <div className="bg-black/40 backdrop-blur-md rounded-xl p-6 border border-white/10 shadow-xl">
                                    <h3 className="text-xl font-bold text-white mb-4">Gestión de Usuarios</h3>
                                    <AdminUserList users={users} />
                                </div>
                            </TabsContent>

                            <TabsContent value="logs" className="mt-6">
                                <AdminLogs />
                            </TabsContent>
                        </Tabs>
                    </div>

                    {/* ===== MOBILE VIEW (<md) ===== */}
                    <div className="md:hidden">
                        {mobileTab === 'terrenos' && (
                            <div className="animate-fade-in">
                                <AdminLotList lots={lots} />
                            </div>
                        )}

                        {mobileTab === 'pagos' && (
                            <div className="animate-fade-in">
                                <MobilePaymentDashboard
                                    stats={paymentStats}
                                    soldLots={lots.filter((l: any) => l.status === 'sold' && l.price_total_clp).map((l: any) => ({
                                        id: l.id,
                                        number: l.number,
                                        stage: l.stage,
                                        area_m2: l.area_m2,
                                        price_total_clp: l.price_total_clp,
                                    }))}
                                />
                            </div>
                        )}

                        {mobileTab === 'usuarios' && (
                            <div className="animate-fade-in">
                                <AdminUserList users={users} />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Bottom Nav */}
            <MobileBottomNav activeTab={mobileTab} onTabChange={setMobileTab} />

            {/* Onboarding Tour — fires once on first mobile visit */}
            <OnboardingTour />
        </>
    )
}
