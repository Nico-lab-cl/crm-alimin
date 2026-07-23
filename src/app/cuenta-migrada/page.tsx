'use client';

import { signOut } from "next-auth/react";
import { ExternalLink, LogOut } from "lucide-react";

const PORTAL_LOGIN_URL = "https://pagos.aliminspa.cl/login";

export default function CuentaMigradaPage() {
    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-[#F4F7F6]">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-10 text-center border border-[#36595F]/10">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#36595F]/10 flex items-center justify-center">
                    <ExternalLink className="w-8 h-8 text-[#36595F]" />
                </div>
                <h1 className="text-2xl font-bold text-[#36595F] mb-3">
                    Tu cuenta ahora vive en el Portal de Pagos
                </h1>
                <p className="text-gray-500 text-sm leading-relaxed mb-8">
                    A partir de ahora, revisa tus pagos, tu estado de mora y tus documentos en el
                    nuevo portal de pagos de Alimin. Ingresa con el mismo correo y contraseña que
                    usabas aquí.
                </p>

                <a
                    href={PORTAL_LOGIN_URL}
                    className="w-full inline-flex items-center justify-center gap-2 bg-[#36595F] hover:bg-[#2A464B] text-white font-bold py-4 rounded-full shadow-lg transition-all mb-4"
                >
                    Ir al Portal de Pagos
                    <ExternalLink className="w-4 h-4" />
                </a>

                <button
                    onClick={() => signOut({ callbackUrl: '/login' })}
                    className="w-full inline-flex items-center justify-center gap-2 text-gray-400 hover:text-gray-600 text-xs font-medium py-2 transition-colors"
                >
                    <LogOut className="w-3.5 h-3.5" />
                    Cerrar sesión
                </button>
            </div>
        </div>
    );
}
