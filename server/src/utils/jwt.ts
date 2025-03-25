import { env } from 'envValidator';
import jwt from 'jsonwebtoken';
import prisma from '@src/utils/client';

export interface JwtPayload {
  userId: string;
  isAdmin: boolean;
  isBlocked: boolean;
}


export type TokenUser = {
  id: string;
  name: string | null;
  email: string;
  isAdmin: boolean;
  isBlocked: boolean;
  isModerator: boolean;
  isVerifiedPoster: boolean;
};

export const generateAccessToken = (user: TokenUser) => {
  return jwt.sign(
    {
      userId: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      isBlocked: user.isBlocked,
      isModerator: user.isModerator,
      isVerifiedPoster: user.isVerifiedPoster
    },
    env.JWT_SECRET,
    { expiresIn: '1m' } // Changed from '1m' to '15m' for better usability
  );
};

export const generateRefreshToken = async (user: { id: string }, ipAddress?: string, userAgent?: string) => {
  const refreshToken = jwt.sign(
    { userId: user.id },
    env.REFRESH_SECRET,
    { expiresIn: '7d' }
  );

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      ipAddress,
      userAgent,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  return refreshToken;
};


export const verifyAccessToken = (token: string): JwtPayload => {
  return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
};


export const verifyRefreshToken = async (token: string) => {
  console.log("[verifyRefreshToken] Verifying token:", token);
  try {
    console.log("[verifyRefreshToken] Using REFRESH_SECRET:", env.REFRESH_SECRET);
    const decoded = jwt.verify(token, env.REFRESH_SECRET) as { userId: string };
    console.log("[verifyRefreshToken] Decoded token:", decoded);

    const storedToken = await prisma.refreshToken.findUnique({
      where: { token },
    });

    if (!storedToken) {
      console.log("[verifyRefreshToken] No matching token record found");
      throw new Error('Invalid or expired refresh token');
    }
    if (storedToken.isRevoked) {
      console.log("[verifyRefreshToken] Token is revoked");
      throw new Error('Invalid or expired refresh token');
    }
    if (storedToken.expiresAt < new Date()) {
      console.log("[verifyRefreshToken] Token has expired:", storedToken.expiresAt);
      throw new Error('Invalid or expired refresh token');
    }

    return storedToken;
  } catch (error) {
    console.error("[verifyRefreshToken] Error:", (error as Error).message);
    throw new Error('Invalid or expired refresh token'); // Standardize error message
  }
};



// Revoke refresh token
export const revokeRefreshToken = async (token: string) => {
  await prisma.refreshToken.updateMany({
    where: { token },
    data: { isRevoked: true, revokedAt: new Date() },
  });
};