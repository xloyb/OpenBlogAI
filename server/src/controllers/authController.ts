

import { Request, Response, NextFunction } from "express";
import { 
  registerUserService, 
  loginUserService, 
  refreshUserTokenService, 
  logoutUserService 
} from "@services/userService";

export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const ipAddress = req.ip || 'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';

    const { user, accessToken, refreshToken } = await registerUserService(email, password, ipAddress, userAgent);

    res.status(201).json({
      message: "User registered successfully",
      accessToken,
      refreshToken,
      user
    });
  } catch (error) {
    if ((error as Error).message === "User already registered") {
      return res.status(409).json({ error: "User already exists" });
    }
    next(error);
  }
};

// Login User
export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const ipAddress = req.ip || 'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';

    const { accessToken, refreshToken, user } = await loginUserService(email, password, ipAddress, userAgent);

    res.json({ 
      message: "Login successful", 
      accessToken, 
      refreshToken, 
      user 
    });
  } catch (error) {
    if ((error as Error).message === "Invalid email or password") {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    if ((error as Error).message === "Account is blocked") {
      return res.status(403).json({ error: "Your account is blocked" });
    }
    next(error);
  }
};

// Refresh Token
export const refreshToken = async (req: Request, res: Response) => {
  console.log("[refreshToken] Received POST /api/auth/refresh request");
  console.log("[refreshToken] Request headers:", req.headers);

  const authHeader = req.headers.authorization;
  console.log("[refreshToken] Authorization header:", authHeader);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("[refreshToken] Missing or invalid Authorization header");
    return res.status(401).json({ error: "Authorization header missing or invalid" });
  }

  const refreshToken = authHeader.split(" ")[1];
  console.log("[refreshToken] Extracted refresh token:", refreshToken);

  const ipAddress = req.ip || 'unknown';
  const userAgent = req.headers['user-agent'] || 'unknown';
  console.log("[refreshToken] IP Address:", ipAddress);
  console.log("[refreshToken] User Agent:", userAgent);

  try {
    console.log("[refreshToken] Calling refreshUserTokenService...");
    const { newAccessToken, newRefreshToken } = await refreshUserTokenService(
      refreshToken,
      ipAddress,
      userAgent
    );
    console.log("[refreshToken] Successfully refreshed tokens:");
    console.log("[refreshToken] New Access Token:", newAccessToken);
    console.log("[refreshToken] New Refresh Token:", newRefreshToken);

    res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  } catch (error) {
    console.error("[refreshToken] Error in refreshUserTokenService:", error);

    if ((error as Error).message === "Invalid or expired refresh token") {
      console.log("[refreshToken] Detected invalid or expired refresh token");
      return res.status(403).json({ error: "Invalid or expired refresh token" });
    }
    if ((error as Error).message === "Account is blocked") {
      console.log("[refreshToken] Detected blocked account");
      return res.status(403).json({ error: "Your account is blocked" });
    }
    console.log("[refreshToken] Unhandled error, returning 500");
    res.status(500).json({ error: "Failed to refresh token" });
  }
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