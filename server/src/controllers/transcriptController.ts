import { Request, Response, NextFunction } from "express";
import { YoutubeTranscript } from 'youtube-transcript';
import axios from 'axios';

export const extractTranscript = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { videoId } = req.params;

    if (!videoId) {
      res.status(400).json({ error: true, message: "Video ID is required" });
      return;
    }
    let title = await getVideoTitle(videoId);
    console.log("title:",title);

    // Fetch the transcript using the youtube-transcript package
    const transcript = await YoutubeTranscript.fetchTranscript(videoId);
    
    // Format the transcript into a single string
    const formattedTranscript = transcript.map(entry => entry.text).join(' ');
    console.log("formattedTranscript",formattedTranscript);

    res.status(200).json({
      message: "Transcript extracted successfully",
      title: title,
      transcript: formattedTranscript,
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
  if (!titleMatch) throw new Error('Title not found');

  // Remove " - YouTube" from the title
  return titleMatch[1].replace(' - YouTube', '');
};