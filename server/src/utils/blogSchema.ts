import { z } from 'zod';

const SubsectionSchema = z.object({
  heading: z.string(),
  content: z.string()
});

export const BlogSchema = z.object({
  title: z.string().min(10).max(255),
  introduction: z.string().min(100),
  subsections: z.array(SubsectionSchema).min(3),
  conclusion: z.string().min(100),
  key_takeaways: z.array(z.string().min(20)).min(3),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
  videoId: z.number().positive(),
  seoTitle: z.string().max(60).optional(),
  seoDescription: z.string().max(160).optional(),
  seoKeywords: z.array(z.string().min(1)).max(10).optional(),
  seoFaq: z.array(z.string().min(10)).max(20).optional()
});