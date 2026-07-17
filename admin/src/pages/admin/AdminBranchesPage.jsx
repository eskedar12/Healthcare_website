import { useState, useEffect } from 'react'
import { FiPlus, FiEdit, FiTrash2, FiMapPin, FiPhone, FiClock } from 'react-icons/fi'
import BranchForm from '../../components/admin/BranchForm'
import api from '../../services/api'
import { useAdmin } from '../../hooks/useAdmin'
import { canManageBranches } from '../../utils/permissions'

const AdminBranchesPage = () => {
  const { user } = useAdmin()
  const canEdit = canManageBranches(user)
  const [branches, setBranches] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editingBranch, setEditingBranch] = useState(null)

  useEffect(() => {
    fetchBranches()
  }, [])

  const fetchBranches = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.get('/branches')
      setBranches(response.data || [])
    } catch (err) {
      setError(err.message || 'Failed to load branches')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this branch?')) {
      try {
        await api.delete(`/branches/${id}`)
        await fetchBranches()
      } catch (err) {
        alert('Failed to delete branch: ' + err.message)
      }
    }
  }

  const handleEdit = (branch) => {
    setEditingBranch(branch)
    setShowForm(true)
  }

  const handleSave = async (branchData) => {
    try {
      if (editingBranch) {
        await api.put(`/branches/${editingBranch.id}`, branchData)
      } else {
        await api.post('/branches', branchData)
      }
      await fetchBranches()
      setShowForm(false)
      setEditingBranch(null)
    } catch (err) {
      alert('Failed to save branch: ' + err.message)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl text-text-dark">Branches</h1>
        {canEdit && (
          <button
            onClick={() => {
              setEditingBranch(null)
              setShowForm(true)
            }}
            className="btn-primary flex items-center gap-2"
          >
            <FiPlus /> Add Branch
          </button>
        )}
      </div>

      {loading ? (
        <div className="py-24 text-center text-text-muted">Loading branches...</div>
      ) : error ? (
        <div className="py-24 text-center text-red-500">Error: {error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {branches.map((branch) => (
            <div key={branch.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <h3 className="font-serif text-lg text-text-dark">{branch.name}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  branch.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {branch.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div className="mt-4 space-y-3">
                <p className="font-sans text-sm text-text-body flex items-start gap-2">
                  <FiMapPin className="text-forest mt-0.5 flex-shrink-0" />
                  {branch.address}
                </p>
                <p className="font-sans text-sm text-text-body flex items-center gap-2">
                  <FiPhone className="text-forest" />
                  {branch.phone}
                </p>
                <p className="font-sans text-sm text-text-body flex items-center gap-2">
                  <FiClock className="text-forest" />
                  {typeof branch.working_hours === 'string'
                    ? branch.working_hours
                    : branch.working_hours
                      ? JSON.stringify(branch.working_hours)
                      : ''}
                </p>
              </div>

              {canEdit && (
                <div className="mt-4 flex gap-2 border-t border-cream pt-4">
                  <button
                    onClick={() => handleEdit(branch)}
                    className="btn-outline flex items-center gap-1 text-sm py-1.5 px-3"
                  >
                    <FiEdit /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(branch.id)}
                    className="btn-danger flex items-center gap-1 text-sm py-1.5 px-3"
                  >
                    <FiTrash2 /> Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <BranchForm
          branch={editingBranch}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false)
            setEditingBranch(null)
          }}
        />
      )}

      <div className="mt-6">
        <a href="/" className="font-sans text-sm text-forest hover:underline">
          ← Back to site
        </a>
      </div>
    </div>
  )
}

export default AdminBranchesPage