import prisma from "@src/utils/client";

export const createRefreshToken = async (data: { token: string; userId: string; ipAddress?: string; userAgent?: string; expiresAt: Date }) => {
  return await prisma.refreshToken.create({
    data,
  });
};

export const getRefreshToken = async (token: string) => {
  return await prisma.refreshToken.findUnique({
    where: { token },
  });
};

export const revokeRefreshToken = async (token: string) => {
  return await prisma.refreshToken.update({
    where: { token },
    data: { isRevoked: true },
  });
};

export const deleteRefreshToken = async (id: string) => {
  return await prisma.refreshToken.delete({
    where: { id },
  });
};
