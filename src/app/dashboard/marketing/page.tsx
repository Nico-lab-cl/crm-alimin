import { Mail, Plus, FileText, Send, CheckCircle } from "lucide-react";
import { DesktopGuard } from "@/components/layout/DesktopGuard";
import prisma from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function MarketingPage() {
    // Basic stats
    const templatesCount = await prisma.emailTemplate.count();
    const activeCampaigns = await prisma.emailCampaign.count({
        where: { status: { in: ["SCHEDULED", "SENDING"] } }
    });
    const sentCampaigns = await prisma.emailCampaign.count({
        where: { status: "SENT" }
    });

    // Recent templates
    const recentTemplates = await prisma.emailTemplate.findMany({
        orderBy: { updatedAt: "desc" },
        take: 3
    });

    // Recent campaigns
    const recentCampaigns = await prisma.emailCampaign.findMany({
        orderBy: { createdAt: "desc" },
        take: 3,
        include: { template: true }
    });

    return (
        <DesktopGuard>
            <div className="p-8 max-w-7xl mx-auto h-full overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[var(--alimin-green)] to-[#2d4b50] flex items-center justify-center shadow-lg transform rotate-3">
                            <Mail className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Email Marketing</h1>
                            <p className="text-gray-500 text-sm font-medium">Diseña, segmenta y automatiza tus campañas</p>
                        </div>
                    </div>
                    
                    <Link 
                        href="/dashboard/marketing/editor"
                        className="flex items-center gap-2 bg-[var(--alimin-gold)] hover:bg-[#c4a04e] text-black px-6 py-2.5 rounded-full font-bold shadow-md transition-all hover:scale-105 active:scale-95"
                    >
                        <Plus className="h-5 w-5" />
                        Nuevo Correo
                    </Link>
                </div>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <StatCard 
                        title="Plantillas Guardadas" 
                        value={templatesCount} 
                        icon={FileText} 
                        color="bg-blue-500"
                        bg="bg-blue-50"
                    />
                    <StatCard 
                        title="Campañas Activas" 
                        value={activeCampaigns} 
                        icon={Send} 
                        color="bg-amber-500"
                        bg="bg-amber-50"
                    />
                    <StatCard 
                        title="Enviadas con Éxito" 
                        value={sentCampaigns} 
                        icon={CheckCircle} 
                        color="bg-emerald-500"
                        bg="bg-emerald-50"
                    />
                </div>

                {/* Main Content Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    {/* Recent Templates */}
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-gray-800">Tus Diseños Recientes</h2>
                            {templatesCount > 3 && <Link href="/dashboard/marketing/templates" className="text-sm font-bold text-[var(--alimin-green)] hover:underline">Ver todos</Link>}
                        </div>
                        
                        <div className="space-y-3 flex-1">
                            {recentTemplates.length === 0 ? (
                                <div className="py-12 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-100 rounded-2xl">
                                    <p className="text-sm mb-4">Aún no tienes plantillas diseñadas</p>
                                    <Link href="/dashboard/marketing/editor" className="text-xs font-bold text-[var(--alimin-gold)] border border-[var(--alimin-gold)] px-4 py-2 rounded-full hover:bg-[var(--alimin-gold)] hover:text-black transition-colors">
                                        Crear mi primera plantilla
                                    </Link>
                                </div>
                            ) : (
                                recentTemplates.map((t) => (
                                    <div key={t.id} className="flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all group">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                                                <Mail className="h-5 w-5 text-gray-400 group-hover:text-[var(--alimin-green)]" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-800 text-sm">{t.name}</p>
                                                <p className="text-[10px] text-gray-400 uppercase font-medium">Actualizado {t.updatedAt.toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <Link href={`/dashboard/marketing/editor?id=${t.id}`} className="p-2 text-gray-300 hover:text-[var(--alimin-gold)]">
                                            <Plus className="h-4 w-4" />
                                        </Link>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Campaign List */}
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-gray-800">Campañas y Estrategias</h2>
                            <Link href="/dashboard/marketing/strategy" className="text-sm font-bold text-[var(--alimin-green)] hover:underline">Gestionar</Link>
                        </div>
                        
                        <div className="space-y-3 flex-1">
                            {recentCampaigns.length === 0 ? (
                                <div className="py-12 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-100 rounded-2xl">
                                    <p className="text-sm mb-4">No hay campañas configuradas</p>
                                    <Link href="/dashboard/marketing/strategy" className="text-xs font-bold text-[var(--alimin-green)] border border-[var(--alimin-green)] px-4 py-2 rounded-full hover:bg-[var(--alimin-green)] hover:text-white transition-colors">
                                        Configurar primera estrategia
                                    </Link>
                                </div>
                            ) : (
                                recentCampaigns.map((c) => (
                                    <div key={c.id} className="p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-md transition-all">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className={`px-2 py-0.5 rounded-full text-[8px] font-black tracking-widest uppercase ${
                                                c.status === 'SENT' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                                            }`}>
                                                {c.status}
                                            </span>
                                            <p className="text-[10px] text-gray-400 font-bold">{c.segment}</p>
                                        </div>
                                        <h4 className="font-black text-gray-900 text-sm line-clamp-1">{c.name}</h4>
                                        <p className="text-xs text-gray-500 mt-1">Asunto: {c.subject}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Marketing Strategy Hint */}
                <div className="bg-gradient-to-br from-[#36595F] to-[#1e3235] rounded-3xl p-8 text-white shadow-xl relative overflow-hidden group">
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="max-w-xl">
                            <h2 className="text-xl font-bold mb-3">Maximiza tu conversión</h2>
                            <p className="text-white/70 text-sm leading-relaxed">
                                Automatiza el seguimiento de tus leads. Define reglas basadas en el origen del usuario o su interés en proyectos específicos como <span className="text-[var(--alimin-gold)] font-bold italic">Lomas del Mar</span>.
                            </p>
                        </div>
                        <Link 
                            href="/dashboard/marketing/strategy"
                            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md px-8 py-3 rounded-2xl font-bold transition-all whitespace-nowrap"
                        >
                            Crear Estrategia Inteligente
                        </Link>
                    </div>
                    
                    {/* Abstract background elements */}
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-all duration-500"></div>
                    <div className="absolute top-0 right-10 w-20 h-20 bg-[var(--alimin-gold)]/10 rounded-full blur-2xl"></div>
                </div>
            </div>
        </DesktopGuard>
    );
}

function StatCard({ title, value, icon: Icon, color, bg }: any) {
    return (
        <div className={`p-6 rounded-3xl ${bg} flex items-center gap-5 border border-white transition-all hover:shadow-md cursor-default`}>
            <div className={`h-12 w-12 rounded-2xl ${color} flex items-center justify-center text-white shadow-sm`}>
                <Icon className="h-6 w-6" />
            </div>
            <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{title}</p>
                <h3 className="text-3xl font-black text-gray-900 mt-1">{value}</h3>
            </div>
        </div>
    );
}
