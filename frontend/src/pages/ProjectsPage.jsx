import SectionLabel from '../components/ui/SectionLabel'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import useFetch from '../hooks/useFetch'
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
  const header = { ...DEFAULT_HEADER, ...contentData?.data?.header }
  const projects = data?.projects || FALLBACK_PROJECTS

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16 lg:py-24">
      <div className="text-center">
        <h1
          className="font-serif text-text-dark leading-tight mb-4 max-w-3xl mx-auto"
          style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}
        >
          {header.title}
        </h1>
        <p className="font-sans text-text-body text-base leading-relaxed max-w-xl mx-auto mb-14">
          {header.description}
        </p>
      </div>

      {loading ? (
        <div className="py-24 flex justify-center">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <>
          {/* Projects List - Two columns with bold and regular items */}
          <div className="bg-cream rounded-2xl p-8 lg:p-12 shadow-sm mb-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left Column - Bold items */}
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 hover:bg-cream-dark rounded-lg transition-colors">
                  <span className="text-forest text-lg mt-1">•</span>
                  <p className="font-sans text-text-body text-base leading-relaxed font-bold">
                    {projects[0]?.name || 'MHPSS trainings'}
                  </p>
                </div>
                <div className="flex items-start gap-3 p-3 hover:bg-cream-dark rounded-lg transition-colors">
                  <span className="text-forest text-lg mt-1">•</span>
                  <p className="font-sans text-text-body text-base leading-relaxed font-bold">
                    {projects[1]?.name || 'MHPSS staff supervision and mentoring'}
                  </p>
                </div>
                <div className="flex items-start gap-3 p-3 hover:bg-cream-dark rounded-lg transition-colors">
                  <span className="text-forest text-lg mt-1">•</span>
                  <p className="font-sans text-text-body text-base leading-relaxed font-bold">
                    {projects[2]?.name || 'Individual and group counselling services for staff and beneficiaries'}
                  </p>
                </div>
              </div>

              {/* Right Column - Regular items */}
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 hover:bg-cream-dark rounded-lg transition-colors">
                  <span className="text-forest text-lg mt-1">•</span>
                  <p className="font-sans text-text-body text-base leading-relaxed">
                    {projects[3]?.name || 'Project implementation, monitoring and evaluation'}
                  </p>
                </div>
                <div className="flex items-start gap-3 p-3 hover:bg-cream-dark rounded-lg transition-colors">
                  <span className="text-forest text-lg mt-1">•</span>
                  <p className="font-sans text-text-body text-base leading-relaxed">
                    {projects[4]?.name || 'Mental health related researches'}
                  </p>
                </div>
                <div className="flex items-start gap-3 p-3 hover:bg-cream-dark rounded-lg transition-colors">
                  <span className="text-forest text-lg mt-1">•</span>
                  <p className="font-sans text-text-body text-base leading-relaxed">
                    {projects[5]?.name || 'Mental health need assessment'}
                  </p>
                </div>
                <div className="flex items-start gap-3 p-3 hover:bg-cream-dark rounded-lg transition-colors">
                  <span className="text-forest text-lg mt-1">•</span>
                  <p className="font-sans text-text-body text-base leading-relaxed">
                    {projects[6]?.name || 'MHPSS document preparation'}
                  </p>
                </div>
              </div>
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