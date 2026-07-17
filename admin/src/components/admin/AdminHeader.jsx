// src/components/admin/AdminHeader.jsx
import { FiBell, FiX } from 'react-icons/fi'
import { useAdmin } from '../../hooks/useAdmin'
import { useNotifications } from '../../contexts/NotificationContext'
import { Link } from 'react-router-dom'
import { canViewNotifications } from '../../utils/permissions'

const formatRole = (role) =>
  role ? role.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : ''

const formatTime = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now - date
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  return `${days}d ago`
}

const AdminHeader = () => {
  const { user } = useAdmin()
  const {
    notifications,
    unreadCount,
    showDropdown,
    setShowDropdown,
    markAllAsRead,
    markAsRead,
  } = useNotifications()
  const displayName = user?.full_name || 'Admin'
  const initials = displayName.split(' ').map((n) => n[0]).join('').toUpperCase()
  const showNotifications = canViewNotifications(user)

  return (
    <header className="bg-white border-b border-cream-darker px-6 py-4 flex items-center justify-end relative">
      <div className="flex items-center gap-4">
        {showNotifications && (
          <div className="relative">
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              className="relative p-2 rounded-lg hover:bg-cream transition-colors"
            >
              <FiBell className="text-lg text-text-body" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showDropdown && (
              <>
                {/* Backdrop to close dropdown when clicking outside */}
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowDropdown(false)}
                />
                
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-lg border border-cream-darker z-50">
                  <div className="flex items-center justify-between p-4 border-b border-cream-darker">
                    <h3 className="font-serif text-lg text-text-dark">Notifications</h3>
                    {unreadCount > 0 && (
                      <button 
                        onClick={markAllAsRead}
                        className="font-sans text-sm text-forest hover:underline"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>

                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-text-muted">
                        No notifications
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <Link
                          key={notification.id}
                          to={notification.link}
                          onClick={() => {
                            markAsRead(notification.id)
                            setShowDropdown(false)
                          }}
                          className={`block p-4 border-b border-cream/50 hover:bg-cream/50 transition-colors ${
                            !notification.read ? 'bg-cream/30' : ''
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                              notification.type === 'appointment' 
                                ? 'bg-blue-100 text-blue-700' 
                                : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {notification.type === 'appointment' ? '📅' : '✉️'}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-sans text-sm font-medium text-text-dark">
                                {notification.title}
                              </p>
                              <p className="font-sans text-xs text-text-body mt-1 truncate">
                                {notification.message}
                              </p>
                              <p className="font-sans text-xs text-text-muted mt-1">
                                {formatTime(notification.createdAt)}
                              </p>
                            </div>
                            {!notification.read && (
                              <div className="w-2 h-2 rounded-full bg-forest flex-shrink-0 mt-2" />
                            )}
                          </div>
                        </Link>
                      ))
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

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
