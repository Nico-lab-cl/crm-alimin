import crypto from 'crypto';

// --------------------------------------------------------
// META CAPI UTILITIES
// --------------------------------------------------------

/**
 * Generates a unique event ID for deduplication between Pixel and CAPI.
 * Safe for both client and server.
 */
export const generateEventId = (prefix: string = 'evt') => {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 10);
    return `${prefix}_${timestamp}_${randomStr}`;
};

/**
 * Hashes a string using SHA256 as required by Meta.
 * Safe for BOTH client (Web Crypto API or simple fallback) and server (Node runtime).
 * We imported crypto-js earlier, let's just use it instead of native node crypto buffer to support Edge/Browser.
 */
import CryptoJS from 'crypto-js';

export const hashData = (data: string | null | undefined): string | undefined => {
    if (!data) return undefined;

    // Clean string as per Meta guidelines: lowercase, no leading/trailing spaces
    const cleanedText = data.trim().toLowerCase();

    // Return SHA256 hash using crypto-js (works in browser and Edge runtime)
    return CryptoJS.SHA256(cleanedText).toString(CryptoJS.enc.Hex);
};

// Phone normalizer to ensure "+569..." becomes "569..." for Meta
export const normalizeAndHashPhone = (phone: string | null | undefined): string | undefined => {
    if (!phone) return undefined;

    // Remove all non-numeric characters (except plus sign initially to check country code)
    let cleanedPhone = phone.replace(/[\s\-\(\)]/g, '');

    // If it starts with a plus, remove it
    if (cleanedPhone.startsWith('+')) {
        cleanedPhone = cleanedPhone.substring(1);
    }

    // If it's a chilean number missing the country code (Meta expects country code)
    // E.g., '987654321' -> '56987654321'
    if (cleanedPhone.length === 9 && cleanedPhone.startsWith('9')) {
        cleanedPhone = '56' + cleanedPhone;
    }

    return hashData(cleanedPhone);
};

/**
 * Push an event to the frontend Meta Pixel.
 * @param eventName Standard Meta event name (e.g., 'InitiateCheckout', 'Purchase')
 * @param data Event data payload
 * @param eventId Optional deduplication ID
 */
export const trackPixelEvent = (
    eventName: string,
    data: any = {},
    eventId?: string
) => {
    // Check if window and fbq exist (running in browser)
    if (typeof window !== 'undefined' && (window as any).fbq) {
        if (eventId) {
            (window as any).fbq('track', eventName, data, { eventID: eventId });
        } else {
            (window as any).fbq('track', eventName, data);
        }
        console.log(`[Meta Pixel] Tracked ${eventName}`, data, eventId ? `(ID: ${eventId})` : '');
    }
};

// --------------------------------------------------------
// META CAPI MATCH QUALITY HELPERS (Caching)
// --------------------------------------------------------

export interface CachedMetaUserData {
    name?: string;
    email?: string;
    phone?: string;
    city?: string;
    state?: string;
}

const META_CACHE_KEY = 'lomas_meta_user_data';

export const cacheUserData = (
    name?: string,
    email?: string,
    phone?: string,
    city?: string,
    state?: string
) => {
    if (typeof window === 'undefined') return;

    try {
        const existingData = getCachedUserData() || {};
        const newData = {
            name: name || existingData.name,
            email: email || existingData.email,
            phone: phone || existingData.phone,
            city: city || existingData.city,
            state: state || existingData.state
        };

        localStorage.setItem(META_CACHE_KEY, JSON.stringify(newData));
    } catch (e) {
        console.warn("Failed to cache Meta user data", e);
    }
};

export const getCachedUserData = (): CachedMetaUserData => {
    if (typeof window === 'undefined') return {};

    try {
        const raw = localStorage.getItem(META_CACHE_KEY);
        if (raw) {
            return JSON.parse(raw) as CachedMetaUserData;
        }
    } catch (e) {
        console.warn("Failed to retrieve cached Meta user data", e);
    }
    return {};
};
