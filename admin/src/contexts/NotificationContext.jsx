import { createContext, useState, useEffect, useContext } from 'react'
import { useAdmin } from '../hooks/useAdmin'
import api from '../services/api'
import { canViewContactMessages, canEditAppointments, canViewNotifications } from '../utils/permissions'

const NotificationContext = createContext(null)

const READ_STORAGE_KEY = 'adminReadNotificationIds'

const SUBJECT_LABELS = {
  general: 'General Inquiry',
  appointment: 'Appointment Question',
  billing: 'Billing & Insurance',
  feedback: 'Feedback & Suggestions',
  other: 'Other Inquiry',
}

const formatSubject = (subject) => SUBJECT_LABELS[subject] || subject || 'General Inquiry'

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
    // Ignore storage errors
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

      // Fetch pending appointments
      if (canEditAppointments(user)) {
        try {
          const apptRes = await api.get('/appointments', { params: { status: 'Pending' } })
          const pendingAppointments = apptRes.data || []
          pendingAppointments.forEach(appt => {
            newNotifications.push({
              id: `appt-${appt.id}`,
              type: 'appointment',
              title: 'New Appointment Booking',
              message: `Appointment booked by ${appt.patient_name} for ${appt.date} at ${appt.time}`,
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
            const subjectStr = formatSubject(msg.subject)
            const textSnippet = (msg.message || '').trim()
            const messagePreview = textSnippet
              ? (textSnippet.length > 50 ? `${textSnippet.substring(0, 50)}...` : textSnippet)
              : subjectStr

            newNotifications.push({
              id: `msg-${msg.id}`,
              type: 'contact',
              title: 'New Contact Form Message',
              message: `Contact Form submission from ${msg.name}: "${messagePreview}"`,
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

      const readIds = loadReadIds()
      const currentIds = new Set(newNotifications.map(n => n.id))
      const prunedReadIds = new Set([...readIds].filter(id => currentIds.has(id)))
      if (prunedReadIds.size !== readIds.size) saveReadIds(prunedReadIds)

      const withReadState = newNotifications.map(n => ({ ...n, read: prunedReadIds.has(n.id) }))
      const unreadItems = withReadState.filter(n => !n.read)
      setNotifications(withReadState)
      setUnreadCount(unreadItems.length)
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
        badgeCount: unreadCount,
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
