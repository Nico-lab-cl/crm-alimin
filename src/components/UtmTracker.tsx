'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function UtmTrackerInner() {
    const searchParams = useSearchParams();

    useEffect(() => {
        if (!searchParams) return;

        const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
        let hasUtms = false;
        const utmData: Record<string, string> = {};

        utmKeys.forEach(key => {
            if (searchParams.has(key)) {
                hasUtms = true;
                utmData[key] = searchParams.get(key) || '';
            }
        });

        // If new UTMs are found in the URL, overwrite the session storage
        if (hasUtms) {
            // Also grab fbclid or gclid if present, though we primarily care about standard UTMs here
            if (searchParams.has('fbclid')) utmData['fbclid'] = searchParams.get('fbclid') || '';
            if (searchParams.has('gclid')) utmData['gclid'] = searchParams.get('gclid') || '';

            sessionStorage.setItem('lomas_utm_data', JSON.stringify(utmData));
            console.log('✅ URL UTM parameters captured:', utmData);
        } else {
            // No URL parameters. Let's check if we already have session data.
            const existingUtm = sessionStorage.getItem('lomas_utm_data');

            // Only set a fallback source if there is absolutely no previous tracking data in this entire session
            if (!existingUtm) {
                const referrer = document.referrer.toLowerCase();
                const fallbackData: Record<string, string> = {};

                if (referrer) {
                    if (referrer.includes('google.com') || referrer.includes('bing.com') || referrer.includes('yahoo.com')) {
                        fallbackData['utm_source'] = 'organic_search';
                        fallbackData['utm_medium'] = 'organic';
                    } else if (referrer.includes('instagram.com') || referrer.includes('facebook.com') || referrer.includes('t.co') || referrer.includes('linkedin.com')) {
                        fallbackData['utm_source'] = 'organic_social';
                        fallbackData['utm_medium'] = 'social';
                    } else if (referrer.includes('mail.') || referrer.includes('outlook.') || referrer.includes('gmail.')) {
                        fallbackData['utm_source'] = 'email';
                        fallbackData['utm_medium'] = 'email';
                    } else {
                        // Came from another random website
                        try {
                            const refUrl = new URL(referrer);
                            fallbackData['utm_source'] = refUrl.hostname.replace('www.', '');
                            fallbackData['utm_medium'] = 'referral';
                        } catch (e) {
                            fallbackData['utm_source'] = 'unknown_referral';
                            fallbackData['utm_medium'] = 'referral';
                        }
                    }
                } else {
                    // No referrer at all. User typed the URL manually or used a bookmark.
                    fallbackData['utm_source'] = 'direct';
                    fallbackData['utm_medium'] = 'none';
                }

                sessionStorage.setItem('lomas_utm_data', JSON.stringify(fallbackData));
                console.log('🌱 Organic/Direct tracking applied:', fallbackData);
            }
        }
    }, [searchParams]);

    return null;
}

export function UtmTracker() {
    return (
        <Suspense fallback={null}>
            <UtmTrackerInner />
        </Suspense>
    );
}
