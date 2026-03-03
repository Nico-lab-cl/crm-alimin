'use client';

import { useSyncStatus } from './SyncProvider';
import { Loader2, Cloud } from 'lucide-react';

export function SyncIndicator() {
    const { isSyncing } = useSyncStatus();

    return (
        <div
            className={`
                fixed top-0 left-0 right-0 z-[100] flex items-center justify-center gap-2
                py-1.5 px-4 text-xs font-medium transition-all duration-300 ease-in-out
                bg-alimin-green/95 backdrop-blur-sm text-white
                md:hidden
                ${isSyncing
                    ? 'translate-y-0 opacity-100'
                    : '-translate-y-full opacity-0 pointer-events-none'
                }
            `}
        >
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>Sincronizando...</span>
            <Cloud className="w-3.5 h-3.5 opacity-60" />
        </div>
    );
}
