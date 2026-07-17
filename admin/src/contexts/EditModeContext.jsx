import { createContext, useContext, useEffect, useState } from 'react'

// Bridges the public site (running inside the admin's preview iframe) with
// the admin app. The admin toggles edit mode and hands over a short-lived
// admin token via postMessage; this site never has its own admin login.
//
// Message shapes:
//   admin -> site:  { type: 'ADMIN_EDIT_MODE', enabled: boolean, token?: string }
//   site  -> admin: { type: 'PUBLIC_SITE_READY' }
//                    (sent on mount so the admin can (re)send state after
//                    every iframe reload/page switch)

const EditModeContext = createContext({ editMode: false, token: null })

export const EditModeProvider = ({ children }) => {
  const [editMode, setEditMode] = useState(false)
  const [token, setToken] = useState(null)

  useEffect(() => {
    // Only ever trust messages while actually embedded in an iframe — a
    // standalone visit to the site has no admin parent to listen to.
    if (window.parent === window) return

    const handleMessage = (event) => {
      const msg = event.data
      if (!msg || msg.type !== 'ADMIN_EDIT_MODE') return
      setEditMode(Boolean(msg.enabled))
      setToken(msg.enabled ? msg.token || null : null)
    }

    window.addEventListener('message', handleMessage)
    window.parent.postMessage({ type: 'PUBLIC_SITE_READY' }, '*')

    return () => window.removeEventListener('message', handleMessage)
  }, [])

  return (
    <EditModeContext.Provider value={{ editMode, token }}>
      {children}
    </EditModeContext.Provider>
  )
}

export const useEditMode = () => useContext(EditModeContext)