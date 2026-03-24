"use client";

import React, { useState, useEffect } from 'react';
import MapWrapper from '@/components/MapWrapper';
import { Lot } from '@/types';
import { generateKML, downloadKML } from '@/services/kmlExport';
import { Download, Map as MapIcon, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function KMZPage() {
    const [lots, setLots] = useState<Lot[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchLots() {
            try {
                const res = await fetch('/api/lots');
                const json = await res.json();
                if (json.ok && Array.isArray(json.data)) {
                    setLots(json.data);
                } else {
                    throw new Error(json.error || 'Failed to fetch lots');
                }
            } catch (err: any) {
                console.error("Error fetching lots:", err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        }
        fetchLots();
    }, []);

    const handleExportKML = () => {
        const kml = generateKML(lots);
        downloadKML(kml, 'lomas-del-mar-loteo.kml');
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <Link href="/" className="text-[#E0B457] hover:text-[#f2c97a] flex items-center gap-2 text-sm font-medium transition-colors mb-2">
                            <ChevronLeft size={16} />
                            Volver al sitio
                        </Link>
                        <h1 className="text-3xl md:text-4xl font-black flex items-center gap-3">
                            <MapIcon className="text-[#E0B457]" size={32} />
                            Mapa de Polígonos
                        </h1>
                        <p className="text-slate-400 text-sm md:text-base">
                            Visualización técnica y exportación geográfica del proyecto Lomas del Mar.
                        </p>
                    </div>

                    <Button 
                        onClick={handleExportKML}
                        disabled={isLoading}
                        className="bg-[#E0B457] hover:bg-[#f2c97a] text-slate-900 font-bold px-6 py-6 rounded-xl shadow-lg shadow-[#E0B457]/10 flex items-center gap-3 transition-all transform hover:scale-105 active:scale-95"
                    >
                        <Download size={20} />
                        Exportar a KML (Google Earth)
                    </Button>
                </div>

                {/* Map Section */}
                <div className="relative border border-slate-700 rounded-[2rem] overflow-hidden bg-slate-800/50 backdrop-blur-sm shadow-2xl">
                    {isLoading ? (
                        <div className="w-full h-[600px] flex flex-col items-center justify-center gap-4 animate-pulse">
                            <div className="p-4 rounded-full bg-slate-700/50">
                                <MapIcon className="w-10 h-10 text-slate-500 animate-spin" />
                            </div>
                            <p className="text-slate-400 font-medium">Inicializando motor de mapas...</p>
                        </div>
                    ) : error ? (
                        <div className="w-full h-[600px] flex flex-col items-center justify-center gap-4 text-center p-8">
                            <div className="p-4 rounded-full bg-red-500/10 text-red-500">
                                <MapIcon className="w-10 h-10" />
                            </div>
                            <h3 className="text-xl font-bold text-red-400">Error al cargar datos</h3>
                            <p className="text-slate-500 max-w-md">{error}</p>
                            <Button onClick={() => window.location.reload()} variant="outline" className="mt-4">
                                Reintentar
                            </Button>
                        </div>
                    ) : (
                        <MapWrapper lots={lots} />
                    )}
                </div>

                {/* Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                    <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/50">
                        <h3 className="text-[#E0B457] font-bold mb-2 flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-[#36595F]" />
                            Disponibles
                        </h3>
                        <p className="text-slate-400 text-sm">Terrenos listos para reserva inmediata. Sincronizados en tiempo real.</p>
                    </div>
                    <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/50">
                        <h3 className="text-[#E0B457] font-bold mb-2 flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-[#EF4444]" />
                            Vendidos
                        </h3>
                        <p className="text-slate-400 text-sm">Áreas con cierre de contrato o pie completo pagado.</p>
                    </div>
                    <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/50">
                        <h3 className="text-[#E0B457] font-bold mb-2 flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-[#F59E0B]" />
                            Reservados
                        </h3>
                        <p className="text-slate-400 text-sm">Lotes en proceso de pago de pie o firma de promesa.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
