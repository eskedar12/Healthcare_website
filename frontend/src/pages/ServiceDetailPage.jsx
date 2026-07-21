import { useParams, Link } from 'react-router-dom'
import ServiceDetail from '../components/services/ServiceDetail'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import Button from '../components/ui/Button'
import useFetch from '../hooks/useFetch'
import { useEditableSection } from '../hooks/useEditableSection'
import SERVICES, { getServiceBySlug } from '../data/services'

const ServiceDetailPage = () => {
  const { slug } = useParams()
  const { data: contentData, loading } = useFetch('/content/services')

  // Same canonical "items" array the /services listing page edits — found
  // here by slug so edits made on either page stay in sync.
  const itemsInitial = contentData?.data?.items?.length ? contentData.data.items : SERVICES
  const { value: services, updateAll: updateServicesAll } = useEditableSection(
    'services',
    'items',
    itemsInitial
  )

  const index = services.findIndex((s) => s.slug === slug)
  const service = index !== -1 ? services[index] : getServiceBySlug(slug)

  const updateServiceField = (field, fieldValue) => {
    if (index === -1) return
    const next = services.map((s, i) => (i === index ? { ...s, [field]: fieldValue } : s))
    updateServicesAll(next)
  }

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

  return <ServiceDetail service={service} onFieldChange={updateServiceField} />
}

export default ServiceDetailPage