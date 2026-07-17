import { createContext, useState, useEffect } from 'react'
import api from '../services/api'

export const AdminContext = createContext(null)

export const AdminProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  // true while we check localStorage on first load, so ProtectedRoute
  // doesn't bounce a logged-in user to /login for a split second
  const [initializing, setInitializing] = useState(true)

  useEffect(() => {
    const storedToken = localStorage.getItem('adminToken')
    const storedUser = localStorage.getItem('adminUser')
    if (storedToken && storedUser) {
      try {
        setToken(storedToken)
        setUser(JSON.parse(storedUser))
      } catch {
        localStorage.removeItem('adminToken')
        localStorage.removeItem('adminUser')
        localStorage.removeItem('adminRefreshToken')
      }
    }
    setInitializing(false)
  }, [])

  const login = async (email, password) => {
    // auth: false — we don't have a token yet, this call doesn't need one
    const res = await api.post('/auth/login', { email, password }, { auth: false })
    const { token: accessToken, refreshToken, user: loggedInUser } = res.data

    localStorage.setItem('adminToken', accessToken)
    localStorage.setItem('adminUser', JSON.stringify(loggedInUser))
    if (refreshToken) localStorage.setItem('adminRefreshToken', refreshToken)

    setToken(accessToken)
    setUser(loggedInUser)

    return loggedInUser
  }

  const logout = async () => {
    try {
      // Best-effort — the current backend logout is stateless, but this
      // keeps the door open for real session invalidation later.
      await api.post('/auth/logout')
    } catch {
      // Ignore errors here — we're logging out either way.
    }
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUser')
    localStorage.removeItem('adminRefreshToken')
    setToken(null)
    setUser(null)
  }

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    initializing,
    login,
    logout,
  }

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
}