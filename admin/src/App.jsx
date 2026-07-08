import { Routes, Route, Navigate } from 'react-router-dom'
import { AdminProvider } from './contexts/AdminContext'
import { ToastProvider } from './contexts/ToastContext'
import { useAdmin } from './hooks/useAdmin'
import { canAccessContent } from './utils/permissions'
import AdminLoginPage from './pages/admin/AdminLoginPage'
import AdminLayout from './components/admin/AdminLayout'
import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import AdminContentPage from './pages/admin/AdminContentPage'
import AdminAppointmentsPage from './pages/admin/AdminAppointmentsPage'
import AdminDoctorsPage from './pages/admin/AdminDoctorsPage'
import AdminServicesPage from './pages/admin/AdminServicesPage'
import AdminBranchesPage from './pages/admin/AdminBranchesPage'

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, initializing } = useAdmin()

  if (initializing) {
    // Avoid a flash-redirect to /login while we check localStorage
    return null
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />
  }

  return children
}

// Wraps a route so a signed-in user without the right role is bounced
// to the dashboard instead of seeing a page they shouldn't access.
const RoleRoute = ({ allow, children }) => {
  const { user } = useAdmin()

  if (!allow(user?.role)) {
    return <Navigate to="/admin/dashboard" replace />
  }

  return children
}

function App() {
  return (
    <AdminProvider>
      <ToastProvider>
      <Routes>
        {/* Redirect root to admin login */}
        <Route path="/" element={<Navigate to="/admin/login" replace />} />

        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="content" element={
            <RoleRoute allow={canAccessContent}>
              <AdminContentPage />
            </RoleRoute>
          } />
          <Route path="appointments" element={<AdminAppointmentsPage />} />
          <Route path="doctors" element={<AdminDoctorsPage />} />
          <Route path="services" element={<AdminServicesPage />} />
          <Route path="branches" element={<AdminBranchesPage />} />
        </Route>
      </Routes>
      </ToastProvider>
    </AdminProvider>
  )
}

export default App
