import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Button from '../ui/Button'

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Services', to: '/services' },
  { label: 'About us', to: '/about' },
  { label: 'Projects', to: '/projects' },
  { label: 'Contact us', to: '/contact' },
]

const Navbar = () => {
  const { pathname } = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-cream/95 backdrop-blur-md shadow-card border-b border-cream-darker'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between h-16 lg:h-20">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
          <span
            className="text-forest font-serif font-bold"
            style={{ fontSize: '1.75rem', lineHeight: 1 }}
          >
            Ψ
          </span>
          <div className="flex flex-col leading-none">
            <span className="font-serif font-semibold text-text-dark text-lg leading-none">
              Lebeza
            </span>
            <span className="section-label text-[0.6rem] tracking-widest mt-0.5">
              PSYCHIATRY
            </span>
          </div>
        </Link>

        {/* Desktop nav links */}
        <ul className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map(({ label, to }) => {
            const active = pathname === to
            return (
              <li key={to}>
                <Link
                  to={to}
                  className={`font-sans text-sm transition-colors duration-150 hover:text-forest ${
                    active ? 'text-forest font-medium' : 'text-text-body'
                  }`}
                >
                  {label}
                </Link>
              </li>
            )
          })}
        </ul>

        {/* CTA */}
        <div className="hidden lg:block">
          <Link to="/book">
            <Button variant="primary" size="md">
              Book here
              <span className="text-xs">↗</span>
            </Button>
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden flex flex-col gap-1.5 p-2 -mr-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span
            className={`block w-6 h-0.5 bg-text-dark transition-all duration-200 ${
              menuOpen ? 'rotate-45 translate-y-2' : ''
            }`}
          />
          <span
            className={`block w-6 h-0.5 bg-text-dark transition-all duration-200 ${
              menuOpen ? 'opacity-0' : ''
            }`}
          />
          <span
            className={`block w-6 h-0.5 bg-text-dark transition-all duration-200 ${
              menuOpen ? '-rotate-45 -translate-y-2' : ''
            }`}
          />
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        className={`lg:hidden transition-all duration-300 overflow-hidden ${
          menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-cream border-t border-cream-darker px-6 py-4 flex flex-col gap-4">
          {NAV_LINKS.map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              className={`font-sans text-sm py-1.5 border-b border-cream-darker last:border-0 ${
                pathname === to ? 'text-forest font-medium' : 'text-text-body'
              }`}
            >
              {label}
            </Link>
          ))}
          <Link to="/book" className="mt-2">
            <Button variant="primary" size="md" className="w-full justify-center">
              Book Here
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Navbar