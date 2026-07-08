import { Link } from 'react-router-dom'

const DoctorCard = ({ doctor }) => {
  return (
    <Link to={`/doctors/${doctor.id}`} className="group block">
      {/* Photo */}
      <div className="relative rounded-2xl overflow-hidden bg-cream-darker aspect-[3/4] mb-4">
        {doctor.image ? (
          <img
            src={doctor.image}
            alt={doctor.name}
            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-cream-dark">
            <span className="font-serif text-6xl text-text-muted/20">
              {doctor.name?.charAt(4) || 'D'}
            </span>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-forest/0 group-hover:bg-forest/10 transition-all duration-300 flex items-end p-4">
          <span className="font-sans text-cream text-xs font-medium translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
            View profile →
          </span>
        </div>
      </div>

      <h3 className="font-serif text-text-dark text-lg group-hover:text-forest transition-colors">
        {doctor.name}
      </h3>
      <p className="font-sans text-sm text-text-muted mt-1">
        {doctor.specialty}
      </p>
    </Link>
  )
}

export default DoctorCard