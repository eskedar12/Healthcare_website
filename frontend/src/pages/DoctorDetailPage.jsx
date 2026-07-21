import { useParams, Link } from 'react-router-dom'
import DoctorDetail from '../components/doctors/DoctorDetail'
import Button from '../components/ui/Button'
import useFetch from '../hooks/useFetch'
import { normalizeDoctor } from '../utils/doctors'

const DoctorDetailPage = () => {
  const { id } = useParams()
  const { data, loading, error } = useFetch(`/doctors/${id}`)
  const doctor = normalizeDoctor(data?.data)

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-24 text-center">
        <p className="font-sans text-sm text-text-muted">Loading…</p>
      </div>
    )
  }

  if (error || !doctor) {
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