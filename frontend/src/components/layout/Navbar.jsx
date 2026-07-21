import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Button from '../ui/Button'
import ThemeToggle from '../ui/ThemeToggle'
import useFetch from '../../hooks/useFetch'
import { useEditableSection } from '../../hooks/useEditableSection'
import { useEditMode } from '../../contexts/EditModeContext'
import EditableText from '../editable/EditableText'

// Brand copy lives under page="global", section="navbar" so it can be edited
// from the admin's Web Editor no matter which page is currently loaded in
// the preview — Navbar renders on every route via Layout.
const DEFAULT_BRAND = {
  symbol: 'Ψ',
  name: 'Lebeza',
  tagline: 'PSYCHIATRY',
}

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Services', to: '/services' },
  { label: 'About us', to: '/about' },
  { label: 'Blog', to: '/blog' },
  { label: 'Projects', to: '/projects' },
  { label: 'Contact us', to: '/contact' },
]

const Navbar = () => {
  const { pathname } = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const isHome = pathname === '/'

  const { editMode } = useEditMode()
  const { data } = useFetch('/content/global')
  const brand = data?.data?.navbar
  const initial = {
    symbol: brand?.symbol || DEFAULT_BRAND.symbol,
    name: brand?.name || DEFAULT_BRAND.name,
    tagline: brand?.tagline || DEFAULT_BRAND.tagline,
  }
  const { value, updateField } = useEditableSection('global', 'navbar', initial)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  // While editing, the logo wraps in a plain div instead of a Link so
  // clicking into the text fields doesn't trigger "/" navigation.
  const LogoTag = editMode ? 'div' : Link
  const logoProps = editMode ? {} : { to: '/' }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 border-b-2 ${
        scrolled
          ? 'bg-cream/95 backdrop-blur-md shadow-card border-forest/25'
          : isHome
            ? 'bg-forest/10 backdrop-blur-sm border-forest/30'
            : 'bg-cream/80 backdrop-blur-sm border-forest/15'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between h-20 lg:h-24">

        {/* Logo */}
        <LogoTag {...logoProps} className="flex items-center gap-3 flex-shrink-0 relative">
          <span className="flex items-center justify-center w-11 h-11 rounded-full bg-forest/10 border border-forest/20 flex-shrink-0">
            <EditableText
              as="span"
              value={value.symbol}
              onChange={(v) => updateField('symbol', v)}
              className="text-forest font-serif font-bold"
              style={{ fontSize: '1.5rem', lineHeight: 1 }}
            />
          </span>
          <div className="flex flex-col leading-none">
            <EditableText
              as="span"
              value={value.name}
              onChange={(v) => updateField('name', v)}
              className="font-serif font-semibold text-text-dark text-xl leading-none"
            />
            <EditableText
              as="span"
              value={value.tagline}
              onChange={(v) => updateField('tagline', v)}
              className="section-label text-[0.65rem] tracking-[0.2em] text-forest/80 mt-1"
            />
          </div>
        </LogoTag>

        {/* Desktop nav links */}
        <ul className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map(({ label, to }) => {
            const active = pathname === to
            return (
              <li key={to} className="relative py-2">
                <Link
                  to={to}
                  className={`font-sans text-sm transition-colors duration-150 hover:text-forest ${
                    active ? 'text-forest font-semibold' : 'text-text-body'
                  }`}
                >
                  {label}
                </Link>
                <span
                  className={`absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-forest transition-transform duration-200 origin-left ${
                    active ? 'scale-x-100' : 'scale-x-0'
                  }`}
                />
              </li>
            )
          })}
        </ul>

        {/* CTA */}
        <div className="hidden lg:flex items-center gap-4">
          <ThemeToggle />
          <Link to="/book">
            <Button variant="primary" size="lg">
              Book here
              <span className="text-xs">↗</span>
            </Button>
          </Link>
        </div>

        {/* Mobile hamburger */}
        <div className="lg:hidden flex items-center gap-2 -mr-2">
        <ThemeToggle />
        <button
          className="flex flex-col gap-1.5 p-2"
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
        </div>
      </nav>

      {/* Subtle accent line — only on the home page, before scrolling, to
          give the navbar its own distinct identity against the hero. */}
      {isHome && !scrolled && (
        <div className="h-px bg-gradient-to-r from-transparent via-forest/40 to-transparent" />
      )}

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