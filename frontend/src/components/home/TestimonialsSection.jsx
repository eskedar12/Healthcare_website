import { useState } from 'react'
import SectionLabel from '../ui/SectionLabel'
import SectionTitle from '../ui/SectionTitle'
import useFetch from '../../hooks/useFetch'
import TESTIMONIALS from '../../data/testimonials'

const Star = ({ filled }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill={filled ? 'currentColor' : 'none'}
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <path d="M12 2.5l2.94 6.36 6.98.75-5.2 4.78 1.43 6.9L12 17.9l-6.15 3.4 1.43-6.9-5.2-4.78 6.98-.75z" />
  </svg>
)

const TestimonialsSection = () => {
  const { data } = useFetch('/content/home')
  const testimonials = data?.data?.testimonials?.length
    ? data.data.testimonials
    : TESTIMONIALS
  const [active, setActive] = useState(0)
  const current = testimonials[active]

  return (
    <section className="bg-cream py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <SectionLabel>Testimonials</SectionLabel>
          <SectionTitle>What our patients say</SectionTitle>
        </div>

        <div className="max-w-3xl mx-auto text-center">
          <div className="flex justify-center gap-1 text-forest mb-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} filled={i < (current.rating || 5)} />
            ))}
          </div>

          <p
            className="font-serif text-text-dark leading-snug text-balance mb-8"
            style={{ fontSize: 'clamp(1.35rem, 2.6vw, 1.9rem)' }}
          >
            "{current.quote}"
          </p>

          <p className="font-sans text-sm font-medium text-text-dark">
            {current.name}
          </p>
          <p className="section-label mt-1">{current.role}</p>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-12">
          {testimonials.map((t, i) => (
            <button
              key={t.id || i}
              onClick={() => setActive(i)}
              aria-label={`Show testimonial from ${t.name}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === active ? 'w-6 bg-forest' : 'w-2 bg-cream-darker'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default TestimonialsSection
