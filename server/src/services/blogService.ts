import prisma from "@src/utils/client";

// Create a new blog
export const createBlog = async (videoId: number, title: string, content: string, keywords: string[]) => {
  return prisma.blog.create({
    data: {
      videoId,
      title,
      content,
      keywords: {
        connectOrCreate: keywords.map((word) => ({
          where: { word },
          create: { word },
        })),
      },
    },
    include: { keywords: true },
  });
};

// Fetch a blog by ID
export const getBlogById = async (id: number) => {
  return prisma.blog.findUnique({
    where: { id },
    include: { keywords: true },
  });
};

// Fetch all blogs
export const getAllBlogs = async () => {
  return prisma.blog.findMany({
    include: { keywords: true },
  });
};

// Delete a blog
export const deleteBlog = async (id: number) => {
  return prisma.blog.delete({
    where: { id },
  });
};
