import { useState } from 'react'
import { FiX } from 'react-icons/fi'

const BranchForm = ({ branch, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: branch?.name || '',
    address: branch?.address || '',
    phone: branch?.phone || '',
    working_hours: branch?.working_hours
      ? typeof branch.working_hours === 'string'
        ? branch.working_hours
        : JSON.stringify(branch.working_hours)
      : '',
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
            {branch ? 'Edit Branch' : 'Add New Branch'}
          </h2>
          <button onClick={onCancel} className="p-2 hover:bg-cream rounded-lg transition-colors">
            <FiX className="text-xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="font-sans text-sm font-medium text-text-dark block mb-1">
              Branch Name *
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
              Address *
            </label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              rows="2"
              className="w-full px-4 py-2 rounded-lg border border-cream-darker focus:border-forest focus:outline-none transition-colors resize-none"
              required
            />
          </div>

          <div>
            <label className="font-sans text-sm font-medium text-text-dark block mb-1">
              Phone *
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-cream-darker focus:border-forest focus:outline-none transition-colors"
              required
            />
          </div>

          <div>
            <label className="font-sans text-sm font-medium text-text-dark block mb-1">
              Operating Hours *
            </label>
            <input
              type="text"
              value={formData.working_hours}
              onChange={(e) => setFormData({ ...formData, working_hours: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-cream-darker focus:border-forest focus:outline-none transition-colors"
              placeholder="e.g., 24 / 7 or Mon-Sat · 08:00–20:00"
              required
            />
          </div>

          <div className="flex gap-3 pt-4 border-t border-cream-darker">
            <button type="submit" className="btn-primary flex-1">
              {branch ? 'Update Branch' : 'Add Branch'}
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

export default BranchForm