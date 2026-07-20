import SectionLabel from '../components/ui/SectionLabel'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import Textarea from '../components/ui/Textarea'
import Button from '../components/ui/Button'
import useInquiryForm from '../hooks/useInquiryForm'
import useFetch from '../hooks/useFetch'
import { useEditableSection } from '../hooks/useEditableSection'
import EditableText from '../components/editable/EditableText'
import { CLINIC_INFO, CONTACT_SUBJECTS } from '../utils/constants'
import ChatBot from '../components/chatbot/ChatBot'

const DEFAULT_HEADER = {
  title: "We're here to help.",
  description:
    "Have a question before booking, or need to reach our team directly? Send us a message and we'll respond within one business day.",
}

const ContactPage = () => {
  const { form, errors, loading, submitted, submitError, handleChange, handleSubmit } = useInquiryForm()
  const { data } = useFetch('/content/contact')
  const headerInitial = { ...DEFAULT_HEADER, ...data?.data?.header }
  const { value: header, updateField: updateHeaderField } = useEditableSection(
    'contact',
    'header',
    headerInitial
  )

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16 lg:py-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

        {/* Info */}
        <div>
          <SectionLabel className="mb-4">Get in touch</SectionLabel>
          <EditableText
            as="h1"
            value={header.title}
            onChange={(v) => updateHeaderField('title', v)}
            className="font-serif text-text-dark leading-tight mb-6 text-balance"
            style={{ fontSize: 'clamp(2.25rem, 4vw, 3.5rem)' }}
          />
          <EditableText
            as="p"
            value={header.description}
            onChange={(v) => updateHeaderField('description', v)}
            multiline
            className="font-sans text-text-body text-base leading-relaxed max-w-md mb-10"
          />

          <div className="space-y-6">
            <div>
              <p className="section-label mb-1">Address</p>
              <p className="font-sans text-sm text-text-body">{CLINIC_INFO.location}</p>
            </div>
            <div>
              <p className="section-label mb-1">Phone</p>
              <a href={`tel:${CLINIC_INFO.phone.replace(/\s/g, '')}`} className="font-sans text-sm text-text-body hover:text-forest transition-colors">
                {CLINIC_INFO.phone}
              </a>
            </div>
            <div>
              <p className="section-label mb-1">Email</p>
              <a href={`mailto:${CLINIC_INFO.email}`} className="font-sans text-sm text-text-body hover:text-forest transition-colors">
                {CLINIC_INFO.email}
              </a>
            </div>
            <div>
              <p className="section-label mb-1">Hours</p>
              <p className="font-sans text-sm text-text-body">{CLINIC_INFO.hours}</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-cream-dark rounded-2xl p-8 lg:p-10">
          {submitted ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">✓</div>
              <h3 className="font-serif text-2xl text-forest mb-3">Message sent.</h3>
              <p className="font-sans text-text-body text-sm max-w-sm mx-auto">
                Thank you, {form.name}. Our team will get back to you shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <Input
                id="name" label="Full Name" placeholder="Your name"
                value={form.name} onChange={handleChange('name')}
                required error={errors.name}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Input
                  id="email" label="Email" type="email" placeholder="you@example.com"
                  value={form.email} onChange={handleChange('email')}
                  required error={errors.email}
                />
                <Input
                  id="phone" label="Phone (optional)" type="tel" placeholder="+251 9XX XXX XXX"
                  value={form.phone} onChange={handleChange('phone')}
                  error={errors.phone}
                />
              </div>
              <Select
                id="subject" label="Subject" placeholder="Select a subject"
                value={form.subject} onChange={handleChange('subject')}
                options={CONTACT_SUBJECTS}
              />
              <Textarea
                id="message" label="Message" placeholder="How can we help?"
                value={form.message} onChange={handleChange('message')}
                required error={errors.message} rows={5}
              />
              {submitError && (
                <p className="text-sm text-red-500 text-center">{submitError}</p>
              )}
              <Button type="submit" variant="primary" size="lg" disabled={loading} className="w-full justify-center">
                {loading ? 'Sending...' : 'Send message'}
              </Button>
            </form>
          )}
        </div>
      </div>

      <ChatBot />
    </div>
  )
}

export default ContactPage