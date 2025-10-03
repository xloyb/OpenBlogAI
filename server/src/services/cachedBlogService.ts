import { cacheManager, generateCacheKey, CACHE_TTL } from '@src/utils/cache';
import { logger } from '@src/utils/logger';
import * as blogService from './blogService';

// Interface for cached blog service functions
export interface CachedBlogService {
    getBlogsWithPaginationCached: typeof getBlogsWithPaginationCached;
    getBlogByIdCached: typeof getBlogByIdCached;
    getBlogBySlugCached: typeof getBlogBySlugCached;
    invalidateAllBlogCaches: typeof invalidateAllBlogCaches;
    invalidateBlogCache: typeof invalidateBlogCache;
}

/**
 * Get blogs with pagination (cached version for public blogs only)
 * This function implements cache stampede prevention for high-traffic scenarios
 */
export const getBlogsWithPaginationCached = async (
    options: Parameters<typeof blogService.getBlogsWithPagination>[0] = {}
): Promise<ReturnType<typeof blogService.getBlogsWithPagination>> => {
    const {
        page = 1,
        limit = 10,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        visible
    } = options;

    // Only cache public blogs (visible = 1) to avoid caching private data
    if (visible !== 1) {
        logger.debug('Non-public blog request, bypassing cache');
        return blogService.getBlogsWithPagination(options);
    }

    // Generate cache key
    const cacheKey = generateCacheKey.blogPagination(visible, page, limit, sortBy, sortOrder);

    // Use cache manager with lock-based stampede prevention
    return cacheManager.getWithLock(
        cacheKey,
        async () => {
            logger.debug(`Fetching paginated blogs from database: page=${page}, limit=${limit}, sortBy=${sortBy}, sortOrder=${sortOrder}`);
            return blogService.getBlogsWithPagination(options);
        },
        CACHE_TTL.PAGINATION,
        CACHE_TTL.LOCK_TTL
    );
};

/**
 * Get single blog by ID (cached version for public blogs only)
 */
export const getBlogByIdCached = async (id: number): Promise<ReturnType<typeof blogService.getBlogById>> => {
    const cacheKey = generateCacheKey.blogById(id);

    return cacheManager.getWithLock(
        cacheKey,
        async () => {
            logger.debug(`Fetching blog by ID from database: ${id}`);
            const blog = await blogService.getBlogById(id);

            // Only cache public blogs
            if (blog && blog.visible !== 1) {
                logger.debug(`Blog ${id} is not public, not caching`);
                return blog;
            }

            return blog;
        },
        CACHE_TTL.SINGLE_BLOG,
        CACHE_TTL.LOCK_TTL
    );
};

/**
 * Get single blog by slug (cached version for public blogs only)
 */
export const getBlogBySlugCached = async (slug: string): Promise<ReturnType<typeof blogService.getBlogBySlug>> => {
    const cacheKey = generateCacheKey.blogBySlug(slug);

    return cacheManager.getWithLock(
        cacheKey,
        async () => {
            logger.debug(`Fetching blog by slug from database: ${slug}`);
            const blog = await blogService.getBlogBySlug(slug);

            // Only cache public blogs
            if (blog && blog.visible !== 1) {
                logger.debug(`Blog with slug ${slug} is not public, not caching`);
                return blog;
            }

            return blog;
        },
        CACHE_TTL.SINGLE_BLOG,
        CACHE_TTL.LOCK_TTL
    );
};

/**
 * Invalidate all blog-related caches
 * Called when any blog is created, updated, or deleted
 */
export const invalidateAllBlogCaches = async (): Promise<void> => {
    try {
        logger.info('Invalidating all blog caches...');
        await cacheManager.invalidateBlogCaches();
        logger.info('Blog cache invalidation completed');
    } catch (error) {
        logger.error('Failed to invalidate blog caches:', error);
    }
};

/**
 * Invalidate specific blog caches
 * Called when a specific blog is updated or deleted
 */
export const invalidateBlogCache = async (blogId: number, slug?: string): Promise<void> => {
    try {
        logger.info(`Invalidating cache for blog ${blogId}${slug ? ` (slug: ${slug})` : ''}`);

        const deletePromises: Promise<boolean>[] = [
            cacheManager.delete(generateCacheKey.blogById(blogId))
        ];

        if (slug) {
            deletePromises.push(cacheManager.delete(generateCacheKey.blogBySlug(slug)));
        }

        // Also invalidate all paginated results since they might include this blog
        deletePromises.push(
            cacheManager.deletePattern(`${generateCacheKey.blogPagination()}*`).then(() => true)
        );

        await Promise.all(deletePromises);
        logger.info(`Cache invalidation completed for blog ${blogId}`);
    } catch (error) {
        logger.error(`Failed to invalidate cache for blog ${blogId}:`, error);
    }
};

/**
 * Warm up cache with commonly requested data
 * Can be called during server startup or periodically
 */
export const warmUpCache = async (): Promise<void> => {
    try {
        logger.info('Warming up blog caches...');

        // Warm up first page of public blogs with default sorting
        const commonQueries = [
            { page: 1, limit: 10, sortBy: 'createdAt' as const, sortOrder: 'desc' as const, visible: 1 },
            { page: 1, limit: 20, sortBy: 'createdAt' as const, sortOrder: 'desc' as const, visible: 1 },
            { page: 2, limit: 10, sortBy: 'createdAt' as const, sortOrder: 'desc' as const, visible: 1 },
        ];

        const warmUpPromises = commonQueries.map(async (query) => {
            try {
                await getBlogsWithPaginationCached(query);
                logger.debug(`Cache warmed up for: ${JSON.stringify(query)}`);
            } catch (error) {
                logger.error(`Failed to warm up cache for query ${JSON.stringify(query)}:`, error);
            }
        });

        await Promise.all(warmUpPromises);
        logger.info('Blog cache warm-up completed');
    } catch (error) {
        logger.error('Failed to warm up blog caches:', error);
    }
};

/**
 * Get cache statistics for monitoring
 */
export const getCacheStats = async (): Promise<{
    redisStatus: any;
    blogCacheKeys: number;
    paginationCacheKeys: number;
    singleBlogCacheKeys: number;
}> => {
    try {
        const redisStatus = await cacheManager.getStatus();

        // Count different types of cache keys
        const patterns = [
            `${generateCacheKey.blogPagination()}*`,
            `${generateCacheKey.blogById(0).split(':')[0]}:*`, // Get prefix for blog IDs
            `${generateCacheKey.blogBySlug('').split(':')[0]}:*`, // Get prefix for blog slugs
        ];

        const counts = await Promise.all(
            patterns.map(async (pattern) => {
                try {
                    const keys = await (cacheManager as any).redisClient.keys(pattern);
                    return keys.length;
                } catch (error) {
                    logger.error(`Failed to count keys for pattern ${pattern}:`, error);
                    return 0;
                }
            })
        );

        return {
            redisStatus,
            paginationCacheKeys: counts[0] || 0,
            singleBlogCacheKeys: (counts[1] || 0) + (counts[2] || 0),
            blogCacheKeys: counts.reduce((a: number, b: number) => a + b, 0),
        };
    } catch (error) {
        logger.error('Failed to get cache stats:', error);
        return {
            redisStatus: { connected: false, mode: 'error' },
            blogCacheKeys: 0,
            paginationCacheKeys: 0,
            singleBlogCacheKeys: 0,
        };
    }
};

/**
 * Health check for cache system
 */
export const cacheHealthCheck = async (): Promise<{
    healthy: boolean;
    redisConnected: boolean;
    canReadWrite: boolean;
    error?: string;
}> => {
    try {
        const redisConnected = await cacheManager.isConnected();

        if (!redisConnected) {
            return {
                healthy: false,
                redisConnected: false,
                canReadWrite: false,
                error: 'Redis not connected',
            };
        }

        // Test read/write operations
        const testKey = 'health_check_test';
        const testValue = { timestamp: Date.now(), test: true };

        const writeSuccess = await cacheManager.set(testKey, testValue, 10);
        if (!writeSuccess) {
            return {
                healthy: false,
                redisConnected: true,
                canReadWrite: false,
                error: 'Cannot write to cache',
            };
        }

        const readResult = await cacheManager.get(testKey);
        const canRead = readResult && (readResult as any).test === true;

        // Clean up test key
        await cacheManager.delete(testKey);

        if (!canRead) {
            return {
                healthy: false,
                redisConnected: true,
                canReadWrite: false,
                error: 'Cannot read from cache',
            };
        }

        return {
            healthy: true,
            redisConnected: true,
            canReadWrite: true,
        };
    } catch (error) {
        logger.error('Cache health check failed:', error);
        return {
            healthy: false,
            redisConnected: false,
            canReadWrite: false,
            error: (error as Error).message,
        };
    }
};

// Export all functions
export const cachedBlogService = {
    getBlogsWithPaginationCached,
    getBlogByIdCached,
    getBlogBySlugCached,
    invalidateAllBlogCaches,
    invalidateBlogCache,
    warmUpCache,
    getCacheStats,
    cacheHealthCheck,
};