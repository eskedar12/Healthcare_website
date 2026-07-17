export const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Services', to: '/services' },
  { label: 'About us', to: '/about' },
  { label: 'Blog', to: '/blog' },
  { label: 'Projects', to: '/projects' },
  { label: 'Contact us', to: '/contact' },
]

export const CLINIC_INFO = {
  name: 'Lebeza Psychiatry Consultation',
  founded: 2016,
  location: 'Addis Ababa, Ethiopia',
  phone: '+251 11 123 4567',
  email: 'info@lebeza.org',
  hours: '24 / 7',
}

export const TIME_SLOTS = [
  '08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM',
  '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '02:00 PM', '02:30 PM', '03:00 PM',
  '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM',
].map((t) => ({ value: t, label: t }))

export const CONTACT_SUBJECTS = [
  { value: 'general', label: 'General inquiry' },
  { value: 'appointment', label: 'Appointment question' },
  { value: 'billing', label: 'Billing & insurance' },
  { value: 'feedback', label: 'Feedback' },
  { value: 'other', label: 'Other' },
]

export default { NAV_LINKS, CLINIC_INFO, TIME_SLOTS, CONTACT_SUBJECTS }
