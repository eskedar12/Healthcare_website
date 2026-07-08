import SectionLabel from '../components/ui/SectionLabel'
import BookingForm from '../components/booking/BookingForm'
import useFetch from '../hooks/useFetch'

const BookingPage = () => {
  const { data: branchData } = useFetch('/branches')
  const { data: serviceData } = useFetch('/services')
  const { data: doctorData } = useFetch('/doctors')

  const branches = branchData?.data || []
  const services = serviceData?.data || []
  const doctors = doctorData?.data || []

  return (
    <div className="max-w-3xl mx-auto px-6 lg:px-10 py-16 lg:py-24">
      <SectionLabel className="mb-4">Book Here</SectionLabel>
      <h1
        className="font-serif text-text-dark leading-tight mb-6 text-balance"
        style={{ fontSize: 'clamp(2.25rem, 4vw, 3.5rem)' }}
      >
        Let's find you a time.
      </h1>
      <p className="font-sans text-text-body text-base leading-relaxed max-w-xl mb-14">
        Fill in your details below and our team will confirm your appointment
        within 24 hours. All information is kept strictly confidential.
      </p>

      <div className="bg-cream-dark rounded-2xl p-8 lg:p-10">
        <BookingForm
          branches={branches}
          services={services}
          doctors={doctors}
        />
      </div>
    </div>
  )
}

export default BookingPage
