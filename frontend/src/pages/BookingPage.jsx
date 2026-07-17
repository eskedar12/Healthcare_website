import BookingForm from '../components/booking/BookingForm'
import useFetch from '../hooks/useFetch'
import { useEditableSection } from '../hooks/useEditableSection'
import EditableText from '../components/editable/EditableText'

const DEFAULT_HEADER = {
  label: 'Book Here',
  title: "Let's find you a time.",
  description:
    'Fill in your details below and our team will confirm your appointment within 24 hours. All information is kept strictly confidential.',
}

const BookingPage = () => {
  const { data: branchData } = useFetch('/branches')
  const { data: serviceData } = useFetch('/services')
  const { data: doctorData } = useFetch('/doctors')
  const { data: contentData } = useFetch('/content/booking')
  const headerInitial = { ...DEFAULT_HEADER, ...contentData?.data?.header }
  const { value: header, updateField: updateHeaderField } = useEditableSection(
    'booking',
    'header',
    headerInitial
  )

  const branches = branchData?.data || []
  const services = serviceData?.data || []
  const doctors = doctorData?.data || []

  return (
    <div className="max-w-3xl mx-auto px-6 lg:px-10 py-16 lg:py-24">
      <EditableText
        as="p"
        value={header.label}
        onChange={(v) => updateHeaderField('label', v)}
        className="section-label mb-4 text-text-muted"
      />
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
        className="font-sans text-text-body text-base leading-relaxed max-w-xl mb-14"
      />

      <div className="bg-cream-dark rounded-2xl p-8 lg:p-10">
        <BookingForm
          branches={branches}
          services={services}
          doctors={doctors}
        />
      </div>
    </div>
  )
}

export default BookingPage
