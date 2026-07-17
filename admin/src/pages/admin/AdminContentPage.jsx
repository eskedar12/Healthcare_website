import { useState, useEffect, useRef, useCallback } from 'react'
import { FiRefreshCw, FiExternalLink, FiEdit3 } from 'react-icons/fi'
import useToast from '../../hooks/useToast'
import { useAdmin } from '../../hooks/useAdmin'
import { canEditContent } from '../../utils/permissions'

// The public site runs as a separate app. Point this at wherever it's
// served — defaults to the standard Vite dev port, override with
// VITE_SITE_URL in the admin app's .env if your setup differs.
const SITE_URL = import.meta.env.VITE_SITE_URL || 'http://localhost:5173'

// Every editable page on the public site, and the path used for the live
// preview. Add an entry here to make another page available in the sidebar
// — the page itself controls what's editable via <EditableText>/<EditableImage>.
const PAGES = {
  home: { label: 'Home', path: '/' },
  about: { label: 'About', path: '/about' },
  services: { label: 'Services', path: '/services' },
  doctors: { label: 'Doctors', path: '/doctors' },
  blog: { label: 'Blog', path: '/blog' },
  projects: { label: 'Projects', path: '/projects' },
  contact: { label: 'Contact', path: '/contact' },
  booking: { label: 'Booking', path: '/book' },
}

// The navbar (logo, brand name, tagline) and footer are shared across every
// page via the Layout component, so they're editable no matter which page
// above is selected — there's no separate "page" for them.

// Edit mode and content changes flow to/from the live preview entirely via
// postMessage — there's no separate form. See src3 (public site)
// EditModeContext.jsx / useEditableSection.js for the other side of this bridge.
const AdminContentPage = () => {
  const toast = useToast()
  const { user } = useAdmin()
  const canEdit = canEditContent(user)
  const [page, setPage] = useState('home')
  const [editMode, setEditMode] = useState(false)
  const [saveStatus, setSaveStatus] = useState('idle') // idle | saving | saved | error
  const [previewKey, setPreviewKey] = useState(0)
  const iframeRef = useRef(null)

  const sendEditModeMessage = useCallback((enabled) => {
    const token = enabled ? localStorage.getItem('adminToken') : null
    iframeRef.current?.contentWindow?.postMessage(
      { type: 'ADMIN_EDIT_MODE', enabled, token },
      SITE_URL
    )
  }, [])

  // Re-announce the current edit mode whenever the live preview reloads
  // (page switch, manual refresh, or the site's own navigation), and relay
  // save status back from the page into a small status indicator here.
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.origin !== new URL(SITE_URL).origin) return
      const msg = event.data
      if (!msg) return

      if (msg.type === 'PUBLIC_SITE_READY') {
        sendEditModeMessage(editMode)
      } else if (msg.type === 'ADMIN_CONTENT_SAVING') {
        setSaveStatus('saving')
      } else if (msg.type === 'ADMIN_CONTENT_SAVED') {
        setSaveStatus('saved')
      } else if (msg.type === 'ADMIN_CONTENT_ERROR') {
        setSaveStatus('error')
        toast.error('Failed to save: ' + (msg.message || 'unknown error'))
      }
    }
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editMode, sendEditModeMessage])

  const toggleEdit = () => {
    if (!canEdit) return
    const next = !editMode
    setEditMode(next)
    setSaveStatus('idle')
    sendEditModeMessage(next)
  }

  const refreshPreview = () => {
    setPreviewKey((k) => k + 1)
  }

  const handlePageChange = (newPage) => {
    if (newPage === page) return
    setPage(newPage)
    setSaveStatus('idle')
    // Switching pages remounts the iframe (fresh load); edit mode is
    // re-sent automatically once it reports PUBLIC_SITE_READY.
  }

  const previewUrl = `${SITE_URL}${PAGES[page].path}`

  const statusLabel = {
    idle: null,
    saving: 'Saving…',
    saved: 'All changes saved',
    error: 'Save failed',
  }[saveStatus]

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col">
      <div className="flex items-center justify-between mb-3 flex-shrink-0">
        <div>
          <h1 className="font-serif text-xl text-text-dark">Web Editor</h1>
          <p className="font-sans text-text-muted text-xs">
            {editMode
              ? 'Click any text or image on the page to edit it directly.'
              : 'Pick a page below, then click Edit to change it in place.'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {statusLabel && (
            <span
              className={`font-sans text-xs ${
                saveStatus === 'error' ? 'text-red-600' : 'text-text-muted'
              }`}
            >
              {statusLabel}
            </span>
          )}
          <button onClick={refreshPreview} className="btn-outline flex items-center gap-2">
            <FiRefreshCw /> Refresh
          </button>
          {canEdit && (
            <button
              onClick={toggleEdit}
              className={editMode ? 'btn-primary flex items-center gap-2 !bg-forest-dark' : 'btn-primary flex items-center gap-2'}
            >
              <FiEdit3 /> {editMode ? 'Done editing' : 'Edit'}
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 mb-3 flex-shrink-0">
        {Object.entries(PAGES).map(([key, { label }]) => (
          <button
            key={key}
            onClick={() => handlePageChange(key)}
            className={`px-4 py-2 rounded-full font-sans text-sm transition-colors ${
              page === key
                ? 'bg-forest text-cream'
                : 'bg-cream-dark text-text-dark hover:bg-cream-darker'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex-1 rounded-xl border border-cream-darker overflow-hidden bg-white flex flex-col min-h-0">
        <div className="flex items-center justify-end px-4 py-2 border-b border-cream-darker bg-cream flex-shrink-0">
          <a
            href={previewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans text-xs text-forest hover:underline flex items-center gap-1.5"
          >
            <FiExternalLink /> Open in new tab
          </a>
        </div>
        <iframe
          key={`${page}-${previewKey}`}
          ref={iframeRef}
          src={previewUrl}
          title="Page preview"
          className="flex-1 w-full border-0"
        />
      </div>
    </div>
  )
}

export default AdminContentPage