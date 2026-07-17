import SectionLabel from '../ui/SectionLabel'
import DoctorCard from '../doctors/DoctorCard'
import LoadingSpinner from '../ui/LoadingSpinner'
import useFetch from '../../hooks/useFetch'
import { FEATURED_DOCTORS } from '../../data/doctors'

const DoctorsPreviewSection = () => {
  const { data, loading } = useFetch('/doctors')
  const doctors = data?.doctors?.length ? data.doctors : FEATURED_DOCTORS

  return (
    <section className="bg-cream py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <SectionLabel>Our team</SectionLabel>
          <h2
            className="font-serif text-text-dark leading-tight"
            style={{ fontSize: 'clamp(2rem, 3vw, 2.75rem)' }}
          >
            Meet our expertise
          </h2>
        </div>

        {loading ? (
          <div className="py-16 flex justify-center">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-12">
            {doctors.map((doctor) => (
              <div
                key={doctor.id}
                className="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.5rem)]"
              >
                <DoctorCard doctor={doctor} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default DoctorsPreviewSection