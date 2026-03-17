"use client";

import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";

// ✅ Etapas reales del proceso de venta Lomas del Mar
const PIPELINE_STAGES = [
    {
        id: "RESERVA",
        title: "Reserva",
        subtitle: "Reservó, pago pendiente",
        color: "border-slate-400",
        headerBg: "bg-slate-50",
        badge: "bg-slate-100 text-slate-600",
        dot: "bg-slate-400",
    },
    {
        id: "RESERVA_POR_FIRMAR",
        title: "Reserva por Firmar",
        subtitle: "Pago OK · Contrato pendiente",
        color: "border-amber-400",
        headerBg: "bg-amber-50",
        badge: "bg-amber-100 text-amber-700",
        dot: "bg-amber-400",
    },
    {
        id: "COMPRAVENTA_POR_FIRMAR",
        title: "Compra Venta por Firmar",
        subtitle: "Reserva firmada · Promesa pendiente",
        color: "border-orange-400",
        headerBg: "bg-orange-50",
        badge: "bg-orange-100 text-orange-700",
        dot: "bg-orange-400",
    },
    {
        id: "PIE_POR_PAGAR",
        title: "Pie por Pagar",
        subtitle: "Promesa firmada · Pie pendiente",
        color: "border-blue-400",
        headerBg: "bg-blue-50",
        badge: "bg-blue-100 text-blue-700",
        dot: "bg-blue-400",
    },
    {
        id: "CUOTAS_POR_PAGAR",
        title: "Cuotas por Pagar",
        subtitle: "Pie pagado · En cuotas",
        color: "border-teal-400",
        headerBg: "bg-teal-50",
        badge: "bg-teal-100 text-teal-700",
        dot: "bg-teal-400",
    },
    {
        id: "VENTA_CERRADA",
        title: "Venta Cerrada",
        subtitle: "✅ Proceso completo",
        color: "border-green-500",
        headerBg: "bg-green-50",
        badge: "bg-green-100 text-green-700",
        dot: "bg-green-500",
    },
    {
        id: "VENTA_PERDIDA",
        title: "Venta Perdida",
        subtitle: "❌ Cliente no siguió",
        color: "border-red-400",
        headerBg: "bg-red-50",
        badge: "bg-red-100 text-red-700",
        dot: "bg-red-400",
    },
];

export default function KanbanBoard({ initialReservations }: { initialReservations: any[] }) {
    const [isClient, setIsClient] = useState(false);
    const [columns, setColumns] = useState<Record<string, any[]>>({});

    useEffect(() => {
        setIsClient(true);
        const grouped: Record<string, any[]> = {};
        PIPELINE_STAGES.forEach(stage => {
            grouped[stage.id] = initialReservations.filter(r => r.pipeline_stage === stage.id);
        });

        // Unmapped reservations go to the first stage
        const mappedIds = PIPELINE_STAGES.map(s => s.id);
        const unmapped = initialReservations.filter(r => !mappedIds.includes(r.pipeline_stage));
        if (unmapped.length > 0) {
            grouped["RESERVA"] = [...(grouped["RESERVA"] || []), ...unmapped];
        }

        setColumns(grouped);
    }, [initialReservations]);

    const onDragEnd = async (result: DropResult) => {
        const { source, destination, draggableId } = result;

        if (!destination) return;
        if (source.droppableId === destination.droppableId && source.index === destination.index) return;

        const sourceCol = [...columns[source.droppableId]];
        const destCol = [...columns[destination.droppableId]];

        const [movedItem] = sourceCol.splice(source.index, 1);
        movedItem.pipeline_stage = destination.droppableId;
        destCol.splice(destination.index, 0, movedItem);

        setColumns({
            ...columns,
            [source.droppableId]: sourceCol,
            [destination.droppableId]: destCol,
        });

        try {
            await fetch(`/api/pipeline/${movedItem.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ pipeline_stage: destination.droppableId }),
            });
        } catch (e) {
            console.error("Error actualizando etapa del pipeline", e);
        }
    };

    if (!isClient) return <div className="p-4 text-center text-gray-500">Cargando tablero...</div>;

    const totalCards = Object.values(columns).reduce((acc, col) => acc + col.length, 0);

    return (
        <div className="flex flex-col h-full">
            {/* Stats bar */}
            <div className="flex items-center gap-6 mb-4 px-1 flex-shrink-0">
                <span className="text-sm font-semibold text-gray-700">
                    Total activo: <span className="text-[var(--alimin-green)]">{totalCards}</span> reservas
                </span>
                <div className="flex gap-3 flex-wrap">
                    {PIPELINE_STAGES.map(stage => (
                        <div key={stage.id} className="flex items-center gap-1.5">
                            <div className={`w-2 h-2 rounded-full ${stage.dot}`} />
                            <span className="text-xs text-gray-500">
                                {stage.title}: <strong>{columns[stage.id]?.length || 0}</strong>
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Kanban */}
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="flex gap-4 flex-1 overflow-x-auto pb-4">
                    {PIPELINE_STAGES.map(stage => (
                        <div key={stage.id} className={`flex-shrink-0 w-72 flex flex-col rounded-xl bg-gray-50 border-t-4 ${stage.color} shadow-sm`}>
                            {/* Column header */}
                            <div className={`px-4 py-3 ${stage.headerBg} rounded-t-lg border-b border-gray-100`}>
                                <div className="flex items-center justify-between">
                                    <h3 className="font-bold text-sm text-gray-800">{stage.title}</h3>
                                    <span className={`text-xs font-bold py-0.5 px-2 rounded-full ${stage.badge}`}>
                                        {columns[stage.id]?.length || 0}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-400 mt-0.5">{stage.subtitle}</p>
                            </div>

                            {/* Droppable column */}
                            <Droppable droppableId={stage.id}>
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        className={`flex-1 p-3 overflow-y-auto space-y-2.5 min-h-[80px] transition-colors rounded-b-xl ${snapshot.isDraggingOver ? "bg-indigo-50/60" : ""
                                            }`}
                                    >
                                        {columns[stage.id]?.map((res, index) => (
                                            <Draggable key={res.id} draggableId={res.id} index={index}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className={`bg-white p-3.5 rounded-lg shadow-sm border border-gray-100 transition-all hover:shadow-md hover:border-[var(--alimin-gold)]/40 select-none cursor-grab active:cursor-grabbing ${snapshot.isDragging ? "shadow-lg border-indigo-300 rotate-1 scale-105" : ""
                                                            }`}
                                                    >
                                                        {/* Lote badge */}
                                                        <div className="flex justify-between items-center mb-2">
                                                            <span className="text-xs font-bold bg-[var(--alimin-green)]/10 text-[var(--alimin-green)] px-2 py-0.5 rounded">
                                                                Lote {res.lot?.number || "—"}
                                                            </span>
                                                            <span className="text-[10px] text-gray-400">
                                                                {format(new Date(res.created_at), "dd MMM", { locale: es })}
                                                            </span>
                                                        </div>

                                                        {/* Client name */}
                                                        <div className="font-semibold text-sm text-gray-800 leading-tight mb-0.5">
                                                            {res.contact?.first_name
                                                                ? `${res.contact.first_name} ${res.contact.last_name || ""}`
                                                                : res.name}
                                                        </div>

                                                        {/* Email */}
                                                        <div className="text-xs text-gray-400 truncate mb-3">
                                                            {res.email}
                                                        </div>

                                                        {/* Lot price */}
                                                        {res.lot?.price_total_clp && (
                                                            <div className="text-xs font-semibold text-[var(--alimin-gold)] mb-2">
                                                                ${res.lot.price_total_clp.toLocaleString("es-CL")}
                                                            </div>
                                                        )}

                                                        {/* Status pills */}
                                                        <div className="flex gap-1.5 flex-wrap mb-3">
                                                            <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${res.status === "paid" ? "bg-green-100 text-green-700" :
                                                                    res.status === "pending_payment" ? "bg-yellow-100 text-yellow-700" :
                                                                        "bg-red-100 text-red-700"
                                                                }`}>
                                                                {res.status === "paid" ? "Pago OK" :
                                                                    res.status === "pending_payment" ? "Pago Pendiente" : "Cancelada"}
                                                            </span>
                                                            {res.signed_at && (
                                                                <span className="text-[10px] px-1.5 py-0.5 rounded font-medium bg-purple-100 text-purple-700">
                                                                    Firmó reserva
                                                                </span>
                                                            )}
                                                            {res.promesa_signed_at && (
                                                                <span className="text-[10px] px-1.5 py-0.5 rounded font-medium bg-blue-100 text-blue-700">
                                                                    Firmó promesa
                                                                </span>
                                                            )}
                                                        </div>

                                                        {/* Footer link */}
                                                        <div className="pt-2.5 border-t border-gray-100 flex justify-end">
                                                            {res.contact_id ? (
                                                                <Link
                                                                    href={`/dashboard/contacts/${res.contact_id}`}
                                                                    className="text-xs font-bold text-[var(--alimin-gold)] hover:underline"
                                                                >
                                                                    Ver Perfil →
                                                                </Link>
                                                            ) : (
                                                                <span className="text-[10px] text-gray-400 italic">Sin perfil CRM</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}

                                        {/* Empty state */}
                                        {(columns[stage.id]?.length || 0) === 0 && (
                                            <div className="text-center py-6 text-gray-300 text-xs italic">
                                                Sin reservas aquí
                                            </div>
                                        )}
                                    </div>
                                )}
                            </Droppable>
                        </div>
                    ))}
                </div>
            </DragDropContext>
        </div>
    );
}
