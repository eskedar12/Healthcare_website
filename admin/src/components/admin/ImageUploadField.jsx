import { useRef, useState } from 'react'
import { FiImage, FiTrash2, FiUploadCloud } from 'react-icons/fi'
import api, { API_ORIGIN } from '../../services/api'
import useToast from '../../hooks/useToast'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

// Resolve a value stored in content (either a relative "/uploads/..." path
// returned by our own upload endpoint, or a full external URL) into
// something an <img> can load directly.
const resolveImageSrc = (value) => {
  if (!value) return null
  if (/^https?:\/\//i.test(value) || value.startsWith('data:')) return value
  return `${API_ORIGIN}${value}`
}

// Editable image field: shows the current image (or an empty placeholder),
// lets the user pick a new file from their computer, uploads it immediately,
// and calls onChange with the resulting URL to store on content.
const ImageUploadField = ({ label, value, onChange, uploadUrl = '/content/upload/image' }) => {
  const toast = useToast()
  const inputRef = useRef(null)
  const [uploading, setUploading] = useState(false)

  const handlePick = () => inputRef.current?.click()

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = '' // allow picking the same file again later
    if (!file) return

    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error('Please choose a JPG, PNG, WEBP, or GIF image')
      return
    }
    if (file.size > MAX_FILE_SIZE) {
      toast.error('Image must be 5MB or smaller')
      return
    }

    const formData = new FormData()
    formData.append('image', file)

    setUploading(true)
    try {
      const res = await api.post(uploadUrl, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      onChange(res.data.url)
      toast.success('Image uploaded')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = () => onChange('')

  const src = resolveImageSrc(value)

  return (
    <div>
      <label className="font-sans text-sm font-medium text-text-dark block mb-1">{label}</label>
      <div className="flex items-start gap-3">
        <div className="w-32 h-24 rounded-lg border border-cream-darker bg-cream flex items-center justify-center overflow-hidden flex-shrink-0">
          {src ? (
            <img src={src} alt={label} className="w-full h-full object-cover" />
          ) : (
            <FiImage className="text-text-muted text-2xl" />
          )}
        </div>
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={handlePick}
            disabled={uploading}
            className="btn-outline flex items-center gap-2 text-sm px-3 py-1.5 disabled:opacity-60"
          >
            <FiUploadCloud />
            {uploading ? 'Uploading...' : src ? 'Change image' : 'Upload image'}
          </button>
          {src && (
            <button
              type="button"
              onClick={handleRemove}
              disabled={uploading}
              className="flex items-center gap-1.5 text-sm text-red-600 hover:underline disabled:opacity-60"
            >
              <FiTrash2 /> Remove
            </button>
          )}
          <p className="font-sans text-xs text-text-muted">JPG, PNG, WEBP, or GIF. Max 5MB.</p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  )
}

export default ImageUploadField
