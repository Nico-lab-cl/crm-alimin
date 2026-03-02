import { NextResponse } from 'next/server';
import { sendMetaCAPIEvent, prepareCAPIUserData } from '@/lib/metaCAPI';
import { hashData, normalizeAndHashPhone } from '@/lib/metaTracking';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { eventName, eventId, customData, userData, testEventCode } = body;

        if (!eventName) {
            return NextResponse.json({ error: "eventName is required" }, { status: 400 });
        }

        // Extract connection data from headers if not provided by client
        const ipMatch = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || '127.0.0.1';
        const uaMatch = req.headers.get('user-agent') || 'Mozilla/5.0 (Unknown; Node.js)';

        // Extract cookies from headers if fbp/fbc are missing
        const cookiesHeader = req.headers.get('cookie') || '';
        const fbpMatch = cookiesHeader.match(/_fbp=([^;]+)/);
        const fbcMatch = cookiesHeader.match(/_fbc=([^;]+)/);

        const fbp = userData?.fbp || (fbpMatch ? fbpMatch[1] : undefined);
        const fbc = userData?.fbc || (fbcMatch ? fbcMatch[1] : undefined);

        // We prepare the base user data. We assume the client sends plain text email/phone/name 
        // to be hashed securely on the server, or they are already omitted if unknown.
        const cUserData = prepareCAPIUserData(
            userData?.email,
            userData?.phone,
            userData?.name,
            ipMatch,
            uaMatch,
            fbp,
            fbc
        );

        // Forward to Meta
        const result = await sendMetaCAPIEvent({
            eventName,
            eventId, // Deduplication ID
            actionSource: 'website',
            userData: cUserData,
            customData,
            testEventCode // Allow passing test code from frontend if needed
        });

        return NextResponse.json({ success: true, result });
    } catch (error) {
        console.error("[Meta Track Endpoint] Error processing event:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
