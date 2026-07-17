import { Outlet, useLocation } from 'react-router-dom'
import AdminSidebar from './AdminSidebar'
import AdminHeader from './AdminHeader'
import ErrorBoundary from './ErrorBoundary'

const AdminLayout = () => {
  const location = useLocation()
  return (
    <div className="flex h-screen bg-cream overflow-hidden">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          {/* key={pathname} remounts the boundary (and the page) on route
              change, so navigating away from a crashed page recovers cleanly. */}
          <ErrorBoundary key={location.pathname}>
            <Outlet />
          </ErrorBoundary>
        </main>
      </div>
    </div>
  )
}

export default AdminLayout