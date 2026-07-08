import { Link } from 'react-router-dom'
import SectionLabel from '../ui/SectionLabel'
import Button from '../ui/Button'
import useFetch from '../../hooks/useFetch'
import clinicBuildingImage from '../../assets/images/homepage.png'

const DEFAULT_TITLE = 'You have lots of reasons to choose us'
const DEFAULT_DESCRIPTION =
  'Lebeza Psychiatry Consultation is a Private Limited Company (PLC) established in December 2016 by two psychiatrists and one public health specialist. Lebeza Psychiatry Clinic is established with the vision of providing mental health promotion, high quality mental health care, early intervention and treatment. Equipped with a modern ambulance, an Electronic Medical Recording (EMR) system particularly tailored for mental health care, Lebeza is now home for ten practicing psychiatrists, three experienced clinical psychologists, six psychiatric nurses as well as 15 ancillary staff members.'

const AboutSection = () => {
  const { data } = useFetch('/content/home')
  const about = data?.data?.about

  const title = about?.title || DEFAULT_TITLE
  const description = about?.description || DEFAULT_DESCRIPTION

  return (
    <section className="bg-cream py-20 lg:py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* Left — text */}
          <div>
            <h2
              className="font-serif text-text-dark leading-tight mb-6 text-balance"
              style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)' }}
            >
              {title}
            </h2>

            <p className="font-sans text-text-body text-base leading-relaxed mb-8 max-w-lg">
              {description}
            </p>

            <Link to="/about">
              <Button variant="outline" size="md">
                About us
              </Button>
            </Link>
          </div>

          {/* Right — single full-width image */}
          <div className="relative">
            <div className="rounded-2xl overflow-hidden h-80 lg:h-[32rem]">
              <img
                src={clinicBuildingImage}
                alt="Lebeza clinic"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutSection