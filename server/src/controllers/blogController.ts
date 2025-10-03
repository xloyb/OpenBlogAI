// Updated blog controller with OpenRouter free models integration

import { Request, Response, NextFunction } from "express";
import { createOpenAI } from "@ai-sdk/openai";
import { streamText, CoreMessage } from "ai";
import { CHAT_INSTRUCTIONS } from "@src/utils/instructions";
import { createBlog, deleteBlog, getBlogById, getBlogBySlug, getBlogs, updateBlog, getBlogsWithPagination } from "@src/services/blogService";
import { cachedBlogService } from "@src/services/cachedBlogService";
import { markForCacheInvalidation } from "@src/middlewares/cacheMiddleware";

// OpenRouter Free Models Configuration
const FREE_MODEL_CONFIG = {
    // Free models available on OpenRouter (these are commonly free)
    "mistral-7b-instruct": {
        name: "mistralai/mistral-7b-instruct",
        displayName: "Mistral 7B Instruct",
        temperature: 0.8,
        maxTokens: 2048,
        topP: 0.9,
    },
    "mixtral-8x7b-instruct": {
        name: "mistralai/mixtral-8x7b-instruct",
        displayName: "Mixtral 8x7B Instruct",
        temperature: 0.8,
        maxTokens: 2048,
        topP: 0.9,
    },
    "llama-3.1-8b-instruct": {
        name: "meta-llama/llama-3.1-8b-instruct",
        displayName: "Llama 3.1 8B Instruct",
        temperature: 0.8,
        maxTokens: 2048,
        topP: 0.9,
    },
    "llama-3.1-70b-instruct": {
        name: "meta-llama/llama-3.1-70b-instruct",
        displayName: "Llama 3.1 70B Instruct",
        temperature: 0.8,
        maxTokens: 2048,
        topP: 0.9,
    },
    "gemma-2-9b-it": {
        name: "google/gemma-2-9b-it",
        displayName: "Gemma 2 9B IT",
        temperature: 0.8,
        maxTokens: 2048,
        topP: 0.9,
    },
    "qwen-2-7b-instruct": {
        name: "qwen/qwen-2-7b-instruct",
        displayName: "Qwen 2 7B Instruct",
        temperature: 0.8,
        maxTokens: 2048,
        topP: 0.9,
    },
    "phi-3-mini-128k-instruct": {
        name: "microsoft/phi-3-mini-128k-instruct",
        displayName: "Phi-3 Mini 128K Instruct",
        temperature: 0.8,
        maxTokens: 2048,
        topP: 0.9,
    },
    "hermes-2-pro-mistral-7b": {
        name: "nousresearch/hermes-2-pro-mistral-7b",
        displayName: "Hermes 2 Pro Mistral 7B",
        temperature: 0.8,
        maxTokens: 2048,
        topP: 0.9,
    }
};

// OpenRouter client configuration
const openRouterClient = createOpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY, // Add this to your .env file
});

export const generateBlogFromTranscript = async (
    modelId: keyof typeof FREE_MODEL_CONFIG,
    transcript: string,
): Promise<string> => {
    try {
        const model = FREE_MODEL_CONFIG[modelId];

        if (!model) {
            throw new Error(`Model ${modelId} not found in free models configuration`);
        }

        const messages: CoreMessage[] = [
            {
                role: "system",
                content: CHAT_INSTRUCTIONS,
            },
            {
                role: "user",
                content: `Generate a comprehensive blog post based on this transcript: ${transcript.substring(0, 6000)}`,
            },
        ];

        const result = await streamText({
            model: openRouterClient(model.name),
            messages,
            temperature: model.temperature,
            maxTokens: model.maxTokens,
            topP: model.topP,
            // OpenRouter specific headers (optional but recommended)
            headers: {
                "HTTP-Referer": process.env.YOUR_SITE_URL || "http://localhost:3000",
                "X-Title": process.env.YOUR_SITE_NAME || "OpenBlogAI",
            }
        });

        let content = "";
        for await (const textPart of result.textStream) {
            content += textPart;
        }

        return content;
    } catch (error) {
        console.error(`OpenRouter model ${modelId} error:`, error);
        throw new Error(`Blog generation failed with ${modelId}: ${(error as Error).message}`);
    }
};

export const generateBlog = async (
    req: Request<{}, {}, { modelId: keyof typeof FREE_MODEL_CONFIG; transcript: string; uid: string }>,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { modelId, transcript, uid } = req.body;

        if (!transcript?.trim()) {
            res.status(400).json({ error: true, message: "Transcript is required" });
            return;
        }

        if (!FREE_MODEL_CONFIG[modelId]) {
            res.status(400).json({
                error: true,
                message: `Invalid model ID. Available models: ${Object.keys(FREE_MODEL_CONFIG).join(', ')}`
            });
            return;
        }

        console.log(`Generating blog with model: ${FREE_MODEL_CONFIG[modelId].displayName}`);

        const rawBlog = await generateBlogFromTranscript(modelId, transcript);

        // Extract title from the generated blog (first line or first heading)
        const lines = rawBlog.split('\n');
        const title = lines.find(line => line.trim().startsWith('#'))?.replace(/^#+\s*/, '') ||
            lines.find(line => line.trim().length > 0)?.substring(0, 100) ||
            "Generated Blog Post";

        // Extract SEO fields from request body if provided
        const { seoTitle, seoDescription, seoKeywords, seoFaq } = req.body as any;

        // Save the blog to the database
        const newBlog = await createBlog({
            subject: title,
            content: rawBlog,
            visible: 1,
            userId: uid,
            seoTitle,
            seoDescription,
            seoKeywords,
            seoFaq,
        });

        // Mark for cache invalidation since we created a new public blog
        markForCacheInvalidation(req as any, { invalidateAll: true });

        res.status(200).json({
            success: true,
            blog: rawBlog,
            blogId: newBlog.id,
            model: FREE_MODEL_CONFIG[modelId].displayName,
            title: title
        });
    } catch (error) {
        next(error);
    }
};

// Get available free models
export const getAvailableModels = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const models = Object.entries(FREE_MODEL_CONFIG).map(([key, config]) => ({
            id: key,
            name: config.displayName,
            description: `Free model: ${config.name}`,
            maxTokens: config.maxTokens,
            provider: "OpenRouter"
        }));

        res.status(200).json({
            success: true,
            models,
            total: models.length
        });
    } catch (error) {
        next(error);
    }
};

// Enhanced blogs controller with pagination and sorting
export const getAllBlogs = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        // Check if this is a paginated request
        const { page, limit, sortBy, sortOrder, paginated } = req.query;

        // If pagination parameters are provided or explicitly requested
        if (page || limit || sortBy || sortOrder || paginated === 'true') {
            const options = {
                page: page ? parseInt(page as string) : undefined,
                limit: limit ? parseInt(limit as string) : undefined,
                sortBy: sortBy as 'createdAt' | 'updatedAt' | 'subject' | 'id',
                sortOrder: sortOrder as 'asc' | 'desc',
                // For public route, only show visible blogs
                visible: req.path.includes('/public/') ? 1 : undefined,
            };

            const paginatedBlogs = await getBlogsWithPagination(options);
            res.status(200).json({
                success: true,
                ...paginatedBlogs
            });
        } else {
            // Legacy support - return all blogs without pagination
            const blogs = await getBlogs();
            res.status(200).json(blogs);
        }
    } catch (error) {
        next(error);
    }
};

// Dedicated controller for public blogs with enhanced features
export const getPublicBlogs = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const {
            page = 1,
            limit = 10,
            sortBy = 'createdAt',
            sortOrder = 'desc',
            search
        } = req.query;

        const options = {
            page: parseInt(page as string),
            limit: parseInt(limit as string),
            sortBy: sortBy as 'createdAt' | 'updatedAt' | 'subject' | 'id',
            sortOrder: sortOrder as 'asc' | 'desc',
            visible: 1, // Only visible blogs for public
        };

        // Use cached service for public blogs to improve performance (without user data)
        const paginatedBlogs = await cachedBlogService.getPublicBlogsWithPaginationCached(options);

        // If search term is provided, filter results
        if (search && typeof search === 'string') {
            const searchTerm = search.toLowerCase();
            paginatedBlogs.data = paginatedBlogs.data.filter(blog =>
                blog.subject?.toLowerCase().includes(searchTerm) ||
                blog.content?.toLowerCase().includes(searchTerm)
            );
            // Update total count after filtering
            paginatedBlogs.meta.total = paginatedBlogs.data.length;
            paginatedBlogs.meta.totalPages = Math.ceil(paginatedBlogs.data.length / options.limit);
        }

        res.status(200).json({
            success: true,
            ...paginatedBlogs,
            query: {
                page: options.page,
                limit: options.limit,
                sortBy: options.sortBy,
                sortOrder: options.sortOrder,
                search: search || null,
            }
        });
    } catch (error) {
        next(error);
    }
};

export const getSingleBlog = async (
    req: Request<{ id?: string; slug?: string }>,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        let blog;

        // Check if we're fetching by slug or by ID
        if (req.params.slug) {
            // Slug-based fetching with cache
            blog = await cachedBlogService.getBlogBySlugCached(req.params.slug);
        } else if (req.params.id) {
            // ID-based fetching (legacy support) with cache
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                res.status(400).json({ error: true, message: "Invalid blog ID" });
                return;
            }
            blog = await cachedBlogService.getBlogByIdCached(id);
        } else {
            res.status(400).json({ error: true, message: "Blog ID or slug is required" });
            return;
        }

        if (!blog) {
            res.status(404).json({ error: true, message: "Blog not found" });
            return;
        }

        res.status(200).json(blog);
    } catch (error) {
        next(error);
    }
};

export const updateExistingBlog = async (
    req: Request<{ id: string }, {}, {
        subject?: string;
        content?: string;
        visible?: number;
        seoTitle?: string;
        seoDescription?: string;
        seoKeywords?: string[];
        seoFaq?: string[];
    }>,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ error: true, message: "Invalid blog ID" });
            return;
        }

        const existingBlog = await getBlogById(id);
        if (!existingBlog) {
            res.status(404).json({ error: true, message: "Blog not found" });
            return;
        }

        const updatedBlog = await updateBlog(id, req.body);

        // Mark for cache invalidation after blog update
        markForCacheInvalidation(req as any, { blogId: id });

        res.status(200).json(updatedBlog);
    } catch (error) {
        next(error);
    }
};

export const deleteExistingBlog = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ error: true, message: "Invalid blog ID" });
            return;
        }

        const existingBlog = await getBlogById(id);
        if (!existingBlog) {
            res.status(404).json({ error: true, message: "Blog not found" });
            return;
        }

        await deleteBlog(id);

        // Mark for cache invalidation after blog deletion
        markForCacheInvalidation(req as any, { blogId: id });

        res.status(204).send();
    } catch (error) {
        next(error);
    }
};