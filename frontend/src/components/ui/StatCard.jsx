import useCountUp from '../../hooks/useCountUp'

const StatCard = ({ icon, value, label, light = false }) => {
  const { ref, display } = useCountUp(value)

  return (
    <div className="flex flex-col gap-3" ref={ref}>
      {icon && (
        <span className={`text-xl ${light ? 'text-cream/40' : 'text-text-muted'}`}>
          {icon}
        </span>
      )}
      <span
        className={`font-serif font-normal leading-none ${
          light ? 'text-cream' : 'text-text-dark'
        }`}
        style={{ fontSize: '3rem' }}
      >
        {display}
      </span>
      <span
        className={`section-label ${
          light ? 'text-cream/50' : 'text-text-muted'
        }`}
      >
        {label}
      </span>
    </div>
  )
}

export default StatCard
