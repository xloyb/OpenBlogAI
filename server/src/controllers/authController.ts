import { NextFunction, Request, Response } from "express";
import { registerUserService, loginUserService }
from "@services/userService";
import { verifyToken } from "@src/utils/jwt";

// Extend Express Request type
declare module 'express' {
  interface Request {
    User?: {
      id: string;
      email: string;
      password: string;
    };
  }
}

// Register User Controller
export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;
    const { token } = await registerUserService(email, password);
    res.status(201).json({ token });
  } catch (error) {
    if (error instanceof Error && error.message === "User already registered") {
      res.status(400).json({ error: "User already registered" });
    } else {
      next(error);  // Pass the error to the global error handler
    }
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
    const { token } = await loginUserService(email, password); 
    res.json({ message: 'Login successful', token });
  } catch (error) {
    next(error);  // Pass the error to the global error handler
  }
};

// Auth Middleware
export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decoded = verifyToken(token) as { id: string; email: string;
 password: string };
    req.User = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};