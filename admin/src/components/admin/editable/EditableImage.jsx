import { useRef, useState } from 'react'
import { useEditMode } from '../../../contexts/EditModeContext'
import api, { API_ORIGIN } from '../../services/api'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

// A value saved via the uploader is a relative path like
// "/uploads/content/xyz.jpg"; anything else (a bundled asset URL, an
// external URL, or a data/blob URL while previewing) is already usable as-is.
const resolveImageSrc = (value) => {
  if (!value) return null
  if (/^https?:\/\//i.test(value) || value.startsWith('data:') || value.startsWith('blob:')) return value
  return `${API_ORIGIN}${value}`
}

/**
 * Renders an image exactly like a normal <img> when not in edit mode. When
 * edit mode is on, renders the image plus an absolutely-positioned "Change
 * image" overlay as a sibling — it does NOT add a wrapper div, so it relies
 * on whatever div already directly wraps the image being `position:
 * relative` (add that class at the call site if it isn't already, it won't
 * change anything visually since the box's size is unaffected).
 *
 * `fallbackSrc` is the original bundled/static image to show when no
 * content-managed image has been set yet.
 */
const EditableImage = ({ value, onChange, fallbackSrc, alt, className }) => {
  const { editMode, token } = useEditMode()
  const inputRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const resolvedSrc = resolveImageSrc(value) || fallbackSrc

  if (!editMode) {
    return <img src={resolvedSrc} alt={alt} className={className} />
  }

  const handlePick = () => inputRef.current?.click()

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('Please choose a JPG, PNG, WEBP, or GIF image')
      return
    }
    if (file.size > MAX_FILE_SIZE) {
      setError('Image must be 5MB or smaller')
      return
    }
    setError('')

    const formData = new FormData()
    formData.append('image', file)

    setUploading(true)
    try {
      const res = await api.post('/content/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      })
      onChange(res.data.url)
    } catch (err) {
      setError(err.message || 'Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  return (
    <>
      <img src={resolvedSrc} alt={alt} className={className} />
      <button
        type="button"
        onClick={handlePick}
        disabled={uploading}
        className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-black/45 text-white font-sans text-sm opacity-0 hover:opacity-100 focus:opacity-100 transition-opacity disabled:opacity-100"
      >
        <span>{uploading ? 'Uploading…' : 'Change image'}</span>
        {error && <span className="text-xs text-red-200 max-w-[80%] text-center">{error}</span>}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFileChange}
        className="hidden"
      />
    </>
  )
}

export default EditableImage