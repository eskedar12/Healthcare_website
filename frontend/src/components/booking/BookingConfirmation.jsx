import { Link } from 'react-router-dom'
import Button from '../ui/Button'

const BookingConfirmation = ({ patientName, onBookAnother }) => {
  return (
    <div className="text-center py-16 px-6">
      <div className="w-16 h-16 rounded-full bg-forest/10 flex items-center justify-center mx-auto mb-6">
        <span className="text-forest text-2xl">✓</span>
      </div>

      <h3 className="font-serif text-2xl lg:text-3xl text-text-dark mb-3">
        Request received.
      </h3>

      <p className="font-sans text-text-body text-sm max-w-sm mx-auto leading-relaxed mb-8">
        Thank you{patientName ? `, ${patientName}` : ''}. Our team will reach
        out within 24 hours to confirm your appointment details.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-4">
        {onBookAnother && (
          <Button variant="outline" size="md" onClick={onBookAnother}>
            Book another session
          </Button>
        )}
        <Link to="/">
          <Button variant="primary" size="md">
            Back to home
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default BookingConfirmation
