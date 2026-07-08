import { useState } from 'react'
import { FiX } from 'react-icons/fi'

const ServiceForm = ({ service, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    code: service?.code || '',
    name: service?.name || '',
    duration: service?.duration || '60 min',
    price: service?.price || '',
    status: service?.status || 'Active',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-cream-darker">
          <h2 className="font-serif text-xl text-text-dark">
            {service ? 'Edit Service' : 'Add New Service'}
          </h2>
          <button onClick={onCancel} className="p-2 hover:bg-cream rounded-lg transition-colors">
            <FiX className="text-xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="font-sans text-sm font-medium text-text-dark block mb-1">
              Service Code *
            </label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-cream-darker focus:border-forest focus:outline-none transition-colors"
              required
              placeholder="e.g., SRV-001"
            />
          </div>

          <div>
            <label className="font-sans text-sm font-medium text-text-dark block mb-1">
              Service Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-cream-darker focus:border-forest focus:outline-none transition-colors"
              required
            />
          </div>

          <div>
            <label className="font-sans text-sm font-medium text-text-dark block mb-1">
              Duration *
            </label>
            <input
              type="text"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-cream-darker focus:border-forest focus:outline-none transition-colors"
              placeholder="e.g., 60 min"
              required
            />
          </div>

          <div>
            <label className="font-sans text-sm font-medium text-text-dark block mb-1">
              Price *
            </label>
            <input
              type="text"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-cream-darker focus:border-forest focus:outline-none transition-colors"
              placeholder="e.g., 1,500 ETB"
              required
            />
          </div>

          <div>
            <label className="font-sans text-sm font-medium text-text-dark block mb-1">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-cream-darker focus:border-forest focus:outline-none transition-colors"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4 border-t border-cream-darker">
            <button type="submit" className="btn-primary flex-1">
              {service ? 'Update Service' : 'Add Service'}
            </button>
            <button type="button" onClick={onCancel} className="btn-outline flex-1">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ServiceForm