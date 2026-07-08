import { useEffect, useRef, useState, useCallback } from 'react'
import api from '../services/api'

/**
 * Generic GET data-fetching hook.
 * Usage: const { data, loading, error, refetch } = useFetch('/services')
 * Silently fails (error is set, data stays null) so callers can fall back
 * to static placeholder content while the backend is unavailable.
 */
const useFetch = (path, { enabled = true, params } = {}) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(Boolean(enabled))
  const [error, setError] = useState(null)
  const isMounted = useRef(true)

  const fetchData = useCallback(async () => {
    if (!path || !enabled) return
    setLoading(true)
    setError(null)
    try {
      const res = await api.get(path, { params })
      if (isMounted.current) setData(res.data)
    } catch (err) {
      if (isMounted.current) setError(err)
    } finally {
      if (isMounted.current) setLoading(false)
    }
  }, [path, enabled, JSON.stringify(params)])

  useEffect(() => {
    isMounted.current = true
    fetchData()
    return () => {
      isMounted.current = false
    }
  }, [fetchData])

  return { data, loading, error, refetch: fetchData }
}

export default useFetch
