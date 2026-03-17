"use client";

import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useState } from "react";
import { LeadDetailsModal } from "./LeadDetailsModal";
import { Eye } from "lucide-react";

interface LeadsTableProps {
    leads: any[];
}

export function LeadsTable({ leads }: LeadsTableProps) {
    const [selectedLead, setSelectedLead] = useState<any | null>(null);

    return (
        <div className="flex-1 overflow-auto rounded-lg border border-gray-200 shadow-sm bg-white min-h-[400px]">
            <table className="min-w-full divide-y divide-gray-200 lg:min-w-full min-w-[800px]">
                <thead className="bg-gray-50 sticky top-0 z-10">
                    <tr>
                        <th className="py-2 pl-3 pr-2 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">Nombre / Email</th>
                        <th className="px-2 py-2 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider hidden md:table-cell">Ciudad</th>
                        <th className="px-2 py-2 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">Proyecto</th>
                        <th className="px-2 py-2 text-center text-[10px] font-bold text-gray-400 uppercase tracking-wider">Teléfono</th>
                        <th className="px-2 py-2 text-right text-[10px] font-bold text-gray-400 uppercase tracking-wider">Actividad</th>
                        <th className="relative py-2 pl-2 pr-3"><span className="sr-only">Acción</span></th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                    {leads.map((lead) => (
                        <tr 
                            key={lead.id} 
                            onClick={() => setSelectedLead(lead)}
                            className="hover:bg-gray-50 transition-colors border-b last:border-0 border-gray-50 cursor-pointer group"
                        >
                            <td className="whitespace-nowrap py-2 pl-3 pr-2">
                                <div className="flex items-center gap-2">
                                    <div className="h-7 w-7 flex-shrink-0 rounded bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-200 flex items-center justify-center text-[var(--alimin-green)] font-bold uppercase text-[11px] shadow-sm">
                                        {lead.nombre ? lead.nombre.charAt(0) : "?"}
                                    </div>
                                    <div className="min-w-0">
                                        <div className="font-bold text-gray-900 text-xs truncate max-w-[180px]">
                                            {lead.nombre}
                                        </div>
                                        <div className="text-gray-400 text-[10px] truncate max-w-[150px] font-medium">{lead.email}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="whitespace-nowrap px-2 py-1.5 hidden md:table-cell text-[10px] text-gray-500 font-medium">
                                {lead.ciudad || "—"}
                            </td>
                            <td className="whitespace-nowrap px-2 py-1.5">
                                <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-[9px] font-bold border border-gray-200 uppercase tracking-tighter">
                                    {lead.proyecto || "General"}
                                </span>
                            </td>
                            <td className="whitespace-nowrap px-2 py-1.5 text-center text-xs text-gray-600 font-mono italic">
                                {lead.celular || "—"}
                            </td>
                            <td className="whitespace-nowrap px-2 py-1.5 text-right">
                                <div className="flex flex-col items-end">
                                    <span className="text-[10px] font-bold text-gray-600">
                                        {lead.created_at ? format(new Date(lead.created_at), "dd MMM, HH:mm", { locale: es }) : "—"}
                                    </span>
                                    <span className="text-[9px] text-gray-400">captación</span>
                                </div>
                            </td>
                            <td className="relative whitespace-nowrap py-1.5 pl-2 pr-3 text-right">
                                <button className="text-[var(--alimin-gold)] group-hover:text-[var(--alimin-gold-hover)] font-bold text-[10px] uppercase p-1">
                                    Ficha
                                </button>
                            </td>
                        </tr>
                    ))}

                    {leads.length === 0 && (
                        <tr>
                            <td colSpan={6} className="py-24 text-center text-gray-400 text-sm">
                                No se encontraron leads en la base de datos.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            <LeadDetailsModal 
                lead={selectedLead}
                isOpen={!!selectedLead}
                onClose={() => setSelectedLead(null)}
            />
        </div>
    );
}
