import { Link } from 'react-router-dom'
import { CLINIC_INFO } from '../../utils/constants'
import useFetch from '../../hooks/useFetch'
import { useEditableSection } from '../../hooks/useEditableSection'
import EditableText from '../editable/EditableText'
// Place the uploaded Mager Software PLC logo file at this exact path —
// filename must match, or update the import below to match your file.
import magerLogo from '../../assets/mager-logo.png'

// Logo/name/tagline are shared with the Navbar (page="global", section="navbar")
// so editing the brand once keeps the header and footer in sync.
const DEFAULT_BRAND = { symbol: 'Ψ', name: 'Lebeza', tagline: 'PSYCHIATRY' }
const DEFAULT_FOOTER = {
  description: `Providing mental health promotion, high quality care and early intervention since ${CLINIC_INFO.founded}.`,
}

const COMPANY_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Services', to: '/services' },
  { label: 'About Us', to: '/about' },
  { label: 'Blog', to: '/blog' },
  { label: 'Projects', to: '/projects' },
  { label: 'Contact Us', to: '/contact' },
]

const SOCIAL_LINKS = [
  { 
    label: 'Facebook', 
    to: '#', 
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    )
  },
  { 
    label: 'Telegram', 
    to: '#', 
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
      </svg>
    )
  },
  { 
    label: 'Instagram', 
    to: '#', 
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
      </svg>
    )
  },
  { 
    label: 'Twitter', 
    to: '#', 
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    )
  },
  { 
    label: 'LinkedIn', 
    to: '#', 
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    )
  },
]

const Footer = () => {
  const { data } = useFetch('/content/global')
  const brand = data?.data?.navbar
  const brandValue = {
    symbol: brand?.symbol || DEFAULT_BRAND.symbol,
    name: brand?.name || DEFAULT_BRAND.name,
    tagline: brand?.tagline || DEFAULT_BRAND.tagline,
  }
  // Read-only mirror of the navbar's brand fields — edited from the navbar
  // logo itself, not re-editable here, to avoid two separate save paths for
  // the same value fighting each other.

  const footerContent = data?.data?.footer
  const footerInitial = {
    description: footerContent?.description || DEFAULT_FOOTER.description,
  }
  const { value: footerValue, updateField: updateFooterField } = useEditableSection(
    'global',
    'footer',
    footerInitial
  )

  return (
    <footer className="bg-forest text-cream">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">

          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-5">
              <span className="font-serif font-bold text-cream text-3xl">{brandValue.symbol}</span>
              <div>
                <p className="font-serif font-semibold text-cream text-2xl leading-none">
                  {brandValue.name}
                </p>
                <p className="text-cream/40 text-[0.6rem] tracking-widest uppercase mt-0.5">
                  {brandValue.tagline}
                </p>
              </div>
            </div>
            <EditableText
              as="p"
              value={footerValue.description}
              onChange={(v) => updateFooterField('description', v)}
              multiline
              className="font-sans text-sm text-cream/60 leading-relaxed max-w-xs"
            />
          </div>

          {/* Contact / Address */}
          <div>
            <h4 className="font-serif text-cream text-lg font-semibold mb-5">
              Get In Touch
            </h4>
            <ul className="flex flex-col gap-3">
              <li className="font-sans text-sm text-cream/70">
                <span className="block text-cream/40 text-xs uppercase tracking-widest mb-1">
                  Address
                </span>
                {CLINIC_INFO.location}
              </li>
              <li className="font-sans text-sm">
                <span className="block text-cream/40 text-xs uppercase tracking-widest mb-1">
                  Phone
                </span>
                <a
                  href={`tel:${CLINIC_INFO.phone.replace(/\s/g, '')}`}
                  className="text-cream/70 hover:text-cream transition-colors duration-150"
                >
                  {CLINIC_INFO.phone}
                </a>
              </li>
              <li className="font-sans text-sm">
                <span className="block text-cream/40 text-xs uppercase tracking-widest mb-1">
                  Email
                </span>
                <a
                  href={`mailto:${CLINIC_INFO.email}`}
                  className="text-cream/70 hover:text-cream transition-colors duration-150"
                >
                  {CLINIC_INFO.email}
                </a>
              </li>
              <li className="font-sans text-sm text-cream/70">
                <span className="block text-cream/40 text-xs uppercase tracking-widest mb-1">
                  Working Hours
                </span>
                {CLINIC_INFO.hours}
              </li>
            </ul>
          </div>

          {/* Design credit */}
          <div className="flex flex-col items-center justify-center text-center">
            <img
              src={magerLogo}
              alt="Mager Software PLC"
              className="w-28 h-28 lg:w-36 lg:h-36 animate-[spin_10s_linear_infinite]"
            />
            <p className="text-cream/40 text-[0.65rem] tracking-widest uppercase mt-4">
              Design by Mager Software PLC
            </p>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-serif text-cream text-lg font-semibold mb-5">
              Company
            </h4>
            <ul className="flex flex-col gap-3">
              {COMPANY_LINKS.map(({ label, to }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="font-sans text-sm text-cream/70 hover:text-cream transition-colors duration-150"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Follow Us */}
          <div>
            <h4 className="font-serif text-cream text-lg font-semibold mb-5">
              Follow Us
            </h4>
            <ul className="flex flex-col gap-3">
              {SOCIAL_LINKS.map(({ label, to, icon }) => (
                <li key={label}>
                  <a
                    href={to}
                    className="font-sans text-sm text-cream/70 hover:text-cream transition-colors duration-150 flex items-center gap-2.5"
                  >
                    {icon} {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar with copyright */}
      <div className="border-t border-cream/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <p className="text-xs text-cream/30 font-sans">
            Copyright © {new Date().getFullYear()} Lebeza Psychiatry Specialty Clinic | All Rights Reserved
          </p>
          <p className="text-xs text-cream/30 font-sans">
            24/7 urgent care line: {CLINIC_INFO.phone}
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer