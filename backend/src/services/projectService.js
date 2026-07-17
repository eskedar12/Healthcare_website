import { Project } from '../models/index.js'
import { Op } from 'sequelize'

export const getAllProjects = async (filters = {}) => {
  const { search, is_active } = filters
  const where = {}

  if (is_active !== undefined) where.is_active = is_active

  if (search) {
    where[Op.or] = [
      { name: { [Op.like]: `%${search}%` } },
      { description: { [Op.like]: `%${search}%` } }
    ]
  }

  return await Project.findAll({ where, order: [['sort_order', 'ASC'], ['created_at', 'ASC']] })
}

export const getProjectById = async (id) => {
  const project = await Project.findByPk(id)
  if (!project) {
    throw new Error('Project not found')
  }
  return project
}

export const createProject = async (projectData) => {
  return await Project.create(projectData)
}

export const updateProject = async (id, updateData) => {
  const project = await Project.findByPk(id)
  if (!project) {
    throw new Error('Project not found')
  }
  await project.update(updateData)
  return project
}

export const deleteProject = async (id) => {
  const project = await Project.findByPk(id)
  if (!project) {
    throw new Error('Project not found')
  }
  await project.destroy()
  return true
}
