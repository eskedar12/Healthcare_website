import { useState } from 'react'
import { FiX } from 'react-icons/fi'

const ProjectForm = ({ project, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: project?.name || '',
    description: project?.description || '',
    year: project?.year || '',
    is_featured: project?.is_featured || false,
    is_active: project?.is_active ?? true,
    sort_order: project?.sort_order ?? 0,
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
            {project ? 'Edit Project' : 'Add New Project'}
          </h2>
          <button onClick={onCancel} className="p-2 hover:bg-cream rounded-lg transition-colors">
            <FiX className="text-xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="font-sans text-sm font-medium text-text-dark block mb-1">
              Project Name *
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
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows="3"
              className="w-full px-4 py-2 rounded-lg border border-cream-darker focus:border-forest focus:outline-none transition-colors resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-sans text-sm font-medium text-text-dark block mb-1">
                Year
              </label>
              <input
                type="text"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-cream-darker focus:border-forest focus:outline-none transition-colors"
                placeholder="e.g., 2024"
              />
            </div>
            <div>
              <label className="font-sans text-sm font-medium text-text-dark block mb-1">
                Order
              </label>
              <input
                type="number"
                value={formData.sort_order}
                onChange={(e) => setFormData({ ...formData, sort_order: Number(e.target.value) })}
                className="w-full px-4 py-2 rounded-lg border border-cream-darker focus:border-forest focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="flex gap-6">
            <label className="flex items-center gap-2 font-sans text-sm text-text-dark">
              <input
                type="checkbox"
                checked={formData.is_featured}
                onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
              />
              Featured
            </label>
            <label className="flex items-center gap-2 font-sans text-sm text-text-dark">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              />
              Active (shown on site)
            </label>
          </div>

          <div className="flex gap-3 pt-4 border-t border-cream-darker">
            <button type="submit" className="btn-primary flex-1">
              {project ? 'Update Project' : 'Add Project'}
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

export default ProjectForm
