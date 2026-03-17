"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Send, Users, Calendar, Target, Check, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DesktopGuard } from "@/components/layout/DesktopGuard";

export default function StrategyPage() {
    const [templates, setTemplates] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [done, setDone] = useState(false);
    const router = useRouter();

    const [form, setForm] = useState({
        name: "",
        subject: "",
        templateId: "",
        segment: "ALL",
        schedule: "now",
        scheduledDate: "",
    });

    useEffect(() => {
        fetch("/api/marketing/templates")
            .then(res => res.json())
            .then(data => {
                setTemplates(data);
                setLoading(false);
            });
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const response = await fetch("/api/marketing/campaigns", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: form.name,
                    subject: form.subject,
                    templateId: form.templateId,
                    segment: form.segment,
                    scheduledFor: form.schedule === "later" ? form.scheduledDate : null,
                }),
            });

            if (response.ok) {
                setDone(true);
                setTimeout(() => router.push("/dashboard/marketing"), 1500);
            }
        } catch (error) {
            alert("Error al crear la estrategia");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <DesktopGuard>
            <div className="p-8 max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <Link 
                        href="/dashboard/marketing" 
                        className="bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5 text-gray-600" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Definir Estrategia</h1>
                        <p className="text-gray-500 text-sm font-medium">Configura el alcance y el momento del envío</p>
                    </div>
                </div>

                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Basic Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Nombre de la Campaña</label>
                                <input 
                                    required
                                    type="text" 
                                    className="w-full bg-gray-50 border-2 border-transparent focus:border-[var(--alimin-gold)] focus:bg-white rounded-2xl px-4 py-3 outline-none transition-all font-medium"
                                    placeholder="Ej: Bienvenida Lomas del Mar"
                                    value={form.name}
                                    onChange={e => setForm({...form, name: e.target.value})}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Asunto del Correo</label>
                                <input 
                                    required
                                    type="text" 
                                    className="w-full bg-gray-50 border-2 border-transparent focus:border-[var(--alimin-gold)] focus:bg-white rounded-2xl px-4 py-3 outline-none transition-all font-medium"
                                    placeholder="Ej: ¡Descubre tu nuevo hogar!"
                                    value={form.subject}
                                    onChange={e => setForm({...form, subject: e.target.value})}
                                />
                            </div>
                        </div>

                        {/* Template Selection */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Seleccionar Plantilla</label>
                            {loading ? (
                                <div className="h-14 bg-gray-50 rounded-2xl animate-pulse"></div>
                            ) : (
                                <select 
                                    required
                                    className="w-full bg-gray-50 border-2 border-transparent focus:border-[var(--alimin-gold)] focus:bg-white rounded-2xl px-4 py-3 outline-none transition-all font-medium appearance-none"
                                    value={form.templateId}
                                    onChange={e => setForm({...form, templateId: e.target.value})}
                                >
                                    <option value="">-- Elige un diseño --</option>
                                    {templates.map(t => (
                                        <option key={t.id} value={t.id}>{t.name}</option>
                                    ))}
                                </select>
                            )}
                            {templates.length === 0 && !loading && (
                                <p className="text-[10px] text-amber-600 font-bold mt-1 pl-1 italic">
                                    No tienes plantillas. Debes diseñar una primero.
                                </p>
                            )}
                        </div>

                        {/* Audience Segment */}
                        <div className="space-y-4">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Audiencia (Segmentación)</label>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <SegmentOption 
                                    id="ALL" 
                                    title="Todos" 
                                    desc="Toda la base de datos" 
                                    icon={Users} 
                                    active={form.segment === "ALL"}
                                    onClick={() => setForm({...form, segment: "ALL"})}
                                />
                                <SegmentOption 
                                    id="NEWSLETTER" 
                                    title="Newsletter" 
                                    desc="Solo suscriptores" 
                                    icon={Target} 
                                    active={form.segment === "NEWSLETTER"}
                                    onClick={() => setForm({...form, segment: "NEWSLETTER"})}
                                />
                                <SegmentOption 
                                    id="META" 
                                    title="Meta Leads" 
                                    desc="Facebook/Instagram" 
                                    icon={Target} 
                                    active={form.segment === "META"}
                                    onClick={() => setForm({...form, segment: "META"})}
                                />
                            </div>
                        </div>

                        {/* Scheduling */}
                        <div className="space-y-4 pt-4 border-t border-gray-100">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">¿Cuándo enviar?</label>
                            <div className="flex gap-4">
                                <button 
                                    type="button"
                                    onClick={() => setForm({...form, schedule: "now"})}
                                    className={`flex-1 py-3 rounded-2xl font-bold border-2 transition-all ${form.schedule === "now" ? "border-[var(--alimin-gold)] bg-[var(--alimin-gold)]/5 text-black" : "border-transparent bg-gray-50 text-gray-500"}`}
                                >
                                    Enviar Ahora
                                </button>
                                <button 
                                    type="button"
                                    onClick={() => setForm({...form, schedule: "later"})}
                                    className={`flex-1 py-3 rounded-2xl font-bold border-2 transition-all ${form.schedule === "later" ? "border-[var(--alimin-gold)] bg-[var(--alimin-gold)]/5 text-black" : "border-transparent bg-gray-50 text-gray-500"}`}
                                >
                                    Programar
                                </button>
                            </div>

                            {form.schedule === "later" && (
                                <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Fecha y Hora</label>
                                    <div className="relative">
                                        <input 
                                            required
                                            type="datetime-local" 
                                            className="w-full bg-gray-50 border-2 border-transparent focus:border-[var(--alimin-gold)] focus:bg-white rounded-2xl px-4 py-3 outline-none transition-all font-medium"
                                            value={form.scheduledDate}
                                            onChange={e => setForm({...form, scheduledDate: e.target.value})}
                                        />
                                        <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Submit */}
                        <button
                            disabled={submitting || done || templates.length === 0}
                            className={`w-full py-4 rounded-2xl font-black text-lg shadow-xl transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 ${
                                done 
                                ? "bg-emerald-500 text-white" 
                                : "bg-[var(--alimin-green)] text-white hover:shadow-2xl"
                            }`}
                        >
                            {submitting ? (
                                <Loader2 className="h-6 w-6 animate-spin" />
                            ) : done ? (
                                <Check className="h-6 w-6" />
                            ) : (
                                <Send className="h-6 w-6" />
                            )}
                            {submitting ? "Creando..." : done ? "¡Estrategia Lista!" : "Activar Estrategia"}
                        </button>
                    </form>
                </div>
            </div>
        </DesktopGuard>
    );
}

function SegmentOption({ title, desc, icon: Icon, active, onClick }: any) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`flex flex-col items-center text-center p-4 rounded-2xl border-2 transition-all ${active ? "border-[var(--alimin-gold)] bg-[var(--alimin-gold)]/5 shadow-md" : "border-gray-100 bg-white hover:bg-gray-50 text-gray-400"}`}
        >
            <div className={`p-3 rounded-xl mb-2 ${active ? "bg-[var(--alimin-gold)] text-black" : "bg-gray-100 text-gray-400"}`}>
                <Icon className="h-5 w-5" />
            </div>
            <p className={`font-bold text-sm ${active ? "text-gray-900" : "text-gray-500"}`}>{title}</p>
            <p className="text-[10px] mt-1 line-clamp-1">{desc}</p>
        </button>
    );
}
