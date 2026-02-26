import { NextResponse } from 'next/server';
import { sendMetaCAPIEvent } from '@/lib/metaCAPI';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await sendMetaCAPIEvent({
            eventName: 'ViewContent',
            eventId: `test_${Date.now()}`,
            actionSource: 'website',
            userData: {
                client_ip_address: '190.160.0.1',
                client_user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            customData: {
                currency: 'CLP',
                value: 999000,
                content_name: 'PRUEBA_DIRECTA_SERVIDOR'
            }
        });

        return NextResponse.json({ success: true, message: 'Evento de prueba enviado a Meta por el Backend. Si tu código TEST68872 está activo, debería aparecer en Meta ahora mismo.' });
    } catch (e) {
        return NextResponse.json({ success: false, error: String(e) });
    }
}
