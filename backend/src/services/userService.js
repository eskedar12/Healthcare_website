import { User } from '../models/index.js';
import { hashPassword } from '../utils/hashPassword.js';
import { Op } from 'sequelize';

export const getAllUsers = async (filters = {}) => {
  const { role, branch_id, is_active, search } = filters;
  
  const where = {};
  
  if (role) where.role = role;
  if (branch_id) where.branch_id = branch_id;
  if (is_active !== undefined) where.is_active = is_active;
  
  if (search) {
    where[Op.or] = [
      { full_name: { [Op.like]: `%${search}%` } },
      { email: { [Op.like]: `%${search}%` } }
    ];
  }
  
  const users = await User.findAll({
    where,
    attributes: { exclude: ['password'] },
    include: ['branch'],
    order: [['createdAt', 'DESC']]
  });
  
  return users;
};

export const getUserById = async (id) => {
  const user = await User.findByPk(id, {
    attributes: { exclude: ['password'] },
    include: ['branch']
  });
  
  if (!user) {
    throw new Error('User not found');
  }
  
  return user;
};

export const createUser = async (userData) => {
  const { email } = userData;
  
  // Check if user exists
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new Error('User already exists with this email');
  }
  
  // Hash password
  const hashedPassword = await hashPassword(userData.password);
  
  // Create user
  const user = await User.create({
    ...userData,
    password: hashedPassword
  });
  
  // Remove password from response
  const userResponse = user.toJSON();
  delete userResponse.password;
  
  return userResponse;
};

export const updateUser = async (id, updateData) => {
  const user = await User.findByPk(id);
  
  if (!user) {
    throw new Error('User not found');
  }
  
  // If updating password, hash it
  if (updateData.password) {
    updateData.password = await hashPassword(updateData.password);
  }
  
  await user.update(updateData);
  
  // Get updated user without password
  const updatedUser = await User.findByPk(id, {
    attributes: { exclude: ['password'] },
    include: ['branch']
  });
  
  return updatedUser;
};

export const deleteUser = async (id) => {
  const user = await User.findByPk(id);
  
  if (!user) {
    throw new Error('User not found');
  }
  
  // Soft delete
  await user.destroy();
  
  return true;
};

export const deactivateUser = async (id) => {
  const user = await User.findByPk(id);
  
  if (!user) {
    throw new Error('User not found');
  }
  
  await user.update({ is_active: false });
  
  return user;
};

export const activateUser = async (id) => {
  const user = await User.findByPk(id);
  
  if (!user) {
    throw new Error('User not found');
  }
  
  await user.update({ is_active: true });
  
  return user;
};