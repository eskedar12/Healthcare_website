import { Branch, User, Appointment } from '../models/index.js';
import { Op } from 'sequelize';

export const getAllBranches = async (filters = {}) => {
  const { is_active, search } = filters;
  
  const where = {};
  if (is_active !== undefined) where.is_active = is_active;
  
  if (search) {
    where[Op.or] = [
      { name: { [Op.like]: `%${search}%` } },
      { address: { [Op.like]: `%${search}%` } },
      { phone: { [Op.like]: `%${search}%` } }
    ];
  }
  
  const branches = await Branch.findAll({
    where,
    include: [
      {
        model: User,
        as: 'users',
        attributes: ['id', 'full_name', 'email', 'role'],
        where: { is_active: true },
        required: false
      }
    ],
    order: [['name', 'ASC']]
  });
  
  return branches;
};

export const getBranchById = async (id) => {
  const branch = await Branch.findByPk(id, {
    include: [
      {
        model: User,
        as: 'users',
        attributes: ['id', 'full_name', 'email', 'role'],
        where: { is_active: true },
        required: false
      }
    ]
  });
  
  if (!branch) {
    throw new Error('Branch not found');
  }
  
  return branch;
};

export const createBranch = async (branchData) => {
  const normalizedData = {
    ...branchData,
    working_hours: branchData.working_hours || branchData.hours
  };

  const branch = await Branch.create(normalizedData);
  return branch;
};

export const updateBranch = async (id, updateData) => {
  const branch = await Branch.findByPk(id);
  
  if (!branch) {
    throw new Error('Branch not found');
  }

  const normalizedData = {
    ...updateData,
    working_hours: updateData.working_hours || updateData.hours
  };
  
  await branch.update(normalizedData);
  return branch;
};

export const deleteBranch = async (id) => {
  const branch = await Branch.findByPk(id);
  
  if (!branch) {
    throw new Error('Branch not found');
  }
  
  // Check if branch has active users
  const userCount = await User.count({
    where: { branch_id: id, is_active: true }
  });
  
  if (userCount > 0) {
    throw new Error('Cannot delete branch with active users');
  }
  
  // Soft delete
  await branch.destroy();
  return true;
};

export const getBranchStats = async (id) => {
  const branch = await Branch.findByPk(id);
  
  if (!branch) {
    throw new Error('Branch not found');
  }
  
  const totalAppointments = await Appointment.count({
    where: { branch_id: id }
  });
  
  const pendingAppointments = await Appointment.count({
    where: { branch_id: id, status: 'pending' }
  });
  
  const confirmedAppointments = await Appointment.count({
    where: { branch_id: id, status: 'confirmed' }
  });
  
  const completedAppointments = await Appointment.count({
    where: { branch_id: id, status: 'completed' }
  });
  
  return {
    totalAppointments,
    pendingAppointments,
    confirmedAppointments,
    completedAppointments
  };
};