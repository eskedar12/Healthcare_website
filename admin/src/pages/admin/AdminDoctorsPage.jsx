import { useState, useEffect } from 'react'
import { FiPlus, FiEdit, FiTrash2, FiEye } from 'react-icons/fi'
import DoctorForm from '../../components/admin/DoctorForm'
import ConfirmDialog from '../../components/admin/ConfirmDialog'
import useToast from '../../hooks/useToast'
import api from '../../services/api'
import { useAdmin } from '../../hooks/useAdmin'
import { canEditManagement } from '../../utils/permissions'

const AdminDoctorsPage = () => {
  const toast = useToast()
  const { user } = useAdmin()
  const canEdit = canEditManagement(user?.role)
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editingDoctor, setEditingDoctor] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [saving, setSaving] = useState(false)
  const [doctorToDelete, setDoctorToDelete] = useState(null)

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await api.get('/doctors')
        setDoctors(response.data || [])
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to load doctors')
      } finally {
        setLoading(false)
      }
    }

    fetchDoctors()
  }, [])

  const filteredDoctors = doctors.filter(doc =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const confirmDelete = async () => {
    const doctor = doctorToDelete
    setDoctorToDelete(null)
    try {
      await api.delete(`/doctors/${doctor.id}`)
      setDoctors((prev) => prev.filter((doc) => doc.id !== doctor.id))
      toast.success('Doctor deleted successfully')
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to delete doctor')
    }
  }

  const handleEdit = (doctor) => {
    setEditingDoctor(doctor)
    setShowForm(true)
  }

  const handleSave = async (doctorData) => {
    setError(null)
    setSaving(true)

    try {
      if (editingDoctor) {
        const response = await api.put(`/doctors/${editingDoctor.id}`, doctorData)
        const updatedDoctor = response.data
        setDoctors(doctors.map(doc => doc.id === editingDoctor.id ? updatedDoctor : doc))
        toast.success('Doctor updated successfully')
      } else {
        const response = await api.post('/doctors', doctorData)
        const newDoctor = response.data
        setDoctors([...doctors, newDoctor])
        toast.success('Doctor added successfully')
      }
      setShowForm(false)
      setEditingDoctor(null)
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to save doctor')
      toast.error(err.response?.data?.message || err.message || 'Failed to save doctor')
    } finally {
      setSaving(false)
    }
  }

  const getInitials = (name) => {
    return name.split(' ').slice(0, 2).map(n => n[0]).join('')
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl text-text-dark">Doctors</h1>
        {canEdit && (
          <button
            onClick={() => {
              setEditingDoctor(null)
              setShowForm(true)
            }}
            className="btn-primary flex items-center gap-2"
          >
            <FiPlus /> Add Doctor
          </button>
        )}
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Search doctors..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-sm pl-10 pr-4 py-2 rounded-lg border border-cream-darker focus:border-forest focus:outline-none transition-colors text-sm"
        />
      </div>

      {/* Doctors Grid */}
      {loading ? (
        <div className="py-24 text-center text-text-muted">Loading doctors…</div>
      ) : error ? (
        <div className="py-24 text-center text-red-600">Error loading doctors: {error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doctor) => (
            <div key={doctor.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-forest/10 flex items-center justify-center font-serif text-forest text-lg font-semibold">
                      {getInitials(doctor.name)}
                    </div>
                    <div>
                      <h3 className="font-serif text-lg text-text-dark">{doctor.name}</h3>
                      <p className="font-sans text-sm text-text-body">{doctor.title}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    doctor.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {doctor.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <div className="mt-4 space-y-2">
                  <p className="font-sans text-sm text-text-body">
                    <span className="font-medium">Specialty:</span> {doctor.specialty}
                  </p>
                  <p className="font-sans text-sm text-text-body">
                    <span className="font-medium">Email:</span> {doctor.email}
                  </p>
                  <p className="font-sans text-sm text-text-body">
                    <span className="font-medium">Phone:</span> {doctor.phone}
                  </p>
                  <p className="font-sans text-sm text-text-body">
                    <span className="font-medium">Branches:</span> {doctor.branches.join(', ')}
                  </p>
                </div>

                <div className="mt-4 flex gap-2 border-t border-cream pt-4">
                  {canEdit && (
                    <>
                      <button
                        onClick={() => handleEdit(doctor)}
                        className="btn-outline flex items-center gap-1 text-sm py-1.5 px-3"
                      >
                        <FiEdit /> Edit
                      </button>
                      <button
                        onClick={() => setDoctorToDelete(doctor)}
                        className="btn-danger flex items-center gap-1 text-sm py-1.5 px-3"
                      >
                        <FiTrash2 /> Delete
                      </button>
                    </>
                  )}
                  <button className="btn-primary flex items-center gap-1 text-sm py-1.5 px-3">
                    <FiEye /> View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Doctor Form Modal */}
      {showForm && (
        <DoctorForm
          doctor={editingDoctor}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false)
            setEditingDoctor(null)
          }}
        />
      )}

      <ConfirmDialog
        open={!!doctorToDelete}
        title="Delete this doctor?"
        message={doctorToDelete ? `"${doctorToDelete.name}" will be permanently removed.` : ''}
        onConfirm={confirmDelete}
        onCancel={() => setDoctorToDelete(null)}
      />

      <div className="mt-6">
        <a href="/" className="font-sans text-sm text-forest hover:underline">
          ← Back to site
        </a>
      </div>
    </div>
  )
}

export default AdminDoctorsPage