import StatCard from '../ui/StatCard'
import useFetch from '../../hooks/useFetch'

const DEFAULT_STATS = [
  { value: '24/7', label: 'Working Hours' },
  { value: '2,426+', label: 'Patients a Year' },
  { value: '35', label: 'Clinical Staff' },
  { value: '40+', label: 'Community Projects' },
]

const StatsBar = () => {
  const { data } = useFetch('/content/home')
  const stats = data?.data?.stats?.length ? data.data.stats : DEFAULT_STATS

  return (
    <section className="bg-forest py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <h2 className="font-serif text-cream text-2xl lg:text-3xl text-center mb-12">
          Our results in numbers
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-16">
          {stats.map((stat) => (
            <StatCard
              key={stat.label}
              value={stat.value}
              label={stat.label}
              light
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default StatsBar