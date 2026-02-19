
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
            const text = await res.text();
            console.error(`[Webhook] Failed: ${res.status} ${res.statusText} - ${text}`);
            return { success: false, error: `N8N Error: ${res.status} ${res.statusText} - ${text}` };
        }

        console.log(`[Webhook] Pie Webhook sent successfully for Reservation ${reservationId}`);
        return { success: true, message: "Webhook accepted by N8N" };
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

export async function sendContractSignedWebhook(reservationId: string) {
    const webhookUrl = "https://n8n-n8n.yszha2.easypanel.host/webhook/dd409dcd-adb6-4b8a-9d8a-6734156c7f08";

    const reservation = await prisma.reservation.findUnique({
        where: { id: reservationId },
        include: { lot: true }
    });

    if (!reservation || !reservation.lot) {
        return { success: false, error: 'Reservation or Lot not found' };
    }

    const payload = {
        // Client Data (All fields from form/db)
        nombre_cliente: reservation.name,
        email_cliente: reservation.email,
        telefono_cliente: reservation.phone,
        rut_cliente: reservation.rut,
        direccion_cliente: reservation.address,
        estado_civil: reservation.marital_status,
        profesion: reservation.profession,
        nacionalidad: reservation.nationality,

        // Address Breakout
        calle: reservation.address_street,
        numero: reservation.address_number,
        comuna: reservation.address_commune,
        region: reservation.address_region,

        // Lot Info
        numero_lote: reservation.lot.number,
        etapa_lote: reservation.lot.stage,
        m2_lote: reservation.lot.area_m2,
        precio_lista: reservation.lot.price_total_clp,
        pie_total: reservation.lot.pie,
        valor_cuota: reservation.lot.valor_cuota,
        cantidad_cuotas: reservation.lot.cuotas,

        // Contract Info
        fecha_firma: reservation.signed_at?.toISOString() || new Date().toISOString(),
        url_descarga_contrato: `${baseUrl}/api/contracts/${reservationId}/pdf`,
        dashboard_url: `${baseUrl}/user/plots`,

        // System Info
        reservation_id: reservationId,
        pipeline_stage: "CONTRATO_FIRMADO"
    };

    try {
        const res = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            console.error(`[Webhook] Contract Signed Webhook failed: ${res.status}`);
            return { success: false, status: res.status };
        }

        console.log(`[Webhook] Contract Signed Webhook sent successfully`);
        return { success: true };
    } catch (e) {
        console.error(`[Webhook] Failed to trigger contract signed webhook`, e);
        return { success: false, error: String(e) };
    }
}
