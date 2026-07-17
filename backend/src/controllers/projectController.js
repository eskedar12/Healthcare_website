import {
  getAllProjects,
  getProjectById,
  createProject as createProjectService,
  updateProject as updateProjectService,
  deleteProject as deleteProjectService
} from '../services/projectService.js'
import { sendSuccess, sendCreated } from '../utils/response.js'

export const getProjects = async (req, res, next) => {
  try {
    const projects = await getAllProjects(req.query)
    sendSuccess(res, 'Projects retrieved successfully', projects)
  } catch (error) {
    next(error)
  }
}

export const getProject = async (req, res, next) => {
  try {
    const { id } = req.params
    const project = await getProjectById(id)
    sendSuccess(res, 'Project retrieved successfully', project)
  } catch (error) {
    next(error)
  }
}

export const createProject = async (req, res, next) => {
  try {
    const project = await createProjectService(req.body)
    sendCreated(res, 'Project created successfully', project)
  } catch (error) {
    next(error)
  }
}

export const updateProject = async (req, res, next) => {
  try {
    const { id } = req.params
    const project = await updateProjectService(id, req.body)
    sendSuccess(res, 'Project updated successfully', project)
  } catch (error) {
    next(error)
  }
}

export const deleteProject = async (req, res, next) => {
  try {
    const { id } = req.params
    await deleteProjectService(id)
    sendSuccess(res, 'Project deleted successfully')
  } catch (error) {
    next(error)
  }
}
