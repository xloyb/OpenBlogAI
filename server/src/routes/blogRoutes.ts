// src/routes/blogRoutes.ts
import { Router } from "express";
import { deleteExistingBlog, generateBlog, getAllBlogs, getSingleBlog, updateExistingBlog, getAvailableModels, getPublicBlogs } from "@controllers/blogController";
import { authenticateJWT, authorizeAdmin } from "@src/middlewares/authMiddleware";
import {
    cacheInvalidationMiddleware,
    manualCacheInvalidationMiddleware,
    cacheStatsMiddleware
} from "@src/middlewares/cacheMiddleware";

const router = Router();

// Apply cache invalidation middleware to all routes that modify data
router.use(cacheInvalidationMiddleware());

// Route to get available models
router.get('/models', getAvailableModels);

// Route to generate a blog from a transcript (invalidates cache automatically)
router.post("/generate-blog", generateBlog as any);

// Public route to get all visible blogs with pagination and sorting (cached)
router.get('/public/blogs', getPublicBlogs);

// Cache management routes (admin only)
router.post('/cache/invalidate', authenticateJWT, authorizeAdmin, manualCacheInvalidationMiddleware());
router.get('/cache/stats', authenticateJWT, authorizeAdmin, cacheStatsMiddleware());

// Protected route to get user's blogs (not cached)
router.get('/blogs', authenticateJWT, getAllBlogs);

// Single blog routes (cached for public blogs)
router.get('/blogs/slug/:slug', getSingleBlog);
router.get('/blogs/:id', getSingleBlog);

// Blog modification routes (invalidates cache automatically)
router.patch('/blogs/:id', authenticateJWT, updateExistingBlog);
router.delete('/blogs/:id', authenticateJWT, deleteExistingBlog);

export default router;