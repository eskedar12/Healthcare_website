import { Link } from 'react-router-dom'
import Button from '../ui/Button'
import SectionLabel from '../ui/SectionLabel'

const DoctorDetail = ({ doctor }) => {
  if (!doctor) return null

  const {
    name,
    specialty,
    image,
    bio,
    education = [],
    languages = [],
    departments = [],
  } = doctor

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16 lg:py-24">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">

        {/* Photo */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl overflow-hidden bg-cream-darker aspect-[3/4]">
            {image ? (
              <img src={image} alt={name} className="w-full h-full object-cover object-top" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-cream-dark">
                <span className="font-serif text-7xl text-text-muted/20">
                  {name?.charAt(4) || 'D'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="lg:col-span-3">
          <SectionLabel className="mb-3">{specialty}</SectionLabel>
          <h1
            className="font-serif text-text-dark leading-tight mb-6"
            style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)' }}
          >
            {name}
          </h1>

          {bio && (
            <p className="font-sans text-text-body text-base leading-relaxed mb-8 max-w-xl">
              {bio}
            </p>
          )}

          {departments.length > 0 && (
            <div className="mb-6">
              <p className="section-label mb-2">Departments</p>
              <div className="flex flex-wrap gap-2">
                {departments.map((d) => (
                  <span
                    key={d}
                    className="text-xs font-sans px-3 py-1.5 rounded-pill bg-cream-dark text-text-body border border-cream-darker"
                  >
                    {d}
                  </span>
                ))}
              </div>
            </div>
          )}

          {education.length > 0 && (
            <div className="mb-6">
              <p className="section-label mb-2">Education</p>
              <ul className="font-sans text-sm text-text-body space-y-1.5">
                {education.map((e) => (
                  <li key={e}>{e}</li>
                ))}
              </ul>
            </div>
          )}

          {languages.length > 0 && (
            <div className="mb-10">
              <p className="section-label mb-2">Languages</p>
              <p className="font-sans text-sm text-text-body">{languages.join(', ')}</p>
            </div>
          )}

          <div className="flex flex-wrap gap-4">
            <Link to="/book">
              <Button variant="primary" size="md">
                Book with {name?.split(' ')[1] || 'this doctor'}
              </Button>
            </Link>
            <Link to="/doctors">
              <Button variant="outline" size="md">
                All doctors
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DoctorDetail
