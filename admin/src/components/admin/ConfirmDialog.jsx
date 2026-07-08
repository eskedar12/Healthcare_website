import { FiAlertTriangle } from 'react-icons/fi'

// A styled in-app confirmation modal, used instead of window.confirm()
// so delete actions don't show the browser's native "localhost says" popup.
const ConfirmDialog = ({
  open,
  title = 'Are you sure?',
  message,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
}) => {
  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0">
            <FiAlertTriangle size={20} />
          </div>
          <div>
            <h3 className="font-serif text-lg text-text-dark">{title}</h3>
            {message && (
              <p className="font-sans text-sm text-text-muted mt-1">{message}</p>
            )}
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-sans text-sm font-medium py-2.5 rounded-lg transition-colors"
          >
            {confirmLabel}
          </button>
          <button
            onClick={onCancel}
            className="btn-outline flex-1"
          >
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog
