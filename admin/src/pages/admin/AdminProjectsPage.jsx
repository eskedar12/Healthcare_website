import { useState, useEffect } from 'react'
import { FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi'
import ProjectForm from '../../components/admin/ProjectForm'
import ConfirmDialog from '../../components/admin/ConfirmDialog'
import useToast from '../../hooks/useToast'
import api from '../../services/api'
import { useAdmin } from '../../hooks/useAdmin'
import { canEditContent } from '../../utils/permissions'

const AdminProjectsPage = () => {
  const toast = useToast()
  const { user } = useAdmin()
  const canEdit = canEditContent(user)
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [projectToDelete, setProjectToDelete] = useState(null)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.get('/projects')
      setProjects(response.data || [])
    } catch (err) {
      setError(err.message || 'Failed to load projects')
    } finally {
      setLoading(false)
    }
  }

  const confirmDelete = async () => {
    const project = projectToDelete
    setProjectToDelete(null)
    try {
      await api.delete(`/projects/${project.id}`)
      await fetchProjects()
      toast.success('Project deleted successfully')
    } catch (err) {
      toast.error('Failed to delete project: ' + err.message)
    }
  }

  const handleEdit = (project) => {
    setEditingProject(project)
    setShowForm(true)
  }

  const handleSave = async (projectData) => {
    try {
      if (editingProject) {
        await api.put(`/projects/${editingProject.id}`, projectData)
        toast.success('Project updated successfully')
      } else {
        await api.post('/projects', projectData)
        toast.success('Project added successfully')
      }
      await fetchProjects()
      setShowForm(false)
      setEditingProject(null)
    } catch (err) {
      toast.error('Failed to save project: ' + err.message)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-2xl text-text-dark">Projects</h1>
          <p className="font-sans text-text-muted text-xs mt-1">
            These show up as the project list on the public Projects page.
          </p>
        </div>
        {canEdit && (
          <button
            onClick={() => {
              setEditingProject(null)
              setShowForm(true)
            }}
            className="btn-primary flex items-center gap-2"
          >
            <FiPlus /> New Project
          </button>
        )}
      </div>

      {loading ? (
        <div className="py-24 text-center text-text-muted">Loading projects...</div>
      ) : error ? (
        <div className="py-24 text-center text-red-500">Error: {error}</div>
      ) : projects.length === 0 ? (
        <div className="py-24 text-center text-text-muted">
          No projects yet. {canEdit && 'Click "New Project" to add one.'}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-cream">
                <tr>
                  <th className="text-left px-6 py-3 font-sans text-xs font-medium text-text-muted uppercase tracking-wider">Order</th>
                  <th className="text-left px-6 py-3 font-sans text-xs font-medium text-text-muted uppercase tracking-wider">Project</th>
                  <th className="text-left px-6 py-3 font-sans text-xs font-medium text-text-muted uppercase tracking-wider">Year</th>
                  <th className="text-left px-6 py-3 font-sans text-xs font-medium text-text-muted uppercase tracking-wider">Featured</th>
                  <th className="text-left px-6 py-3 font-sans text-xs font-medium text-text-muted uppercase tracking-wider">Status</th>
                  <th className="text-left px-6 py-3 font-sans text-xs font-medium text-text-muted uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr key={project.id} className="border-b border-cream/50 hover:bg-cream/30 transition-colors">
                    <td className="px-6 py-4 font-sans text-sm text-text-body">{project.sort_order}</td>
                    <td className="px-6 py-4 font-sans text-sm font-medium text-text-dark">{project.name}</td>
                    <td className="px-6 py-4 font-sans text-sm text-text-body">{project.year || '—'}</td>
                    <td className="px-6 py-4 font-sans text-sm text-text-body">{project.is_featured ? 'Yes' : 'No'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        project.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {project.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {canEdit ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(project)}
                            className="btn-outline text-sm py-1 px-3 flex items-center gap-1"
                          >
                            <FiEdit /> Edit
                          </button>
                          <button
                            onClick={() => setProjectToDelete(project)}
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
        <ProjectForm
          project={editingProject}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false)
            setEditingProject(null)
          }}
        />
      )}

      <ConfirmDialog
        open={!!projectToDelete}
        title="Delete this project?"
        message={projectToDelete ? `"${projectToDelete.name}" will be permanently removed.` : ''}
        onConfirm={confirmDelete}
        onCancel={() => setProjectToDelete(null)}
      />

      <div className="mt-6">
        <a href="/" className="font-sans text-sm text-forest hover:underline">
          ← Back to site
        </a>
      </div>
    </div>
  )
}

export default AdminProjectsPage
