import { Request, Response, NextFunction } from "express";
import { YoutubeTranscript } from "youtube-transcript";
import axios from "axios";
import { createTranscript } from "@src/services/transcriptService";
import { createVideo } from "@src/services/videoService";
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
    const formattedTranscript = transcript.map((entry) => entry.text).join(" ");
    console.log("formattedTranscript:", formattedTranscript);
  
    const video = await createVideo({
      url: `https://www.youtube.com/watch?v=${videoId}`,
      title,
      userId,
    });

    const transcriptEntry = await createTranscript(video.id, formattedTranscript);

    res.status(200).json({      message: "Transcript extracted and saved successfully",
      video,
      transcript: transcriptEntry,
    });
  } catch (error) {
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
