// src/routes/blogRoutes.ts
import { Router } from "express";
import { deleteExistingBlog, generateBlog, getAllBlogs, getSingleBlog, updateExistingBlog } from "@controllers/blogController";
import { authenticateJWT, authorizeAdmin } from "@src/middlewares/authMiddleware";

const router = Router();

// Route to generate a blog from a transcript
router.post("/generate-blog", generateBlog as any);
router.get('/blogs', authenticateJWT ,getAllBlogs);
router.get('/blogs/:id', getSingleBlog);
router.patch('/blogs/:id', updateExistingBlog);
router.delete('/blogs/:id', deleteExistingBlog);

export default router;