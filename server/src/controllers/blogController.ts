




import { Request, Response, NextFunction } from "express";
import { createOpenAI } from "@ai-sdk/openai";
import { streamText, CoreMessage } from "ai";
import { env } from "envValidator";
import { CHAT_INSTRUCTIONS } from "@src/utils/instructions";
import { createBlog, deleteBlog, getBlogById, getBlogs, updateBlog } from "@src/services/blogService";

const MODEL_CONFIG = {
  "gpt-4o": {
    name: "GPT-4 Omni",
    temperature: 1,
    maxTokens: 4096,
    topP: 1,
  },
  "llama-3.1": {
    name: "Meta-Llama-3.1-405B-Instruct",
    temperature: 0.8,
    maxTokens: 2048,
    topP: 0.1,
  },
  jamba: {
    name: "AI21-Jamba-1.5-Large",
    temperature: 0.8,
    maxTokens: 2048,
    topP: 0.1,
  },
  "phi-3.5": {
    name: "Phi-3.5-MoE-instruct",
    temperature: 0.8,
    maxTokens: 2048,
    topP: 0.1,
  },
  cohere: {
    name: "Cohere-command-r-08-2024",
    temperature: 0.8,
    maxTokens: 2048,
    topP: 0.1,
  },
  ministral: {
    name: "Ministral-3B",
    temperature: 0.8,
    maxTokens: 2048,
    topP: 0.1,
  },
};

const client = createOpenAI({
  baseURL: "https://models.inference.ai.azure.com",
  apiKey: env.GITHUB_API,
});

export const generateBlogFromTranscript = async (
  modelId: keyof typeof MODEL_CONFIG,
  transcript: string,
  
): Promise<string> => {
  try {
    const model = MODEL_CONFIG[modelId];
    const messages: CoreMessage[] = [
      {
        role: "system",
        content: CHAT_INSTRUCTIONS,
      },
      {
        role: "user",
        content: `Generate blog post: ${transcript.substring(0, 6000)}`,
      },
    ];

    const result = await streamText({
      model: client(model.name),
      messages,
      temperature: model.temperature,
      maxTokens: model.maxTokens,
      topP: model.topP,
    });

    let content = "";
    for await (const textPart of result.textStream) {
      content += textPart;
    }

    return content;
  } catch (error) {
    console.error(`Model ${modelId} error:`, error);
    throw new Error(`Generation failed: ${(error as Error).message}`);
  }
};



export const generateBlog = async (
  req: Request<{}, {}, { modelId: keyof typeof MODEL_CONFIG; transcript: string, uid: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { modelId, transcript, uid } = req.body;

    if (!transcript?.trim()) {
      res.status(400).json({ error: true, message: "Transcript required" });
      return;
    }

    const rawBlog = await generateBlogFromTranscript(modelId, transcript);
    

    // Save the blog to the database
    const newBlog = await createBlog({
      subject:"test blog",
      content: rawBlog,
      visible: 1,
      userId: uid,
    });

    res.status(200).json({
      success: true,
      blog: rawBlog,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllBlogs = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const blogs = await getBlogs();
    res.status(200).json(blogs);
  } catch (error) {
    next(error);
  }
};

export const getSingleBlog = async (
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

    const blog = await getBlogById(id);
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
  req: Request<{ id: string }, {}, { subject?: string; content?: string; visible?: number }>,
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
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};