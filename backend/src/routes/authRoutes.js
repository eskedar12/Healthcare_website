import express from 'express';
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

// Public routes
router.post('/login', loginValidation, validate, login);
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