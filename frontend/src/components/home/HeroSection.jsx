import { Link } from 'react-router-dom'
import Button from '../ui/Button'
import heroImage from '../../assets/images/hero.jpg'
import useFetch from '../../hooks/useFetch'
import { useEditableSection } from '../../hooks/useEditableSection'
import EditableText from '../editable/EditableText'
import EditableImage from '../editable/EditableImage'

const DEFAULT_TITLE = 'For your peace\nof mind.'
const DEFAULT_DESCRIPTION =
  'Lebeza Psychiatry Consultation is a Private Limited Company (PLC) established in December 2016 by two psychiatrists and one public health specialist. Lebeza Psychiatry Clinic is established with the vision of providing mental health promotion, high quality mental health care, early intervention and treatment.'

const HeroSection = () => {
  const { data } = useFetch('/content/home')
  const hero = data?.data?.hero

  const initial = {
    title: hero?.title || DEFAULT_TITLE,
    description: hero?.description || DEFAULT_DESCRIPTION,
    image: hero?.image || null,
  }
  const { value, updateField } = useEditableSection('home', 'hero', initial)

  return (
    <section className="relative min-h-screen bg-cream flex items-center overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-0 items-center min-h-screen">

          {/* Left — Text */}
          <div className="flex flex-col justify-center py-16 lg:py-24 pt-20 lg:pt-32">
            <EditableText
              as="h1"
              value={value.title}
              onChange={(v) => updateField('title', v)}
              multiline
              className="font-serif text-text-dark leading-tight mb-6 text-balance whitespace-pre-line"
              style={{ fontSize: 'clamp(2.8rem, 5vw, 4.5rem)' }}
            />

            <EditableText
              as="p"
              value={value.description}
              onChange={(v) => updateField('description', v)}
              multiline
              className="font-sans text-text-body text-base lg:text-lg leading-relaxed max-w-md mb-10"
            />

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
          <div className="relative h-[55vh] lg:h-[80vh] flex items-stretch self-center">
            <div className="relative w-full lg:rounded-bl-[3rem] overflow-hidden">
              <EditableImage
                value={value.image}
                onChange={(v) => updateField('image', v)}
                fallbackSrc={heroImage}
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