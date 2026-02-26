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
            console.log('✅ UTM parameters captured and stored in session:', utmData);
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
