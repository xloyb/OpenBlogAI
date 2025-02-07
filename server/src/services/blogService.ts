import prisma from "@src/utils/client";

export const createBlog = async (data: { subject: string; content: string; userId: string; videoId?: number; visible?: number }) => {
  return await prisma.blog.create({
    data,
  });
};

export const getBlogById = async (id: number) => {
  return await prisma.blog.findUnique({
    where: { id },
    include: { user: true, video: true },
  });
};

export const getBlogs = async () => {
  return await prisma.blog.findMany({
    include: { user: true, video: true },
    orderBy: { createdAt: "desc" },
  });
};

export const updateBlog = async (id: number, data: { subject?: string; content?: string; visible?: number }) => {
  return await prisma.blog.update({
    where: { id },
    data,
  });
};

export const deleteBlog = async (id: number) => {
  return await prisma.blog.delete({
    where: { id },
  });
};
