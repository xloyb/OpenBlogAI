import { Request, Response, NextFunction } from "express";
import axios from "axios";
import { env } from 'envValidator';


// Hugging Face API configuration
const API_TOKEN = env.HUGGING_FACE_API_TOKEN; 
const API_URL = "https://api-inference.huggingface.co/models/gpt2"; 

// Headers for authentication
const headers = {
  Authorization: `Bearer ${API_TOKEN}`,
};

/**
 * Generate a blog from a transcript using the Hugging Face API.
 * @param transcript - The YouTube video transcript.
 * @param maxLength - The maximum length of the generated blog.
 * @returns The generated blog text.
 */
export const generateBlogFromTranscript = async (transcript: string, maxLength: number = 500): Promise<string> => {
  try {
    // Create a prompt for the model
    const prompt = `Based on the following YouTube video transcript, create a detailed and engaging blog post:\n\n${transcript}\n\nBlog:`;
    // Payload for the API request
    const payload = {
      inputs: prompt,
      parameters: {
        max_length: maxLength, // Maximum length of the generated text
        temperature: 0.7, // Controls randomness (0 = deterministic, 1 = creative)
        do_sample: true, // Enable sampling for diverse outputs
      },
    };

    // Send the request to the Hugging Face API
    const response = await axios.post(API_URL, payload, { headers });

    // Extract the generated blog text
    const generatedBlog = response.data[0]?.generated_text;
    if (!generatedBlog) {
      throw new Error("Failed to generate blog: No text returned from the API.");
    }

    return generatedBlog;
  } catch (error) {
    console.error("Error generating blog:", error);
    throw new Error("Failed to generate blog from transcript.");
  }
};

/**
 * Controller to handle blog generation requests.
 */
export const generateBlog = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { transcript } = req.body;

    if (!transcript) {
      res.status(400).json({ error: true, message: "Transcript is required" });
      return;
    }

    // Generate the blog from the transcript
    const blog = await generateBlogFromTranscript(transcript);

    res.status(200).json({
      message: "Blog generated successfully",
      blog: blog,
    });
  } catch (error) {
    next(error);
  }
};