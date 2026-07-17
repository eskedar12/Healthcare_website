import DoctorCard from '../components/doctors/DoctorCard'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import useFetch from '../hooks/useFetch'
import { useEditableSection } from '../hooks/useEditableSection'
import EditableText from '../components/editable/EditableText'
import { CLINICAL_DOCTORS } from '../data/doctors'

const DEFAULT_HEADER = {
  label: 'Our team',
  title: 'Meet our expertise',
  description:
    'Lebeza is now home for ten practicing psychiatrists, three experienced clinical psychologists, six psychiatric nurses as well as 15 ancillary staff members.',
}

const DoctorsPage = () => {
  const { data, loading } = useFetch('/doctors')
  const { data: contentData } = useFetch('/content/doctors')
  const headerInitial = { ...DEFAULT_HEADER, ...contentData?.data?.header }
  const { value: header, updateField: updateHeaderField } = useEditableSection(
    'doctors',
    'header',
    headerInitial
  )
  const doctors = data?.doctors?.length ? data.doctors : CLINICAL_DOCTORS

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