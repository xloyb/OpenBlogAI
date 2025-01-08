// src/utils/logger.ts
import winston from 'winston';

// Configure log format
const logFormat = winston.format.printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

// Create logger instance
export const logger = winston.createLogger({
  level: 'info',  // Log level (error, warn, info, http, debug)
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.colorize(),
    logFormat
  ),
  transports: [
    // Log to console
    new winston.transports.Console(),

    // Log errors to a file
    new winston.transports.File({ filename: 'logs/error.log',
 level: 'error' }),

    // Log all info to a separate file
    new winston.transports.File({ filename: 'logs/app.log' }),
  ],
});