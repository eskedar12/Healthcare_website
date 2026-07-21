import { ContactMessage } from '../models/index.js'
import { sendContactNotification } from '../services/mailService.js'
import { sendCreated, sendSuccess } from '../utils/response.js'

// Public: someone submits the "Contact us" form on the website
export const createInquiry = async (req, res, next) => {
  try {
    const { name, email, phone, subject, message } = req.body

    const inquiry = await ContactMessage.create({ name, email, phone, subject, message })

    // Respond right away — the message is already saved, so the visitor's
    // request should never wait on (or fail because of) the mail server.
    sendCreated(res, 'Thank you, your message has been sent.', inquiry)

    // Fire the notification email in the background. Some hosts block or
    // are very slow on outbound SMTP, which used to make this whole request
    // hang/time out client-side even though the message was already saved.
    sendContactNotification({ name, email, phone, subject, message }).catch((mailError) => {
      console.error('⚠️ Failed to send contact notification email:', mailError.message)
    })
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