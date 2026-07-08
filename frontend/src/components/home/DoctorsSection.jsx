import SectionLabel from '../ui/SectionLabel'
import DoctorCard from '../doctors/DoctorCard'
import LoadingSpinner from '../ui/LoadingSpinner'
import useFetch from '../../hooks/useFetch'

const FALLBACK_DOCTORS = [
  { id: 1, name: 'Dr. Amir Bekele', specialty: 'Consultant Psychiatrist', image: null },
  { id: 2, name: 'Dr. Sara Tadesse', specialty: 'Clinical Psychologist', image: null },
  { id: 3, name: 'Dr. Yonas Girma', specialty: 'Child Psychiatrist', image: null },
  { id: 4, name: 'Dr. Hana Mulatu', specialty: 'Psychotherapist', image: null },
  { id: 5, name: 'Dr. Elias Worku', specialty: 'Consultant Psychiatrist', image: null },
]

const DoctorsPage = () => {
  const { data, loading } = useFetch('/doctors')
  const doctors = data?.doctors || FALLBACK_DOCTORS

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16 lg:py-24">
      <div className="text-center">
        <SectionLabel className="mb-4">Our team</SectionLabel>
        <h1
          className="font-serif text-text-dark leading-tight mb-4 max-w-3xl mx-auto"
          style={{ fontSize: 'clamp(2.25rem, 4vw, 3.5rem)' }}
        >
          Meet our expertise
        </h1>
        <p className="font-sans text-text-body text-base leading-relaxed max-w-2xl mx-auto mb-14">
          Lebeza is now home for ten practicing psychiatrists, three experienced 
          clinical psychologists, six psychiatric nurses as well as 15 ancillary 
          staff members.
        </p>
      </div>

      {loading ? (
        <div className="py-24 flex justify-center">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {doctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>
      )}
    </div>
  )
}

export default DoctorsPage