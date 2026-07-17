import logo1 from '../../assets/partners/logo1.png'
import logo2 from '../../assets/partners/logo2.png'
import logo3 from '../../assets/partners/logo3.jpg'
import logo4 from '../../assets/partners/logo4.png'
import logo5 from '../../assets/partners/logo5.png'
import logo6 from '../../assets/partners/logo6.jpg'
import logo7 from '../../assets/partners/logo7.jpg'
import logo8 from '../../assets/partners/logo8.jpg'
import logo9 from '../../assets/partners/logo9.png'
import logo10 from '../../assets/partners/logo10.jpg'

const PARTNERS = [
  { name: 'Partner 1', logo: logo1 },
  { name: 'Partner 2', logo: logo2 },
  { name: 'Partner 3', logo: logo3 },
  { name: 'Partner 4', logo: logo4 },
  { name: 'Partner 5', logo: logo5 },
  { name: 'Partner 6', logo: logo6 },
  { name: 'Partner 7', logo: logo7 },
  { name: 'Partner 8', logo: logo8 },
  { name: 'Partner 9', logo: logo9 },
  { name: 'Partner 10', logo: logo10 },
]

// Duplicate the list so the scroll loop is seamless
const LOOP = [...PARTNERS, ...PARTNERS]

const TrustedBySection = () => {
  return (
    <section className="bg-cream-dark py-20 lg:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 text-center mb-14">
        <h2
          className="font-serif text-text-dark leading-tight text-balance"
          style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)' }}
        >
          Trusted by 10+ companies around the world
        </h2>
      </div>

      {/* Marquee track */}
      <div
        className="relative w-full"
        style={{
          maskImage:
            'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
          WebkitMaskImage:
            'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
        }}
      >
        <div className="lebeza-marquee-track flex items-center gap-20 w-max">
          {LOOP.map((partner, i) => (
            <div
              key={`${partner.name}-${i}`}
              className="flex items-center justify-center flex-shrink-0"
            >
              {partner.logo ? (
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="h-16 lg:h-20 w-auto object-contain hover:scale-105 transition-transform"
                />
              ) : (
                <span className="font-sans font-medium text-text-muted text-lg lg:text-xl whitespace-nowrap opacity-70 hover:opacity-100 hover:text-forest transition-all">
                  {partner.name}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes lebeza-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .lebeza-marquee-track {
          animation: lebeza-marquee 28s linear infinite;
        }
        .lebeza-marquee-track:hover {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .lebeza-marquee-track {
            animation: none;
          }
        }
      `}</style>
    </section>
  )
}

export default TrustedBySection