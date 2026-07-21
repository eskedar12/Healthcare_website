import { useParams, Link } from 'react-router-dom'
import DoctorDetail from '../components/doctors/DoctorDetail'
import Button from '../components/ui/Button'
import { getDoctorById } from '../data/doctors'

const DoctorDetailPage = () => {
  const { id } = useParams()
  const doctor = getDoctorById(id)

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