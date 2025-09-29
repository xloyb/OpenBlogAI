import { Request, Response, NextFunction } from "express";
import { YoutubeTranscript } from "youtube-transcript";
import axios from "axios";
import { createTranscript } from "@src/services/transcriptService";
import { findOrCreateVideo } from "@src/services/videoService";
export const extractTranscript = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { videoId } = req.params;
    const { userId } = req.body;

    if (!videoId || !userId) {
      res.status(400).json({ error: true, message: "Video ID and User ID are required" });
      return;
    }

    // // Check if the video already exists in the database
    // const existingVideo = await prisma.video.findUnique({
    //   where: { url: `https://www.youtube.com/watch?v=${videoId}` },
    // });

    // if (existingVideo) {
    //   res.status(400).json({ error: true, message: "Video already exists" });
    //   return;
    // }

    // Fetch the video title
    const title = await getVideoTitle(videoId);
    console.log("title:", title);

    // Fetch the transcript using the youtube-transcript package
    const transcript = await YoutubeTranscript.fetchTranscript(videoId);
    const formattedTranscript = transcript.map((entry) => entry.text).join(" ").trim();
    console.log("formattedTranscript:", formattedTranscript);

    // Validate transcript content
    if (!formattedTranscript || formattedTranscript.length === 0) {
      res.status(400).json({
        error: true,
        message: "No transcript content found for this video. The video might not have captions available."
      });
      return;
    }

    const video = await findOrCreateVideo({
      url: `https://www.youtube.com/watch?v=${videoId}`,
      title,
      userId,
    });

    // Check if transcript already exists for this video (1:1 relationship)
    let transcriptEntry;
    if (video.transcript) {
      // Use existing transcript
      transcriptEntry = video.transcript;
    } else {
      // Create new transcript
      transcriptEntry = await createTranscript(video.id, formattedTranscript);
    }

    res.status(200).json({
      message: "Transcript extracted and saved successfully",
      video,
      transcript: transcriptEntry,
    });
  } catch (error) {
    console.error("Transcript extraction error:", error);

    // Handle specific YouTube transcript errors
    if (error instanceof Error) {
      if (error.message.includes('Transcript is disabled') || error.message.includes('No transcript')) {
        res.status(400).json({
          error: true,
          message: "Transcript is not available for this video. Please try a different video with captions enabled."
        });
        return;
      }

      if (error.message.includes('Video unavailable') || error.message.includes('Private video')) {
        res.status(400).json({
          error: true,
          message: "Video is unavailable or private. Please check the video URL and try again."
        });
        return;
      }
    }

    next(error);
  }
};

export const getVideoTitle = async (videoId: string) => {
  const response = await axios.get(`https://www.youtube.com/watch?v=${videoId}`);
  const html = response.data;

  // Extract the title from the HTML
  const titleMatch = html.match(/<title>(.*?)<\/title>/);
  if (!titleMatch) throw new Error("Title not found");

  // Remove " - YouTube" from the title
  return titleMatch[1].replace(" - YouTube", "");
};
