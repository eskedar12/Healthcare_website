import { useState, useEffect } from 'react'
import { FiMail, FiCheckCircle, FiEye } from 'react-icons/fi'
import useToast from '../../hooks/useToast'
import api from '../../services/api'
import { useAdmin } from '../../hooks/useAdmin'
import { canViewContactMessages } from '../../utils/permissions'

const STATUS_OPTIONS = [
  { value: 'New', label: 'New', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'Read', label: 'Read', color: 'bg-blue-100 text-blue-700' },
  { value: 'Replied', label: 'Replied', color: 'bg-green-100 text-green-700' },
]

const AdminContactPage = () => {
  const toast = useToast()
  const { user } = useAdmin()
  const canEdit = canViewContactMessages(user)
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [filter, setFilter] = useState('All')

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await api.get('/inquiries')
        setMessages(response.data || [])
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to load messages')
      } finally {
        setLoading(false)
      }
    }
    fetchMessages()
  }, [])

  const filteredMessages = filter === 'All'
    ? messages
    : messages.filter(msg => msg.status === filter)

  const handleUpdateStatus = async (messageId, status) => {
    try {
      const response = await api.put(`/inquiries/${messageId}`, { status })
      setMessages(messages.map(msg => msg.id === messageId ? response.data : msg))
      if (selectedMessage && selectedMessage.id === messageId) {
        setSelectedMessage(response.data)
      }
      toast.success('Status updated successfully')
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to update status')
    }
  }

  const getStatusColor = (status) => {
    const option = STATUS_OPTIONS.find(o => o.value === status)
    return option ? option.color : 'bg-gray-100 text-gray-700'
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (!canEdit) {
    return (
      <div className="py-24 text-center text-text-muted">
        You don't have permission to view contact messages.
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl text-text-dark">Contact Messages</h1>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['All', ...STATUS_OPTIONS.map(o => o.value)].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === f
                ? 'bg-forest text-white'
                : 'bg-cream text-text-body hover:bg-cream-darker'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Messages */}
      {loading ? (
        <div className="py-24 text-center text-text-muted">Loading messages…</div>
      ) : error ? (
        <div className="py-24 text-center text-red-600">Error loading messages: {error}</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Message List */}
          <div className="lg:col-span-1 space-y-3">
            {filteredMessages.length === 0 ? (
              <div className="bg-white rounded-xl p-6 text-center text-text-muted">
                No messages found.
              </div>
            ) : (
              filteredMessages.map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => setSelectedMessage(msg)}
                  className={`bg-white rounded-xl p-4 cursor-pointer transition-all border-2 ${
                    selectedMessage?.id === msg.id
                      ? 'border-forest'
                      : 'border-transparent hover:border-cream-darker'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-forest/10 flex items-center justify-center">
                        <FiMail className="text-forest" />
                      </div>
                      <div>
                        <p className="font-sans text-sm font-medium text-text-dark">
                          {msg.name}
                        </p>
                        <p className="font-sans text-xs text-text-muted">
                          {msg.email}
                        </p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(msg.status)}`}>
                      {msg.status}
                    </span>
                  </div>
                  {msg.subject && (
                    <p className="font-sans text-sm text-text-body mt-2 truncate">
                      {msg.subject}
                    </p>
                  )}
                  <p className="font-sans text-xs text-text-muted mt-1">
                    {formatDate(msg.created_at)}
                  </p>
                </div>
              ))
            )}
          </div>

          {/* Message Detail */}
          <div className="lg:col-span-2">
            {selectedMessage ? (
              <div className="bg-white rounded-xl p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="font-serif text-xl text-text-dark">
                      {selectedMessage.name}
                    </h2>
                    <p className="font-sans text-sm text-text-muted">
                      {selectedMessage.email}
                      {selectedMessage.phone && ` · ${selectedMessage.phone}`}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedMessage.status)}`}>
                    {selectedMessage.status}
                  </span>
                </div>

                {selectedMessage.subject && (
                  <div className="mb-4">
                    <p className="font-sans text-sm font-medium text-text-dark mb-1">
                      Subject
                    </p>
                    <p className="font-sans text-sm text-text-body">
                      {selectedMessage.subject}
                    </p>
                  </div>
                )}

                <div className="mb-6">
                  <p className="font-sans text-sm font-medium text-text-dark mb-1">
                    Message
                  </p>
                  <div className="bg-cream/50 p-4 rounded-lg">
                    <p className="font-sans text-sm text-text-body whitespace-pre-wrap">
                      {selectedMessage.message}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 border-t border-cream pt-4">
                  <p className="font-sans text-xs text-text-muted">
                    Received {formatDate(selectedMessage.created_at)}
                  </p>
                  <div className="flex-1" />
                  {STATUS_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleUpdateStatus(selectedMessage.id, option.value)}
                      className={`btn-outline text-sm flex items-center gap-1 ${
                        selectedMessage.status === option.value ? 'opacity-50' : ''
                      }`}
                    >
                      {option.value === 'Read' && <FiEye />}
                      {option.value === 'Replied' && <FiCheckCircle />}
                      Mark as {option.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl p-12 text-center text-text-muted">
                <FiMail className="text-4xl mx-auto mb-4 opacity-50" />
                <p>Select a message to view its details.</p>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="mt-6">
        <a href="/" className="font-sans text-sm text-forest hover:underline">
          ← Back to site
        </a>
      </div>
    </div>
  )
}

export default AdminContactPage
