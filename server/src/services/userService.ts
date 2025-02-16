import bcrypt from "bcrypt";
import prisma from "@utils/client";
import { signToken, verifyToken } from "@utils/jwt";
import { env } from 'envValidator';

export const registerUserService = async (email: string, password: string) => {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) throw new Error("User already registered");

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { email, password: hashedPassword },
  });

  // Generate tokens with user flags
  const tokenPayload = {
    id: user.id,
    isAdmin: user.isAdmin,
    isModerator: user.isModerator,
    isVerifiedPoster: user.isVerifiedPoster,
    isBlocked: user.isBlocked
  };
  
  const token = signToken(tokenPayload, "1h");
  const refreshToken = signToken(tokenPayload, '7d');

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  return { user, token, refreshToken };
};

export const loginUserService = async (email: string, password: string, ipAddress: string, userAgent: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("Invalid email or password");

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw new Error("Invalid email or password");

  // Create token payload
  const tokenPayload = {
    id: user.id,
    isAdmin: user.isAdmin,
    isModerator: user.isModerator,
    isVerifiedPoster: user.isVerifiedPoster,
    isBlocked: user.isBlocked
  };

  const accessToken = signToken(tokenPayload, '1h');
  const refreshToken = signToken(tokenPayload, '7d');

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      ipAddress,
      userAgent,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  return { accessToken, refreshToken };
};

export const refreshUserTokenService = async (refreshToken: string) => {
  if (!refreshToken) throw new Error("Refresh token missing");

  const tokenRecord = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
  });

  if (!tokenRecord || tokenRecord.isRevoked || tokenRecord.expiresAt < new Date()) {
    throw new Error("Invalid or expired refresh token");
  }

  const user = await prisma.user.findUnique({ where: { id: tokenRecord.userId } });
  if (!user) throw new Error("User not found");

  // Create updated token payload
  const tokenPayload = {
    id: user.id,
    isAdmin: user.isAdmin,
    isModerator: user.isModerator,
    isVerifiedPoster: user.isVerifiedPoster,
    isBlocked: user.isBlocked
  };

  const newAccessToken = signToken(tokenPayload, "1h");
  const newRefreshToken = signToken(tokenPayload, "7d");

  await prisma.refreshToken.update({
    where: { id: tokenRecord.id },
    data: { isRevoked: true },
  });

  await prisma.refreshToken.create({
    data: {
      token: newRefreshToken,
      userId: user.id,
      ipAddress: tokenRecord.ipAddress,
      userAgent: tokenRecord.userAgent,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  return { newAccessToken, newRefreshToken };
};


export const logoutUserService = async (refreshToken: string) => {
  if (!refreshToken) throw new Error("No refresh token provided");

  // Mark the refresh token as revoked
  await prisma.refreshToken.updateMany({
    where: { token: refreshToken },
    data: { isRevoked: true },
  });
};