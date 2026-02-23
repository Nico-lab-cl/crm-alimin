import { NextResponse } from "next/server";
import { renderToStream } from "@react-pdf/renderer";
import { PromesaCompraventaContract } from "@/components/pdf/PromesaCompraventaContract";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/auth";
import { SIGNATURE_BASE64 } from "@/lib/signatureData";
import path from "path";

const prisma = new PrismaClient();

const REPRESENTANTES: Record<string, { Name: string; RUT: string; Role: string }> = {
    cindy: {
        Name: "Cindy Valeria Gutierrez Gutierrez",
        RUT: "26.727.267-0",
        Role: "Promitente Vendedor"
    },
    patricio: {
        Name: "Patricio Andrés Escobar Díaz",
        RUT: "18.147.698-2",
        Role: "Representante Legal"
    }
};

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        // Since we are providing this to Admins/Sellers
        if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SELLER')) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const url = new URL(request.url);
        const repKey = url.searchParams.get("rep") || "cindy";
        const representante = REPRESENTANTES[repKey] || REPRESENTANTES["cindy"];

        const { id } = await params;
        const reservation = await prisma.reservation.findUnique({
            where: { id },
            include: { lot: true }
        });

        if (!reservation) {
            return new NextResponse("Reservation not found", { status: 404 });
        }

        // Resolving paths. Note: in Vercel, reading static files via fs in API routes can fail without special setups.
        // But since this is using `@react-pdf/renderer` images need valid URLs or base64.
        const logoUrl = new URL('/images/logo.png', request.url).toString();

        // Render PDF Stream
        const stream = await renderToStream(
            <PromesaCompraventaContract
                reservation={reservation}
                lot={reservation.lot}
                logoPath={logoUrl}
                signaturePath={SIGNATURE_BASE64}
                repName={representante.Name}
                repRut={representante.RUT}
                repRole={representante.Role}
            />
        );

        return new NextResponse(stream as unknown as ReadableStream, {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `inline; filename="Promesa_Compraventa_${reservation.folio || 'Lote_' + reservation.lot.number}.pdf"`,
            }
        });

    } catch (error) {
        console.error("Error generating Promesa de Compra Venta PDF:", error);
        return new NextResponse("Internal Server Error generating PDF", { status: 500 });
    }
}
