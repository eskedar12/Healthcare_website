import { Link } from 'react-router-dom'
import SectionLabel from '../ui/SectionLabel'
import Button from '../ui/Button'
import useFetch from '../../hooks/useFetch'

// Fallback static data while API loads
const FALLBACK_SERVICES = [
  {
    id: 1,
    name: 'Psychiatric Consultation',
    description: 'Comprehensive evaluation and diagnosis by experienced psychiatrists.',
    icon: '🧠',
    slug: 'psychiatric-consultation',
  },
  {
    id: 2,
    name: 'Clinical Psychology',
    description: 'Psychological assessment and evidence-based therapeutic interventions.',
    icon: '💬',
    slug: 'clinical-psychology',
  },
  {
    id: 3,
    name: 'Psychotherapy',
    description: 'Individual and group therapy using proven therapeutic approaches.',
    icon: '🌿',
    slug: 'psychotherapy',
  },
  {
    id: 4,
    name: 'Child & Adolescent Care',
    description: 'Specialized mental health support tailored for young patients.',
    icon: '🌱',
    slug: 'child-adolescent-care',
  },
  {
    id: 5,
    name: 'Community Mental Health',
    description: 'Outreach programs and community-level mental health promotion.',
    icon: '🤝',
    slug: 'community-mental-health',
  },
  {
    id: 6,
    name: 'Crisis Intervention',
    description: 'Immediate professional support for acute mental health crises.',
    icon: '⚡',
    slug: 'crisis-intervention',
  },
]

const ServiceCard = ({ service }) => (
  <Link
    to={`/services/${service.slug}`}
    className="card group flex flex-col gap-4 hover:border-forest/20 border border-transparent"
  >
    <span className="text-2xl">{service.icon}</span>
    <h3 className="font-serif text-lg text-text-dark group-hover:text-forest transition-colors">
      {service.name}
    </h3>
    <p className="font-sans text-sm text-text-body leading-relaxed flex-1">
      {service.description}
    </p>
    <span className="font-sans text-xs text-forest font-medium flex items-center gap-1 mt-auto">
      Learn more <span className="group-hover:translate-x-1 transition-transform">→</span>
    </span>
  </Link>
)

const ServicesSection = () => {
  const { data, loading } = useFetch('/services')
  const services = data?.services || FALLBACK_SERVICES

  return (
    <section className="bg-cream-dark py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        {/* Header - Centered */}
        <div className="text-center mb-14">
          <h2
            className="font-serif text-text-dark leading-tight"
            style={{ fontSize: 'clamp(2rem, 3vw, 2.75rem)' }}
          >
            Services we provide
          </h2>
          <div className="mt-6">
            <Link to="/services">
              <Button variant="outline" size="md">
                All services
              </Button>
            </Link>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default ServicesSection