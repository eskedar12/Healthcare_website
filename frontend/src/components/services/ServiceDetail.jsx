import { Link } from 'react-router-dom'
import Button from '../ui/Button'
import SectionLabel from '../ui/SectionLabel'

const ServiceDetail = ({ service }) => {
  if (!service) return null

  const { name, description, icon, longDescription, highlights = [] } = service

  return (
    <div className="max-w-4xl mx-auto px-6 lg:px-10 py-16 lg:py-24">
      <SectionLabel className="mb-4">Our services</SectionLabel>

      <div className="flex items-start gap-5 mb-8">
        {icon && <span className="text-4xl">{icon}</span>}
        <h1
          className="font-serif text-text-dark leading-tight"
          style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)' }}
        >
          {name}
        </h1>
      </div>

      <p className="font-sans text-text-body text-lg leading-relaxed mb-8">
        {description}
      </p>

      {longDescription && (
        <p className="font-sans text-text-body text-base leading-relaxed mb-8">
          {longDescription}
        </p>
      )}

      {highlights.length > 0 && (
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 mb-12">
          {highlights.map((item) => (
            <li key={item} className="flex items-center gap-2.5">
              <span className="text-forest text-sm">●</span>
              <span className="font-sans text-sm text-text-body">{item}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="flex flex-wrap gap-4 pt-4 border-t border-cream-darker">
        <Link to="/book">
          <Button variant="primary" size="md">
            Book Here
          </Button>
        </Link>
        <Link to="/services">
          <Button variant="outline" size="md">
            All services
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default ServiceDetail
