import { Content } from '../models/index.js'
import { sendSuccess, sendBadRequest } from '../utils/response.js'

export const getPageContent = async (req, res, next) => {
  try {
    const { page } = req.params

    const entries = await Content.findAll({
      where: { page }
    })

    const contentMap = {}
    entries.forEach(entry => {
      contentMap[entry.section] = entry.content
    })

    // Pre-populate with default data for the home page if it doesn't exist
    if (Object.keys(contentMap).length === 0 && page === 'home') {
      contentMap.hero = {
        title: 'For your peace\nof mind.',
        description: 'Lebeza Psychiatry Consultation is a Private Limited Company (PLC) established in December 2016 by two psychiatrists and one public health specialist. Lebeza Psychiatry Clinic is established with the vision of providing mental health promotion, high quality mental health care, early intervention and treatment.'
      }

      contentMap.stats = [
        { value: '24/7', label: 'Working Hours' },
        { value: '2,426+', label: 'Patients a Year' },
        { value: '35', label: 'Clinical Staff' },
        { value: '40+', label: 'Community Projects' }
      ]

      contentMap.about = {
        title: 'You have lots of reasons to choose us',
        description: 'Lebeza Psychiatry Consultation is a Private Limited Company (PLC) established in December 2016 by two psychiatrists and one public health specialist. Lebeza Psychiatry Clinic is established with the vision of providing mental health promotion, high quality mental health care, early intervention and treatment. Equipped with a modern ambulance, an Electronic Medical Recording (EMR) system particularly tailored for mental health care, Lebeza is now home for ten practicing psychiatrists, three experienced clinical psychologists, six psychiatric nurses as well as 15 ancillary staff members.'
      }
    }

    sendSuccess(res, 'Page content retrieved successfully', contentMap)
  } catch (error) {
    next(error)
  }
}

export const uploadContentImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return sendBadRequest(res, 'No image file provided')
    }

    // multer-storage-cloudinary puts the hosted https:// URL in req.file.path
    const url = req.file.path
    sendSuccess(res, 'Image uploaded successfully', { url })
  } catch (error) {
    next(error)
  }
}

export const updatePageContent = async (req, res, next) => {
  try {
    const { page } = req.params
    const sections = req.body

    if (!sections || typeof sections !== 'object') {
      return sendBadRequest(res, 'Invalid request body')
    }

    const userId = req.user?.id

    for (const [section, content] of Object.entries(sections)) {
      await Content.upsert({
        page,
        section,
        content,
        created_by: userId,
        is_published: true,
        published_at: new Date()
      })
    }

    // Retrieve updated content
    const entries = await Content.findAll({
      where: { page }
    })

    const contentMap = {}
    entries.forEach(entry => {
      contentMap[entry.section] = entry.content
    })

    sendSuccess(res, 'Page content updated successfully', contentMap)
  } catch (error) {
    next(error)
  }
}