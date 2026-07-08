import { useState, useEffect } from 'react'
import { FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi'
import ServiceForm from '../../components/admin/ServiceForm'
import ConfirmDialog from '../../components/admin/ConfirmDialog'
import useToast from '../../hooks/useToast'
import api from '../../services/api'
import { useAdmin } from '../../hooks/useAdmin'
import { canEditManagement } from '../../utils/permissions'

const AdminServicesPage = () => {
  const toast = useToast()
  const { user } = useAdmin()
  const canEdit = canEditManagement(user?.role)
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editingService, setEditingService] = useState(null)
  const [serviceToDelete, setServiceToDelete] = useState(null)

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.get('/services')
      setServices(response.data || [])
    } catch (err) {
      setError(err.message || 'Failed to load services')
    } finally {
      setLoading(false)
    }
  }

  const confirmDelete = async () => {
    const service = serviceToDelete
    setServiceToDelete(null)
    try {
      await api.delete(`/services/${service.id}`)
      await fetchServices()
      toast.success('Service deleted successfully')
    } catch (err) {
      toast.error('Failed to delete service: ' + err.message)
    }
  }

  const handleEdit = (service) => {
    setEditingService(service)
    setShowForm(true)
  }

  const handleSave = async (serviceData) => {
    try {
      if (editingService) {
        await api.put(`/services/${editingService.id}`, serviceData)
        toast.success('Service updated successfully')
      } else {
        await api.post('/services', serviceData)
        toast.success('Service added successfully')
      }
      await fetchServices()
      setShowForm(false)
      setEditingService(null)
    } catch (err) {
      toast.error('Failed to save service: ' + err.message)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl text-text-dark">Services</h1>
        {canEdit && (
          <button
            onClick={() => {
              setEditingService(null)
              setShowForm(true)
            }}
            className="btn-primary flex items-center gap-2"
          >
            <FiPlus /> New Service
          </button>
        )}
      </div>

      {loading ? (
        <div className="py-24 text-center text-text-muted">Loading services...</div>
      ) : error ? (
        <div className="py-24 text-center text-red-500">Error: {error}</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-cream">
                <tr>
                  <th className="text-left px-6 py-3 font-sans text-xs font-medium text-text-muted uppercase tracking-wider">Code</th>
                  <th className="text-left px-6 py-3 font-sans text-xs font-medium text-text-muted uppercase tracking-wider">Service</th>
                  <th className="text-left px-6 py-3 font-sans text-xs font-medium text-text-muted uppercase tracking-wider">Duration</th>
                  <th className="text-left px-6 py-3 font-sans text-xs font-medium text-text-muted uppercase tracking-wider">Price</th>
                  <th className="text-left px-6 py-3 font-sans text-xs font-medium text-text-muted uppercase tracking-wider">Status</th>
                  <th className="text-left px-6 py-3 font-sans text-xs font-medium text-text-muted uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {services.map((service) => (
                  <tr key={service.id} className="border-b border-cream/50 hover:bg-cream/30 transition-colors">
                    <td className="px-6 py-4 font-sans text-sm font-medium text-text-dark">{service.code}</td>
                    <td className="px-6 py-4 font-sans text-sm text-text-body">{service.name}</td>
                    <td className="px-6 py-4 font-sans text-sm text-text-body">{service.duration}</td>
                    <td className="px-6 py-4 font-sans text-sm text-text-body">{service.price}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        service.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {service.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {canEdit ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(service)}
                            className="btn-outline text-sm py-1 px-3 flex items-center gap-1"
                          >
                            <FiEdit /> Edit
                          </button>
                          <button
                            onClick={() => setServiceToDelete(service)}
                            className="btn-danger text-sm py-1 px-3 flex items-center gap-1"
                          >
                            <FiTrash2 /> Delete
                          </button>
                        </div>
                      ) : (
                        <span className="font-sans text-xs text-text-muted">View only</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showForm && (
        <ServiceForm
          service={editingService}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false)
            setEditingService(null)
          }}
        />
      )}

      <ConfirmDialog
        open={!!serviceToDelete}
        title="Delete this service?"
        message={serviceToDelete ? `"${serviceToDelete.name}" will be permanently removed.` : ''}
        onConfirm={confirmDelete}
        onCancel={() => setServiceToDelete(null)}
      />

      <div className="mt-6">
        <a href="/" className="font-sans text-sm text-forest hover:underline">
          ← Back to site
        </a>
      </div>
    </div>
  )
}

export default AdminServicesPage