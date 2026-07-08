import { useState } from 'react'
import SectionLabel from '../components/ui/SectionLabel'
import ServiceCard from '../components/services/ServiceCard'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import useFetch from '../hooks/useFetch'

const FALLBACK_SERVICES = [
  { id: 1, name: 'Psychiatric Consultation', description: 'Comprehensive evaluation and diagnosis by experienced psychiatrists.', icon: '🧠', slug: 'psychiatric-consultation' },
  { id: 2, name: 'Clinical Psychology', description: 'Psychological assessment and evidence-based therapeutic interventions.', icon: '💬', slug: 'clinical-psychology' },
  { id: 3, name: 'Psychotherapy', description: 'Individual and group therapy using proven therapeutic approaches.', icon: '🌿', slug: 'psychotherapy' },
  { id: 4, name: 'Child & Adolescent Care', description: 'Specialized mental health support tailored for young patients.', icon: '🌱', slug: 'child-adolescent-care' },
  { id: 5, name: 'Community Mental Health', description: 'Outreach programs and community-level mental health promotion.', icon: '🤝', slug: 'community-mental-health' },
  { id: 6, name: 'Crisis Intervention', description: 'Immediate professional support for acute mental health crises.', icon: '⚡', slug: 'crisis-intervention' },
]

const DEFAULT_HEADER = {
  label: 'What we offer',
  title: 'Specialist care for every stage of healing.',
  description:
    'From first consultation to long-term follow-up, our multidisciplinary team offers evidence-based care across every department.',
}

const ServicesPage = () => {
  const { data, loading } = useFetch('/services')
  const { data: contentData } = useFetch('/content/services')
  const header = { ...DEFAULT_HEADER, ...contentData?.data?.header }
  const services = data?.services || FALLBACK_SERVICES
  const [layout] = useState('grid')

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16 lg:py-24">
      <SectionLabel className="mb-4">{header.label}</SectionLabel>
      <h1
        className="font-serif text-text-dark leading-tight mb-6 max-w-2xl"
        style={{ fontSize: 'clamp(2.25rem, 4vw, 3.5rem)' }}
      >
        {header.title}
      </h1>
      <p className="font-sans text-text-body text-base leading-relaxed max-w-xl mb-14">
        {header.description}
      </p>

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
