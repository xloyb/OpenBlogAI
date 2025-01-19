import { NextFunction, Request, Response } from "express";
import { registerUserService, loginUserService, refreshUserTokenService, logoutUserService } from "@services/userService";

// Register User Controller
export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
       res.status(400).json({ error: true, message: "Email and password are required" });
    }

    const { user, token } = await registerUserService(email, password);

    res.status(201).json({
      message: "User registered successfully",
      token,
    });
  } catch (error) {
    next(error); // Pass the error to the global error handler
  }
};

// Login User Controller
export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;
    const ipAddress = req.ip || 'unknown'; 
    const userAgent = req.headers['user-agent'] || 'unknown'; // Extract the user's device/user agent

    const { accessToken, refreshToken } = await loginUserService(email, password, ipAddress, userAgent);

    res.json({ message: 'Login successful', accessToken, refreshToken });
  } catch (error) {
    next(error); // Pass the error to the global error handler
  }
};

// Refresh Token Controller
export const refreshToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ error: 'Refresh token missing' });
  }

  try {
    const { newAccessToken, newRefreshToken } = await refreshUserTokenService(refreshToken);
    res.json({ newAccessToken, newRefreshToken });
  } catch (error) {
    res.status(403).json({ error: 'Invalid refresh token' });
  }
};

// Logout User Controller
export const logoutUser = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ error: 'Refresh token missing' });
  }

  try {
    await logoutUserService(refreshToken);
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to log out" });
  }
};