import { useContext } from 'react'
import { AdminContext } from '../contexts/AdminContext'

// Access the current admin's auth state and login/logout actions.
// Must be used within an <AdminProvider>.
export const useAdmin = () => {
  const context = useContext(AdminContext)
  if (!context) {
    throw new Error('useAdmin must be used within an <AdminProvider>')
  }
  return context
}

export default useAdmin
