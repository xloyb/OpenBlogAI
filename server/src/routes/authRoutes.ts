import { Router, Request, Response } from 'express';
import { registerUser, loginUser, refreshToken, logoutUser  } from '@controllers/authController';
import rateLimit from 'express-rate-limit';

const router = Router();

// Rate limit for login specifically
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 2,
  message: 'Too many login attempts, try again later in 15 Minutes.',
});

// Apply only to the login route
router.post('/register', registerUser as any);
router.post('/login', loginLimiter, loginUser as any);
router.post('/refresh', refreshToken as any);  
router.post('/logout', logoutUser as any);

export default router;