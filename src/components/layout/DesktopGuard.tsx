"use client";

import { useEffect, useState } from "react";
import { MonitorOff } from "lucide-react";

export function DesktopGuard({ children }: { children: React.ReactNode }) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024);
        };
        
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    if (isMobile) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-center h-[calc(100vh-100px)]">
                <div className="bg-amber-50 p-4 rounded-full mb-4">
                    <MonitorOff className="h-10 w-10 text-amber-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">Diseñador solo para Desktop</h2>
                <p className="text-gray-600 max-w-xs">
                    El módulo de Email Marketing requiere una pantalla más grande para diseñar correos electrónicos y gestionar estrategias de forma efectiva.
                </p>
                <p className="mt-4 text-sm font-semibold text-[var(--alimin-green)] italic">
                    ¡Por favor, accede desde tu computadora!
                </p>
            </div>
        );
    }

    return <>{children}</>;
}
