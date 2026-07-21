import { Link } from 'react-router-dom'
import Button from '../ui/Button'
import useFetch from '../../hooks/useFetch'
import SERVICES from '../../data/services'
import ServiceCard from '../services/ServiceCard'

const ServicesSection = () => {
  // Same canonical content source as the /services page, so edits made
  // there (name, description, image) show up here too.
  const { data: contentData } = useFetch('/content/services')
  const services = contentData?.data?.items?.length ? contentData.data.items : SERVICES

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
          {services.slice(0, 6).map((service, i) => (
            <ServiceCard key={service.id ?? service.slug ?? i} service={service} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default ServicesSection