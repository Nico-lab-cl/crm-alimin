import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { sendContractSignedWebhook } from "@/lib/webhooks";

export async function POST(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session || !session.user || !session.user.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const params = await context.params;
        const reservationId = params.id;
        const { code } = await req.json();

        if (!code || code.length !== 4) {
            return NextResponse.json({ error: "Código inválido" }, { status: 400 });
        }

        const reservation = await prisma.reservation.findUnique({
            where: { id: reservationId },
        });

        if (!reservation) {
            return NextResponse.json({ error: "Reserva no encontrada" }, { status: 404 });
        }

        // Verify ownership
        if (reservation.email !== session.user.email && reservation.buyer_id !== session.user.id) {
            return NextResponse.json({ error: "No tienes permiso para firmar este contrato" }, { status: 403 });
        }

        if (reservation.signed_at) {
            return NextResponse.json({ error: "El contrato ya ha sido firmado" }, { status: 400 });
        }

        // Verify OTP
        if (reservation.signature_otp !== code) {
            return NextResponse.json({ error: "Código incorrecto" }, { status: 400 });
        }

        if (reservation.signature_otp_expires && new Date() > reservation.signature_otp_expires) {
            return NextResponse.json({ error: "El código ha expirado. Solicita uno nuevo." }, { status: 400 });
        }

        // Get IP Address
        let ip = req.headers.get("x-forwarded-for") || (req as any).ip || "unknown";
        if (ip.includes(',')) ip = ip.split(',')[0];

        // Sign Contract
        await prisma.reservation.update({
            where: { id: reservationId },
            data: {
                signed_at: new Date(),
                signature_ip: ip,
                signature_otp: null, // Clear OTP after use
                signature_otp_expires: null,
                pipeline_stage: 'PIE_POR_PAGAR' // User requested move to Pie por pagar when signed
            }
        });

        // Trigger Webhook (Fire and forget to avoid blocking UI)
        sendContractSignedWebhook(reservationId).catch(console.error);

        return NextResponse.json({ success: true, message: "Contrato firmado exitosamente" });

    } catch (error: any) {
        console.error("Error signing contract:", error);
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
    }
}
