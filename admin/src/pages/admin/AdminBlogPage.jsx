import { useState, useEffect } from 'react'
import { FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi'
import PostForm from '../../components/admin/PostForm'
import ConfirmDialog from '../../components/admin/ConfirmDialog'
import useToast from '../../hooks/useToast'
import api from '../../services/api'
import { useAdmin } from '../../hooks/useAdmin'
import { canEditContent } from '../../utils/permissions'

const formatDate = (value) => {
  if (!value) return '—'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

const AdminBlogPage = () => {
  const toast = useToast()
  const { user } = useAdmin()
  const canEdit = canEditContent(user)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editingPost, setEditingPost] = useState(null)
  const [postToDelete, setPostToDelete] = useState(null)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.get('/posts')
      setPosts(response.data || [])
    } catch (err) {
      setError(err.message || 'Failed to load posts')
    } finally {
      setLoading(false)
    }
  }

  const confirmDelete = async () => {
    const post = postToDelete
    setPostToDelete(null)
    try {
      await api.delete(`/posts/${post.id}`)
      await fetchPosts()
      toast.success('Post deleted successfully')
    } catch (err) {
      toast.error('Failed to delete post: ' + err.message)
    }
  }

  const handleEdit = (post) => {
    setEditingPost(post)
    setShowForm(true)
  }

  const handleSave = async (postData) => {
    try {
      if (editingPost) {
        await api.put(`/posts/${editingPost.id}`, postData)
        toast.success('Post updated successfully')
      } else {
        await api.post('/posts', postData)
        toast.success('Post added successfully')
      }
      await fetchPosts()
      setShowForm(false)
      setEditingPost(null)
    } catch (err) {
      toast.error('Failed to save post: ' + err.message)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-2xl text-text-dark">Blog</h1>
          <p className="font-sans text-text-muted text-xs mt-1">
            Articles shown on the public Blog page.
          </p>
        </div>
        {canEdit && (
          <button
            onClick={() => {
              setEditingPost(null)
              setShowForm(true)
            }}
            className="btn-primary flex items-center gap-2"
          >
            <FiPlus /> New Post
          </button>
        )}
      </div>

      {loading ? (
        <div className="py-24 text-center text-text-muted">Loading posts...</div>
      ) : error ? (
        <div className="py-24 text-center text-red-500">Error: {error}</div>
      ) : posts.length === 0 ? (
        <div className="py-24 text-center text-text-muted">
          No posts yet. {canEdit && 'Click "New Post" to add one.'}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-cream">
                <tr>
                  <th className="text-left px-6 py-3 font-sans text-xs font-medium text-text-muted uppercase tracking-wider">Title</th>
                  <th className="text-left px-6 py-3 font-sans text-xs font-medium text-text-muted uppercase tracking-wider">Category</th>
                  <th className="text-left px-6 py-3 font-sans text-xs font-medium text-text-muted uppercase tracking-wider">Published</th>
                  <th className="text-left px-6 py-3 font-sans text-xs font-medium text-text-muted uppercase tracking-wider">Status</th>
                  <th className="text-left px-6 py-3 font-sans text-xs font-medium text-text-muted uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id} className="border-b border-cream/50 hover:bg-cream/30 transition-colors">
                    <td className="px-6 py-4 font-sans text-sm font-medium text-text-dark">{post.title}</td>
                    <td className="px-6 py-4 font-sans text-sm text-text-body">{post.category || '—'}</td>
                    <td className="px-6 py-4 font-sans text-sm text-text-body">
                      {post.published_at ? formatDate(post.published_at) : '—'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        post.is_published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {post.is_published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {canEdit ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(post)}
                            className="btn-outline text-sm py-1 px-3 flex items-center gap-1"
                          >
                            <FiEdit /> Edit
                          </button>
                          <button
                            onClick={() => setPostToDelete(post)}
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
        <PostForm
          post={editingPost}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false)
            setEditingPost(null)
          }}
        />
      )}

      <ConfirmDialog
        open={!!postToDelete}
        title="Delete this post?"
        message={postToDelete ? `"${postToDelete.title}" will be permanently removed.` : ''}
        onConfirm={confirmDelete}
        onCancel={() => setPostToDelete(null)}
      />

      <div className="mt-6">
        <a href="/" className="font-sans text-sm text-forest hover:underline">
          ← Back to site
        </a>
      </div>
    </div>
  )
}

export default AdminBlogPage
