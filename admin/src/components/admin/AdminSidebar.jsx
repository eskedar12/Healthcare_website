import { NavLink, useNavigate } from 'react-router-dom'
import { 
  FiHome, 
  FiCalendar, 
  FiUsers, 
  FiGrid, 
  FiMapPin, 
  FiEdit3,
  FiSettings,
  FiLogOut
} from 'react-icons/fi'
import { useAdmin } from '../../hooks/useAdmin'
import { canAccessContent } from '../../utils/permissions'

const SIDEBAR_LINKS = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: FiHome },
  { to: '/admin/content', label: 'Web Editor', icon: FiEdit3, requires: canAccessContent },
  { to: '/admin/appointments', label: 'Appointments', icon: FiCalendar },
  { to: '/admin/doctors', label: 'Doctors', icon: FiUsers },
  { to: '/admin/services', label: 'Services', icon: FiGrid },
  { to: '/admin/branches', label: 'Branches', icon: FiMapPin },
]

const AdminSidebar = () => {
  const { logout, user } = useAdmin()
  const navigate = useNavigate()
  const links = SIDEBAR_LINKS.filter((link) => !link.requires || link.requires(user?.role))

  const handleLogout = async () => {
    await logout()
    navigate('/admin/login', { replace: true })
  }

  return (
    <aside className="bg-white w-64 border-r border-cream-darker flex flex-col flex-shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-6 py-5 border-b border-cream-darker">
        <span className="font-serif font-bold text-forest text-2xl">Ψ</span>
        <div>
          <p className="font-serif font-semibold text-text-dark text-lg leading-none">
            Lebeza
          </p>
          <p className="text-text-muted text-[0.5rem] tracking-widest uppercase">
            ADMIN
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            <Icon className="text-lg" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-cream-darker">
        <button
          onClick={handleLogout}
          className="sidebar-link w-full text-red-500 hover:bg-red-50"
        >
          <FiLogOut className="text-lg" />
          Logout
        </button>
      </div>
    </aside>
  )
}

export default AdminSidebar