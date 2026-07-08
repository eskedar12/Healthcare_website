import { useContext } from 'react'
import { ToastContext } from '../contexts/ToastContext'

// Access the app-wide toast notifier: toast.success(msg) / toast.error(msg)
// Must be used within a <ToastProvider>.
export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a <ToastProvider>')
  }
  return context
}

export default useToast
