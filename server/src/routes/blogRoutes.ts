// src/routes/blogRoutes.ts
import { Router } from "express";
import { deleteExistingBlog, generateBlog, getAllBlogs, getSingleBlog, updateExistingBlog, getAvailableModels } from "@controllers/blogController";
import { authenticateJWT, authorizeAdmin } from "@src/middlewares/authMiddleware";

const router = Router();

// Route to get available models
router.get('/models', getAvailableModels);
// Route to generate a blog from a transcript
router.post("/generate-blog", generateBlog as any);
// Public route to get all visible blogs without authentication
router.get('/public/blogs', getAllBlogs);
// Protected route to get user's blogs
router.get('/blogs', authenticateJWT, getAllBlogs);
router.get('/blogs/:id', getSingleBlog);
router.patch('/blogs/:id', updateExistingBlog);
router.delete('/blogs/:id', deleteExistingBlog);

export default router;