"use client";

import { useRef, useState, useEffect, Suspense } from "react";
import EmailEditor, { EditorRef } from "react-email-editor";
import { Save, ArrowLeft, Loader2, Check } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { DesktopGuard } from "@/components/layout/DesktopGuard";

function EditorContent() {
    const emailEditorRef = useRef<EditorRef>(null);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [templateName, setTemplateName] = useState("Nueva Plantilla");
    const [isLoaded, setIsLoaded] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const templateId = searchParams.get("id");

    // Load existing template if ID is provided
    useEffect(() => {
        if (templateId && isLoaded && emailEditorRef.current) {
            const fetchTemplate = async () => {
                try {
                    const response = await fetch(`/api/marketing/templates?id=${templateId}`);
                    if (response.ok) {
                        const data = await response.json();
                        // Handle the case where the API returns a single object if id is passed
                        const template = Array.isArray(data) ? data.find(t => t.id === templateId) : data;
                        if (template && template.content) {
                            emailEditorRef.current?.editor?.loadDesign(template.content);
                            setTemplateName(template.name);
                        }
                    }
                } catch (error) {
                    console.error("Error fetching template:", error);
                }
            };
            fetchTemplate();
        }
    }, [templateId, isLoaded]);

    const onEditorReady = () => {
        setIsLoaded(true);
    };

    const saveDesign = () => {
        if (!emailEditorRef.current) return;

        setSaving(true);
        
        emailEditorRef.current.editor?.exportHtml(async (data) => {
            const { design, html } = data;
            
            try {
                const response = await fetch("/api/marketing/templates", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        name: templateName,
                        content: design,
                        html: html,
                    }),
                });

                if (response.ok) {
                    setSaved(true);
                    setTimeout(() => {
                        setSaved(false);
                        router.push("/dashboard/marketing");
                    }, 1500);
                }
            } catch (error) {
                console.error("Error saving design:", error);
                alert("Error al guardar el diseño");
            } finally {
                setSaving(false);
            }
        });
    };

    return (
        <DesktopGuard>
            <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
                {/* Editor Header */}
                <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10 shadow-sm">
                    <div className="flex items-center gap-6">
                        <Link 
                            href="/dashboard/marketing" 
                            className="bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-colors"
                        >
                            <ArrowLeft className="h-5 w-5 text-gray-600" />
                        </Link>
                        <div>
                            <input 
                                type="text" 
                                value={templateName}
                                onChange={(e) => setTemplateName(e.target.value)}
                                className="text-xl font-black text-gray-900 bg-transparent border-b-2 border-transparent hover:border-gray-200 focus:border-[var(--alimin-gold)] focus:outline-none px-1 transition-colors"
                                placeholder="Nombre de la plantilla..."
                            />
                            <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mt-1">Editando diseño de correo</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={saveDesign}
                            disabled={saving || saved}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-bold shadow-md transition-all active:scale-95 ${
                                saved 
                                ? "bg-emerald-500 text-white" 
                                : "bg-[var(--alimin-gold)] hover:bg-[#c4a04e] text-black"
                            }`}
                        >
                            {saving ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : saved ? (
                                <Check className="h-5 w-5" />
                            ) : (
                                <Save className="h-5 w-5" />
                            )}
                            {saving ? "Guardando..." : saved ? "¡Guardado!" : "Guardar Diseño"}
                        </button>
                    </div>
                </header>

                {/* Editor Container */}
                <main className="flex-1 w-full bg-white">
                    <EmailEditor 
                        ref={emailEditorRef} 
                        onLoad={onEditorReady}
                        style={{ height: 'calc(100vh - 84px)' }}
                        options={{
                            locale: 'es-ES',
                            appearance: {
                                theme: 'modern_light',
                                panels: {
                                    tools: {
                                        dock: 'left'
                                    }
                                }
                            }
                        }}
                    />
                </main>
            </div>
        </DesktopGuard>
    );
}

export default function MarketingEditorPage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center bg-gray-50">
                <Loader2 className="h-10 w-10 animate-spin text-[var(--alimin-gold)]" />
            </div>
        }>
            <EditorContent />
        </Suspense>
    );
}
