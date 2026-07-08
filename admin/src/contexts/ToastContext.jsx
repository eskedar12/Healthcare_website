import { createContext, useCallback, useState } from 'react'
import { FiCheckCircle, FiXCircle, FiX } from 'react-icons/fi'

export const ToastContext = createContext(null)

let idCounter = 0

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const showToast = useCallback((message, type = 'success') => {
    const id = ++idCounter
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => removeToast(id), 3500)
  }, [removeToast])

  const success = useCallback((message) => showToast(message, 'success'), [showToast])
  const error = useCallback((message) => showToast(message, 'error'), [showToast])

  return (
    <ToastContext.Provider value={{ success, error }}>
      {children}

      {/* Toast stack */}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 w-full max-w-sm pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-xl shadow-lg font-sans text-sm animate-[fadeIn_0.2s_ease-out] ${
              toast.type === 'success'
                ? 'bg-forest text-white'
                : 'bg-red-600 text-white'
            }`}
          >
            {toast.type === 'success' ? (
              <FiCheckCircle className="mt-0.5 shrink-0" size={18} />
            ) : (
              <FiXCircle className="mt-0.5 shrink-0" size={18} />
            )}
            <p className="flex-1">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="opacity-80 hover:opacity-100 transition-opacity"
            >
              <FiX size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
