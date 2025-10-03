// src/routes/blogRoutes.ts
import { Router } from "express";
import { deleteExistingBlog, generateBlog, getAllBlogs, getSingleBlog, updateExistingBlog, getAvailableModels, getPublicBlogs } from "@controllers/blogController";
import { authenticateJWT, authorizeAdmin } from "@src/middlewares/authMiddleware";

const router = Router();

// Route to get available models
router.get('/models', getAvailableModels);
// Route to generate a blog from a transcript
router.post("/generate-blog", generateBlog as any);
// Public route to get all visible blogs with pagination and sorting
router.get('/public/blogs', getPublicBlogs);
// Protected route to get user's blogs
router.get('/blogs', authenticateJWT, getAllBlogs);
router.get('/blogs/slug/:slug', getSingleBlog);
router.get('/blogs/:id', getSingleBlog);
router.patch('/blogs/:id', updateExistingBlog);
router.delete('/blogs/:id', deleteExistingBlog);

export default router;