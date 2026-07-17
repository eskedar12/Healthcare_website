import { createContext, useState, useEffect, useContext } from 'react'
import { useAdmin } from '../hooks/useAdmin'
import api from '../services/api'
import { canViewContactMessages, canEditAppointments, canViewNotifications } from '../utils/permissions'

const NotificationContext = createContext(null)

// Notifications are synthesized on every fetch from "Pending" appointments
// and "New" contact messages — there's no dedicated notifications table on
// the backend, so "read" isn't a real field we can PATCH. Instead we keep
// the set of read notification ids in localStorage, so marking something
// read survives a refresh instead of resetting the moment the list is
// rebuilt from scratch. Entries are pruned to whatever's currently in the
// fetched list, so the stored set never grows unbounded.
const READ_STORAGE_KEY = 'adminReadNotificationIds'

const loadReadIds = () => {
  try {
    const raw = localStorage.getItem(READ_STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return new Set(Array.isArray(parsed) ? parsed : [])
  } catch {
    return new Set()
  }
}

const saveReadIds = (idsSet) => {
  try {
    localStorage.setItem(READ_STORAGE_KEY, JSON.stringify([...idsSet]))
  } catch {
    // Ignore storage errors (e.g. private browsing quota) — read state just
    // won't persist across refreshes in that case.
  }
}

export const NotificationProvider = ({ children }) => {
  const { user } = useAdmin()
  const [notifications, setNotifications] = useState([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  const fetchNotifications = async () => {
    if (!user || !canViewNotifications(user)) return
    try {
      const newNotifications = []

      // Fetch new appointments
      if (canEditAppointments(user)) {
        try {
          const apptRes = await api.get('/appointments', { params: { status: 'Pending' } })
          const pendingAppointments = apptRes.data || []
          pendingAppointments.forEach(appt => {
            newNotifications.push({
              id: `appt-${appt.id}`,
              type: 'appointment',
              title: 'New Appointment',
              message: `${appt.patient_name} booked an appointment for ${appt.date} at ${appt.time}`,
              createdAt: appt.created_at,
              read: false,
              link: '/admin/appointments',
            })
          })
        } catch (err) {
          console.error('Failed to fetch appointments for notifications:', err)
        }
      }

      // Fetch new contact messages
      if (canViewContactMessages(user)) {
        try {
          const msgRes = await api.get('/inquiries')
          const newMessages = (msgRes.data || []).filter(msg => msg.status === 'New')
          newMessages.forEach(msg => {
            newNotifications.push({
              id: `msg-${msg.id}`,
              type: 'contact',
              title: 'New Contact Message',
              message: `${msg.name}: ${msg.subject || msg.message.substring(0, 50)}...`,
              createdAt: msg.created_at,
              read: false,
              link: '/admin/contact',
            })
          })
        } catch (err) {
          console.error('Failed to fetch messages for notifications:', err)
        }
      }

      // Sort by date, newest first
      newNotifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

      // Re-apply any read state that was persisted from before this fetch
      // (e.g. a page refresh), and drop stale ids for notifications that no
      // longer exist so storage doesn't grow forever.
      const readIds = loadReadIds()
      const currentIds = new Set(newNotifications.map(n => n.id))
      const prunedReadIds = new Set([...readIds].filter(id => currentIds.has(id)))
      if (prunedReadIds.size !== readIds.size) saveReadIds(prunedReadIds)

      const withReadState = newNotifications.map(n => ({ ...n, read: prunedReadIds.has(n.id) }))
      setNotifications(withReadState)
      setUnreadCount(withReadState.filter(n => !n.read).length)
    } catch (err) {
      console.error('Failed to fetch notifications:', err)
    }
  }

  const markAllAsRead = () => {
    const readIds = loadReadIds()
    notifications.forEach(n => readIds.add(n.id))
    saveReadIds(readIds)
    setNotifications(notifications.map(n => ({ ...n, read: true })))
    setUnreadCount(0)
  }

  const markAsRead = (id) => {
    const readIds = loadReadIds()
    readIds.add(id)
    saveReadIds(readIds)
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n))
    setUnreadCount(prev => Math.max(0, prev - 1))
  }

  // Poll for new notifications every 30 seconds
  useEffect(() => {
    if (user && canViewNotifications(user)) {
      fetchNotifications()
      const interval = setInterval(fetchNotifications, 30000)
      return () => clearInterval(interval)
    }
  }, [user])

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        showDropdown,
        setShowDropdown,
        markAllAsRead,
        markAsRead,
        refreshNotifications: fetchNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotifications = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}
