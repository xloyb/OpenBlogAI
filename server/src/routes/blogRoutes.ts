// src/routes/blogRoutes.ts
import { Router } from "express";
import { generateBlog, getAllBlogs, getSingleBlog } from "@controllers/blogController";

const router = Router();

// Route to generate a blog from a transcript
router.post("/generate-blog", generateBlog as any);
router.get('/blogs', getAllBlogs);
router.get('/blogs/:id', getSingleBlog);



export default router;