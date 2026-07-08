const PARTNERS = [
  { name: 'Médecins Sans Frontières', logo: null },
  { name: 'Catholic Relief Services', logo: null },
  { name: 'Amref Health Africa', logo: null },
  { name: 'Heineken', logo: null },
  { name: 'IOM — UN Migration', logo: null },
  { name: 'PAD', logo: null },
  { name: 'ARRA', logo: null },
  { name: 'Norwegian Refugee Council', logo: null },
  { name: 'Oxfam', logo: null },
  { name: "SOS Children's Villages", logo: null },
  { name: 'US Embassy Addis Ababa', logo: null },
  { name: 'Embassy of Ireland', logo: null },
  { name: 'Jhpiego', logo: null },
  { name: 'Médecins du Monde', logo: null },
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
              className="flex items-center justify-center h-16"
            >
              {partner.logo ? (
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="max-h-14 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity"
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