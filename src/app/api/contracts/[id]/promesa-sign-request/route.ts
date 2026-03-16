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
        console.log(`[PromesaSignRequest] Attempting OTP for reservation: ${reservationId}`);

        const reservation = await prisma.reservation.findUnique({
            where: { id: reservationId },
            include: { lot: true, buyer: true }
        });

        if (!reservation) {
            console.log(`[PromesaSignRequest] Reservation not found: ${reservationId}`);
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

        // Use same n8n OTP webhook (New Domain)
        const webhookUrl = "https://n8n.aliminlomasdelmar.com/webhook/533d88ba-81ec-4d87-8bb3-000998fc5550";

        // Fire and await with timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

        try {
            console.log(`[PromesaSignRequest] Calling n8n webhook for ${reservation.email}...`);
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
                }),
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            if (!response.ok) {
                const errorText = await response.text();
                const msg = `N8N Error: ${response.status} - ${errorText}`;
                console.error(`[PromesaSignRequest] ${msg}`);
                throw new Error(msg);
            }
            console.log(`[PromesaSignRequest] Webhook called successfully for ${reservation.email}`);
        } catch (webhookError: any) {
            clearTimeout(timeoutId);
            const isTimeout = webhookError.name === 'AbortError';
            const errorMsg = isTimeout ? "La solicitud al servidor de correos saturó (timeout 10s)" : webhookError.message;

            console.error("[PromesaSignRequest] Failed to call n8n webhook:", webhookError);
            return NextResponse.json({ error: `Error enviando correo: ${errorMsg}` }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: "Código enviado a tu correo" });

    } catch (error: any) {
        console.error("Error generating promesa OTP:", error);
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
    }
}
