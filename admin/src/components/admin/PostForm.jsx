import { useState } from 'react'
import { FiX } from 'react-icons/fi'
import ImageUploadField from './ImageUploadField'

// content comes back from the API as an array of paragraphs; edit it here
// as plain text (one paragraph per blank-line-separated block) and let the
// backend re-split it on save.
const contentToText = (content) => (Array.isArray(content) ? content.join('\n\n') : content || '')

const PostForm = ({ post, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: post?.title || '',
    category: post?.category || '',
    author: post?.author || '',
    excerpt: post?.excerpt || '',
    content: contentToText(post?.content),
    image: post?.image || '',
    is_published: post?.is_published ?? true,
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full my-8">
        <div className="flex items-center justify-between p-6 border-b border-cream-darker">
          <h2 className="font-serif text-xl text-text-dark">
            {post ? 'Edit Post' : 'Add New Post'}
          </h2>
          <button onClick={onCancel} className="p-2 hover:bg-cream rounded-lg transition-colors">
            <FiX className="text-xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
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
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-sans text-sm font-medium text-text-dark block mb-1">
                Category
              </label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-cream-darker focus:border-forest focus:outline-none transition-colors"
                placeholder="e.g., Mental Health"
              />
            </div>
            <div>
              <label className="font-sans text-sm font-medium text-text-dark block mb-1">
                Author
              </label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-cream-darker focus:border-forest focus:outline-none transition-colors"
              />
            </div>
          </div>

          <ImageUploadField
            label="Cover Image"
            value={formData.image}
            onChange={(url) => setFormData({ ...formData, image: url })}
          />

          <div>
            <label className="font-sans text-sm font-medium text-text-dark block mb-1">
              Excerpt
            </label>
            <textarea
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              rows="2"
              className="w-full px-4 py-2 rounded-lg border border-cream-darker focus:border-forest focus:outline-none transition-colors resize-none"
              placeholder="One or two sentences shown on the blog list card"
            />
          </div>

          <div>
            <label className="font-sans text-sm font-medium text-text-dark block mb-1">
              Content
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows="10"
              className="w-full px-4 py-2 rounded-lg border border-cream-darker focus:border-forest focus:outline-none transition-colors"
              placeholder="Separate paragraphs with a blank line"
            />
          </div>

          <label className="flex items-center gap-2 font-sans text-sm text-text-dark">
            <input
              type="checkbox"
              checked={formData.is_published}
              onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
            />
            Published (visible on the site)
          </label>

          <div className="flex gap-3 pt-4 border-t border-cream-darker">
            <button type="submit" className="btn-primary flex-1">
              {post ? 'Update Post' : 'Add Post'}
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

export default PostForm
