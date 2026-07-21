import DoctorCard from '../components/doctors/DoctorCard'
import useFetch from '../hooks/useFetch'
import { useEditableSection } from '../hooks/useEditableSection'
import EditableText from '../components/editable/EditableText'
import { normalizeDoctor } from '../utils/doctors'

const DEFAULT_HEADER = {
  label: 'Our team',
  title: 'Meet our expertise',
  description:
    'Lebeza is now home for ten practicing psychiatrists, three experienced clinical psychologists, six psychiatric nurses as well as 15 ancillary staff members.',
}

const DoctorsPage = () => {
  const { data: contentData } = useFetch('/content/doctors')
  const headerInitial = { ...DEFAULT_HEADER, ...contentData?.data?.header }
  const { value: header, updateField: updateHeaderField } = useEditableSection(
    'doctors',
    'header',
    headerInitial
  )

  // Pulled live from the admin-managed doctors table so anything added,
  // edited, or removed in the admin panel shows up here immediately.
  const { data: doctorsData, loading, error } = useFetch('/doctors')
  const doctors = (doctorsData?.data || [])
    .filter((d) => d.is_active !== false)
    .map(normalizeDoctor)

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16 lg:py-24">
      <div className="text-center">
        <EditableText
          as="p"
          value={header.label}
          onChange={(v) => updateHeaderField('label', v)}
          className="section-label mb-3 text-text-muted"
        />
        <EditableText
          as="h1"
          value={header.title}
          onChange={(v) => updateHeaderField('title', v)}
          className="font-serif text-text-dark leading-tight mb-4 max-w-3xl mx-auto"
          style={{ fontSize: 'clamp(2.25rem, 4vw, 3.5rem)' }}
        />
        <EditableText
          as="p"
          value={header.description}
          onChange={(v) => updateHeaderField('description', v)}
          multiline
          className="font-sans text-text-body text-base leading-relaxed max-w-2xl mx-auto mb-14"
        />
      </div>

      {loading && (
        <p className="text-center font-sans text-sm text-text-muted">Loading doctors…</p>
      )}

      {!loading && error && (
        <p className="text-center font-sans text-sm text-text-muted">
          Couldn't load doctors right now. Please try again shortly.
        </p>
      )}

      {!loading && !error && doctors.length === 0 && (
        <p className="text-center font-sans text-sm text-text-muted">
          No doctors to show yet.
        </p>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        {doctors.map((doctor) => (
          <DoctorCard key={doctor.id} doctor={doctor} />
        ))}
      </div>
    </div>
  )
}

export default DoctorsPage