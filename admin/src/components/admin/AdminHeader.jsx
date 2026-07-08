// src/components/admin/AdminHeader.jsx
import { FiBell } from 'react-icons/fi'
import { useAdmin } from '../../hooks/useAdmin'

const formatRole = (role) =>
  role ? role.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : ''

const AdminHeader = () => {
  const { user } = useAdmin()
  const displayName = user?.full_name || 'Admin'
  const initials = displayName.split(' ').map((n) => n[0]).join('').toUpperCase()

  return (
    <header className="bg-white border-b border-cream-darker px-6 py-4 flex items-center justify-end">
      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-lg hover:bg-cream transition-colors">
          <FiBell className="text-lg text-text-body" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-forest text-white flex items-center justify-center font-medium text-sm">
            {initials || 'A'}
          </div>
          <div className="hidden sm:block">
            <p className="font-sans text-sm font-medium text-text-dark">{displayName}</p>
            <p className="font-sans text-xs text-text-muted">{formatRole(user?.role)}</p>
          </div>
        </div>
      </div>
    </header>
  )
}

export default AdminHeader
