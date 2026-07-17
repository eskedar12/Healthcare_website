import express from 'express';
import {
  getBranches,
  getBranch,
  createBranch,
  updateBranch,
  deleteBranch,
  getBranchStats
} from '../controllers/branchController.js';
import { authenticate, requirePermission } from '../middleware/auth.js';
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
  requirePermission('manage_branches'), 
  createBranchValidation, 
  validate, 
  createBranch
);

router.put(
  '/:id', 
  authenticate, 
  requirePermission('manage_branches'), 
  updateBranchValidation, 
  validate, 
  updateBranch
);

router.delete(
  '/:id', 
  authenticate, 
  requirePermission('manage_branches'), 
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