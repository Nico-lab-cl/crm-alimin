import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const generateOTP = () => Math.floor(1000 + Math.random() * 9000).toString();

export const dynamic = 'force-dynamic';

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id: reservationId } = await params;

        const reservation = await prisma.reservation.findUnique({
            where: { id: reservationId },
            include: { lot: true, buyer: true }
        });

        if (!reservation) {
            return NextResponse.json({ error: "Reserva no encontrada" }, { status: 404 });
        }

        // Ownership check
        if (reservation.email !== session.user.email && reservation.buyer?.email !== session.user.email) {
            return NextResponse.json({ error: "No tienes permiso" }, { status: 403 });
        }

        // Must have contract uploaded first
        if (!reservation.uploaded_contract_url) {
            return NextResponse.json({ error: "El contrato no está disponible aún" }, { status: 400 });
        }

        // Already signed
        if ((reservation as any).promesa_signed_at) {
            return NextResponse.json({ error: "La promesa ya ha sido firmada" }, { status: 400 });
        }

        const otp = generateOTP();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min

        await prisma.reservation.update({
            where: { id: reservationId },
            data: {
                promesa_signature_otp: otp,
                promesa_signature_otp_expires: expiresAt
            } as any
        });

        // Use same n8n OTP webhook
        const webhookUrl = "https://n8n-n8n.yszha2.easypanel.host/webhook/533d88ba-81ec-4d87-8bb3-000998fc5550";

        try {
            const response = await fetch(webhookUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: reservation.email,
                    name: reservation.name,
                    code: otp,
                    document_type: "Promesa de Compraventa",
                    dashboard_url: `${process.env.NEXT_PUBLIC_BASE_URL}/user/documents`,
                    lot_number: reservation.lot.number,
                    lot_stage: reservation.lot.stage
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`N8N Error: ${response.status} - ${errorText}`);
            }
        } catch (webhookError: any) {
            console.error("Failed to call n8n webhook:", webhookError);
            return NextResponse.json({ error: `Error enviando correo: ${webhookError.message}` }, { status: 502 });
        }

        return NextResponse.json({ success: true, message: "Código enviado a tu correo" });

    } catch (error: any) {
        console.error("Error generating promesa OTP:", error);
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
    }
}
