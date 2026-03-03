'use client';

import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

interface SyncContextType {
    isSyncing: boolean;
    pendingCount: number;
    startSync: () => string;
    endSync: (id: string) => void;
}

const SyncContext = createContext<SyncContextType>({
    isSyncing: false,
    pendingCount: 0,
    startSync: () => '',
    endSync: () => { },
});

export function useSyncStatus() {
    return useContext(SyncContext);
}

export function SyncProvider({ children }: { children: React.ReactNode }) {
    const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());
    const counterRef = useRef(0);

    const startSync = useCallback(() => {
        const id = `sync_${++counterRef.current}_${Date.now()}`;
        setPendingIds(prev => {
            const next = new Set(prev);
            next.add(id);
            return next;
        });
        return id;
    }, []);

    const endSync = useCallback((id: string) => {
        setPendingIds(prev => {
            const next = new Set(prev);
            next.delete(id);
            return next;
        });
    }, []);

    return (
        <SyncContext.Provider value={{
            isSyncing: pendingIds.size > 0,
            pendingCount: pendingIds.size,
            startSync,
            endSync,
        }}>
            {children}
        </SyncContext.Provider>
    );
}
