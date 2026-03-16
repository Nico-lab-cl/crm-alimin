import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// Generate a random 4-digit code
const generateOTP = () => Math.floor(1000 + Math.random() * 9000).toString();

export const dynamic = 'force-dynamic';

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: reservationId } = await params;
        console.log(`[SignRequest] Attempting OTP for reservation: ${reservationId}`);
        const session = await auth();
        if (!session || !session.user || !session.user.email) {
            console.log(`[SignRequest] Unauthorized attempt for: ${reservationId}`);
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }


        const reservation = await prisma.reservation.findUnique({
            where: { id: reservationId },
            include: { lot: true, buyer: true }
        });

        if (!reservation) {
            console.log(`[SignRequest] Reservation not found: ${reservationId}`);
            return NextResponse.json({ error: "Reserva no encontrada" }, { status: 404 });
        }

        // Verify ownership (either the buyer or the seller if associated, but strictly buyer for signature)
        // For now, allow if the session email matches reservation email
        if (reservation.email !== session.user.email && reservation.buyer?.email !== session.user.email) {
            return NextResponse.json({ error: "No tienes permiso para firmar este contrato" }, { status: 403 });
        }

        if (reservation.signed_at) {
            return NextResponse.json({ error: "El contrato ya ha sido firmado" }, { status: 400 });
        }

        const otp = generateOTP();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Save OTP to DB
        await prisma.reservation.update({
            where: { id: reservationId },
            data: {
                signature_otp: otp,
                signature_otp_expires: expiresAt
            }
        });

        // Send to n8n Webhook
        const webhookUrl = "https://n8n-n8n.yszha2.easypanel.host/webhook/533d88ba-81ec-4d87-8bb3-000998fc5550";

        // Prepare payload
        const payload = {
            email: reservation.email,
            name: reservation.name,
            code: otp,
            dashboard_url: `${process.env.NEXT_PUBLIC_BASE_URL}/user/plots`,
            lot_number: reservation.lot.number,
            lot_stage: reservation.lot.stage
        };

        // Fire and await with timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

        try {
            console.log(`[SignRequest] Calling n8n webhook for ${reservation.email}...`);
            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            if (!response.ok) {
                const errorText = await response.text();
                const msg = `N8N Error: ${response.status} - ${errorText}`;
                console.error(`[SignRequest] ${msg}`);
                throw new Error(msg);
            }
            console.log(`[SignRequest] Webhook called successfully for ${reservation.email}`);
        } catch (webhookError: any) {
            clearTimeout(timeoutId);
            const isTimeout = webhookError.name === 'AbortError';
            const errorMsg = isTimeout ? "La solicitud al servidor de correos saturó (timeout 10s)" : webhookError.message;
            
            console.error(`[SignRequest] Failed to call n8n webhook:`, webhookError);
            
            // Revert DB change if email fails (optional)
            return NextResponse.json({ error: `Error enviando correo: ${errorMsg}` }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: "Código enviado a tu correo" });

    } catch (error: any) {
        console.error("Error generating OTP:", error);
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
    }
}
