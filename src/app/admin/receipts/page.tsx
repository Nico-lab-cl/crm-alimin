import { auth } from "@/auth";
import { redirect } from "next/navigation";
import ReceiptsClient from "./ReceiptsClient";
import { getPaginatedReceipts } from "@/actions/receipts";

export const dynamic = 'force-dynamic';

export default async function ReceiptsPage({ 
    searchParams 
}: { 
    searchParams: { page?: string, status?: string } 
}) {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
        redirect("/login");
    }

    const page = parseInt(searchParams.page || '1');
    const status = searchParams.status || 'ALL';

    try {
        const result = await getPaginatedReceipts({
            page,
            pageSize: 20,
            status
        });

        return (
            <div className="container mx-auto px-3 md:px-6 py-4 md:py-8 pb-24">
                <div className="mb-4 md:mb-8">
                    <h1 className="text-xl md:text-3xl font-bold text-[#36595F] mb-1 md:mb-2 text-center md:text-left">
                        Verificación de Pagos
                    </h1>
                    <p className="text-gray-600 text-sm md:text-base text-center md:text-left">
                        Revisa los comprobantes del día. Mostrando página {page} de {(result as any).totalPages}.
                    </p>
                </div>

                <ReceiptsClient 
                    key={`receipts-${page}-${status}`}
                    initialReceipts={(result as any).receipts || []} 
                    totalPages={(result as any).totalPages || 1}
                    currentPage={page}
                    currentStatus={status}
                />
            </div>
        );
    } catch (error) {
        console.error("Error fetching receipts:", error);
        return (
            <div className="p-8 text-center text-red-500">
                <h2>Error cargando comprobantes de pago.</h2>
                <p>Verifica la conexión a la base de datos.</p>
            </div>
        );
    }
}
