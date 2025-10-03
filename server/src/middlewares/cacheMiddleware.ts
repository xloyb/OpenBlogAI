import { Request, Response, NextFunction } from 'express';
import { cachedBlogService } from '@src/services/cachedBlogService';
import { logger } from '@src/utils/logger';

// Extended request interface to track cache invalidation needs
interface CacheInvalidationRequest extends Request {
    cacheInvalidation?: {
        blogId?: number;
        slug?: string;
        invalidateAll?: boolean;
        skipInvalidation?: boolean;
    };
}

/**
 * Middleware to automatically invalidate cache after blog operations
 * Should be used after successful blog create/update/delete operations
 */
export const cacheInvalidationMiddleware = () => {
    return async (req: CacheInvalidationRequest, res: Response, next: NextFunction) => {
        // Store original json method
        const originalJson = res.json;

        // Override json method to intercept successful responses
        res.json = function (body: any) {
            // Only invalidate cache on successful operations (2xx status codes)
            if (res.statusCode >= 200 && res.statusCode < 300) {
                // Run cache invalidation asynchronously to avoid blocking the response
                setImmediate(async () => {
                    try {
                        await performCacheInvalidation(req, body);
                    } catch (error) {
                        logger.error('Cache invalidation failed:', error);
                        // Don't fail the request if cache invalidation fails
                    }
                });
            }

            // Call original json method
            return originalJson.call(this, body);
        };

        next();
    };
};

/**
 * Perform cache invalidation based on request context
 */
async function performCacheInvalidation(req: CacheInvalidationRequest, responseBody: any): Promise<void> {
    // Skip if explicitly requested
    if (req.cacheInvalidation?.skipInvalidation) {
        logger.debug('Cache invalidation skipped as requested');
        return;
    }

    const method = req.method;
    const path = req.path;

    logger.debug(`Performing cache invalidation for ${method} ${path}`);

    try {
        // Blog creation - invalidate all caches since pagination will change
        if (method === 'POST' && path.includes('/blog')) {
            await cachedBlogService.invalidateAllBlogCaches();
            logger.info('Cache invalidated after blog creation');
            return;
        }

        // Blog update - invalidate specific blog and all pagination caches
        if (method === 'PUT' && path.includes('/blog/')) {
            const blogId = extractBlogIdFromPath(path) || req.cacheInvalidation?.blogId;
            if (blogId) {
                await cachedBlogService.invalidateBlogCache(blogId, req.cacheInvalidation?.slug);
                logger.info(`Cache invalidated after blog ${blogId} update`);
            } else {
                // Fallback to invalidating all caches
                await cachedBlogService.invalidateAllBlogCaches();
                logger.info('Cache invalidated after blog update (fallback to all)');
            }
            return;
        }

        // Blog deletion - invalidate specific blog and all pagination caches
        if (method === 'DELETE' && path.includes('/blog/')) {
            const blogId = extractBlogIdFromPath(path) || req.cacheInvalidation?.blogId;
            if (blogId) {
                await cachedBlogService.invalidateBlogCache(blogId, req.cacheInvalidation?.slug);
                logger.info(`Cache invalidated after blog ${blogId} deletion`);
            } else {
                // Fallback to invalidating all caches
                await cachedBlogService.invalidateAllBlogCaches();
                logger.info('Cache invalidated after blog deletion (fallback to all)');
            }
            return;
        }

        // Manual invalidation flag
        if (req.cacheInvalidation?.invalidateAll) {
            await cachedBlogService.invalidateAllBlogCaches();
            logger.info('Cache invalidated as explicitly requested');
            return;
        }

        // Specific blog invalidation
        if (req.cacheInvalidation?.blogId) {
            await cachedBlogService.invalidateBlogCache(
                req.cacheInvalidation.blogId,
                req.cacheInvalidation.slug
            );
            logger.info(`Cache invalidated for blog ${req.cacheInvalidation.blogId} as requested`);
            return;
        }

        logger.debug('No cache invalidation performed - no matching conditions');
    } catch (error) {
        logger.error('Cache invalidation operation failed:', error);
        throw error;
    }
}

/**
 * Extract blog ID from request path
 */
function extractBlogIdFromPath(path: string): number | null {
    const matches = path.match(/\/blog\/(\d+)/);
    return matches ? parseInt(matches[1], 10) : null;
}

/**
 * Helper function to mark request for cache invalidation
 */
export const markForCacheInvalidation = (
    req: CacheInvalidationRequest,
    options: {
        blogId?: number;
        slug?: string;
        invalidateAll?: boolean;
        skipInvalidation?: boolean;
    }
): void => {
    req.cacheInvalidation = {
        ...req.cacheInvalidation,
        ...options,
    };
};

/**
 * Middleware specifically for blog operations that always invalidate all caches
 * Use this for operations that significantly affect blog listings (create, bulk operations)
 */
export const invalidateAllBlogCachesMiddleware = () => {
    return async (req: CacheInvalidationRequest, res: Response, next: NextFunction) => {
        markForCacheInvalidation(req, { invalidateAll: true });
        next();
    };
};

/**
 * Middleware for blog update/delete operations that need specific blog invalidation
 */
export const invalidateSpecificBlogCacheMiddleware = (getBlogId?: (req: Request) => number | undefined) => {
    return async (req: CacheInvalidationRequest, res: Response, next: NextFunction) => {
        const blogId = getBlogId ? getBlogId(req) : extractBlogIdFromPath(req.path);

        if (blogId) {
            markForCacheInvalidation(req, { blogId });
        } else {
            // Fallback to invalidating all caches if we can't determine the specific blog
            markForCacheInvalidation(req, { invalidateAll: true });
        }

        next();
    };
};

/**
 * Middleware to skip cache invalidation for specific routes
 */
export const skipCacheInvalidationMiddleware = () => {
    return (req: CacheInvalidationRequest, res: Response, next: NextFunction) => {
        markForCacheInvalidation(req, { skipInvalidation: true });
        next();
    };
};

/**
 * Manual cache invalidation endpoint middleware
 * Can be used to create admin endpoints for cache management
 */
export const manualCacheInvalidationMiddleware = () => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { type, blogId, slug } = req.body;

            switch (type) {
                case 'all':
                    await cachedBlogService.invalidateAllBlogCaches();
                    res.json({ success: true, message: 'All blog caches invalidated' });
                    break;

                case 'blog':
                    if (!blogId) {
                        res.status(400).json({ error: 'Blog ID is required for blog-specific invalidation' });
                        return;
                    }
                    await cachedBlogService.invalidateBlogCache(blogId, slug);
                    res.json({ success: true, message: `Cache invalidated for blog ${blogId}` });
                    break;

                case 'warmup':
                    await cachedBlogService.warmUpCache();
                    res.json({ success: true, message: 'Cache warmed up successfully' });
                    break;

                default:
                    res.status(400).json({ error: 'Invalid invalidation type. Use "all", "blog", or "warmup"' });
                    return;
            }
        } catch (error) {
            logger.error('Manual cache invalidation failed:', error);
            res.status(500).json({ error: 'Cache invalidation failed', message: (error as Error).message });
        }
    };
};

/**
 * Cache statistics endpoint middleware
 */
export const cacheStatsMiddleware = () => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const stats = await cachedBlogService.getCacheStats();
            const health = await cachedBlogService.cacheHealthCheck();

            res.json({
                success: true,
                cache: {
                    health,
                    stats,
                    timestamp: new Date().toISOString(),
                },
            });
        } catch (error) {
            logger.error('Failed to get cache stats:', error);
            res.status(500).json({
                error: 'Failed to get cache stats',
                message: (error as Error).message
            });
        }
    };
};

export default {
    cacheInvalidationMiddleware,
    invalidateAllBlogCachesMiddleware,
    invalidateSpecificBlogCacheMiddleware,
    skipCacheInvalidationMiddleware,
    manualCacheInvalidationMiddleware,
    cacheStatsMiddleware,
    markForCacheInvalidation,
};