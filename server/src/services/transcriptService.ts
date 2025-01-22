import prisma from "@src/utils/client";

// Create a new transcript
export const createTranscript = async (videoId: number, content: string) => {
  return prisma.transcript.create({
    data: { videoId, content },
  });
};

// Fetch a transcript by video ID
export const getTranscriptByVideoId = async (videoId: number) => {
  return prisma.transcript.findUnique({
    where: { videoId },
  });
};

// Delete a transcript
export const deleteTranscript = async (id: number) => {
  return prisma.transcript.delete({
    where: { id },
  });
};
