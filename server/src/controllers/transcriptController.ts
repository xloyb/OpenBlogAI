import { Request, Response, NextFunction } from "express";
import { YoutubeTranscript } from 'youtube-transcript';

export const extractTranscript = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { videoId } = req.params;

    // let videoId = "lVdgiuzGmdI";

    if (!videoId) {
      res.status(400).json({ error: true, message: "Video ID is required" });
      return;
    }

    // Fetch the transcript using the youtube-transcript package
    const transcript = await YoutubeTranscript.fetchTranscript(videoId);

    // Format the transcript into a single string
    const formattedTranscript = transcript.map(entry => entry.text).join(' ');
    console.log("formattedTranscript",formattedTranscript);

    res.status(200).json({
      message: "Transcript extracted successfully",
      transcript: formattedTranscript,
    });
  } catch (error) {
    next(error); 
  }
};