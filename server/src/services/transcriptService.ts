import prisma from "@src/utils/client";

export const createTranscript = async (videoId: number, content: string) => {
  return await prisma.transcript.create({
    data: { videoId, content },
  });
};

export const getTranscriptByVideoId = async (videoId: number) => {
  return await prisma.transcript.findUnique({
    where: { videoId },
  });
};

export const updateTranscript = async (videoId: number, content: string) => {
  return await prisma.transcript.update({
    where: { videoId },
    data: { content },
  });
};

export const deleteTranscript = async (videoId: number) => {
  return await prisma.transcript.delete({
    where: { videoId },
  });
};
