import { useParams, Link } from 'react-router-dom'
import ServiceDetail from '../components/services/ServiceDetail'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import Button from '../components/ui/Button'
import useFetch from '../hooks/useFetch'
import { getServiceBySlug } from '../data/services'

const ServiceDetailPage = () => {
  const { slug } = useParams()
  const { data, loading } = useFetch(`/services/${slug}`)
  const service = data?.service || getServiceBySlug(slug)

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
