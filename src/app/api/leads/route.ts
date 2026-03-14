import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * Endpoint para recibir leads desde n8n.
 * Espera un JSON con: email, first_name, last_name, phone, source, etc.
 * Requiere el header 'x-crm-api-key'.
 */
export async function POST(request: Request) {
    try {
        const apiKey = request.headers.get("x-crm-api-key");
        const internalApiKey = process.env.CRM_API_KEY;

        if (!internalApiKey || apiKey !== internalApiKey) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await request.json();
        const { 
            email, first_name, last_name, phone, source,
            utm_source, utm_medium, utm_campaign, utm_content, utm_term,
            ad_id, ad_name, adset_id, adset_name, campaign_id, campaign_name,
            form_id, lead_id, page_id
        } = body;

        if (!email) {
            return new NextResponse("Missing email", { status: 400 });
        }

        // Upsert del contacto por email
        const contact = await prisma.contact.upsert({
            where: { email },
            update: {
                first_name: first_name || undefined,
                last_name: last_name || undefined,
                phone: phone || undefined,
                source: source || undefined,
                utm_source: utm_source || undefined,
                utm_medium: utm_medium || undefined,
                utm_campaign: utm_campaign || undefined,
                utm_content: utm_content || undefined,
                utm_term: utm_term || undefined,
                meta_lead_id: lead_id ? String(lead_id) : undefined,
                meta_form_id: form_id ? String(form_id) : undefined,
                meta_ad_id: ad_id ? String(ad_id) : undefined,
                meta_ad_name: ad_name || undefined,
                meta_adset_id: adset_id ? String(adset_id) : undefined,
                meta_adset_name: adset_name || undefined,
                meta_campaign_id: campaign_id ? String(campaign_id) : undefined,
                meta_campaign_name: campaign_name || undefined,
                meta_page_id: page_id ? String(page_id) : undefined,
                updated_at: new Date(),
            },
            create: {
                email,
                first_name: first_name || "",
                last_name: last_name || "",
                phone: phone || "",
                source: source || "META",
                utm_source,
                utm_medium,
                utm_campaign,
                utm_content,
                utm_term,
                meta_lead_id: lead_id ? String(lead_id) : undefined,
                meta_form_id: form_id ? String(form_id) : undefined,
                meta_ad_id: ad_id ? String(ad_id) : undefined,
                meta_ad_name: ad_name || undefined,
                meta_adset_id: adset_id ? String(adset_id) : undefined,
                meta_adset_name: adset_name || undefined,
                meta_campaign_id: campaign_id ? String(campaign_id) : undefined,
                meta_campaign_name: campaign_name || undefined,
                meta_page_id: page_id ? String(page_id) : undefined,
            },
        });

        return NextResponse.json({
            success: true,
            contact_id: contact.id
        });

    } catch (error: any) {
        console.error("[LEADS_POST]", error);
        return NextResponse.json({ 
            success: false, 
            error: error.message || "Internal Server Error" 
        }, { status: 500 });
    }
}
