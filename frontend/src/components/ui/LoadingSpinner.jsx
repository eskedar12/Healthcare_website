const LoadingSpinner = ({ size = 'md', light = false }) => {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-3',
  }

  return (
    <div
      className={`${sizes[size]} rounded-full animate-spin ${
        light
          ? 'border-cream/30 border-t-cream'
          : 'border-forest/20 border-t-forest'
      }`}
      role="status"
      aria-label="Loading"
    />
  )
}

export const PageLoader = () => (
  <div className="min-h-screen bg-cream flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <LoadingSpinner size="lg" />
      <p className="section-label">Loading...</p>
    </div>
  </div>
)

export default LoadingSpinner