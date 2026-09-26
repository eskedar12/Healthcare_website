// Render's free web services block outbound SMTP ports (25, 465, 587), so
// nodemailer talking to Gmail/SMTP times out in production even though it
// works fine locally. This sends mail via Brevo's transactional email API
// over plain HTTPS (port 443) instead, which isn't blocked.
//
// Setup:
//  1. Sign up at https://www.brevo.com (free tier: 300 emails/day)
//  2. Verify a sender — Settings > Senders & IP > Add a sender. You can
//     verify your existing Gmail address here; no domain/DNS needed.
//  3. Create an API key — Settings > SMTP & API > API Keys > Generate a new key
//  4. Set these env vars on Render (backend service):
//       BREVO_API_KEY=xkeysib-...
//       EMAIL_FROM=your_verified_sender@gmail.com
//       CONTACT_EMAIL_TO=where_notifications_should_land@gmail.com
//     (EMAIL_USER / EMAIL_PASS are no longer used and can be removed.)

const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email'

const escapeHtml = (str = '') =>
  String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

// Sends the clinic owner a notification email whenever someone submits
// the public "Contact us" form.
export const sendContactNotification = async (inquiry) => {
  const { BREVO_API_KEY, EMAIL_FROM } = process.env
  const to = process.env.CONTACT_EMAIL_TO || EMAIL_FROM

  if (!BREVO_API_KEY || !EMAIL_FROM) {
    throw new Error(
      'Email is not configured. Set BREVO_API_KEY and EMAIL_FROM in your environment variables.'
    )
  }

  const { name, email, phone, subject, message } = inquiry

  const textContent = [
    `New contact form submission from the website.`,
    ``,
    `Name: ${name}`,
    `Email: ${email}`,
    `Phone: ${phone || '—'}`,
    `Subject: ${subject || '—'}`,
    ``,
    `Message:`,
    message
  ].join('\n')

  const htmlContent = `
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

  const response = await fetch(BREVO_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'api-key': BREVO_API_KEY
    },
    body: JSON.stringify({
      sender: { name: 'Lebeza Psychiatry Website', email: EMAIL_FROM },
      to: [{ email: to }],
      replyTo: { email },
      subject: `New website inquiry: ${subject || 'General'}`,
      textContent,
      htmlContent
    })
  })

  if (!response.ok) {
    const errorBody = await response.text().catch(() => '')
    throw new Error(`Brevo API error (${response.status}): ${errorBody}`)
  }
}

export default { sendContactNotification }