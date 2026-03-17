"use client";

import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Link from "next/link";
import { LeadDetailsModal } from "./LeadDetailsModal";

const STAGE_LABELS: Record<string, string> = {
    RESERVA: "Reservó",
    RESERVA_PAGADA: "Reservó",
    RESERVA_POR_FIRMAR: "Reserva por Firmar",
    COMPRAVENTA_POR_FIRMAR: "Compra Venta por Firmar",
    ESPERANDO_PIE: "Pie por Pagar",
    PIE_POR_PAGAR: "Pie por Pagar",
    PIE_PAGADO: "Cuotas por Pagar",
    PAGO_CUOTAS: "Cuotas por Pagar",
    CUOTAS_POR_PAGAR: "Cuotas por Pagar",
    VENTA_CERRADA: "Venta Cerrada",
    VENTA_PERDIDA: "Venta Perdida",
};
const STATUS_LABELS: Record<string, string> = {
    paid: "Pagado",
    pending_payment: "Pendiente de Pago",
    canceled: "Cancelado",
};

interface ContactTableProps {
    contacts: any[];
}

export function ContactTable({ contacts }: ContactTableProps) {
    const [selectedLead, setSelectedLead] = useState<any>(null);

    return (
        <div className="flex-1 overflow-auto rounded-lg border border-gray-200 shadow-sm bg-white min-h-[400px]">
            <table className="min-w-full divide-y divide-gray-200 lg:min-w-full min-w-[800px]">
                <thead className="bg-gray-50 sticky top-0 z-10">
                    <tr>
                        <th className="py-2 pl-3 pr-2 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">Nombre / Email</th>
                        <th className="px-2 py-2 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider hidden sm:table-cell">RUT</th>
                        <th className="px-2 py-2 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider hidden md:table-cell">Fuente</th>
                        <th className="px-2 py-2 text-center text-[10px] font-bold text-gray-400 uppercase tracking-wider">Res.</th>
                        <th className="px-2 py-2 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider hidden lg:table-cell">Última Etapa</th>
                        <th className="px-2 py-2 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider hidden lg:table-cell">Estado Pago</th>
                        <th className="px-2 py-2 text-right text-[10px] font-bold text-gray-400 uppercase tracking-wider">Actividad</th>
                        <th className="relative py-2 pl-2 pr-3"><span className="sr-only">Acción</span></th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                    {contacts.map((contact) => {
                        const lastRes = contact.reservations?.[0];
                        const stageLbl = lastRes ? (STAGE_LABELS[lastRes.pipeline_stage] ?? lastRes.pipeline_stage) : null;
                        const statusLbl = lastRes ? (STATUS_LABELS[lastRes.status] ?? lastRes.status) : null;
                        const statusCls = lastRes?.status === "paid"
                            ? "bg-green-100 text-green-700"
                            : lastRes?.status === "pending_payment"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700";

                        const hasFailedAttempt = lastRes?.status !== 'paid' && lastRes?.transactions?.some((t: any) => t.status !== 'AUTHORIZED' && t.status !== 'INITIALIZED');

                        return (
                            <tr 
                                key={contact.id} 
                                className="hover:bg-gray-50 transition-colors border-b last:border-0 border-gray-50 cursor-pointer"
                                onClick={() => setSelectedLead(contact)}
                            >
                                <td className="whitespace-nowrap py-2 pl-3 pr-2">
                                    <div className="flex items-center gap-2">
                                        <div className="h-7 w-7 flex-shrink-0 rounded bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-200 flex items-center justify-center text-[var(--alimin-green)] font-bold uppercase text-[11px] shadow-sm">
                                            {contact.first_name ? contact.first_name.charAt(0) : "?"}
                                        </div>
                                        <div className="min-w-0">
                                            <div className="font-bold text-gray-900 text-xs truncate max-w-[180px] flex items-center gap-1.5">
                                                {contact.first_name} {contact.last_name || ""}
                                                {hasFailedAttempt && (
                                                    <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse border border-white" title="Intento de pago fallido" />
                                                )}
                                            </div>
                                            <div className="text-gray-400 text-[10px] truncate max-w-[150px] font-medium">{contact.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="whitespace-nowrap px-2 py-1.5 text-[11px] text-gray-500 hidden sm:table-cell font-mono">{contact.rut || "—"}</td>
                                <td className="whitespace-nowrap px-2 py-1.5 hidden md:table-cell">
                                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-tighter ${contact.source === 'META' ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-gray-50 text-gray-500 border-gray-200'}`}>
                                        {contact.source || 'Lead'}
                                    </span>
                                </td>
                                <td className="whitespace-nowrap px-2 py-1.5 text-center">
                                    <span className="inline-flex items-center text-[10px] font-bold text-gray-600 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100">
                                        {contact._count?.reservations || contact.reservations?.length || 0}
                                    </span>
                                </td>
                                <td className="px-2 py-1.5 hidden lg:table-cell">
                                    {stageLbl ? (
                                        <div className="flex flex-col">
                                            <span className="text-[11px] font-bold text-gray-700 truncate block max-w-[120px]">{stageLbl}</span>
                                            <span className="text-[9px] text-gray-400">Lote {lastRes.lot?.number}</span>
                                        </div>
                                    ) : <span className="text-gray-300 text-[10px]">—</span>}
                                </td>
                                <td className="px-2 py-1.5 hidden lg:table-cell">
                                    {statusLbl ? (
                                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${statusCls} border-current border-opacity-30`}>
                                            {statusLbl}
                                        </span>
                                    ) : <span className="text-gray-300 text-[10px]">—</span>}
                                </td>
                                <td className="whitespace-nowrap px-2 py-1.5 text-right">
                                    <div className="flex flex-col items-end">
                                        <span className="text-[10px] font-bold text-gray-600">
                                            {format(new Date(contact.updated_at), "dd MMM, HH:mm", { locale: es })}
                                        </span>
                                        <span className="text-[9px] text-gray-400">última interacción</span>
                                    </div>
                                </td>
                                <td className="relative whitespace-nowrap py-1.5 pl-2 pr-3 text-right">
                                    <button className="text-[var(--alimin-gold)] group-hover:text-[var(--alimin-gold-hover)] font-bold text-[10px] uppercase p-1">
                                        Ver Ficha
                                    </button>
                                </td>
                            </tr>
                        );
                    })}

                    {contacts.length === 0 && (
                        <tr>
                            <td colSpan={8} className="py-24 text-center text-gray-400 text-sm">
                                No se encontraron contactos con esos filtros.
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
