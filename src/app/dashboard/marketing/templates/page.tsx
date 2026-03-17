import { Mail, Edit2, Trash2, ArrowLeft, Plus, Eye } from "lucide-react";
import { DesktopGuard } from "@/components/layout/DesktopGuard";
import prisma from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function TemplatesGalleryPage() {
    const templates = await prisma.emailTemplate.findMany({
        orderBy: { updatedAt: "desc" },
    });

    return (
        <DesktopGuard>
            <div className="p-8 max-w-7xl mx-auto h-full overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Link 
                            href="/dashboard/marketing" 
                            className="bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-colors"
                        >
                            <ArrowLeft className="h-5 w-5 text-gray-600" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Galería de Diseños</h1>
                            <p className="text-gray-500 text-sm font-medium">Gestiona tus plantillas de correo</p>
                        </div>
                    </div>
                    
                    <Link 
                        href="/dashboard/marketing/editor"
                        className="flex items-center gap-2 bg-[var(--alimin-gold)] hover:bg-[#c4a04e] text-black px-6 py-2.5 rounded-full font-bold shadow-md transition-all hover:scale-105 active:scale-95"
                    >
                        <Plus className="h-5 w-5" />
                        Nuevo Diseño
                    </Link>
                </div>

                {/* Templates Grid */}
                {templates.length === 0 ? (
                    <div className="py-24 flex flex-col items-center justify-center text-gray-400 bg-white rounded-3xl border-2 border-dashed border-gray-100 shadow-sm mt-12">
                        <Mail className="h-16 w-16 mb-4 opacity-10" />
                        <h3 className="text-xl font-bold text-gray-900">No hay diseños guardados</h3>
                        <p className="text-sm mt-2 max-w-xs text-center">Tus diseños aparecerán aquí una vez que los guardes desde el editor.</p>
                        <Link href="/dashboard/marketing/editor" className="mt-8 bg-[var(--alimin-green)] text-white px-8 py-3 rounded-full font-bold shadow-lg">
                            Empezar a diseñar
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {templates.map((template) => (
                            <div key={template.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-xl transition-all group relative">
                                {/* Preview Placeholder (since we don't have screenshots) */}
                                <div className="aspect-[4/5] bg-gray-50 rounded-2xl mb-4 flex items-center justify-center border border-gray-100 group-hover:bg-gray-100 transition-colors relative overflow-hidden">
                                     <Mail className="h-12 w-12 text-gray-200 group-hover:scale-110 transition-transform" />
                                     
                                     {/* Quick View Button on Hover */}
                                     {/* Note: Delete logic would ideally go to an API, but for now we focus on UI */}
                                     <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                        <Link 
                                            href={`/dashboard/marketing/editor?id=${template.id}`}
                                            className="bg-white p-3 rounded-full hover:bg-[var(--alimin-gold)] transition-colors"
                                            title="Editar"
                                        >
                                            <Edit2 className="h-5 w-5 text-gray-800" />
                                        </Link>
                                     </div>
                                </div>

                                <div className="flex items-start justify-between">
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-black text-gray-900 truncate mb-1 pr-8">{template.name}</h4>
                                        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">
                                            Actualizado: {template.updatedAt.toLocaleDateString()}
                                        </p>
                                    </div>
                                    
                                    {/* Action Buttons */}
                                    {/* In a real app, delete would be handled here too */}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </DesktopGuard>
    );
}
