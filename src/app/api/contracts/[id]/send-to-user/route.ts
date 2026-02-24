import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { PromesaCompraventaContract } from "@/components/pdf/PromesaCompraventaContract";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { SIGNATURE_BASE64 } from "@/lib/signatureData";
import React from "react";

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

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SELLER')) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const { rep } = await request.json().catch(() => ({ rep: "cindy" }));
        const repKey = rep || "cindy";
        const representante = REPRESENTANTES[repKey] || REPRESENTANTES["cindy"];

        const reservation = await prisma.reservation.findUnique({
            where: { id },
            include: { lot: true }
        });

        if (!reservation) {
            return NextResponse.json({ error: "Reservation not found" }, { status: 404 });
        }

        const logoUrl = new URL('/images/logo.png', request.url).toString();

        // Render PDF to buffer
        const pdfBuffer = await renderToBuffer(
            React.createElement(PromesaCompraventaContract, {
                reservation,
                lot: reservation.lot,
                logoPath: logoUrl,
                signaturePath: SIGNATURE_BASE64,
                repName: representante.Name,
                repRut: representante.RUT,
                repRole: representante.Role,
            })
        );

        // Convert to base64 data URL
        const base64 = `data:application/pdf;base64,${Buffer.from(pdfBuffer).toString("base64")}`;

        // Save to uploaded_contract_url (visible to user in their Documents)
        await prisma.reservation.update({
            where: { id },
            data: { uploaded_contract_url: base64 }
        });

        // Create in-app notification for the buyer if they exist
        if (reservation.buyer_id) {
            await prisma.notification.create({
                data: {
                    user_id: reservation.buyer_id,
                    type: 'contract_ready',
                    title: '📄 Tu contrato de compraventa está listo',
                    message: 'Tu Promesa de Compra y Venta ya está disponible en la sección de Documentos. Puedes descargarlo cuando quieras.',
                    read: false,
                }
            }).catch(console.error);
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Error sending contract to user:", error);
        return NextResponse.json({ error: "Failed to generate and send contract" }, { status: 500 });
    }
}
