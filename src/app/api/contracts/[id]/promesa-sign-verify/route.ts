import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id: reservationId } = await context.params;
        const { code } = await req.json();

        if (!code || code.length !== 4) {
            return NextResponse.json({ error: "Código inválido" }, { status: 400 });
        }

        const reservation = await prisma.reservation.findUnique({
            where: { id: reservationId }
        }) as any;

        if (!reservation) {
            return NextResponse.json({ error: "Reserva no encontrada" }, { status: 404 });
        }

        // Ownership check
        if (reservation.email !== session.user.email && reservation.buyer_id !== session.user.id) {
            return NextResponse.json({ error: "No tienes permiso para firmar este contrato" }, { status: 403 });
        }

        if (reservation.promesa_signed_at) {
            return NextResponse.json({ error: "La promesa ya ha sido firmada" }, { status: 400 });
        }

        // Verify OTP
        if (reservation.promesa_signature_otp !== code) {
            return NextResponse.json({ error: "Código incorrecto" }, { status: 400 });
        }

        if (reservation.promesa_signature_otp_expires && new Date() > reservation.promesa_signature_otp_expires) {
            return NextResponse.json({ error: "El código ha expirado. Solicita uno nuevo." }, { status: 400 });
        }

        // Get IP
        let ip = req.headers.get("x-forwarded-for") || (req as any).ip || "unknown";
        if (ip.includes(",")) ip = ip.split(",")[0];

        // Sign
        await prisma.reservation.update({
            where: { id: reservationId },
            data: {
                promesa_signed_at: new Date(),
                promesa_signature_ip: ip,
                promesa_signature_otp: null,
                promesa_signature_otp_expires: null,
            } as any
        });

        // Create success notification
        if (reservation.buyer_id) {
            await prisma.notification.create({
                data: {
                    user_id: reservation.buyer_id,
                    type: "promesa_signed",
                    title: "✅ Promesa de compraventa firmada",
                    message: "Has firmado exitosamente tu Promesa de Compra y Venta. Nuestro equipo te contactará pronto.",
                    read: false,
                }
            }).catch(console.error);
        }

        return NextResponse.json({ success: true, message: "Promesa firmada exitosamente" });

    } catch (error: any) {
        console.error("Error verifying promesa OTP:", error);
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
    }
}
