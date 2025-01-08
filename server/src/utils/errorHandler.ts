
import { NextFunction, Request, Response } from "express";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Default to a 500 status code if not explicitly set
  const statusCode = err.status || 500;
  const message = err.message || "Internal Server Error";

  // Send a consistent JSON response for errors
  res.status(statusCode).json({
    error: true,
    message,
  });
};