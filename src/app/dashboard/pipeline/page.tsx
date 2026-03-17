import prisma from "@/lib/prisma";
import KanbanBoard from "./KanbanBoard";

export const dynamic = "force-dynamic";

export default async function PipelinePage() {
    const reservations = await prisma.reservation.findMany({
        where: {
            status: { not: "canceled" } // Or whichever active states make sense
        },
        include: {
            lot: true,
            contact: true,
        },
        orderBy: {
            created_at: "desc"
        }
    });

    return (
        <div className="h-full flex flex-col p-4 md:p-8">
            <div className="sm:flex sm:items-center mb-6 flex-shrink-0">
                <div className="sm:flex-auto">
                    <h1 className="text-2xl font-semibold text-gray-900">Pipeline de Ventas</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        Gestiona el estado de todas las reservas activas en el proyecto usando el tablero.
                    </p>
                </div>
            </div>

            {/* Kanban Board Container (Flex-1 to take remaining height) */}
            <div className="flex-1 overflow-hidden relative">
                <KanbanBoard initialReservations={reservations} />
            </div>
        </div>
    );
}
