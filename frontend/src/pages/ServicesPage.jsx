import { useState } from 'react'
import SectionLabel from '../components/ui/SectionLabel'
import ServiceCard from '../components/services/ServiceCard'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import useFetch from '../hooks/useFetch'
import { useEditableSection } from '../hooks/useEditableSection'
import EditableText from '../components/editable/EditableText'
import SERVICES from '../data/services'

const DEFAULT_HEADER = {
  label: 'What we offer',
  title: 'Specialist care for every stage of healing.',
  description:
    'From first consultation to long-term follow-up, our multidisciplinary team offers evidence-based care across every department.',
}

const ServicesPage = () => {
  const { data, loading } = useFetch('/services')
  const { data: contentData } = useFetch('/content/services')
  const headerInitial = { ...DEFAULT_HEADER, ...contentData?.data?.header }
  const { value: header, updateField: updateHeaderField } = useEditableSection(
    'services',
    'header',
    headerInitial
  )
  const services = data?.services?.length ? data.services : SERVICES
  const [layout] = useState('grid')

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16 lg:py-24">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <EditableText
          as="p"
          value={header.label}
          onChange={(v) => updateHeaderField('label', v)}
          className="section-label mb-3 text-text-muted"
        />
        <EditableText
          as="h1"
          value={header.title}
          onChange={(v) => updateHeaderField('title', v)}
          className="font-serif text-text-dark leading-tight mb-6"
          style={{ fontSize: 'clamp(2.25rem, 4vw, 3.5rem)' }}
        />
        <EditableText
          as="p"
          value={header.description}
          onChange={(v) => updateHeaderField('description', v)}
          multiline
          className="font-sans text-text-body text-base leading-relaxed"
        />
      </div>

      {loading ? (
        <div className="py-24 flex justify-center">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} layout={layout} />
          ))}
        </div>
      )}
    </div>
  )
}

export default ServicesPage
