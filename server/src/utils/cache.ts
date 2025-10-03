import Redis from 'ioredis';
import { logger } from './logger';

// Redis client configuration
const redisConfig = {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD || undefined,
    maxRetriesPerRequest: 0, // Don't retry failed requests
    enableReadyCheck: true,
    maxLoadingTimeout: 1000,
    lazyConnect: true,
    connectTimeout: 5000,
    // Disable automatic reconnection to prevent log spam
    retryDelayOnFailover: 0,
    retryDelayOnClusterDown: 0,
    enableAutoPipelining: false,
};

// Create Redis client instance
export const redisClient = new Redis(redisConfig);

// Track connection status to prevent spam
let isRedisConnected = false;
let connectionAttempted = false;

// Redis event handlers with connection status tracking
redisClient.on('connect', () => {
    if (!connectionAttempted) {
        logger.info('Redis client connecting...');
        connectionAttempted = true;
    }
});

redisClient.on('ready', () => {
    isRedisConnected = true;
    logger.info('✅ Redis client connected and ready');
});

redisClient.on('error', (err) => {
    if (isRedisConnected || !connectionAttempted) {
        logger.error('Redis client error:', err.message);
    }
    isRedisConnected = false;

    // Disconnect to prevent reconnection attempts
    if ((err as any)?.code === 'ECONNREFUSED' && connectionAttempted) {
        setTimeout(() => {
            redisClient.disconnect(false);
        }, 100);
    }
});

redisClient.on('close', () => {
    if (isRedisConnected) {
        logger.warn('Redis client connection closed');
    }
    isRedisConnected = false;
});

// Remove reconnecting event listener to prevent spam
// redisClient.on('reconnecting', () => {
//   logger.info('Redis client reconnecting...');
// });

// Cache key prefixes
export const CACHE_KEYS = {
    PUBLIC_BLOGS: 'public_blogs',
    BLOG_BY_ID: 'blog_id',
    BLOG_BY_SLUG: 'blog_slug',
    BLOG_PAGINATION: 'blog_pagination',
    LOCK_PREFIX: 'lock',
} as const;

// Cache TTL (Time To Live) in seconds
export const CACHE_TTL = {
    PUBLIC_BLOGS: 300, // 5 minutes
    SINGLE_BLOG: 600, // 10 minutes
    PAGINATION: 180, // 3 minutes
    LOCK_TTL: 30, // 30 seconds for locks
} as const;

// Cache key generation functions
export const generateCacheKey = {
    publicBlogs: (page?: number, limit?: number, sortBy?: string, sortOrder?: string, search?: string) => {
        const params = [page, limit, sortBy, sortOrder, search].filter(Boolean).join(':');
        return `${CACHE_KEYS.PUBLIC_BLOGS}:${params || 'default'}`;
    },

    blogById: (id: number) => `${CACHE_KEYS.BLOG_BY_ID}:${id}`,

    blogBySlug: (slug: string) => `${CACHE_KEYS.BLOG_BY_SLUG}:${slug}`,

    blogPagination: (visible?: number, page?: number, limit?: number, sortBy?: string, sortOrder?: string) => {
        const params = [visible, page, limit, sortBy, sortOrder].filter(v => v !== undefined).join(':');
        return `${CACHE_KEYS.BLOG_PAGINATION}:${params || 'default'}`;
    },

    lock: (key: string) => `${CACHE_KEYS.LOCK_PREFIX}:${key}`,
};

// Cache stampede prevention using distributed locks
class CacheManager {
    private static instance: CacheManager;

    private constructor() { }

    public static getInstance(): CacheManager {
        if (!CacheManager.instance) {
            CacheManager.instance = new CacheManager();
        }
        return CacheManager.instance;
    }

    /**
     * Acquire a distributed lock to prevent cache stampede
     */
    async acquireLock(lockKey: string, ttl: number = CACHE_TTL.LOCK_TTL, maxWaitTime: number = 5000): Promise<string | null> {
        const lockToken = `${Date.now()}-${Math.random()}`;
        const fullLockKey = generateCacheKey.lock(lockKey);
        const startTime = Date.now();

        while (Date.now() - startTime < maxWaitTime) {
            try {
                const result = await redisClient.set(fullLockKey, lockToken, 'EX', ttl, 'NX');

                if (result === 'OK') {
                    logger.debug(`Lock acquired: ${fullLockKey} with token: ${lockToken}`);
                    return lockToken;
                }

                await new Promise(resolve => setTimeout(resolve, 10 + Math.random() * 20));
            } catch (error) {
                logger.error(`Error acquiring lock ${fullLockKey}:`, error);
                break;
            }
        }

        logger.debug(`Failed to acquire lock: ${fullLockKey}`);
        return null;
    }

    /**
     * Release a distributed lock
     */
    async releaseLock(lockKey: string, lockToken: string): Promise<boolean> {
        const fullLockKey = generateCacheKey.lock(lockKey);

        try {
            const luaScript = `
        if redis.call("get", KEYS[1]) == ARGV[1] then
          return redis.call("del", KEYS[1])
        else
          return 0
        end
      `;

            const result = await redisClient.eval(luaScript, 1, fullLockKey, lockToken);
            const released = result === 1;

            if (released) {
                logger.debug(`Lock released: ${fullLockKey}`);
            } else {
                logger.debug(`Lock not released (token mismatch or expired): ${fullLockKey}`);
            }

            return released;
        } catch (error) {
            logger.error(`Error releasing lock ${fullLockKey}:`, error);
            return false;
        }
    }

    /**
     * Get cached data with cache stampede prevention
     */
    async getWithLock<T>(
        cacheKey: string,
        fetchFunction: () => Promise<T>,
        ttl: number,
        lockTtl: number = CACHE_TTL.LOCK_TTL
    ): Promise<T> {
        try {
            // Check if Redis is connected before attempting cache operations
            const isConnected = await this.isConnected();
            if (!isConnected) {
                logger.debug(`Redis not connected, bypassing cache for: ${cacheKey}`);
                return await fetchFunction();
            }

            // First, try to get from cache
            const cachedData = await redisClient.get(cacheKey);

            if (cachedData) {
                logger.debug(`Cache hit: ${cacheKey}`);
                return JSON.parse(cachedData);
            }

            logger.debug(`Cache miss: ${cacheKey}`);

            // Cache miss - try to acquire lock to prevent cache stampede
            const lockKey = `fetch:${cacheKey}`;
            const lockToken = await this.acquireLock(lockKey, lockTtl);

            if (lockToken) {
                try {
                    // Double-check cache after acquiring lock
                    const secondCheck = await redisClient.get(cacheKey);
                    if (secondCheck) {
                        logger.debug(`Cache populated by another thread: ${cacheKey}`);
                        return JSON.parse(secondCheck);
                    }

                    // Fetch data from source
                    logger.debug(`Fetching data for cache: ${cacheKey}`);
                    const data = await fetchFunction();

                    // Store in cache
                    await redisClient.setex(cacheKey, ttl, JSON.stringify(data));
                    logger.debug(`Data cached: ${cacheKey}`);

                    return data;
                } finally {
                    await this.releaseLock(lockKey, lockToken);
                }
            } else {
                // Could not acquire lock - wait and retry or fallback
                logger.debug(`Could not acquire lock for ${cacheKey}, waiting and retrying...`);

                await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));

                const retryCache = await redisClient.get(cacheKey);
                if (retryCache) {
                    logger.debug(`Cache populated during wait: ${cacheKey}`);
                    return JSON.parse(retryCache);
                }

                // Fallback to direct fetch
                logger.debug(`Fallback direct fetch for: ${cacheKey}`);
                return await fetchFunction();
            }
        } catch (error) {
            logger.error(`Cache operation failed for ${cacheKey}:`, error);
            return await fetchFunction();
        }
    }

    /**
     * Set cache data
     */
    async set<T>(cacheKey: string, data: T, ttl: number): Promise<boolean> {
        try {
            await redisClient.setex(cacheKey, ttl, JSON.stringify(data));
            logger.debug(`Data cached: ${cacheKey}`);
            return true;
        } catch (error) {
            logger.error(`Failed to cache data for ${cacheKey}:`, error);
            return false;
        }
    }

    /**
     * Get cache data
     */
    async get<T>(cacheKey: string): Promise<T | null> {
        try {
            const cachedData = await redisClient.get(cacheKey);
            if (cachedData) {
                return JSON.parse(cachedData);
            }
            return null;
        } catch (error) {
            logger.error(`Failed to get cached data for ${cacheKey}:`, error);
            return null;
        }
    }

    /**
     * Delete cache data
     */
    async delete(cacheKey: string): Promise<boolean> {
        try {
            const result = await redisClient.del(cacheKey);
            logger.debug(`Cache deleted: ${cacheKey}`);
            return result > 0;
        } catch (error) {
            logger.error(`Failed to delete cache for ${cacheKey}:`, error);
            return false;
        }
    }

    /**
     * Delete multiple cache keys matching a pattern
     */
    async deletePattern(pattern: string): Promise<number> {
        try {
            const keys = await redisClient.keys(pattern);
            if (keys.length > 0) {
                const result = await redisClient.del(...keys);
                logger.debug(`Deleted ${result} cache keys matching pattern: ${pattern}`);
                return result;
            }
            return 0;
        } catch (error) {
            logger.error(`Failed to delete cache pattern ${pattern}:`, error);
            return 0;
        }
    }

    /**
     * Invalidate all blog-related caches
     */
    async invalidateBlogCaches(): Promise<void> {
        try {
            const patterns = [
                `${CACHE_KEYS.PUBLIC_BLOGS}:*`,
                `${CACHE_KEYS.BLOG_PAGINATION}:*`,
                `${CACHE_KEYS.BLOG_BY_ID}:*`,
                `${CACHE_KEYS.BLOG_BY_SLUG}:*`,
            ];

            let totalDeleted = 0;
            for (const pattern of patterns) {
                const deleted = await this.deletePattern(pattern);
                totalDeleted += deleted;
            }

            logger.info(`Blog cache invalidation complete. Deleted ${totalDeleted} cache entries.`);
        } catch (error) {
            logger.error('Failed to invalidate blog caches:', error);
        }
    }

    /**
     * Check if Redis is connected
     */
    async isConnected(): Promise<boolean> {
        try {
            if (!isRedisConnected) {
                return false;
            }
            const result = await redisClient.ping();
            return result === 'PONG';
        } catch (error) {
            isRedisConnected = false;
            return false;
        }
    }

    /**
     * Safely disconnect Redis and prevent reconnection
     */
    async safeDisconnect(): Promise<void> {
        try {
            isRedisConnected = false;
            await redisClient.disconnect(false);
            logger.info('Redis client safely disconnected');
        } catch (error) {
            logger.debug('Redis disconnect error (non-critical):', error);
        }
    }    /**
     * Get Redis connection status and stats
     */
    async getStatus(): Promise<{
        connected: boolean;
        mode: string;
        memory?: string;
        keyCount?: number;
    }> {
        try {
            const connected = await this.isConnected();

            if (!connected) {
                return { connected: false, mode: 'disconnected' };
            }

            const info = await redisClient.info('memory');
            const dbSize = await redisClient.dbsize();

            const memoryMatch = info.match(/used_memory_human:([^\r\n]+)/);
            const memory = memoryMatch ? memoryMatch[1] : 'unknown';

            return {
                connected: true,
                mode: redisClient.status,
                memory,
                keyCount: dbSize,
            };
        } catch (error) {
            logger.error('Failed to get Redis status:', error);
            return { connected: false, mode: 'error' };
        }
    }
}

// Export singleton instance
export const cacheManager = CacheManager.getInstance();

// Graceful shutdown
process.on('SIGTERM', async () => {
    logger.info('Shutting down Redis connection...');
    await redisClient.quit();
});

process.on('SIGINT', async () => {
    logger.info('Shutting down Redis connection...');
    await redisClient.quit();
});