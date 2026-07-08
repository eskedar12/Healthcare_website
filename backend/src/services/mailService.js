import nodemailer from 'nodemailer'

let transporter = null

// Lazily create the transporter so a missing/incomplete config doesn't
// crash the whole server on boot — it just fails the first send with a
// clear error instead.
const getTransporter = () => {
  if (transporter) return transporter

  const { EMAIL_USER, EMAIL_PASS } = process.env
  if (!EMAIL_USER || !EMAIL_PASS) {
    throw new Error(
      'Email is not configured. Set EMAIL_USER and EMAIL_PASS (a Gmail App Password) in .env'
    )
  }

  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS
    }
  })

  return transporter
}

// Sends the clinic owner a notification email whenever someone submits
// the public "Contact us" form.
export const sendContactNotification = async (inquiry) => {
  const to = process.env.CONTACT_EMAIL_TO || process.env.EMAIL_USER
  const { name, email, phone, subject, message } = inquiry

  await getTransporter().sendMail({
    from: `"Lebeza Psychiatry Website" <${process.env.EMAIL_USER}>`,
    to,
    replyTo: email,
    subject: `New website inquiry: ${subject || 'General'}`,
    text: [
      `New contact form submission from the website.`,
      ``,
      `Name: ${name}`,
      `Email: ${email}`,
      `Phone: ${phone || '—'}`,
      `Subject: ${subject || '—'}`,
      ``,
      `Message:`,
      message
    ].join('\n'),
    html: `
      <div style="font-family: sans-serif; line-height: 1.6;">
        <h2>New contact form submission</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(phone || '—')}</p>
        <p><strong>Subject:</strong> ${escapeHtml(subject || '—')}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(message).replace(/\n/g, '<br/>')}</p>
      </div>
    `
  })
}

const escapeHtml = (str = '') =>
  String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

export default { sendContactNotification }
