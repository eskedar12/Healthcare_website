import { Link } from 'react-router-dom'
import Button from '../ui/Button'
import heroImage from '../../assets/images/hero.jpg'
import useFetch from '../../hooks/useFetch'

const DEFAULT_TITLE = 'For your peace\nof mind.'
const DEFAULT_DESCRIPTION =
  'Lebeza Psychiatry Consultation is a Private Limited Company (PLC) established in December 2016 by two psychiatrists and one public health specialist. Lebeza Psychiatry Clinic is established with the vision of providing mental health promotion, high quality mental health care, early intervention and treatment.'

const HeroSection = () => {
  const { data } = useFetch('/content/home')
  const hero = data?.data?.hero

  const title = hero?.title || DEFAULT_TITLE
  const description = hero?.description || DEFAULT_DESCRIPTION

  return (
    <section className="relative min-h-screen bg-cream flex items-center overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-0 items-center min-h-screen">

          {/* Left — Text */}
          <div className="flex flex-col justify-center py-16 lg:py-24 pt-20 lg:pt-32">
            <h1
              className="font-serif text-text-dark leading-tight mb-6 text-balance"
              style={{ fontSize: 'clamp(2.8rem, 5vw, 4.5rem)' }}
            >
              {title.split('\n').map((line, i) => (
                <span key={i}>
                  {line}
                  {i < title.split('\n').length - 1 && <br />}
                </span>
              ))}
            </h1>

            <p className="font-sans text-text-body text-base lg:text-lg leading-relaxed max-w-md mb-10">
              {description}
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link to="/book">
                <Button variant="primary" size="lg">
                  Book here
                  <span>↗</span>
                </Button>
              </Link>
              <Link to="/services">
                <Button variant="outline" size="lg">
                  Explore care
                </Button>
              </Link>
            </div>
          </div>

          {/* Right — Image */}
          <div className="relative h-[55vh] lg:h-screen flex items-stretch">
            <div className="relative w-full lg:rounded-bl-[3rem] overflow-hidden">
              <img
                src={heroImage}
                alt="Comfortable therapy room at Lebeza Psychiatry"
                className="w-full h-full object-cover"
              />
              {/* Subtle gradient fade at bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-cream/30 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection