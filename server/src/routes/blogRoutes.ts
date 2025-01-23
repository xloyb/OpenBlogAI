// src/routes/blogRoutes.ts
import { Router } from "express";
import { generateBlog } from "@controllers/blogController";

const router = Router();

// Route to generate a blog from a transcript
router.post("/generate-blog", generateBlog as any);

export default router;