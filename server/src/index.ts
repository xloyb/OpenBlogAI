
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import authRoutes from '@routes/authRoutes';
import { setupCSRF } from '@src/middlewares/csrfMiddleware';
import { globalErrorLogger, globalLogger }
  from '@src/middlewares/globalLogger';
import { globalErrorHandler } from '@src/utils/errorHandler';
import transcriptRoutes from './routes/transcriptRoutes';
import blogRoutes from './routes/blogRoutes';
import userRoutes from './routes/userRoutes';
import { redisClient, cacheManager } from '@src/utils/cache';
import { cachedBlogService } from '@src/services/cachedBlogService';

const app = express();

const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'https://example.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true,
};


// Use CORS middleware
app.use(cors(corsOptions));

// Set proxy to trust headers (useful for Heroku or proxies)
app.set('trust proxy', 1);

// 1. Apply essential security headers
app.use(helmet());

// 2. Parse JSON requests
app.use(express.json());

// 3. Log every request globally (should come before routes)
app.use(globalLogger);

// 4. Set up rate limiting to prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  // Return rate limit info in the `RateLimit-*`headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: 'Too many requests, please try again later.',
});
app.use(limiter);

// 5. Set up CSRF protection middleware (requires this order) - DISABLED FOR DEVELOPMENT
// setupCSRF(app);

// 6. Define basic routes
app.get('/', (req, res) => {
  res.send("Welcome to xLoy's Server!");
});

// 7. Load application routes (organized under `/api` prefix)
app.use('/api/auth', authRoutes);
app.use('/api/transcript', transcriptRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/users", userRoutes);



// 8. Global error handling middleware (should be the last middleware)
app.use(globalErrorHandler);

// 9. Initialize Redis and start the server
const PORT = parseInt(process.env.PORT || '8082', 10);

async function startServer() {
  try {
    // Initialize Redis connection with graceful fallback
    console.log('Initializing Redis connection...');
    let redisConnected = false;

    try {
      // Try to connect to Redis with timeout
      await Promise.race([
        redisClient.connect(),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Redis connection timeout')), 3000))
      ]);

      // Check Redis connection status with a short delay
      await new Promise(resolve => setTimeout(resolve, 100));
      redisConnected = await cacheManager.isConnected();

      if (redisConnected) {
        console.log('✅ Redis connected successfully');

        // Warm up cache with commonly requested data (optional)
        setTimeout(async () => {
          try {
            await cachedBlogService.warmUpCache();
            console.log('✅ Cache warm-up completed');
          } catch (error) {
            console.warn('⚠️ Cache warm-up failed (non-critical):', error);
          }
        }, 2000); // Wait 2 seconds after server start
      }
    } catch (error) {
      console.warn('⚠️ Redis connection failed - continuing without cache');
      console.warn('⚠️ Cache will be bypassed and data will be served directly from database');
      redisConnected = false;

      // Ensure Redis client is disconnected to prevent reconnection attempts
      try {
        redisClient.disconnect(false);
      } catch (disconnectError) {
        // Ignore disconnect errors
      }
    }

    // Start the Express server regardless of Redis status
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${PORT} - http://0.0.0.0:${PORT}`);
      if (redisConnected) {
        console.log(`📊 Cache stats endpoint: http://0.0.0.0:${PORT}/api/blog/cache/stats`);
        console.log(`🗑️ Cache invalidation endpoint: http://0.0.0.0:${PORT}/api/blog/cache/invalidate`);
      } else {
        console.log(`⚠️ Cache endpoints unavailable - Redis not connected`);
      }
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}// Handle graceful shutdown
process.on('SIGTERM', async () => {
  console.log('🛑 SIGTERM received, shutting down gracefully...');
  await redisClient.quit();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('🛑 SIGINT received, shutting down gracefully...');
  await redisClient.quit();
  process.exit(0);
});

startServer();