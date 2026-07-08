import { Service } from '../models/index.js'
import { Op } from 'sequelize'

export const getAllServices = async (filters = {}) => {
  const { search, status } = filters
  const where = {}

  if (status) where.status = status

  if (search) {
    where[Op.or] = [
      { code: { [Op.like]: `%${search}%` } },
      { name: { [Op.like]: `%${search}%` } },
      { duration: { [Op.like]: `%${search}%` } },
      { price: { [Op.like]: `%${search}%` } }
    ]
  }

  return await Service.findAll({ where, order: [['name', 'ASC']] })
}

export const getServiceById = async (id) => {
  const service = await Service.findByPk(id)
  if (!service) {
    throw new Error('Service not found')
  }
  return service
}

export const createService = async (serviceData) => {
  const existingService = await Service.findOne({ where: { code: serviceData.code } })
  if (existingService) {
    throw new Error('Service with this code already exists')
  }
  return await Service.create(serviceData)
}

export const updateService = async (id, updateData) => {
  const service = await Service.findByPk(id)
  if (!service) {
    throw new Error('Service not found')
  }
  if (updateData.code && updateData.code !== service.code) {
    const existingService = await Service.findOne({ where: { code: updateData.code, id: { [Op.ne]: id } } })
    if (existingService) {
      throw new Error('Service with this code already exists')
    }
  }
  await service.update(updateData)
  return service
}

export const deleteService = async (id) => {
  const service = await Service.findByPk(id)
  if (!service) {
    throw new Error('Service not found')
  }
  await service.destroy()
  return true
}
