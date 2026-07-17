import { Link } from 'react-router-dom'

const ServiceCard = ({ service, layout = 'grid' }) => {
  if (layout === 'list') {
    return (
      <Link
        to={`/services/${service.slug}`}
        className="flex items-start gap-6 p-6 bg-cream rounded-2xl border border-cream-darker hover:border-forest/20 hover:shadow-card transition-all duration-200 group"
      >
        {service.image ? (
          <div className="w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden bg-cream-dark">
            <img src={service.image} alt="" className="w-full h-full object-cover" />
          </div>
        ) : (
          <span className="text-3xl flex-shrink-0">{service.icon}</span>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-serif text-lg text-text-dark group-hover:text-forest transition-colors mb-2">
            {service.name}
          </h3>
          <p className="font-sans text-sm text-text-body leading-relaxed">
            {service.description}
          </p>
        </div>
        <span className="text-forest opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-1">
          →
        </span>
      </Link>
    )
  }

  return (
    <Link
      to={`/services/${service.slug}`}
      className="group flex flex-col bg-cream-dark rounded-2xl shadow-card hover:shadow-card-hover transition-shadow duration-200 border border-transparent hover:border-forest/20 overflow-hidden"
    >
      <div className="aspect-[16/10] w-full overflow-hidden bg-cream-dark">
        {service.image ? (
          <img
            src={service.image}
            alt={service.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-3xl">
            {service.icon}
          </div>
        )}
      </div>
      <div className="flex flex-col gap-3 px-6 pb-6 flex-1">
        <span className="text-2xl">{service.icon}</span>
        <h3 className="font-serif text-lg text-text-dark group-hover:text-forest transition-colors">
          {service.name}
        </h3>
        <p className="font-sans text-sm text-text-body leading-relaxed flex-1">
          {service.description}
        </p>
        <span className="font-sans text-xs text-forest font-medium flex items-center gap-1 mt-auto">
          Learn more{' '}
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </span>
      </div>
    </Link>
  )
}

export default ServiceCard
