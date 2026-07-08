// "EST. 2016 · ADDIS ABABA" style uppercase spaced label
const SectionLabel = ({ children, light = false, className = '' }) => {
  return (
    <p
      className={`section-label mb-3 ${
        light ? 'text-cream/50' : 'text-text-muted'
      } ${className}`}
    >
      {children}
    </p>
  )
}

export default SectionLabel