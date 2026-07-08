import {
  getAllServices,
  getServiceById,
  createService as createServiceService,
  updateService as updateServiceService,
  deleteService as deleteServiceService
} from '../services/serviceService.js'
import { sendSuccess, sendCreated } from '../utils/response.js'

export const getServices = async (req, res, next) => {
  try {
    const services = await getAllServices(req.query)
    sendSuccess(res, 'Services retrieved successfully', services)
  } catch (error) {
    next(error)
  }
}

export const getService = async (req, res, next) => {
  try {
    const { id } = req.params
    const service = await getServiceById(id)
    sendSuccess(res, 'Service retrieved successfully', service)
  } catch (error) {
    next(error)
  }
}

export const createService = async (req, res, next) => {
  try {
    const service = await createServiceService(req.body)
    sendCreated(res, 'Service created successfully', service)
  } catch (error) {
    next(error)
  }
}

export const updateService = async (req, res, next) => {
  try {
    const { id } = req.params
    const service = await updateServiceService(id, req.body)
    sendSuccess(res, 'Service updated successfully', service)
  } catch (error) {
    next(error)
  }
}

export const deleteService = async (req, res, next) => {
  try {
    const { id } = req.params
    await deleteServiceService(id)
    sendSuccess(res, 'Service deleted successfully')
  } catch (error) {
    next(error)
  }
}
