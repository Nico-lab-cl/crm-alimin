import { hashData, normalizeAndHashPhone } from './metaTracking';

// Replace with from environment variables later
// For production, ensure these are in your .env file
const META_ACCESS_TOKEN = process.env.META_ACCESS_TOKEN || "REPLACE_WITH_CAPI_TOKEN";
const META_PIXEL_ID = process.env.META_PIXEL_ID || "124174543556349";

interface CAPIUserData {
    em?: string[]; // Email in SHA256 array
    ph?: string[]; // Phone in SHA256 array
    fn?: string[]; // First name in SHA256 array
    ln?: string[]; // Last name in SHA256 array
    client_ip_address?: string;
    client_user_agent?: string;
    fbp?: string;
    fbc?: string;
}

interface CAPICustomData {
    currency?: string;
    value?: number;
    content_ids?: string[];
    content_type?: string;
    content_name?: string;
    order_id?: string;
    [key: string]: any;
}

interface CAPIEventParams {
    eventName: string;
    eventTime?: number;
    eventId?: string;
    actionSource?: 'website' | 'system_generated' | 'other';
    userData: CAPIUserData;
    customData?: CAPICustomData;
}

/**
 * Send an event to Meta Conversions API (Backend side).
 */
export async function sendMetaCAPIEvent(params: CAPIEventParams) {
    try {
        const payload = {
            test_event_code: 'TEST68872', // Temporary for testing
            data: [
                {
                    event_name: params.eventName,
                    event_time: params.eventTime || Math.floor(Date.now() / 1000),
                    action_source: params.actionSource || 'website',
                    event_id: params.eventId,
                    user_data: params.userData,
                    custom_data: params.customData,
                }
            ]
        };

        const apiUrl = `https://graph.facebook.com/v19.0/${META_PIXEL_ID}/events?access_token=${META_ACCESS_TOKEN}`;

        // Fire and forget, or await if needed
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();
        console.log(`[Meta CAPI] Event ${params.eventName} sent. Result:`, result);
        return result;
    } catch (error) {
        console.error(`[Meta CAPI Error] Failed to send event ${params.eventName}:`, error);
    }
}

/**
 * Helper to prepare user data with hashing for Meta.
 */
export function prepareCAPIUserData(
    email?: string | null,
    phone?: string | null,
    name?: string | null,
    ip?: string | null,
    userAgent?: string | null,
    fbp?: string | null,
    fbc?: string | null
): CAPIUserData {

    const userData: CAPIUserData = {};

    if (email) {
        const hashed = hashData(email);
        if (hashed) userData.em = [hashed];
    }

    if (phone) {
        const hashed = normalizeAndHashPhone(phone);
        if (hashed) userData.ph = [hashed];
    }

    if (name) {
        const parts = name.trim().split(' ');
        const first = parts[0];
        const last = parts.length > 1 ? parts.slice(1).join(' ') : null;

        if (first) {
            const hFirst = hashData(first);
            if (hFirst) userData.fn = [hFirst];
        }
        if (last) {
            const hLast = hashData(last);
            if (hLast) userData.ln = [hLast];
        }
    }

    // Adding connection data
    if (ip) userData.client_ip_address = ip;
    if (userAgent) userData.client_user_agent = userAgent;
    if (fbp) userData.fbp = fbp;
    if (fbc) userData.fbc = fbc;

    return userData;
}
