import { CLINIC_INFO } from '../../utils/constants'
import FAQS from '../../data/faqs'

// Simple, fully client-side keyword-matching knowledge base — no external
// API calls, so it works with no backend/network dependency. Each entry is
// checked against the visitor's message; the first entry whose keywords
// all/any match (see matchAnswer below) wins.
export const KNOWLEDGE_BASE = [
  {
    keywords: ['hour', 'open', 'close', 'time'],
    answer: `We're open ${CLINIC_INFO.hours} for urgent care, with scheduled outpatient appointments generally available 8:00 AM–5:00 PM, Monday–Saturday.`,
  },
  {
    keywords: ['address', 'location', 'where', 'find you', 'directions'],
    answer: `Our clinic is located in ${CLINIC_INFO.location}. You'll also find the address in the footer of this site.`,
  },
  {
    keywords: ['phone', 'call', 'number', 'contact'],
    answer: `You can reach us at ${CLINIC_INFO.phone} or email ${CLINIC_INFO.email}.`,
  },
  {
    keywords: ['email'],
    answer: `Our email is ${CLINIC_INFO.email}.`,
  },
  {
    keywords: ['book', 'appointment', 'schedule', 'booking'],
    answer:
      "You can book an appointment using the 'Book here' button in the navigation bar, or fill out the form on this Contact page and our team will follow up.",
  },
  {
    keywords: ['price', 'cost', 'fee', 'insurance', 'payment'],
    answer:
      'We work with a number of insurance providers and offer flexible payment options. Send us a message with your specifics and our team will confirm what applies to you.',
  },
  {
    keywords: ['child', 'kid', 'teen', 'adolescent'],
    answer:
      'Yes — we have a dedicated Child & Adolescent Psychiatry department for younger patients.',
  },
  {
    keywords: ['doctor', 'psychiatrist', 'staff', 'therapist'],
    answer:
      'Our clinical team includes practicing psychiatrists, clinical psychologists and psychiatric nurses. You can see full profiles on our Doctors page.',
  },
  {
    keywords: ['service', 'treatment', 'help with', 'offer'],
    answer:
      'We offer adult psychiatry, child & adolescent psychiatry, clinical psychology and psychotherapy services. Visit the Services page for the full list.',
  },
  {
    keywords: ['emergency', 'urgent', 'crisis'],
    answer: `If this is a medical emergency, please call ${CLINIC_INFO.phone} immediately or go to your nearest emergency room.`,
  },
  {
    keywords: ['confidential', 'privacy', 'private'],
    answer:
      'All patient records are handled with strict confidentiality in our secure Electronic Medical Recording system.',
  },
  {
    keywords: ['hello', 'hi', 'hey'],
    answer: `Hello! I'm the Lebeza assistant. Ask me about our hours, location, services, or how to book an appointment.`,
  },
  {
    keywords: ['thank'],
    answer: "You're welcome! Is there anything else you'd like to know?",
  },
]

const FALLBACK_ANSWER =
  "I don't have an answer for that yet, but our team can help directly — send a message using the form on this page, or call " +
  CLINIC_INFO.phone +
  '.'

export const matchAnswer = (message) => {
  const text = message.toLowerCase()

  const kbHit = KNOWLEDGE_BASE.find((entry) =>
    entry.keywords.some((k) => text.includes(k))
  )
  if (kbHit) return kbHit.answer

  const faqHit = FAQS.find((faq) =>
    faq.question
      .toLowerCase()
      .split(/\W+/)
      .filter((w) => w.length > 3)
      .some((w) => text.includes(w))
  )
  if (faqHit) return faqHit.answer

  return FALLBACK_ANSWER
}

export const SUGGESTED_QUESTIONS = [
  'What are your working hours?',
  'How do I book an appointment?',
  'Where is the clinic located?',
  'Do you treat children?',
]

export default { KNOWLEDGE_BASE, matchAnswer, SUGGESTED_QUESTIONS }
