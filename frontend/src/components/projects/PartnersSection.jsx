import logo10 from '../../assets/partners2/logo10.jpg'
import logo3 from '../../assets/partners2/logo3.jpg'
import logo4 from '../../assets/partners2/logo4.png'
import logo9 from '../../assets/partners2/logo9.png'
import logo11 from '../../assets/partners2/logo11.png'
import logo22 from '../../assets/partners2/logo22.jpg'
import logo33 from '../../assets/partners2/logo33.jpg'
import logo44 from '../../assets/partners2/logo44.jpg'
import logo55 from '../../assets/partners2/logo55.png'
import logo66 from '../../assets/partners2/logo66.png'
import logo77 from '../../assets/partners2/logo77.jpg'
import logo88 from '../../assets/partners2/logo88.jpg'
import logo99 from '../../assets/partners2/logo99.png'

const PARTNERS = [
  { name: 'Catholic Relief Services', logo: logo10 },
  { name: 'Partner 2', logo: logo3 },
  { name: 'Partner 3', logo: logo4 },
  { name: 'Partner 4', logo: logo9 },
  { name: 'Partner 5', logo: logo11 },
  { name: 'Partner 6', logo: logo22 },
  { name: 'Partner 7', logo: logo33 },
  { name: 'Partner 8', logo: logo44 },
  { name: 'Partner 9', logo: logo55 },
  { name: 'Partner 10', logo: logo66 },
  { name: 'Partner 11', logo: logo77 },
  { name: 'Partner 12', logo: logo88 },
  { name: 'Partner 13', logo: logo99 },
]

const PartnersSection = () => {
  return (
    <section className="bg-cream py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <h2
          className="font-serif text-text-dark text-center leading-tight mb-16"
          style={{ fontSize: 'clamp(2rem, 3vw, 2.75rem)' }}
        >
          Our Partners
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-10 gap-y-14">
          {PARTNERS.map((partner) => (
            <div
              key={partner.name}
              className="flex items-center justify-center h-20 lg:h-24"
            >
              {partner.logo ? (
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="max-h-16 lg:max-h-20 w-auto object-contain hover:scale-105 transition-transform"
                />
              ) : (
                <span className="font-sans font-medium text-text-body text-center text-sm lg:text-base leading-snug">
                  {partner.name}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default PartnersSection