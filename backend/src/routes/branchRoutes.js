import express from 'express';
import {
  getBranches,
  getBranch,
  createBranch,
  updateBranch,
  deleteBranch,
  getBranchStats
} from '../controllers/branchController.js';
import { authenticate } from '../middleware/auth.js';
import { checkRole, ROLES } from '../middleware/roleCheck.js';
import { validate } from '../middleware/validate.js';
import { 
  createBranchValidation, 
  updateBranchValidation, 
  branchIdValidation 
} from '../validations/branchValidation.js';

const router = express.Router();

// Public routes
router.get('/', getBranches);
router.get('/:id', branchIdValidation, validate, getBranch);

// Protected routes (Admin only)
router.post(
  '/', 
  authenticate, 
  checkRole(ROLES.SUPER_ADMIN, ROLES.HOSPITAL_ADMIN), 
  createBranchValidation, 
  validate, 
  createBranch
);

router.put(
  '/:id', 
  authenticate, 
  checkRole(ROLES.SUPER_ADMIN, ROLES.HOSPITAL_ADMIN), 
  updateBranchValidation, 
  validate, 
  updateBranch
);

router.delete(
  '/:id', 
  authenticate, 
  checkRole(ROLES.SUPER_ADMIN, ROLES.HOSPITAL_ADMIN), 
  branchIdValidation, 
  validate, 
  deleteBranch
);

router.get(
  '/:id/stats', 
  authenticate, 
  branchIdValidation, 
  validate, 
  getBranchStats
);

export default router;