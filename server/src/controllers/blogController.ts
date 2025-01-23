import { Request, Response, NextFunction } from "express";
import { createOpenAI } from "@ai-sdk/openai";
import { streamText, CoreMessage } from "ai";
import { env } from "envValidator";
import { CHAT_INSTRUCTIONS } from "@src/utils/instructions";

// Model configuration
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
  transcript: string
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
  req: Request<
    {},
    {},
    { modelId: keyof typeof MODEL_CONFIG; transcript: string }
  >,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { modelId, transcript } = req.body;

    if (!transcript?.trim()) {
      res.status(400).json({ error: true, message: "Transcript required" });
      return;
    }

    if (!MODEL_CONFIG[modelId]) {
      res.status(400).json({
        error: true,
        message: `Invalid model ID. Valid options: ${Object.keys(
          MODEL_CONFIG
        ).join(", ")}`,
      });
      return;
    }

    const blog = await generateBlogFromTranscript(modelId, transcript);

    res.status(200).json({
      success: true,
      model: MODEL_CONFIG[modelId].name,
      blog: blog,
    });
  } catch (error) {
    next(error);
  }
};
