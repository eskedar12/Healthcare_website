import SectionLabel from '../ui/SectionLabel'
import DoctorCard from '../doctors/DoctorCard'
import { CLINICAL_DOCTORS } from '../../data/doctors'

const HOME_PREVIEW_DOCTORS = CLINICAL_DOCTORS.slice(0, 6)

const DoctorsPreviewSection = () => {
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

        <div className="flex flex-wrap justify-center gap-x-8 gap-y-12">
          {HOME_PREVIEW_DOCTORS.map((doctor) => (
            <div
              key={doctor.id}
              className="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.5rem)]"
            >
              <DoctorCard doctor={doctor} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default DoctorsPreviewSection