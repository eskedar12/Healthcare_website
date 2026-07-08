import { ContactMessage } from '../models/index.js'
import { sendContactNotification } from '../services/mailService.js'
import { sendCreated, sendSuccess } from '../utils/response.js'

// Public: someone submits the "Contact us" form on the website
export const createInquiry = async (req, res, next) => {
  try {
    const { name, email, phone, subject, message } = req.body

    const inquiry = await ContactMessage.create({ name, email, phone, subject, message })

    // Don't let a broken mail server fail the whole request — the
    // message is already saved, so we log the mail error and still
    // tell the visitor their message went through.
    try {
      await sendContactNotification({ name, email, phone, subject, message })
    } catch (mailError) {
      console.error('⚠️ Failed to send contact notification email:', mailError.message)
    }

    sendCreated(res, 'Thank you, your message has been sent.', inquiry)
  } catch (error) {
    next(error)
  }
}

// Admin: list submitted messages
export const getInquiries = async (req, res, next) => {
  try {
    const messages = await ContactMessage.findAll({ order: [['created_at', 'DESC']] })
    sendSuccess(res, 'Messages retrieved successfully', messages)
  } catch (error) {
    next(error)
  }
}

// Admin: mark a message as read/replied
export const updateInquiryStatus = async (req, res, next) => {
  try {
    const { id } = req.params
    const { status } = req.body
    const inquiry = await ContactMessage.findByPk(id)
    if (!inquiry) return sendSuccess(res, 'Message not found', null, 404)
    inquiry.status = status
    await inquiry.save()
    sendSuccess(res, 'Message updated successfully', inquiry)
  } catch (error) {
    next(error)
  }
}
