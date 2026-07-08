import { useEffect } from 'react'

const Modal = ({ isOpen, onClose, title, children }) => {
  // Lock scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-text-dark/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative bg-cream rounded-2xl shadow-card-hover w-full max-w-lg max-h-[90vh] overflow-y-auto z-10">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-cream-darker">
          {title && (
            <h3 className="font-serif text-xl text-text-dark">{title}</h3>
          )}
          <button
            onClick={onClose}
            className="ml-auto text-text-muted hover:text-text-dark transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-cream-dark"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6">{children}</div>
      </div>
    </div>
  )
}

export default Modal