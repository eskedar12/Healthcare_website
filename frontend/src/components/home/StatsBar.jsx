import StatCard from '../ui/StatCard'
import useFetch from '../../hooks/useFetch'
import { useEditableSection } from '../../hooks/useEditableSection'
import { useEditMode } from '../../contexts/EditModeContext'
import EditableText from '../editable/EditableText'

const DEFAULT_STATS = [
  { value: '24/7', label: 'Working Hours' },
  { value: '2,426+', label: 'Patients a Year' },
  { value: '35', label: 'Clinical Staff' },
  { value: '40+', label: 'Community Projects' },
]

const StatsBar = () => {
  const { data } = useFetch('/content/home')
  const { editMode } = useEditMode()
  const fetchedStats = data?.data?.stats
  const initial = fetchedStats?.length ? fetchedStats : DEFAULT_STATS
  const { value: stats, updateAll } = useEditableSection('home', 'stats', initial)

  const updateStat = (index, field, fieldValue) => {
    updateAll(stats.map((s, i) => (i === index ? { ...s, [field]: fieldValue } : s)))
  }

  return (
    <section className="bg-forest py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <h2 className="font-serif text-cream text-2xl lg:text-3xl text-center mb-12">
          Our results in numbers
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-16">
          {stats.map((stat, index) =>
            editMode ? (
              <div key={index} className="flex flex-col gap-3">
                <EditableText
                  as="span"
                  value={stat.value}
                  onChange={(v) => updateStat(index, 'value', v)}
                  className="font-serif font-normal leading-none text-cream"
                  style={{ fontSize: '3rem' }}
                />
                <EditableText
                  as="span"
                  value={stat.label}
                  onChange={(v) => updateStat(index, 'label', v)}
                  className="section-label text-cream/50"
                />
              </div>
            ) : (
              <StatCard key={index} value={stat.value} label={stat.label} light />
            )
          )}
        </div>
      </div>
    </section>
  )
}

export default StatsBar