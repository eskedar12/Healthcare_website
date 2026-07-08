import { useParams, Link } from 'react-router-dom'
import ServiceDetail from '../components/services/ServiceDetail'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import Button from '../components/ui/Button'
import useFetch from '../hooks/useFetch'

const FALLBACK_SERVICES = {
  'psychiatric-consultation': {
    id: 1, name: 'Psychiatric Consultation', icon: '🧠',
    description: 'Comprehensive evaluation and diagnosis by experienced psychiatrists.',
    longDescription: 'Our psychiatrists conduct thorough clinical assessments to understand each patient\'s history, symptoms, and goals — leading to a personalized treatment plan combining therapy, medication management, and ongoing support where appropriate.',
    highlights: ['Full diagnostic evaluation', 'Personalized treatment plans', 'Medication management', 'Ongoing follow-up'],
  },
  'clinical-psychology': {
    id: 2, name: 'Clinical Psychology', icon: '💬',
    description: 'Psychological assessment and evidence-based therapeutic interventions.',
    longDescription: 'Licensed clinical psychologists work with individuals and families using standardized assessments and structured therapeutic approaches to address a wide range of emotional and behavioral concerns.',
    highlights: ['Psychological testing', 'CBT & DBT approaches', 'Family sessions', 'Confidential setting'],
  },
  psychotherapy: {
    id: 3, name: 'Psychotherapy', icon: '🌿',
    description: 'Individual and group therapy using proven therapeutic approaches.',
    longDescription: 'We offer individual and group psychotherapy sessions led by trained therapists, tailored to each patient\'s pace and comfort — grounded in evidence-based modalities.',
    highlights: ['Individual sessions', 'Group therapy', 'Trauma-informed care', 'Flexible scheduling'],
  },
  'child-adolescent-care': {
    id: 4, name: 'Child & Adolescent Care', icon: '🌱',
    description: 'Specialized mental health support tailored for young patients.',
    longDescription: 'Our child and adolescent psychiatry team provides age-appropriate assessment and care, working closely with families and schools to support healthy development.',
    highlights: ['Developmental assessment', 'Family involvement', 'School coordination', 'Play & talk therapy'],
  },
  'community-mental-health': {
    id: 5, name: 'Community Mental Health', icon: '🤝',
    description: 'Outreach programs and community-level mental health promotion.',
    longDescription: 'Through outreach and education programs, we bring mental health awareness and early intervention services directly to underserved communities across Addis Ababa.',
    highlights: ['Community workshops', 'Awareness campaigns', 'Early screening', 'Referral pathways'],
  },
  'crisis-intervention': {
    id: 6, name: 'Crisis Intervention', icon: '⚡',
    description: 'Immediate professional support for acute mental health crises.',
    longDescription: 'Our team is available around the clock to provide urgent psychiatric support, stabilization, and safe follow-up planning during acute mental health crises.',
    highlights: ['24/7 availability', 'Rapid assessment', 'Safety planning', 'Ambulance support'],
  },
}

const ServiceDetailPage = () => {
  const { slug } = useParams()
  const { data, loading } = useFetch(`/services/${slug}`)
  const service = data?.service || FALLBACK_SERVICES[slug]

  if (loading) {
    return (
      <div className="py-32 flex justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!service) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-24 text-center">
        <h1 className="font-serif text-2xl text-text-dark mb-4">Service not found</h1>
        <p className="font-sans text-text-body text-sm mb-8">
          We couldn't find the service you're looking for.
        </p>
        <Link to="/services">
          <Button variant="primary" size="md">Back to all services</Button>
        </Link>
      </div>
    )
  }

  return <ServiceDetail service={service} />
}

export default ServiceDetailPage
