import { useEffect, useRef } from 'react'
import { useEditMode } from '../../../contexts/EditModeContext'

// Auto-growing textarea used for multi-line text, so the box always matches
// the height of its content instead of showing a scrollbar.
const AutoGrowTextarea = ({ value, onChange, className, placeholder, style }) => {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }, [value])

  return (
    <textarea
      ref={ref}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      rows={1}
      style={style}
      className={`${className} resize-none overflow-hidden bg-transparent w-full outline-none ring-1 ring-forest/30 focus:ring-2 focus:ring-forest rounded-md transition-shadow`}
    />
  )
}

/**
 * Renders `value` as plain text/markup (via `as`) when not in edit mode —
 * pixel-identical to the original design. When the admin has edit mode on,
 * renders an input/textarea styled with the same classes instead, so the
 * layout doesn't shift and the text stays exactly where it was.
 *
 * `multiline` picks a textarea (auto-growing) vs a single-line input.
 */
const EditableText = ({ as: Tag = 'p', value, onChange, className = '', multiline = false, placeholder, renderText, style }) => {
  const { editMode } = useEditMode()

  if (!editMode) {
    return <Tag className={className} style={style}>{renderText ? renderText(value) : value}</Tag>
  }

  if (multiline) {
    return <AutoGrowTextarea value={value} onChange={onChange} className={className} placeholder={placeholder} style={style} />
  }

  return (
    <input
      type="text"
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      style={style}
      className={`${className} bg-transparent w-full outline-none ring-1 ring-forest/30 focus:ring-2 focus:ring-forest rounded-md transition-shadow`}
    />
  )
}

export default EditableText