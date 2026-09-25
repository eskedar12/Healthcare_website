import express from 'express';
import rateLimit from 'express-rate-limit';
import { 
  register, 
  login, 
  refreshToken, 
  getMe, 
  logout 
} from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import { checkRole, ROLES } from '../middleware/roleCheck.js';
import { validate } from '../middleware/validate.js';
import { 
  registerValidation, 
  loginValidation, 
  refreshTokenValidation 
} from '../validations/authValidation.js';

const router = express.Router();

// Brute-force protection on login: 10 attempts per 15 minutes per IP.
// Successful logins don't count against the limit.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  message: {
    success: false,
    message: 'Too many login attempts. Please try again in a few minutes.'
  }
});

// Public routes
router.post('/login', loginLimiter, loginValidation, validate, login);
router.post('/refresh-token', refreshTokenValidation, validate, refreshToken);

// Protected routes
router.get('/me', authenticate, getMe);
router.post('/logout', authenticate, logout);

// Admin only - register new users
router.post(
  '/register', 
  authenticate, 
  checkRole(ROLES.SUPER_ADMIN, ROLES.HOSPITAL_ADMIN), 
  registerValidation, 
  validate, 
  register
);

export default router;