
import { prisma } from '@/lib/prisma';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://aliminlomasdelmar.com';

export async function sendPieWebhook(reservationId: string, amountPaid: number) {
    const pieWebhookUrl = "https://n8n.aliminlomasdelmar.com/webhook/97088a1c-742f-4d8b-a98f-d7aa29452c30";

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

        // Trigger Meta CAPI Offline Conversion (Pie)
        try {
            const { sendMetaCAPIEvent, prepareCAPIUserData } = await import('./metaCAPI');
            const userData = prepareCAPIUserData(
                reservation.email,
                reservation.phone,
                reservation.name
            );

            await sendMetaCAPIEvent({
                eventName: 'Purchase', // Using standard Purchase for ROAS as requested by user
                eventId: `pie_${reservationId}_${Date.now()}`,
                actionSource: 'system_generated',
                userData,
                customData: {
                    currency: 'CLP',
                    value: amountPaid,
                    content_category: 'Pago Pie',
                    content_ids: reservation.lot?.id ? [reservation.lot.id.toString()] : undefined,
                    content_name: reservation.lot ? `Pago Pie Lote ${reservation.lot.number}` : 'Pago Pie',
                    order_id: `pie_${reservationId}`
                }
            });
        } catch (metaErr) {
            console.error("[Meta CAPI Error] Failed in sendPieWebhook", metaErr);
        }

        return { success: true, message: "Webhook accepted by N8N" };
    } catch (e) {
        console.error(`[Webhook] Failed to trigger pie webhook`, e);
        return { success: false, error: String(e) };
    }
}

export async function sendInstallmentWebhook(reservationId: string, amountPaid: number, installmentsCount: number = 1) {
    const installmentWebhookUrl = "https://n8n.aliminlomasdelmar.com/webhook/85da35c7-7d03-4564-94d1-5eeb88414b95";

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

        // Trigger Meta CAPI Offline Conversion (Installment)
        try {
            const { sendMetaCAPIEvent, prepareCAPIUserData } = await import('./metaCAPI');
            const userData = prepareCAPIUserData(
                reservation.email,
                reservation.phone,
                reservation.name
            );

            await sendMetaCAPIEvent({
                eventName: 'Purchase', // Using standard Purchase for LTV ROAS calculation
                eventId: `cuota_${reservationId}_${Date.now()}`,
                actionSource: 'system_generated',
                userData,
                customData: {
                    currency: 'CLP',
                    value: amountPaid,
                    content_category: 'Pago Cuota',
                    content_ids: reservation.lot?.id ? [reservation.lot.id.toString()] : undefined,
                    content_name: reservation.lot ? `Pago de ${installmentsCount} Cuota(s) Lote ${reservation.lot.number}` : 'Pago Cuota',
                    order_id: `cuota_${reservationId}_x${installmentsCount}`
                }
            });
        } catch (metaErr) {
            console.error("[Meta CAPI Error] Failed in sendInstallmentWebhook", metaErr);
        }

        return { success: true };
    } catch (e) {
        console.error(`[Webhook] Failed to trigger installment webhook`, e);
        return { success: false, error: String(e) };
    }
}

export async function sendContractSignedWebhook(reservationId: string) {
    const webhookUrl = "https://n8n.aliminlomasdelmar.com/webhook/dd409dcd-adb6-4b8a-9d8a-6734156c7f08";

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
        pipeline_stage: "PIE_POR_PAGAR"
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

        return { success: true };
    } catch (e) {
        console.error(`[Webhook] Failed to trigger contract signed webhook`, e);
        return { success: false, error: String(e) };
    }
}

export async function sendPaymentReceiptWebhook(receiptId: string) {
    const webhookUrl = "https://n8n.aliminlomasdelmar.com/webhook/a5ec08cd-b2cc-497b-b384-5f1712a3219f"; // Reemplazar con URL real

    const receipt = await prisma.paymentReceipt.findUnique({
        where: { id: receiptId },
        include: {
            reservation: {
                include: { lot: true }
            },
            lot: true
        }
    });

    if (!receipt || !receipt.reservation || !receipt.lot) {
        return { success: false, error: 'Receipt, Reservation, or Lot not found' };
    }

    const { reservation, lot } = receipt;
    const isCuotas = receipt.scope === 'INSTALLMENT';
    const itemName = isCuotas
        ? `Pago de ${receipt.installments_count} Cuota(s)`
        : receipt.scope === 'PIE'
            ? 'Pago de Pie'
            : 'Pago de Reserva';

    const payload = {
        // Receipt info
        receipt_id: receipt.id.split('-')[0].toUpperCase(),
        amount_paid: receipt.amount_clp,
        concept: itemName,
        date: receipt.processed_at?.toISOString() || new Date().toISOString(),

        // Client info
        client_name: reservation.name,
        client_email: reservation.email,

        // Lot info
        lot_number: lot.number,

        // PDFs handling links
        receipt_pdf_url: `${baseUrl}/api/receipt/${receipt.id}/pdf`,
        dashboard_url: `${baseUrl}/user/documents`,
    };

    try {
        const res = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            console.error(`[Webhook] Receipt Webhook failed: ${res.status}`);
            return { success: false, status: res.status };
        }

        console.log(`[Webhook] Receipt Email Webhook sent successfully`);
        return { success: true };
    } catch (e) {
        console.error(`[Webhook] Failed to trigger receipt email webhook`, e);
        return { success: false, error: String(e) };
    }
}
export async function sendMoraWebhook(payload: {
    reservation_id: string;
    contact_name: string;
    contact_email: string;
    lot_number: string;
    lot_stage: number;
    cuota_numero: number;
    monto_cuota: number;
    interes_mora: number;
    total_a_pagar: number;
    dias_atraso: number;
    link_gestion_terreno: string;
    is_pre_mora?: boolean;
}) {
    const moraWebhookUrl = "https://n8n.aliminlomasdelmar.com/webhook/89c6e0f1-2e6d-4a21-9211-92fe1d1d2ba5";

    try {
        const res = await fetch(moraWebhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            console.error(`[Webhook] Mora Webhook failed: ${res.status}`);
            return { success: false, status: res.status };
        }

        console.log(`[Webhook] Mora Webhook sent successfully for Reservation ${payload.reservation_id}`);
        return { success: true };
    } catch (e) {
        console.error(`[Webhook] Failed to trigger mora webhook`, e);
        return { success: false, error: String(e) };
    }
}
