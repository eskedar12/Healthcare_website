import SectionLabel from '../components/ui/SectionLabel'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import useFetch from '../hooks/useFetch'
import { useEditableSection } from '../hooks/useEditableSection'
import EditableText from '../components/editable/EditableText'
import PartnersSection from '../components/projects/PartnersSection'

const FALLBACK_PROJECTS = [
  { id: 1, name: 'MHPSS trainings' },
  { id: 2, name: 'MHPSS staff supervision and mentoring' },
  { id: 3, name: 'Individual and group counselling services for staff and beneficiaries' },
  { id: 4, name: 'Project implementation, monitoring and evaluation' },
  { id: 5, name: 'Mental health related researches' },
  { id: 6, name: 'Mental health need assessment' },
  { id: 7, name: 'MHPSS document preparation' },
]

const DEFAULT_HEADER = {
  title: 'Our Projects',
  description: '40+ Implementations | Years of Experience, Countless Successes',
}

const ProjectsPage = () => {
  const { data, loading } = useFetch('/projects')
  const { data: contentData } = useFetch('/content/projects')
  const headerInitial = { ...DEFAULT_HEADER, ...contentData?.data?.header }
  const { value: header, updateField: updateHeaderField } = useEditableSection(
    'projects',
    'header',
    headerInitial
  )
  const projects = data?.data?.length ? data.data : FALLBACK_PROJECTS

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16 lg:py-24">
      <div className="text-center">
        <EditableText
          as="h1"
          value={header.title}
          onChange={(v) => updateHeaderField('title', v)}
          className="font-serif text-text-dark leading-tight mb-4 max-w-3xl mx-auto"
          style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}
        />
        <EditableText
          as="p"
          value={header.description}
          onChange={(v) => updateHeaderField('description', v)}
          multiline
          className="font-sans text-text-body text-base leading-relaxed max-w-xl mx-auto mb-14"
        />
      </div>

      {loading ? (
        <div className="py-24 flex justify-center">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <>
          {/* Projects List - Two columns, split evenly, featured items bolded */}
          <div className="bg-cream rounded-2xl p-8 lg:p-12 shadow-sm mb-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[0, 1].map((col) => {
                const half = Math.ceil(projects.length / 2)
                const columnItems = col === 0 ? projects.slice(0, half) : projects.slice(half)
                return (
                  <div className="space-y-4" key={col}>
                    {columnItems.map((project) => (
                      <div
                        key={project.id || project.name}
                        className="flex items-start gap-3 p-3 hover:bg-cream-dark rounded-lg transition-colors"
                      >
                        <span className="text-forest text-lg mt-1">•</span>
                        <p
                          className={`font-sans text-text-body text-base leading-relaxed ${
                            project.is_featured ? 'font-bold' : ''
                          }`}
                        >
                          {project.name}
                        </p>
                      </div>
                    ))}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Partners Section */}
          <PartnersSection />
        </>
      )}
    </div>
  )
}

export default ProjectsPage