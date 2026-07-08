const PARTNERS = [
  { name: 'IOM — UN Migration', logo: null },
  { name: 'Johns Hopkins University', logo: null },
  { name: 'Norwegian Refugee Council', logo: null },
  { name: 'Médecins Sans Frontières', logo: null },
  { name: 'Commercial Bank of Ethiopia', logo: null },
  { name: 'Ministry of Health', logo: null },
]

// Duplicate the list so the scroll loop is seamless
const LOOP = [...PARTNERS, ...PARTNERS]

const TrustedBySection = () => {
  return (
    <section className="bg-cream-dark py-20 lg:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 text-center mb-12">
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
        <div className="lebeza-marquee-track flex items-center gap-16 w-max">
          {LOOP.map((partner, i) => (
            <div
              key={`${partner.name}-${i}`}
              className="flex items-center justify-center flex-shrink-0"
            >
              {partner.logo ? (
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="h-10 lg:h-12 w-auto object-contain opacity-70 hover:opacity-100 transition-opacity"
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