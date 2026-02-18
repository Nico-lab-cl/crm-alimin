
import { prisma } from '@/lib/prisma';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://aliminlomasdelmar.com';

export async function sendPieWebhook(reservationId: string, amountPaid: number) {
    const pieWebhookUrl = "https://n8n-n8n.yszha2.easypanel.host/webhook/97088a1c-742f-4d8b-a98f-d7aa29452c30";

    const reservation = await prisma.reservation.findUnique({
        where: { id: reservationId },
        include: { lot: true }
    });

    if (!reservation || !reservation.lot) {
        console.error(`[Webhook] Reservation or Lot not found for ID: ${reservationId}`);
        return { success: false, error: 'Reservation or Lot not found' };
    }

    const pieTotal = reservation.lot.pie || 0;
    const reservationAmount = reservation.lot.reservation_amount_clp || 0;

    const payload = {
        monto_pagado: amountPaid,
        pie_total: pieTotal,
        reserva_descontada: reservationAmount,
        link_gestion_terreno: `${baseUrl}/user/plots`,
        // Context info
        contact_name: reservation.name,
        contact_email: reservation.email,
        lot_number: reservation.lot.number,
        reservation_id: reservationId
    };

    try {
        const res = await fetch(pieWebhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            console.error(`[Webhook] Pie Webhook failed: ${res.status} ${res.statusText}`);
            return { success: false, status: res.status };
        }

        console.log(`[Webhook] Pie Webhook sent successfully for Reservation ${reservationId}`);
        return { success: true };

    } catch (e) {
        console.error(`[Webhook] Failed to trigger pie webhook`, e);
        return { success: false, error: String(e) };
    }
}

export async function sendInstallmentWebhook(reservationId: string, amountPaid: number, installmentsCount: number = 1) {
    const installmentWebhookUrl = "https://n8n-n8n.yszha2.easypanel.host/webhook/85da35c7-7d03-4564-94d1-5eeb88414b95";

    const reservation = await prisma.reservation.findUnique({
        where: { id: reservationId },
        include: { lot: true }
    });

    if (!reservation || !reservation.lot) {
        return { success: false, error: 'Reservation or Lot not found' };
    }

    const totalCuotas = reservation.lot.cuotas || 0;
    const paidCuotas = reservation.installments_paid || 0;
    const remainingCuotas = Math.max(0, totalCuotas - paidCuotas); // Note: Current state in DB
    const valorCuota = reservation.lot.valor_cuota || 0;

    const payload = {
        monto_pagado: amountPaid,
        cantidad_cuotas_pagadas: installmentsCount,
        valor_cuota: valorCuota,
        cuotas_restantes: remainingCuotas,
        link_gestion_terreno: `${baseUrl}/user/plots`,
        // Context info
        contact_name: reservation.name,
        contact_email: reservation.email,
        lot_number: reservation.lot.number,
        reservation_id: reservationId
    };

    try {
        const res = await fetch(installmentWebhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            console.error(`[Webhook] Installment Webhook failed: ${res.status}`);
            return { success: false, status: res.status };
        }

        console.log(`[Webhook] Installment Webhook sent successfully`);
        return { success: true };
    } catch (e) {
        console.error(`[Webhook] Failed to trigger installment webhook`, e);
        return { success: false, error: String(e) };
    }
}
