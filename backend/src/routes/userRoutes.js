import express from 'express';
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  deactivateUser,
  activateUser
} from '../controllers/userController.js';
import { authenticate } from '../middleware/auth.js';
import { checkRole, ROLES } from '../middleware/roleCheck.js';
import { validate } from '../middleware/validate.js';
import { 
  updateUserValidation, 
  userIdValidation 
} from '../validations/userValidation.js';
import { registerValidation } from '../validations/authValidation.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Admin only routes
router.get('/', checkRole(ROLES.SUPER_ADMIN, ROLES.HOSPITAL_ADMIN), getUsers);
router.post(
  '/', 
  checkRole(ROLES.SUPER_ADMIN, ROLES.HOSPITAL_ADMIN), 
  registerValidation, 
  validate, 
  createUser
);

// User specific routes
router.get('/:id', userIdValidation, validate, getUser);
router.put(
  '/:id', 
  updateUserValidation, 
  validate, 
  updateUser
);
router.delete(
  '/:id', 
  checkRole(ROLES.SUPER_ADMIN, ROLES.HOSPITAL_ADMIN), 
  userIdValidation, 
  validate, 
  deleteUser
);
router.patch(
  '/:id/deactivate', 
  checkRole(ROLES.SUPER_ADMIN, ROLES.HOSPITAL_ADMIN), 
  userIdValidation, 
  validate, 
  deactivateUser
);
router.patch(
  '/:id/activate', 
  checkRole(ROLES.SUPER_ADMIN, ROLES.HOSPITAL_ADMIN), 
  userIdValidation, 
  validate, 
  activateUser
);

export default router;