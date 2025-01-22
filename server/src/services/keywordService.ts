import prisma from "@src/utils/client";

// Create a new keyword
export const createKeyword = async (word: string) => {
  return prisma.keyword.create({
    data: { word },
  });
};

// Fetch all keywords
export const getAllKeywords = async () => {
  return prisma.keyword.findMany();
};

// Fetch blogs by keyword
export const getBlogsByKeyword = async (word: string) => {
  return prisma.keyword.findUnique({
    where: { word },
    include: { blogs: true },
  });
};

// Delete a keyword
export const deleteKeyword = async (id: number) => {
  return prisma.keyword.delete({
    where: { id },
  });
};
