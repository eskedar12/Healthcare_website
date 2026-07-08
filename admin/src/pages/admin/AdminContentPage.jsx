import { useState, useEffect, useRef } from 'react'
import { FiRefreshCw, FiExternalLink, FiEdit3, FiX } from 'react-icons/fi'
import useToast from '../../hooks/useToast'
import api from '../../services/api'

// The public site runs as a separate app. Point this at wherever it's
// served — defaults to the standard Vite dev port, override with
// VITE_SITE_URL in the admin app's .env if your setup differs.
const SITE_URL = import.meta.env.VITE_SITE_URL || 'http://localhost:5173'

// Every editable page on the public site: the path used for the live
// preview, and the default/empty shape of its content sections. Add a
// new entry here (plus a matching form block below) to make another
// page editable from the Web Editor.
const PAGES = {
  home: {
    label: 'Home',
    path: '/',
    empty: {
      hero: { title: '', description: '' },
      about: { title: '', description: '' },
      stats: [
        { value: '', label: '' },
        { value: '', label: '' },
        { value: '', label: '' },
        { value: '', label: '' },
      ],
    },
  },
  about: {
    label: 'About',
    path: '/about',
    empty: {
      header: { title: '', subtitle: '', bio1: '', bio2: '' },
      mission: { weExist: '', ourValues: ['', '', ''], weAim: '' },
    },
  },
  contact: {
    label: 'Contact',
    path: '/contact',
    empty: {
      header: { title: '', description: '' },
    },
  },
  services: {
    label: 'Services',
    path: '/services',
    empty: {
      header: { label: '', title: '', description: '' },
    },
  },
  projects: {
    label: 'Projects',
    path: '/projects',
    empty: {
      header: { title: '', description: '' },
    },
  },
}

const AdminContentPage = () => {
  const toast = useToast()
  const [page, setPage] = useState('home')
  const [content, setContent] = useState(PAGES.home.empty)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [previewKey, setPreviewKey] = useState(0)
  const [showEditor, setShowEditor] = useState(false)
  const iframeRef = useRef(null)

  useEffect(() => {
    fetchContent(page)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  const fetchContent = async (targetPage) => {
    setLoading(true)
    try {
      const res = await api.get(`/content/${targetPage}`)
      const data = res.data || {}
      const empty = PAGES[targetPage].empty
      const merged = {}
      for (const section of Object.keys(empty)) {
        const emptySection = empty[section]
        const incoming = data[section]
        if (Array.isArray(emptySection)) {
          merged[section] =
            Array.isArray(incoming) && incoming.length === emptySection.length
              ? incoming
              : emptySection
        } else {
          merged[section] = { ...emptySection, ...incoming }
          // Special-case: nested array fields inside an object section (e.g. mission.ourValues)
          for (const key of Object.keys(emptySection)) {
            if (Array.isArray(emptySection[key])) {
              merged[section][key] =
                Array.isArray(incoming?.[key]) && incoming[key].length === emptySection[key].length
                  ? incoming[key]
                  : emptySection[key]
            }
          }
        }
      }
      setContent(merged)
    } catch (err) {
      toast.error('Failed to load page content: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  // Update a plain field inside a section, e.g. content.hero.title
  const updateField = (section, field, value) => {
    setContent((prev) => ({ ...prev, [section]: { ...prev[section], [field]: value } }))
  }

  // Update one object inside a top-level array section, e.g. content.stats[i].value
  const updateArrayItem = (section, index, field, value) => {
    setContent((prev) => {
      const list = [...prev[section]]
      list[index] = { ...list[index], [field]: value }
      return { ...prev, [section]: list }
    })
  }

  // Update one plain string inside an array nested within a section,
  // e.g. content.mission.ourValues[i]
  const updateNestedStringArrayItem = (section, arrayField, index, value) => {
    setContent((prev) => {
      const list = [...prev[section][arrayField]]
      list[index] = value
      return { ...prev, [section]: { ...prev[section], [arrayField]: list } }
    })
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await api.post(`/content/${page}`, content)
      toast.success('Page content saved successfully')
      refreshPreview()
      setShowEditor(false)
    } catch (err) {
      toast.error('Failed to save page content: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  const refreshPreview = () => {
    // Force the iframe to remount and re-fetch the latest saved content
    setPreviewKey((k) => k + 1)
  }

  const handlePageChange = (newPage) => {
    if (newPage === page) return
    setPage(newPage)
    setShowEditor(false)
  }

  const previewUrl = `${SITE_URL}${PAGES[page].path}`

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col">
      <div className="flex items-center justify-between mb-3 flex-shrink-0">
        <div>
          <h1 className="font-serif text-xl text-text-dark">Web Editor</h1>
          <p className="font-sans text-text-muted text-xs">
            Pick a page below, then click Edit to change the text on it.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={refreshPreview}
            className="btn-outline flex items-center gap-2"
          >
            <FiRefreshCw /> Refresh
          </button>
          <button
            onClick={() => setShowEditor(true)}
            className="btn-primary flex items-center gap-2"
          >
            <FiEdit3 /> Edit
          </button>
        </div>
      </div>

      {/* Page selector */}
      <div className="flex items-center gap-2 mb-3 flex-shrink-0">
        {Object.entries(PAGES).map(([key, cfg]) => (
          <button
            key={key}
            onClick={() => handlePageChange(key)}
            className={`px-4 py-1.5 rounded-full text-sm font-sans transition-colors ${
              page === key
                ? 'bg-forest text-cream'
                : 'bg-cream text-text-body hover:bg-cream-dark'
            }`}
          >
            {cfg.label}
          </button>
        ))}
      </div>

      {/* Full-size live preview of the actual public site */}
      <div className="flex-1 bg-white rounded-xl shadow-sm overflow-hidden flex flex-col min-h-0">
        <div className="flex items-center justify-end px-4 py-2 border-b border-cream-darker bg-cream/50 flex-shrink-0">
          <a
            href={previewUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-sm text-forest hover:underline"
          >
            <FiExternalLink size={14} /> Open in new tab
          </a>
        </div>
        <iframe
          key={`${page}-${previewKey}`}
          ref={iframeRef}
          src={previewUrl}
          title="Live site preview"
          className="flex-1 w-full border-0"
        />
      </div>

      {/* Slide-over editing panel */}
      {showEditor && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowEditor(false)}
          />
          <div className="relative bg-white w-full max-w-md h-full shadow-xl flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-cream-darker flex-shrink-0">
              <h2 className="font-serif text-xl text-text-dark">Edit {PAGES[page].label} Page</h2>
              <button
                onClick={() => setShowEditor(false)}
                className="p-2 hover:bg-cream rounded-lg transition-colors"
              >
                <FiX className="text-xl" />
              </button>
            </div>

            {loading ? (
              <div className="flex-1 flex items-center justify-center text-text-muted">
                Loading content...
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
                {page === 'home' && (
                  <>
                    {/* Hero */}
                    <div>
                      <h3 className="font-serif text-lg text-text-dark mb-4">Hero Section</h3>
                      <div className="space-y-3">
                        <div>
                          <label className="font-sans text-sm font-medium text-text-dark block mb-1">
                            Title
                          </label>
                          <textarea
                            rows={2}
                            value={content.hero.title}
                            onChange={(e) => updateField('hero', 'title', e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-cream-darker focus:border-forest focus:outline-none transition-colors"
                            placeholder={'For your peace\nof mind.'}
                          />
                          <p className="font-sans text-xs text-text-muted mt-1">
                            Use a new line for a line break, like on the live page.
                          </p>
                        </div>
                        <div>
                          <label className="font-sans text-sm font-medium text-text-dark block mb-1">
                            Description
                          </label>
                          <textarea
                            rows={4}
                            value={content.hero.description}
                            onChange={(e) => updateField('hero', 'description', e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-cream-darker focus:border-forest focus:outline-none transition-colors"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div>
                      <h3 className="font-serif text-lg text-text-dark mb-4">Stats Bar</h3>
                      <div className="grid grid-cols-2 gap-4">
                        {content.stats.map((stat, index) => (
                          <div key={index} className="p-3 bg-cream rounded-lg space-y-2">
                            <input
                              type="text"
                              value={stat.value}
                              onChange={(e) => updateArrayItem('stats', index, 'value', e.target.value)}
                              placeholder="Value (e.g. 24/7)"
                              className="w-full px-3 py-1.5 rounded-lg border border-cream-darker focus:border-forest focus:outline-none transition-colors text-sm"
                            />
                            <input
                              type="text"
                              value={stat.label}
                              onChange={(e) => updateArrayItem('stats', index, 'label', e.target.value)}
                              placeholder="Label (e.g. Working Hours)"
                              className="w-full px-3 py-1.5 rounded-lg border border-cream-darker focus:border-forest focus:outline-none transition-colors text-sm"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* About */}
                    <div>
                      <h3 className="font-serif text-lg text-text-dark mb-4">About Section</h3>
                      <div className="space-y-3">
                        <div>
                          <label className="font-sans text-sm font-medium text-text-dark block mb-1">
                            Title
                          </label>
                          <input
                            type="text"
                            value={content.about.title}
                            onChange={(e) => updateField('about', 'title', e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-cream-darker focus:border-forest focus:outline-none transition-colors"
                          />
                        </div>
                        <div>
                          <label className="font-sans text-sm font-medium text-text-dark block mb-1">
                            Description
                          </label>
                          <textarea
                            rows={5}
                            value={content.about.description}
                            onChange={(e) => updateField('about', 'description', e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-cream-darker focus:border-forest focus:outline-none transition-colors"
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {page === 'about' && (
                  <>
                    {/* Header */}
                    <div>
                      <h3 className="font-serif text-lg text-text-dark mb-4">Page Header</h3>
                      <div className="space-y-3">
                        <div>
                          <label className="font-sans text-sm font-medium text-text-dark block mb-1">
                            Title
                          </label>
                          <input
                            type="text"
                            value={content.header.title}
                            onChange={(e) => updateField('header', 'title', e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-cream-darker focus:border-forest focus:outline-none transition-colors"
                          />
                        </div>
                        <div>
                          <label className="font-sans text-sm font-medium text-text-dark block mb-1">
                            Subtitle
                          </label>
                          <input
                            type="text"
                            value={content.header.subtitle}
                            onChange={(e) => updateField('header', 'subtitle', e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-cream-darker focus:border-forest focus:outline-none transition-colors"
                          />
                        </div>
                        <div>
                          <label className="font-sans text-sm font-medium text-text-dark block mb-1">
                            Bio Paragraph 1
                          </label>
                          <textarea
                            rows={4}
                            value={content.header.bio1}
                            onChange={(e) => updateField('header', 'bio1', e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-cream-darker focus:border-forest focus:outline-none transition-colors"
                          />
                        </div>
                        <div>
                          <label className="font-sans text-sm font-medium text-text-dark block mb-1">
                            Bio Paragraph 2
                          </label>
                          <textarea
                            rows={4}
                            value={content.header.bio2}
                            onChange={(e) => updateField('header', 'bio2', e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-cream-darker focus:border-forest focus:outline-none transition-colors"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Mission / Values / Vision */}
                    <div>
                      <h3 className="font-serif text-lg text-text-dark mb-4">Mission, Values &amp; Vision</h3>
                      <div className="space-y-3">
                        <div>
                          <label className="font-sans text-sm font-medium text-text-dark block mb-1">
                            We exist (mission)
                          </label>
                          <textarea
                            rows={3}
                            value={content.mission.weExist}
                            onChange={(e) => updateField('mission', 'weExist', e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-cream-darker focus:border-forest focus:outline-none transition-colors"
                          />
                        </div>
                        <div>
                          <label className="font-sans text-sm font-medium text-text-dark block mb-1">
                            Our values (3 items)
                          </label>
                          <div className="space-y-2">
                            {content.mission.ourValues.map((value, index) => (
                              <textarea
                                key={index}
                                rows={2}
                                value={value}
                                onChange={(e) =>
                                  updateNestedStringArrayItem('mission', 'ourValues', index, e.target.value)
                                }
                                className="w-full px-4 py-2 rounded-lg border border-cream-darker focus:border-forest focus:outline-none transition-colors text-sm"
                              />
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="font-sans text-sm font-medium text-text-dark block mb-1">
                            We aim (vision)
                          </label>
                          <textarea
                            rows={3}
                            value={content.mission.weAim}
                            onChange={(e) => updateField('mission', 'weAim', e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-cream-darker focus:border-forest focus:outline-none transition-colors"
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {page === 'contact' && (
                  <div>
                    <h3 className="font-serif text-lg text-text-dark mb-4">Page Header</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="font-sans text-sm font-medium text-text-dark block mb-1">
                          Title
                        </label>
                        <input
                          type="text"
                          value={content.header.title}
                          onChange={(e) => updateField('header', 'title', e.target.value)}
                          className="w-full px-4 py-2 rounded-lg border border-cream-darker focus:border-forest focus:outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="font-sans text-sm font-medium text-text-dark block mb-1">
                          Description
                        </label>
                        <textarea
                          rows={4}
                          value={content.header.description}
                          onChange={(e) => updateField('header', 'description', e.target.value)}
                          className="w-full px-4 py-2 rounded-lg border border-cream-darker focus:border-forest focus:outline-none transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {page === 'services' && (
                  <div>
                    <h3 className="font-serif text-lg text-text-dark mb-4">Page Header</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="font-sans text-sm font-medium text-text-dark block mb-1">
                          Label
                        </label>
                        <input
                          type="text"
                          value={content.header.label}
                          onChange={(e) => updateField('header', 'label', e.target.value)}
                          placeholder="What we offer"
                          className="w-full px-4 py-2 rounded-lg border border-cream-darker focus:border-forest focus:outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="font-sans text-sm font-medium text-text-dark block mb-1">
                          Title
                        </label>
                        <input
                          type="text"
                          value={content.header.title}
                          onChange={(e) => updateField('header', 'title', e.target.value)}
                          className="w-full px-4 py-2 rounded-lg border border-cream-darker focus:border-forest focus:outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="font-sans text-sm font-medium text-text-dark block mb-1">
                          Description
                        </label>
                        <textarea
                          rows={4}
                          value={content.header.description}
                          onChange={(e) => updateField('header', 'description', e.target.value)}
                          className="w-full px-4 py-2 rounded-lg border border-cream-darker focus:border-forest focus:outline-none transition-colors"
                        />
                      </div>
                    </div>
                    <p className="font-sans text-xs text-text-muted mt-3">
                      The individual service cards below this header are managed from the Services page in the sidebar.
                    </p>
                  </div>
                )}

                {page === 'projects' && (
                  <div>
                    <h3 className="font-serif text-lg text-text-dark mb-4">Page Header</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="font-sans text-sm font-medium text-text-dark block mb-1">
                          Title
                        </label>
                        <input
                          type="text"
                          value={content.header.title}
                          onChange={(e) => updateField('header', 'title', e.target.value)}
                          className="w-full px-4 py-2 rounded-lg border border-cream-darker focus:border-forest focus:outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="font-sans text-sm font-medium text-text-dark block mb-1">
                          Description
                        </label>
                        <textarea
                          rows={3}
                          value={content.header.description}
                          onChange={(e) => updateField('header', 'description', e.target.value)}
                          className="w-full px-4 py-2 rounded-lg border border-cream-darker focus:border-forest focus:outline-none transition-colors"
                        />
                      </div>
                    </div>
                    <p className="font-sans text-xs text-text-muted mt-3">
                      The project list and partners below this header are managed elsewhere.
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-3 px-6 py-4 border-t border-cream-darker flex-shrink-0">
              <button
                onClick={handleSave}
                disabled={saving || loading}
                className="btn-primary flex-1 disabled:opacity-60"
              >
                {saving ? 'Saving...' : 'Save changes'}
              </button>
              <button
                onClick={() => setShowEditor(false)}
                className="btn-outline flex-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminContentPage
