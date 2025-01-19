import { Request, Response, NextFunction } from 'express';
import { logger } from '@utils/logger';

// Log all incoming requests
export const globalLogger = (req: Request, res: Response,
 next: NextFunction) => {
  logger.info(`[${req.method}] ${req.originalUrl}`);
  
  // Capture response details after the request is processed
  res.on('finish', () => {
    logger.info(`[${req.method}] ${req.originalUrl} - ${res.statusCode}`);
  });

  next();
};

// Log uncaught errors globally
export const globalErrorLogger = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(`Error: ${err.message}`);
  logger.error(err.stack || 'No stack trace available');
  res.status(500).json({ error: 'Something went wrong!' });
};