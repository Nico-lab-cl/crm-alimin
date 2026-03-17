import prisma, { webPrisma } from "./prisma";

export interface ActivityEvent {
    id: string;
    type: 'web_lead' | 'newsletter' | 'crm_note' | 'crm_call' | 'crm_reservation';
    title: string;
    description: string;
    date: Date;
    source: 'Aliminspa.cl' | 'Lomas del Mar' | 'Meta Ads';
    metadata?: any;
}

export async function getCrossSourceActivities(email: string): Promise<ActivityEvent[]> {
    if (!email) return [];

    const activities: ActivityEvent[] = [];

    try {
        // 1. Check Aliminspa.cl Web Leads
        const webLeads = await webPrisma.leads.findMany({
            where: { email: { equals: email, mode: 'insensitive' } },
            orderBy: { created_at: 'desc' }
        });

        webLeads.forEach(lead => {
            activities.push({
                id: `web-${lead.id}`,
                type: 'web_lead',
                title: 'Registro en Sitio Web',
                description: `Ingresó como lead en Aliminspa.cl desde ${lead.ciudad || 'desconocido'}. Proyecto: ${lead.proyecto || 'General'}`,
                date: lead.created_at || new Date(),
                source: 'Aliminspa.cl',
                metadata: { utm_source: lead.utm_source, utm_campaign: lead.utm_campaign }
            });
        });

        // 2. Check Newsletter
        const newsletter = await webPrisma.newsletter_subscribers.findFirst({
            where: { email: { equals: email, mode: 'insensitive' } }
        });

        if (newsletter) {
            activities.push({
                id: `news-${newsletter.id}`,
                type: 'newsletter',
                title: 'Suscripción al Boletín',
                description: `Se suscribió a las noticias y novedades de Aliminspa.cl. Estado: ${newsletter.active ? 'Activo' : 'Inactivo'}`,
                date: newsletter.created_at || new Date(),
                source: 'Aliminspa.cl'
            });
        }

        // 3. Check Main CRM (Lomas del Mar / Meta)
        const contact = await prisma.contact.findUnique({
            where: { email },
            include: {
                notes: { include: { seller: true } },
                calls: { include: { seller: true } },
                reservations: { include: { lot: true } }
            }
        });

        if (contact) {
            // Notes
            contact.notes.forEach(note => {
                activities.push({
                    id: `note-${note.id}`,
                    type: 'crm_note',
                    title: 'Nota de Seguimiento',
                    description: note.content,
                    date: note.created_at,
                    source: contact.source === 'META' ? 'Meta Ads' : 'Lomas del Mar',
                    metadata: { author: note.seller.name }
                });
            });

            // Calls
            contact.calls.forEach(call => {
                activities.push({
                    id: `call-${call.id}`,
                    type: 'crm_call',
                    title: 'Llamada Registrada',
                    description: call.summary || 'Llamada de seguimiento',
                    date: call.date,
                    source: contact.source === 'META' ? 'Meta Ads' : 'Lomas del Mar',
                    metadata: { author: call.seller.name, duration: call.duration }
                });
            });

            // Reservations
            contact.reservations.forEach(res => {
                activities.push({
                    id: `res-${res.id}`,
                    type: 'crm_reservation',
                    title: 'Reserva de Lote',
                    description: `Reservó el Lote ${res.lot?.number || res.lot_id}. Estado: ${res.status}`,
                    date: res.created_at,
                    source: 'Lomas del Mar'
                });
            });
        }

    } catch (error) {
        console.error("Error fetching cross-source activities:", error);
    }

    // Sort by date descending
    return activities.sort((a, b) => b.date.getTime() - a.date.getTime());
}
