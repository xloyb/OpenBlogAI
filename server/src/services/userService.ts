import bcrypt from "bcrypt";
import prisma from "@utils/client";
import { Request, Response } from "express";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken, revokeRefreshToken } from "@utils/jwt";

export const registerUserService = async (name: string | null, email: string, password: string, ipAddress?: string, userAgent?: string) => {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) throw new Error("User already registered");

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      password: true,
      updatedAt: true,
      isAdmin: true,
      isModerator: true,
      isVerifiedPoster: true,
      isBlocked: true
    }
  });

  const accessToken = generateAccessToken(user);
  const refreshToken = await generateRefreshToken(user, ipAddress, userAgent);

  const { password: userPassword, ...safeUser } = user;

  return { user: safeUser, accessToken, refreshToken };
};


export const loginUserService = async (email: string, password: string, ipAddress?: string, userAgent?: string) => {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      name: true,
      email: true,
      password: true,
      createdAt: true,
      updatedAt: true,
      isAdmin: true,
      isModerator: true,
      isVerifiedPoster: true,
      isBlocked: true
    }
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  if (user.isBlocked) {
    throw new Error("Account is blocked");
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = await generateRefreshToken(user, ipAddress, userAgent);

  return { accessToken, refreshToken, user };
};


export const logoutUserService = async (refreshToken: string) => {
  if (!refreshToken) throw new Error("No refresh token provided");
  await revokeRefreshToken(refreshToken);
};


export const refreshUserTokenService = async (
  refreshToken: string,
  ipAddress?: string,
  userAgent?: string
) => {
  console.log("[refreshUserTokenService] Starting token refresh process");
  console.log("[refreshUserTokenService] Provided refresh token:", refreshToken);
  console.log("[refreshUserTokenService] IP Address:", ipAddress);
  console.log("[refreshUserTokenService] User Agent:", userAgent);

  if (!refreshToken) {
    console.log("[refreshUserTokenService] No refresh token provided");
    throw new Error("Refresh token missing");
  }

  console.log("[refreshUserTokenService] Verifying refresh token...");
  const tokenRecord = await verifyRefreshToken(refreshToken);
  console.log("[refreshUserTokenService] Token record:", tokenRecord);

  console.log("[refreshUserTokenService] Fetching user with ID:", tokenRecord.userId);
  const user = await prisma.user.findUnique({
    where: { id: tokenRecord.userId },
    select: {
      id: true,
      name: true,
      email: true,
      password: false,
      createdAt: true,
      updatedAt: true,
      isAdmin: true,
      isModerator: true,
      isVerifiedPoster: true,
      isBlocked: true
    }
  });
  console.log("[refreshUserTokenService] Retrieved user:", user);

  if (!user) {
    console.log("[refreshUserTokenService] User not found for ID:", tokenRecord.userId);
    throw new Error("User not found");
  }
  if (user.isBlocked) {
    console.log("[refreshUserTokenService] User is blocked:", user.id);
    throw new Error("Account is blocked");
  }

  console.log("[refreshUserTokenService] Generating new access token...");
  const newAccessToken = generateAccessToken(user);
  console.log("[refreshUserTokenService] New access token generated:", newAccessToken);

  console.log("[refreshUserTokenService] Generating new refresh token...");
  const newRefreshToken = await generateRefreshToken(user, ipAddress, userAgent);
  console.log("[refreshUserTokenService] New refresh token generated:", newRefreshToken);

  console.log("[refreshUserTokenService] Revoking old refresh token ID:", tokenRecord.id);
  await prisma.refreshToken.update({
    where: { id: tokenRecord.id },
    data: { isRevoked: true }
  });
  console.log("[refreshUserTokenService] Old refresh token revoked");

  console.log("[refreshUserTokenService] Returning new tokens");
  return { newAccessToken, newRefreshToken };
};

export const logoutUser = async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(400).json({ error: "Refresh token missing" });
  }

  const refreshToken = authHeader.split(" ")[1];

  try {
    await logoutUserService(refreshToken);
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to log out" });
  }
};