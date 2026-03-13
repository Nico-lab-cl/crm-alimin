
type CacheEntry<T> = {
    data: T;
    expiry: number;
};

class MemoryCache {
    private static instance: MemoryCache;
    private cache: Map<string, CacheEntry<any>>;

    private constructor() {
        this.cache = new Map();
    }

    public static getInstance(): MemoryCache {
        if (!MemoryCache.instance) {
            MemoryCache.instance = new MemoryCache();
        }
        return MemoryCache.instance;
    }

    public set<T>(key: string, data: T, ttlSeconds: number = 300): void {
        const expiry = Date.now() + ttlSeconds * 1000;
        this.cache.set(key, { data, expiry });
    }

    public get<T>(key: string): T | null {
        const entry = this.cache.get(key);
        if (!entry) return null;

        if (Date.now() > entry.expiry) {
            this.cache.delete(key);
            return null;
        }

        return entry.data;
    }

    public delete(key: string): void {
        this.cache.delete(key);
    }

    public deleteByPrefix(prefix: string): void {
        for (const key of this.cache.keys()) {
            if (key.startsWith(prefix)) {
                this.cache.delete(key);
            }
        }
    }

    public clear(): void {
        this.cache.clear();
    }
}

export const memoryCache = MemoryCache.getInstance();
