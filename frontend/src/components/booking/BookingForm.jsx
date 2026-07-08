import Input from '../ui/Input'
import Select from '../ui/Select'
import Textarea from '../ui/Textarea'
import Button from '../ui/Button'
import useAppointmentForm from '../../hooks/useAppointmentForm'

const TIME_SLOTS = [
  '08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM',
  '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '02:00 PM', '02:30 PM', '03:00 PM',
  '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM',
].map((t) => ({ value: t, label: t }))

const BookingForm = ({ branches = [], services = [], doctors = [] }) => {
  const { form, errors, loading, submitted, handleChange, handleSubmit } =
    useAppointmentForm()

  if (submitted) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-4">✓</div>
        <h3 className="font-serif text-2xl text-forest mb-3">
          Request received.
        </h3>
        <p className="font-sans text-text-body text-sm max-w-sm mx-auto">
          Thank you, {form.patientName}. Our team will contact you within 24
          hours to confirm your appointment.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* Row 1 */}
        <Input
          id="patientName"
          label="Patient Name"
          placeholder="Full name"
          value={form.patientName}
          onChange={handleChange('patientName')}
          required
          error={errors.patientName}
        />
        <Input
          id="phone"
          label="Phone Number"
          type="tel"
          placeholder="+251 9XX XXX XXX"
          value={form.phone}
          onChange={handleChange('phone')}
          required
          error={errors.phone}
        />

        {/* Row 2 */}
        <Input
          id="email"
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={handleChange('email')}
          error={errors.email}
        />
        <Select
          id="branch"
          label="Branch"
          placeholder="Select branch"
          value={form.branch}
          onChange={handleChange('branch')}
          options={
            branches.length > 0
              ? branches.map((b) => ({ value: b.id, label: b.name }))
              : [{ value: 'main', label: 'Addis Ababa — Main Branch' }]
          }
          required
          error={errors.branch}
        />

        {/* Row 3 */}
        <Select
          id="service"
          label="Service"
          placeholder="Select service"
          value={form.service}
          onChange={handleChange('service')}
          options={
            services.length > 0
              ? services.map((s) => ({ value: s.id, label: s.name }))
              : [
                  { value: 'adult-psychiatry', label: 'Adult Psychiatry' },
                  { value: 'child-adolescent', label: 'Child & Adolescent' },
                  { value: 'psychology', label: 'Clinical Psychology' },
                  { value: 'psychotherapy', label: 'Psychotherapy' },
                ]
          }
          required
          error={errors.service}
        />
        <Select
          id="preferredDoctor"
          label="Preferred Doctor"
          placeholder="No preference"
          value={form.preferredDoctor}
          onChange={handleChange('preferredDoctor')}
          options={
            doctors.length > 0
              ? doctors.map((d) => ({ value: d.id, label: d.name }))
              : [
                  { value: 'no-preference', label: 'No preference' },
                  { value: '1', label: 'Dr. Amir Bekele' },
                  { value: '2', label: 'Dr. Sara Tadesse' },
                ]
          }
        />

        {/* Row 4 */}
        <Input
          id="preferredDate"
          label="Preferred Date"
          type="date"
          value={form.preferredDate}
          onChange={handleChange('preferredDate')}
          required
          error={errors.preferredDate}
        />
        <Select
          id="preferredTime"
          label="Preferred Time"
          placeholder="Select time"
          value={form.preferredTime}
          onChange={handleChange('preferredTime')}
          options={TIME_SLOTS}
          required
          error={errors.preferredTime}
        />

        {/* Row 5 — full width */}
        <div className="md:col-span-2">
          <Textarea
            id="notes"
            label="Notes (optional)"
            placeholder="Is there anything we should know before your visit?"
            value={form.notes}
            onChange={handleChange('notes')}
            rows={4}
          />
        </div>
      </div>

      {/* Submit */}
      <div className="mt-8">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={loading}
          className="w-full justify-center"
        >
          {loading ? 'Sending request...' : 'Book Here'}
        </Button>
        <p className="font-sans text-xs text-text-muted text-center mt-3">
          Confidential — never shared without your consent.
        </p>
      </div>
    </form>
  )
}

export default BookingForm