import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdmin } from '../../hooks/useAdmin'

const AdminLoginPage = () => {
  const navigate = useNavigate()
  const { login } = useAdmin()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await login(formData.email, formData.password)
      navigate('/admin/dashboard')
    } catch (err) {
      setError(err.message || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2.5 mb-4">
            <span className="font-serif font-bold text-forest text-3xl">Ψ</span>
            <div>
              <p className="font-serif font-semibold text-text-dark text-2xl leading-none">
                Lebeza
              </p>
              <p className="text-text-muted text-[0.6rem] tracking-widest uppercase mt-0.5">
                ADMIN
              </p>
            </div>
          </div>
          <h2 className="font-serif text-xl text-text-dark">Welcome Back</h2>
          <p className="font-sans text-sm text-text-muted mt-1">Sign in to manage your clinic</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="font-sans text-sm font-medium text-text-dark block mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-cream-darker focus:border-forest focus:outline-none transition-colors"
                placeholder="admin@lebeza.org"
                required
              />
            </div>
            <div>
              <label className="font-sans text-sm font-medium text-text-dark block mb-1">
                Password
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-cream-darker focus:border-forest focus:outline-none transition-colors"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <p className="font-sans text-sm text-red-500">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-forest text-white py-2.5 rounded-lg font-medium hover:bg-forest/90 transition-colors disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AdminLoginPage
