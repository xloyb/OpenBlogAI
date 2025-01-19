import { NextFunction, Request, Response } from "express";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Check if the response has already been sent
  if (res.headersSent) {
    return next(err);
  }

  // Default to a 500 status code if not explicitly set
  const statusCode = err.status || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    error: true,
    message,
  });
};
