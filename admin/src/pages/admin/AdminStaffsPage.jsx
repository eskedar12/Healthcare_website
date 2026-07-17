import { useState, useEffect } from 'react'
import { FiPlus, FiEdit, FiTrash2, FiUserCheck, FiKey } from 'react-icons/fi'
import ConfirmDialog from '../../components/admin/ConfirmDialog'
import useToast from '../../hooks/useToast'
import api from '../../services/api'
import { useAdmin } from '../../hooks/useAdmin'
import { PERMISSIONS, canManageStaff } from '../../utils/permissions'

// Resources that support three access levels: don't view, view only, or
// full manage (add/edit/delete). Contact Messages stays a simple on/off
// toggle further down since there's no separate "manage" tier for it.
const RESOURCE_GROUPS = [
  { label: 'Doctors', view: PERMISSIONS.VIEW_DOCTORS, manage: PERMISSIONS.MANAGE_DOCTORS },
  { label: 'Services', view: PERMISSIONS.VIEW_SERVICES, manage: PERMISSIONS.MANAGE_SERVICES },
  { label: 'Branches', view: PERMISSIONS.VIEW_BRANCHES, manage: PERMISSIONS.MANAGE_BRANCHES },
  { label: 'Appointments', view: PERMISSIONS.VIEW_APPOINTMENTS, manage: PERMISSIONS.MANAGE_APPOINTMENTS },
  { label: 'Web Editor (Content)', view: PERMISSIONS.VIEW_CONTENT, manage: PERMISSIONS.MANAGE_CONTENT },
]

// Given the current permissions array, what level is this resource group set to?
const getAccessLevel = (permissions, group) => {
  if (permissions.includes(group.manage)) return 'manage'
  if (permissions.includes(group.view)) return 'view'
  return 'none'
}

const AdminStaffsPage = () => {
  const toast = useToast()
  const { user } = useAdmin()
  const canEdit = canManageStaff(user)
  const [staff, setStaff] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editingStaff, setEditingStaff] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [saving, setSaving] = useState(false)
  const [staffToDelete, setStaffToDelete] = useState(null)

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    password: '',
    role: '',
    permissions: [],
    is_active: true,
  })

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const staffRes = await api.get('/users')
        setStaff(staffRes.data || [])
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to load data')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const filteredStaff = staff.filter(member =>
    member.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const confirmDelete = async () => {
    const member = staffToDelete
    setStaffToDelete(null)
    try {
      await api.delete(`/users/${member.id}`)
      setStaff((prev) => prev.filter((m) => m.id !== member.id))
      toast.success('Staff deleted successfully')
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to delete staff')
    }
  }

  const handleEdit = (member) => {
    setEditingStaff(member)
    setFormData({
      full_name: member.full_name,
      email: member.email,
      phone_number: member.phone_number || '',
      password: '',
      role: member.role,
      permissions: member.permissions || [],
      is_active: member.is_active,
    })
    setShowForm(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setError(null)

    if (!formData.role.trim()) {
      setError('Role is required')
      return
    }
    if (formData.permissions.length === 0) {
      setError('Select at least one permission')
      return
    }

    setSaving(true)
    try {
      if (editingStaff) {
        const payload = { ...formData }
        if (!payload.password) delete payload.password
        const response = await api.put(`/users/${editingStaff.id}`, payload)
        const updatedStaff = response.data
        setStaff(staff.map(m => m.id === editingStaff.id ? updatedStaff : m))
        toast.success('Staff updated successfully')
      } else {
        const response = await api.post('/users', formData)
        const newStaff = response.data
        setStaff([...staff, newStaff])
        toast.success('Staff added successfully')
      }
      setShowForm(false)
      setEditingStaff(null)
      resetForm()
    } catch (err) {
      // The backend's 422 responses include a detailed { errors: [{field, message}] }
      // array — surface that instead of the generic "Validation failed" message.
      const fieldErrors = err.response?.data?.errors
      const detailedMessage = Array.isArray(fieldErrors) && fieldErrors.length > 0
        ? fieldErrors.map(e => `${e.field}: ${e.message}`).join('; ')
        : (err.response?.data?.message || err.message || 'Failed to save staff')
      setError(detailedMessage)
      toast.error(detailedMessage)
    } finally {
      setSaving(false)
    }
  }

  const resetForm = () => {
    setFormData({
      full_name: '',
      email: '',
      phone_number: '',
      password: '',
      role: '',
      permissions: [],
      is_active: true,
    })
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  // Sets a resource group to 'none' | 'view' | 'manage' — replaces whichever
  // permission (view_x or manage_x) was previously set for that resource.
  const setAccessLevel = (group, level) => {
    setFormData(prev => {
      const withoutGroup = prev.permissions.filter(
        p => p !== group.view && p !== group.manage
      )
      if (level === 'view') return { ...prev, permissions: [...withoutGroup, group.view] }
      if (level === 'manage') return { ...prev, permissions: [...withoutGroup, group.manage] }
      return { ...prev, permissions: withoutGroup }
    })
  }

  const handleContactMessagesToggle = () => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(PERMISSIONS.VIEW_CONTACT_MESSAGES)
        ? prev.permissions.filter(p => p !== PERMISSIONS.VIEW_CONTACT_MESSAGES)
        : [...prev.permissions, PERMISSIONS.VIEW_CONTACT_MESSAGES],
    }))
  }

  const getInitials = (name) => {
    return name.split(' ').slice(0, 2).map(n => n[0]).join('')
  }

  if (!canEdit) {
    return (
      <div className="py-24 text-center text-text-muted">
        You don't have permission to manage staff.
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl text-text-dark">Staff</h1>
        <button
          onClick={() => {
            setEditingStaff(null)
            resetForm()
            setShowForm(true)
          }}
          className="btn-primary flex items-center gap-2"
        >
          <FiPlus /> Add Staff
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Search staff..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-sm pl-10 pr-4 py-2 rounded-lg border border-cream-darker focus:border-forest focus:outline-none transition-colors text-sm"
        />
      </div>

      {/* Staff Grid */}
      {loading ? (
        <div className="py-24 text-center text-text-muted">Loading staff…</div>
      ) : error ? (
        <div className="py-24 text-center text-red-600">Error loading staff: {error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStaff.map((member) => (
            <div key={member.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-forest/10 flex items-center justify-center font-serif text-forest text-lg font-semibold">
                      {getInitials(member.full_name)}
                    </div>
                    <div>
                      <h3 className="font-serif text-lg text-text-dark">{member.full_name}</h3>
                      <p className="font-sans text-sm text-text-body">{member.role}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    member.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {member.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <div className="mt-4 space-y-2">
                  <p className="font-sans text-sm text-text-body">
                    <span className="font-medium">Email:</span> {member.email}
                  </p>
                  {member.phone_number && (
                    <p className="font-sans text-sm text-text-body">
                      <span className="font-medium">Phone:</span> {member.phone_number}
                    </p>
                  )}
                  {member.permissions && member.permissions.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {RESOURCE_GROUPS.map((group) => {
                        const level = getAccessLevel(member.permissions, group)
                        if (level === 'none') return null
                        return (
                          <span key={group.label} className="bg-cream px-2 py-1 rounded text-xs text-text-body">
                            {group.label}: {level === 'manage' ? 'Manage' : 'View only'}
                          </span>
                        )
                      })}
                      {member.permissions.includes(PERMISSIONS.VIEW_CONTACT_MESSAGES) && (
                        <span className="bg-cream px-2 py-1 rounded text-xs text-text-body">
                          Contact Messages
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="mt-4 flex gap-2 border-t border-cream pt-4">
                  <button
                    onClick={() => handleEdit(member)}
                    className="btn-outline flex items-center gap-1 text-sm py-1.5 px-3"
                  >
                    <FiEdit /> Edit
                  </button>
                  <button
                    onClick={() => setStaffToDelete(member)}
                    className="btn-danger flex items-center gap-1 text-sm py-1.5 px-3"
                  >
                    <FiTrash2 /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Staff Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-cream-darker">
              <h2 className="font-serif text-xl text-text-dark">
                {editingStaff ? 'Edit Staff' : 'Add Staff'}
              </h2>
              <button 
                onClick={() => {
                  setShowForm(false)
                  setEditingStaff(null)
                }}
                className="p-2 hover:bg-cream rounded-lg transition-colors"
              >
                <FiTrash2 className="text-xl" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-sans text-sm font-medium text-text-dark block mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-cream-darker focus:border-forest focus:outline-none transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="font-sans text-sm font-medium text-text-dark block mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-cream-darker focus:border-forest focus:outline-none transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="font-sans text-sm font-medium text-text-dark block mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-cream-darker focus:border-forest focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="font-sans text-sm font-medium text-text-dark block mb-1">
                    Password {!editingStaff && '*'}
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-cream-darker focus:border-forest focus:outline-none transition-colors"
                    required={!editingStaff}
                  />
                </div>

                <div>
                  <label className="font-sans text-sm font-medium text-text-dark block mb-1">
                    Role *
                  </label>
                  <input
                    type="text"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    placeholder="e.g. Marketing Officer"
                    className="w-full px-4 py-2 rounded-lg border border-cream-darker focus:border-forest focus:outline-none transition-colors"
                    required
                  />
                  <p className="text-xs text-text-muted mt-1">
                    Type any title you like — access is controlled by the permissions below, not by this name.
                  </p>
                </div>
              </div>

              <div>
                <label className="font-sans text-sm font-medium text-text-dark block mb-2 flex items-center gap-2">
                  <FiKey /> Permissions *
                </label>
                <p className="text-xs text-text-muted mb-3">
                  For each area, choose whether this person can't view it, can view it only, or can fully manage it (add/edit/delete).
                </p>
                <div className="space-y-3">
                  {RESOURCE_GROUPS.map((group) => {
                    const level = getAccessLevel(formData.permissions, group)
                    return (
                      <div key={group.label} className="border border-cream-darker rounded-lg p-3">
                        <p className="font-sans text-sm font-medium text-text-dark mb-2">{group.label}</p>
                        <div className="flex flex-wrap gap-4">
                          {[
                            { value: 'none', label: "Don't view" },
                            { value: 'view', label: 'View only' },
                            { value: 'manage', label: 'Manage' },
                          ].map((opt) => (
                            <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                name={`access-${group.label}`}
                                checked={level === opt.value}
                                onChange={() => setAccessLevel(group, opt.value)}
                                className="text-forest focus:ring-forest"
                              />
                              <span className="font-sans text-sm text-text-body">{opt.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )
                  })}

                  <label className="flex items-center gap-2 p-3 border border-cream-darker rounded-lg hover:bg-cream/50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.permissions.includes(PERMISSIONS.VIEW_CONTACT_MESSAGES)}
                      onChange={handleContactMessagesToggle}
                      className="rounded text-forest focus:ring-forest"
                    />
                    <span className="font-sans text-sm text-text-body">View Contact Messages</span>
                  </label>
                </div>
              </div>

              {editingStaff && (
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_active"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleInputChange}
                    className="rounded text-forest focus:ring-forest"
                  />
                  <label htmlFor="is_active" className="font-sans text-sm text-text-dark">
                    Active
                  </label>
                </div>
              )}

              {error && (
                <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t border-cream-darker">
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary flex-1 disabled:opacity-60"
                >
                  {saving ? 'Saving...' : (editingStaff ? 'Update' : 'Add')}
                </button>
                <button 
                  type="button" 
                  onClick={() => {
                    setShowForm(false)
                    setEditingStaff(null)
                  }}
                  className="btn-outline flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!staffToDelete}
        title="Delete this staff member?"
        message={staffToDelete ? `"${staffToDelete.full_name}" will be permanently removed.` : ''}
        onConfirm={confirmDelete}
        onCancel={() => setStaffToDelete(null)}
      />

      <div className="mt-6">
        <a href="/" className="font-sans text-sm text-forest hover:underline">
          ← Back to site
        </a>
      </div>
    </div>
  )
}

export default AdminStaffsPage
