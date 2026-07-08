import { 
  getAllUsers, 
  getUserById, 
  createUser as createUserService, 
  updateUser as updateUserService, 
  deleteUser as deleteUserService,
  deactivateUser as deactivateUserService,
  activateUser as activateUserService
} from '../services/userService.js';
import { sendSuccess, sendCreated } from '../utils/response.js';

export const getUsers = async (req, res, next) => {
  try {
    const filters = req.query;
    const users = await getAllUsers(filters);
    sendSuccess(res, 'Users retrieved successfully', users);
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await getUserById(id);
    sendSuccess(res, 'User retrieved successfully', user);
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req, res, next) => {
  try {
    const user = await createUserService(req.body);
    sendCreated(res, 'User created successfully', user);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await updateUserService(id, req.body);
    sendSuccess(res, 'User updated successfully', user);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    await deleteUserService(id);
    sendSuccess(res, 'User deleted successfully');
  } catch (error) {
    next(error);
  }
};

export const deactivateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await deactivateUserService(id);
    sendSuccess(res, 'User deactivated successfully', user);
  } catch (error) {
    next(error);
  }
};

export const activateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await activateUserService(id);
    sendSuccess(res, 'User activated successfully', user);
  } catch (error) {
    next(error);
  }
};