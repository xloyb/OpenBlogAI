import prisma from "@src/utils/client";

// Create a new video
export const createVideo = async (userId: number, url: string, title: string, description?: string) => {
  return prisma.video.create({
    data: { userId: userId.toString(), url, title, description },
  });
};

// Fetch a video by ID
export const getVideoById = async (id: number) => {
  return prisma.video.findUnique({
    where: { id },
    include: { transcript: true, blog: true },
  });
};

// Fetch all videos
export const getAllVideos = async () => {
  return prisma.video.findMany({
    include: { transcript: true, blog: true },
  });
};

// Delete a video
export const deleteVideo = async (id: number) => {
  return prisma.video.delete({
    where: { id },
  });
};
