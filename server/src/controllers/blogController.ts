// import { Request, Response, NextFunction } from "express";
// import { createOpenAI } from "@ai-sdk/openai";
// import { streamText, CoreMessage } from "ai";
// import { env } from "envValidator";
// import { CHAT_INSTRUCTIONS } from "@src/utils/instructions";
// import prisma from "@src/utils/client";

// const MODEL_CONFIG = {
//   "gpt-4o": {
//     name: "GPT-4 Omni",
//     temperature: 1,
//     maxTokens: 4096,
//     topP: 1,
//   },
//   "llama-3.1": {
//     name: "Meta-Llama-3.1-405B-Instruct",
//     temperature: 0.8,
//     maxTokens: 2048,
//     topP: 0.1,
//   },
//   jamba: {
//     name: "AI21-Jamba-1.5-Large",
//     temperature: 0.8,
//     maxTokens: 2048,
//     topP: 0.1,
//   },
//   "phi-3.5": {
//     name: "Phi-3.5-MoE-instruct",
//     temperature: 0.8,
//     maxTokens: 2048,
//     topP: 0.1,
//   },
//   cohere: {
//     name: "Cohere-command-r-08-2024",
//     temperature: 0.8,
//     maxTokens: 2048,
//     topP: 0.1,
//   },
//   ministral: {
//     name: "Ministral-3B",
//     temperature: 0.8,
//     maxTokens: 2048,
//     topP: 0.1,
//   },
// };

// const client = createOpenAI({
//   baseURL: "https://models.inference.ai.azure.com",
//   apiKey: env.GITHUB_API,
// });

// export const generateBlogFromTranscript = async (
//   modelId: keyof typeof MODEL_CONFIG,
//   transcript: string
// ): Promise<string> => {
//   try {
//     const model = MODEL_CONFIG[modelId];
//     const messages: CoreMessage[] = [
//       {
//         role: "system",
//         content: CHAT_INSTRUCTIONS,
//       },
//       {
//         role: "user",
//         content: `Generate blog post: ${transcript.substring(0, 6000)}`,
//       },
//     ];

//     const result = await streamText({
//       model: client(model.name),
//       messages,
//       temperature: model.temperature,
//       maxTokens: model.maxTokens,
//       topP: model.topP,
//     });

//     let content = "";
//     for await (const textPart of result.textStream) {
//       content += textPart;
//     }

//     return content;
//   } catch (error) {
//     console.error(`Model ${modelId} error:`, error);
//     throw new Error(`Generation failed: ${(error as Error).message}`);
//   }
// };

// export const generateBlog = async (
//   req: Request<
//     {},
//     {},
//     { modelId: keyof typeof MODEL_CONFIG; transcript: string }
//   >,
//   res: Response,
//   next: NextFunction
// ): Promise<void> => {
//   try {
//     const { modelId, transcript } = req.body;

//     if (!transcript?.trim()) {
//       res.status(400).json({ error: true, message: "Transcript required" });
//       return;
//     }

//     if (!MODEL_CONFIG[modelId]) {
//       res.status(400).json({
//         error: true,
//         message: `Invalid model ID. Valid options: ${Object.keys(
//           MODEL_CONFIG
//         ).join(", ")}`,
//       });
//       return;
//     }

//     const blog = await generateBlogFromTranscript(modelId, transcript);
//     //const formattedBlog = parseBlogString(blog);

//    // await prisma.blog.create(formattedBlog);

//     res.status(200).json({
//       success: true,
//       model: MODEL_CONFIG[modelId].name,
//       blogFormatted: blog,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// function parseBlogString(blogString: string) {
//   try {
//     // Remove any unnecessary whitespaces and escape sequences
//     const cleanString = blogString.trim();
    
//     // Parse the string into a JSON object
//     const blogObject = JSON.parse(cleanString);
    
//     return blogObject; // Return only the parsed JSON object
//   } catch (error) {
//     // Handle any errors during parsing
//     return {
//       error: "Invalid JSON string",
//       details: error,
//     };
//   }
// }






import { Request, Response, NextFunction } from "express";
import { createOpenAI } from "@ai-sdk/openai";
import { streamText, CoreMessage } from "ai";
import { env } from "envValidator";
import { CHAT_INSTRUCTIONS } from "@src/utils/instructions";
import prisma from "@src/utils/client";
import { BlogSchema } from "@src/utils/blogSchema";

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
  req: Request<{}, {}, { modelId: keyof typeof MODEL_CONFIG; transcript: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { modelId, transcript } = req.body;

    if (!transcript?.trim()) {
      res.status(400).json({ error: true, message: "Transcript required" });
      return;
    }

    const rawBlog = await generateBlogFromTranscript(modelId, transcript);
    //const parsedBlog = parseBlogString(rawBlog);
    
    // Validate against schema
    //const validationResult = BlogSchema.safeParse(rawBlog);
    // if (!validationResult.success) {
    //   res.status(400).json({
    //     error: 'Validation failed',
    //     details: validationResult.error.flatten()
    //   });
    //   return;
    // }

    // // Create slug from title
    // const slug = validationResult.data.title
    //   .toLowerCase()
    //   .replace(/[^a-z0-9]+/g, '-')
    //   .replace(/(^-|-$)+/g, '');
      

    // // Store in database
    // const { videoId, ...blogData } = validationResult.data;
    // const createdBlog = await prisma.blog.create({
    //   data: {
    //     ...blogData,
    //     slug,
    //     video: { connect: { id: videoId } }
    //   }
    // });

    res.status(200).json({
      success: true,
      blog: rawBlog,
    });
  } catch (error) {
    next(error);
  }
};


function parseBlogString(blogString: string) {
  try {
    // Remove markdown code blocks and asterisks
    const cleaned = blogString
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .replace(/\*\*/g, '')
      .trim();

    // Handle common escaping issues
    const normalized = cleaned
      .replace(/'/g, '"') // Replace single quotes with double quotes
      .replace(/\\"/g, '"') // Fix escaped quotes
      .replace(/(\w)"(\w)/g, '$1\\"$2'); // Handle mid-word quotes

    // Attempt JSON parsing
    const parsed = JSON.parse(normalized);
    
    return parsed;
  } catch (error) {
    console.error('Failed to parse:', blogString);
    throw new Error(`Failed to parse blog content: ${(error as Error).message}`);
  }
}




