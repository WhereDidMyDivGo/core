/**
 * Intelligent caching system to avoid recalculating static results
 */
export declare class CacheManager {
    private _cache;
    private _maxSize;
    private _accessCount;
    constructor(maxSize?: number);
    /**
     * Get cached value if available and not expired
     */
    get(key: string): any | undefined;
    /**
     * Set cached value with optional expiration
     */
    set(key: string, value: any, ttlMs?: number): void;
    /**
     * Check if key exists in cache
     */
    has(key: string): boolean;
    /**
     * Delete specific cache entry
     */
    delete(key: string): void;
    /**
     * Clear all cache entries
     */
    clear(): void;
    /**
     * Generate cache key for expression with dependencies
     */
    generateKey(expression: string, dependencies: Record<string, any>): string;
    /**
     * Get cache statistics
     */
    getStats(): CacheStats;
    /**
     * Evict least recently used items
     */
    private _evictLRU;
    /**
     * Calculate cache hit rate
     */
    private _calculateHitRate;
    /**
     * Estimate memory usage of cache
     */
    private _estimateMemoryUsage;
    /**
     * Estimate size of a value in bytes
     */
    private _estimateValueSize;
    /**
     * Hash a string value
     */
    private _hashString;
    /**
     * Hash any value
     */
    private _hashValue;
}
interface CacheStats {
    size: number;
    maxSize: number;
    hitRate: number;
    memoryUsage: number;
}
export {};
//# sourceMappingURL=CacheManager.d.ts.map