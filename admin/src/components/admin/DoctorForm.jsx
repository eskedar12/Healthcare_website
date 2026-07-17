import { useState } from 'react'
import { FiX } from 'react-icons/fi'
import ImageUploadField from './ImageUploadField'

// Normalize a field that may come back from the API as an array, a
// comma-separated string, or null/undefined into a display string.
const toDisplayString = (value) => {
  if (Array.isArray(value)) return value.join(', ')
  if (typeof value === 'string') return value
  return ''
}

const DoctorForm = ({ doctor, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: doctor?.name || '',
    title: doctor?.title || '',
    specialty: doctor?.specialty || '',
    department: doctor?.department || 'Psychiatry',
    email: doctor?.email || '',
    phone: doctor?.phone || '',
    image: doctor?.image || '',
    bio: doctor?.bio || '',
    education: toDisplayString(doctor?.education),
    languages: toDisplayString(doctor?.languages),
    branches: toDisplayString(doctor?.branches),
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    const processedData = {
      ...formData,
      education: formData.education.trim(),
      languages: formData.languages.trim(),
      branches: formData.branches.split(',').map(s => s.trim()).filter(Boolean),
    }
    onSave(processedData)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-cream-darker">
          <h2 className="font-serif text-xl text-text-dark">
            {doctor ? 'Edit Doctor' : 'Add New Doctor'}
          </h2>
          <button onClick={onCancel} className="p-2 hover:bg-cream rounded-lg transition-colors">
            <FiX className="text-xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <ImageUploadField
            label="Profile Photo"
            value={formData.image}
            onChange={(url) => setFormData({ ...formData, image: url })}
            uploadUrl="/doctors/upload/image"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-sans text-sm font-medium text-text-dark block mb-1">
                Full Name *
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
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-cream-darker focus:border-forest focus:outline-none transition-colors"
                required
                placeholder="e.g., Consultant Psychiatrist"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-sans text-sm font-medium text-text-dark block mb-1">
                Specialty *
              </label>
              <input
                type="text"
                value={formData.specialty}
                onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-cream-darker focus:border-forest focus:outline-none transition-colors"
                required
              />
            </div>
            <div>
              <label className="font-sans text-sm font-medium text-text-dark block mb-1">
                Department
              </label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-cream-darker focus:border-forest focus:outline-none transition-colors"
              >
                <option value="Psychiatry">Psychiatry</option>
                <option value="Psychology">Psychology</option>
                <option value="Psychotherapy">Psychotherapy</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-sans text-sm font-medium text-text-dark block mb-1">
                Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-cream-darker focus:border-forest focus:outline-none transition-colors"
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
          </div>

          <div>
            <label className="font-sans text-sm font-medium text-text-dark block mb-1">
              Bio
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              rows="3"
              className="w-full px-4 py-2 rounded-lg border border-cream-darker focus:border-forest focus:outline-none transition-colors resize-none"
              placeholder="Brief biography of the doctor..."
            />
          </div>

          <div>
            <label className="font-sans text-sm font-medium text-text-dark block mb-1">
              Education (comma separated)
            </label>
            <input
              type="text"
              value={formData.education}
              onChange={(e) => setFormData({ ...formData, education: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-cream-darker focus:border-forest focus:outline-none transition-colors"
              placeholder="MD, Addis Ababa University, Psychiatry Residency, Black Lion Hospital"
            />
          </div>

          <div>
            <label className="font-sans text-sm font-medium text-text-dark block mb-1">
              Languages (comma separated)
            </label>
            <input
              type="text"
              value={formData.languages}
              onChange={(e) => setFormData({ ...formData, languages: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-cream-darker focus:border-forest focus:outline-none transition-colors"
              placeholder="Amharic, English, Afaan Oromo"
            />
          </div>

          <div>
            <label className="font-sans text-sm font-medium text-text-dark block mb-1">
              Branches (comma separated)
            </label>
            <input
              type="text"
              value={formData.branches}
              onChange={(e) => setFormData({ ...formData, branches: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-cream-darker focus:border-forest focus:outline-none transition-colors"
              placeholder="Bole Main Clinic, Kazanchis Branch"
            />
          </div>

          <div className="flex gap-3 pt-4 border-t border-cream-darker">
            <button type="submit" className="btn-primary flex-1">
              {doctor ? 'Update Doctor' : 'Add Doctor'}
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

export default DoctorForm