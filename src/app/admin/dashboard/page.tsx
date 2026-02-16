import { getAdminPipeline, getSellers } from "@/actions/dashboard"
import { AdminPipeline } from "@/components/dashboard/AdminPipeline"

export default async function AdminDashboard() {
    const [pipelineResult, sellersResult] = await Promise.all([
        getAdminPipeline(),
        getSellers()
    ])

    if (pipelineResult.error) {
        return <div className="p-8 text-center text-red-500 font-semibold">{pipelineResult.error}</div>
    }

    return (
        <div className="min-h-screen bg-black/95 relative w-full pt-8 px-4 pb-12">
            <div className="absolute inset-0 bg-[url('/terreno-bg.JPG')] bg-cover bg-center opacity-20 blur-sm fixed" />

            <div className="relative z-10 container mx-auto bg-black/60 p-8 rounded-xl border border-white/10 backdrop-blur-md">
                <h2 className="text-2xl font-bold mb-6 text-[#36595F] bg-white/10 p-4 rounded-lg inline-block border border-white/5">Control Global de Ventas</h2>
                <div className="bg-white/95 rounded-xl p-4 shadow-xl">
                    <AdminPipeline
                        initialData={pipelineResult.data as any}
                        sellers={sellersResult.data || []}
                    />
                </div>
            </div>
        </div>
    )
}
