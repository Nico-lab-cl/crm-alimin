import { getAdminPipeline, getSellers, getAdminLots, getAdminUsers } from "@/actions/dashboard"
import { AdminPipeline } from "@/components/dashboard/AdminPipeline"
import { AdminLotList } from "@/components/dashboard/AdminLotList"
import { AdminUserList } from "@/components/dashboard/AdminUserList"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function AdminDashboard() {
    const [pipelineResult, sellersResult, lotsResult, usersResult] = await Promise.all([
        getAdminPipeline(),
        getSellers(),
        getAdminLots(),
        getAdminUsers()
    ])

    if (pipelineResult.error) {
        return <div className="p-8 text-center text-red-500 font-semibold">{pipelineResult.error}</div>
    }

    return (
        <div className="min-h-screen bg-black/95 relative w-full pt-8 px-4 pb-12">
            <div className="absolute inset-0 bg-[url('/terreno-bg.JPG')] bg-cover bg-center opacity-20 blur-sm fixed" />

            <div className="relative z-10 container mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-black text-white bg-white/5 backdrop-blur-md px-6 py-3 rounded-xl border border-white/10 shadow-xl">
                        Panel de Administración
                    </h2>
                </div>

                <Tabs defaultValue="pipeline" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 bg-white/10 p-1 rounded-xl border border-white/5">
                        <TabsTrigger value="pipeline" className="data-[state=active]:bg-[#36595F] data-[state=active]:text-white text-gray-300 font-bold">
                            Ventas y Pipeline
                        </TabsTrigger>
                        <TabsTrigger value="lots" className="data-[state=active]:bg-[#36595F] data-[state=active]:text-white text-gray-300 font-bold">
                            Gestión de Lotes
                        </TabsTrigger>
                        <TabsTrigger value="users" className="data-[state=active]:bg-[#36595F] data-[state=active]:text-white text-gray-300 font-bold">
                            Usuarios
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="pipeline" className="mt-6">
                        <div className="bg-white/95 rounded-xl p-4 shadow-xl border border-white/10">
                            <AdminPipeline
                                initialData={pipelineResult.data as any}
                                sellers={sellersResult.data || []}
                            />
                        </div>
                    </TabsContent>

                    <TabsContent value="lots" className="mt-6">
                        <div className="bg-black/40 backdrop-blur-md rounded-xl p-6 border border-white/10 shadow-xl">
                            <h3 className="text-xl font-bold text-white mb-4">Control de Disponibilidad</h3>
                            <AdminLotList lots={lotsResult.data || []} />
                        </div>
                    </TabsContent>

                    <TabsContent value="users" className="mt-6">
                        <div className="bg-black/40 backdrop-blur-md rounded-xl p-6 border border-white/10 shadow-xl">
                            <h3 className="text-xl font-bold text-white mb-4">Gestión de Usuarios</h3>
                            <AdminUserList users={usersResult.data || []} />
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
