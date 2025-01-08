import { Router } from 'express';
import { registerUser, loginUser } from '@controllers/authController';
import rateLimit from 'express-rate-limit';

const router = Router();

// Rate limit for login specifically
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 2,
  message: 'Too many login attempts, try again later in 15 Minutes.',
});

// Apply only to the login route
router.post('/register', registerUser);
router.post('/login', loginLimiter, loginUser);

export default router;