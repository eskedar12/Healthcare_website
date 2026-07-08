import { useParams, Link } from 'react-router-dom'
import DoctorDetail from '../components/doctors/DoctorDetail'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import Button from '../components/ui/Button'
import useFetch from '../hooks/useFetch'

const FALLBACK_DOCTORS = {
  1: { id: 1, name: 'Dr. Amir Bekele', specialty: 'Consultant Psychiatrist', image: null,
    bio: 'Dr. Bekele co-founded Lebeza in 2016 and has over 15 years of experience treating mood and anxiety disorders in adults.',
    education: ['MD, Addis Ababa University', 'Psychiatry Residency, Black Lion Hospital'],
    languages: ['Amharic', 'English'], departments: ['Adult Psychiatry', 'Crisis & Emergency'] },
  2: { id: 2, name: 'Dr. Sara Tadesse', specialty: 'Clinical Psychologist', image: null,
    bio: 'Dr. Tadesse specializes in cognitive behavioral therapy and works closely with patients navigating trauma and grief.',
    education: ['MSc Clinical Psychology, Addis Ababa University'],
    languages: ['Amharic', 'English'], departments: ['Clinical Psychology', 'Psychotherapy'] },
  3: { id: 3, name: 'Dr. Yonas Girma', specialty: 'Child Psychiatrist', image: null,
    bio: 'Dr. Girma leads our child and adolescent department, working with families on developmental and behavioral concerns.',
    education: ['MD, Jimma University', 'Fellowship in Child Psychiatry'],
    languages: ['Amharic', 'English', 'Afaan Oromo'], departments: ['Child & Adolescent'] },
  4: { id: 4, name: 'Dr. Hana Mulatu', specialty: 'Psychotherapist', image: null,
    bio: 'Dr. Mulatu offers individual and group psychotherapy grounded in trauma-informed, evidence-based practice.',
    education: ['MA Counseling Psychology'],
    languages: ['Amharic', 'English'], departments: ['Psychotherapy'] },
}

const DoctorDetailPage = () => {
  const { id } = useParams()
  const { data, loading } = useFetch(`/doctors/${id}`)
  const doctor = data?.doctor || FALLBACK_DOCTORS[id]

  if (loading) {
    return (
      <div className="py-32 flex justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!doctor) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-24 text-center">
        <h1 className="font-serif text-2xl text-text-dark mb-4">Doctor not found</h1>
        <p className="font-sans text-text-body text-sm mb-8">
          We couldn't find the profile you're looking for.
        </p>
        <Link to="/doctors">
          <Button variant="primary" size="md">Back to all doctors</Button>
        </Link>
      </div>
    )
  }

  return <DoctorDetail doctor={doctor} />
}

export default DoctorDetailPage
