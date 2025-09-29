import prisma from "@src/utils/client";

export const createVideo = async (data: { url: string; title: string; userId: string }) => {
  return await prisma.video.create({
    data,
  });
};

export const findOrCreateVideo = async (data: { url: string; title: string; userId: string }) => {
  // First, try to find existing video by URL
  const existingVideo = await prisma.video.findUnique({
    where: { url: data.url },
    include: {
      user: true,
      transcript: true,
      blog: true
    },
  });

  if (existingVideo) {
    return existingVideo;
  }

  // If not found, create new video
  return await prisma.video.create({
    data,
    include: {
      user: true,
      transcript: true,
      blog: true
    },
  });
};

export const getVideoById = async (id: number) => {
  return await prisma.video.findUnique({
    where: { id },
    include: { user: true, transcript: true, blog: true },
  });
};

export const getVideos = async () => {
  return await prisma.video.findMany({
    include: { user: true, blog: true },
    orderBy: { uploadedAt: "desc" },
  });
};

export const deleteVideo = async (id: number) => {
  return await prisma.video.delete({
    where: { id },
  });
};
