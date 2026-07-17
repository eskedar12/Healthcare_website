import { Routes, Route, Navigate } from 'react-router-dom'
import { AdminProvider } from './contexts/AdminContext'
import { ToastProvider } from './contexts/ToastContext'
import { NotificationProvider } from './contexts/NotificationContext'
import { useAdmin } from './hooks/useAdmin'
import {
  canAccessContent,
  canManageStaff,
  canViewContactMessages,
  canViewAppointments,
  canViewDoctors,
  canViewServices,
  canViewBranches,
} from './utils/permissions'
import AdminLoginPage from './pages/admin/AdminLoginPage'
import AdminLayout from './components/admin/AdminLayout'
import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import AdminContentPage from './pages/admin/AdminContentPage'
import AdminAppointmentsPage from './pages/admin/AdminAppointmentsPage'
import AdminDoctorsPage from './pages/admin/AdminDoctorsPage'
import AdminServicesPage from './pages/admin/AdminServicesPage'
import AdminProjectsPage from './pages/admin/AdminProjectsPage'
import AdminBlogPage from './pages/admin/AdminBlogPage'
import AdminBranchesPage from './pages/admin/AdminBranchesPage'
import AdminStaffsPage from './pages/admin/AdminStaffsPage'
import AdminContactPage from './pages/admin/AdminContactPage'

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

// Wraps a route so a signed-in user without the right role/permissions is bounced
// to the dashboard instead of seeing a page they shouldn't access.
const PermissionRoute = ({ allow, children }) => {
  const { user } = useAdmin()

  if (!allow(user)) {
    return <Navigate to="/admin/dashboard" replace />
  }

  return children
}

function App() {
  return (
    <AdminProvider>
      <ToastProvider>
        <NotificationProvider>
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
                <PermissionRoute allow={canAccessContent}>
                  <AdminContentPage />
                </PermissionRoute>
              } />
              <Route path="appointments" element={
                <PermissionRoute allow={canViewAppointments}>
                  <AdminAppointmentsPage />
                </PermissionRoute>
              } />
              <Route path="doctors" element={
                <PermissionRoute allow={canViewDoctors}>
                  <AdminDoctorsPage />
                </PermissionRoute>
              } />
              <Route path="services" element={
                <PermissionRoute allow={canViewServices}>
                  <AdminServicesPage />
                </PermissionRoute>
              } />
              <Route path="projects" element={
                <PermissionRoute allow={canAccessContent}>
                  <AdminProjectsPage />
                </PermissionRoute>
              } />
              <Route path="blog" element={
                <PermissionRoute allow={canAccessContent}>
                  <AdminBlogPage />
                </PermissionRoute>
              } />
              <Route path="branches" element={
                <PermissionRoute allow={canViewBranches}>
                  <AdminBranchesPage />
                </PermissionRoute>
              } />
              <Route path="staff" element={
                <PermissionRoute allow={canManageStaff}>
                  <AdminStaffsPage />
                </PermissionRoute>
              } />
              <Route path="contact" element={
                <PermissionRoute allow={canViewContactMessages}>
                  <AdminContactPage />
                </PermissionRoute>
              } />
            </Route>
          </Routes>
        </NotificationProvider>
      </ToastProvider>
    </AdminProvider>
  )
}

export default App