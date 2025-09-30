/**
 * Intelligent caching system to avoid recalculating static results
 */
export class CacheManager {
  private _cache = new Map<string, CacheEntry>();
  private _maxSize: number;
  private _accessCount = new Map<string, number>();

  constructor(maxSize: number = 1000) {
    this._maxSize = maxSize;
  }

  /**
   * Get cached value if available and not expired
   */
  get(key: string): any | undefined {
    const entry = this._cache.get(key);
    if (!entry) return undefined;

    // Check if expired
    if (entry.expiresAt && Date.now() > entry.expiresAt) {
      this._cache.delete(key);
      this._accessCount.delete(key);
      return undefined;
    }

    // Update access count
    this._accessCount.set(key, (this._accessCount.get(key) || 0) + 1);

    return entry.value;
  }

  /**
   * Set cached value with optional expiration
   */
  set(key: string, value: any, ttlMs?: number): void {
    // Ensure cache doesn't exceed max size
    if (this._cache.size >= this._maxSize) {
      this._evictLRU();
    }

    const entry: CacheEntry = {
      value,
      createdAt: Date.now(),
      expiresAt: ttlMs ? Date.now() + ttlMs : undefined,
    };

    this._cache.set(key, entry);
    this._accessCount.set(key, 1);
  }

  /**
   * Check if key exists in cache
   */
  has(key: string): boolean {
    return this._cache.has(key) && this.get(key) !== undefined;
  }

  /**
   * Delete specific cache entry
   */
  delete(key: string): void {
    this._cache.delete(key);
    this._accessCount.delete(key);
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this._cache.clear();
    this._accessCount.clear();
  }

  /**
   * Generate cache key for expression with dependencies
   */
  generateKey(expression: string, dependencies: Record<string, any>): string {
    const depString = Object.entries(dependencies)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}:${this._hashValue(value)}`)
      .join("|");

    return `${this._hashString(expression)}#${this._hashString(depString)}`;
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    return {
      size: this._cache.size,
      maxSize: this._maxSize,
      hitRate: this._calculateHitRate(),
      memoryUsage: this._estimateMemoryUsage(),
    };
  }

  /**
   * Evict least recently used items
   */
  private _evictLRU(): void {
    // Find least accessed item
    let minAccess = Infinity;
    let lruKey = "";

    for (const [key, accessCount] of this._accessCount) {
      if (accessCount < minAccess) {
        minAccess = accessCount;
        lruKey = key;
      }
    }

    if (lruKey) {
      this.delete(lruKey);
    }
  }

  /**
   * Calculate cache hit rate
   */
  private _calculateHitRate(): number {
    const totalAccess = Array.from(this._accessCount.values()).reduce((sum, count) => sum + count, 0);
    const uniqueKeys = this._accessCount.size;

    if (totalAccess === 0) return 0;
    return (totalAccess - uniqueKeys) / totalAccess;
  }

  /**
   * Estimate memory usage of cache
   */
  private _estimateMemoryUsage(): number {
    let totalSize = 0;

    for (const [key, entry] of this._cache) {
      totalSize += key.length * 2; // Assuming 2 bytes per character
      totalSize += this._estimateValueSize(entry.value);
      totalSize += 24; // Overhead for CacheEntry object
    }

    return totalSize;
  }

  /**
   * Estimate size of a value in bytes
   */
  private _estimateValueSize(value: any): number {
    if (typeof value === "string") {
      return value.length * 2;
    } else if (typeof value === "number") {
      return 8;
    } else if (typeof value === "boolean") {
      return 1;
    } else if (Array.isArray(value)) {
      return value.reduce((sum: number, item: any) => sum + this._estimateValueSize(item), 0);
    } else if (typeof value === "object" && value !== null) {
      return Object.values(value).reduce((sum: number, item: any) => sum + this._estimateValueSize(item), 0);
    }
    return 0;
  }

  /**
   * Hash a string value
   */
  private _hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(16);
  }

  /**
   * Hash any value
   */
  private _hashValue(value: any): string {
    if (typeof value === "string") {
      return this._hashString(value);
    } else if (typeof value === "number") {
      return value.toString();
    } else if (typeof value === "boolean") {
      return value ? "1" : "0";
    } else {
      return this._hashString(JSON.stringify(value));
    }
  }
}

interface CacheEntry {
  value: any;
  createdAt: number;
  expiresAt?: number;
}

interface CacheStats {
  size: number;
  maxSize: number;
  hitRate: number;
  memoryUsage: number;
}
