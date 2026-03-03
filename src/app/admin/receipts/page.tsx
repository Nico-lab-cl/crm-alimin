import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import ReceiptsClient from "./ReceiptsClient";

export const dynamic = 'force-dynamic';

export default async function ReceiptsPage() {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
        redirect("/login");
    }

    try {
        // @ts-ignore
        const receipts = await prisma.paymentReceipt.findMany({
            orderBy: { created_at: 'desc' },
            include: {
                reservation: {
                    include: {
                        buyer: true,
                        lot: true
                    }
                }
            }
        });

        return (
            <div className="container mx-auto px-3 md:px-6 py-4 md:py-8">
                <div className="mb-4 md:mb-8">
                    <h1 className="text-xl md:text-3xl font-bold text-[#36595F] mb-1 md:mb-2">Verificación de Pagos</h1>
                    <p className="text-gray-600 text-sm md:text-base">Revisa los comprobantes de transferencia subidos por los clientes para el pago de pie o cuotas.</p>
                </div>

                <ReceiptsClient initialReceipts={receipts} />
            </div>
        );
    } catch (error) {
        console.error("Error fetching receipts:", error);
        return (
            <div className="p-8 text-center text-red-500">
                <h2>Error cargando comprobantes de pago.</h2>
                <p>Verifica la conexión a la base de datos o que el modelo PaymentReceipt se haya generado.</p>
            </div>
        );
    }
}
