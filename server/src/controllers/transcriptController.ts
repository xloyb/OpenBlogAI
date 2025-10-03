import { Request, Response, NextFunction } from "express";
import {
  fetchTranscript,
  YoutubeTranscriptDisabledError,
  YoutubeTranscriptNotAvailableError,
  YoutubeTranscriptVideoUnavailableError,
  YoutubeTranscriptInvalidVideoIdError
} from "@egoist/youtube-transcript-plus";
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

    // Fetch the transcript using @egoist/youtube-transcript-plus
    const transcriptData = await fetchTranscript(videoId);

    // Extract title and transcript from response
    const title = transcriptData.title.replace(" - YouTube", "");
    const formattedTranscript = transcriptData.segments.map((entry: any) => entry.text).join(" ").trim();
    console.log("title:", title);
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

    // Handle specific YouTube transcript errors from @egoist/youtube-transcript-plus
    if (error instanceof YoutubeTranscriptDisabledError) {
      res.status(400).json({
        error: true,
        message: "Transcript is disabled for this video. Please try a different video with captions enabled."
      });
      return;
    }

    if (error instanceof YoutubeTranscriptNotAvailableError) {
      res.status(400).json({
        error: true,
        message: "Transcript is not available for this video. Please try a different video with captions enabled."
      });
      return;
    }

    if (error instanceof YoutubeTranscriptVideoUnavailableError) {
      res.status(400).json({
        error: true,
        message: "Video is unavailable or private. Please check the video URL and try again."
      });
      return;
    }

    if (error instanceof YoutubeTranscriptInvalidVideoIdError) {
      res.status(400).json({
        error: true,
        message: "Invalid video ID provided. Please check the video URL and try again."
      });
      return;
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
