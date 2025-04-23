
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

const app = express();

const corsOptions = {
  origin: ['http://localhost:3002', 'http://localhost:3001', 'https://example.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
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
// app.use(limiter);

// 5. Set up CSRF protection middleware (requires this order)
// setupCSRF(app);

// 6. Define basic routes
app.get('/', (req, res) => {
  res.send("Welcome to xLoy's Server!");
});

// 7. Load application routes (organized under `/api` prefix)
app.use('/api/auth', authRoutes);
app.use('/api/transcript', transcriptRoutes); 
app.use("/api/blog", blogRoutes); 



// 8. Global error handling middleware (should be the last middleware)
app.use(globalErrorHandler);

// 9. Start the server
app.listen(8082,'0.0.0.0', () => {
  console.log('Server running on port 8081 - http://0.0.0.0:8081');
});