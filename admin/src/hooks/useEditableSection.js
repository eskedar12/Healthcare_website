import { useCallback, useEffect, useRef, useState } from 'react'
import { useEditMode } from '../contexts/EditModeContext'
import api from '../services/api'

const SAVE_DEBOUNCE_MS = 700

// Manages the editable copy of one content section (e.g. "hero" on the
// "home" page). The backend stores a whole section as one JSON blob, so any
// save must include the full section — not just the field that changed —
// or it would wipe out the other fields.
//
// `initial` should be the same merged (fetched-or-default) section object
// the page already computes today; this hook just adds a writable layer on
// top of it for when edit mode is on.
export const useEditableSection = (page, section, initial) => {
  const { token } = useEditMode()
  const [value, setValue] = useState(initial)
  const latestRef = useRef(initial)
  const timerRef = useRef(null)

  // Re-sync if the underlying fetched/default content changes (e.g. once
  // the initial GET request resolves).
  const initialKey = JSON.stringify(initial)
  useEffect(() => {
    setValue(initial)
    latestRef.current = initial
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialKey])

  const save = useCallback(
    (sectionValue) => {
      if (!token) return
      window.parent?.postMessage({ type: 'ADMIN_CONTENT_SAVING', page, section }, '*')
      api
        .post(
          `/content/${page}`,
          { [section]: sectionValue },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then(() => {
          window.parent?.postMessage({ type: 'ADMIN_CONTENT_SAVED', page, section }, '*')
        })
        .catch((err) => {
          window.parent?.postMessage(
            { type: 'ADMIN_CONTENT_ERROR', page, section, message: err.message },
            '*'
          )
        })
    },
    [page, section, token]
  )

  const updateField = useCallback(
    (field, fieldValue) => {
      setValue((prev) => {
        const next = { ...prev, [field]: fieldValue }
        latestRef.current = next
        if (timerRef.current) clearTimeout(timerRef.current)
        timerRef.current = setTimeout(() => save(latestRef.current), SAVE_DEBOUNCE_MS)
        return next
      })
    },
    [save]
  )

  // Some fields (arrays of strings/objects, e.g. stats or ourValues) are
  // easier to update as a whole rather than one field at a time.
  const updateAll = useCallback(
    (nextValue) => {
      setValue(nextValue)
      latestRef.current = nextValue
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => save(latestRef.current), SAVE_DEBOUNCE_MS)
    },
    [save]
  )

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current)
  }, [])

  return { value, updateField, updateAll }
}