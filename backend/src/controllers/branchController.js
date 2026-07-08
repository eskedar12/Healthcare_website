import { 
  getAllBranches, 
  getBranchById, 
  createBranch as createBranchService, 
  updateBranch as updateBranchService, 
  deleteBranch as deleteBranchService,
  getBranchStats as getBranchStatsService
} from '../services/branchService.js';
import { sendSuccess, sendCreated } from '../utils/response.js';

export const getBranches = async (req, res, next) => {
  try {
    const filters = req.query;
    const branches = await getAllBranches(filters);
    sendSuccess(res, 'Branches retrieved successfully', branches);
  } catch (error) {
    next(error);
  }
};

export const getBranch = async (req, res, next) => {
  try {
    const { id } = req.params;
    const branch = await getBranchById(id);
    sendSuccess(res, 'Branch retrieved successfully', branch);
  } catch (error) {
    next(error);
  }
};

export const createBranch = async (req, res, next) => {
  try {
    const branch = await createBranchService(req.body);
    sendCreated(res, 'Branch created successfully', branch);
  } catch (error) {
    next(error);
  }
};

export const updateBranch = async (req, res, next) => {
  try {
    const { id } = req.params;
    const branch = await updateBranchService(id, req.body);
    sendSuccess(res, 'Branch updated successfully', branch);
  } catch (error) {
    next(error);
  }
};

export const deleteBranch = async (req, res, next) => {
  try {
    const { id } = req.params;
    await deleteBranchService(id);
    sendSuccess(res, 'Branch deleted successfully');
  } catch (error) {
    next(error);
  }
};

export const getBranchStats = async (req, res, next) => {
  try {
    const { id } = req.params;
    const stats = await getBranchStatsService(id);
    sendSuccess(res, 'Branch statistics retrieved successfully', stats);
  } catch (error) {
    next(error);
  }
};