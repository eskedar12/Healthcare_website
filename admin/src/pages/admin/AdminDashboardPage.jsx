import { useState, useEffect } from 'react'
import { FiCalendar, FiUsers, FiMapPin } from 'react-icons/fi'
import AdminStats from '../../components/admin/AdminStats'
import useAdmin from '../../hooks/useAdmin'
import api from '../../services/api'

const AdminDashboardPage = () => {
  const { user } = useAdmin()
  const [stats, setStats] = useState([])
  const [todayAppointments, setTodayAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    setLoading(true)
    setError(null)
    try {
      // Fetch real data from the API instead of mock numbers
      const [appointmentsRes, doctorsRes, branchesRes] = await Promise.all([
        api.get('/appointments'),
        api.get('/doctors'),
        api.get('/branches'),
      ])

      const allAppointments = appointmentsRes.data || []
      const doctors = doctorsRes.data || []
      const branches = branchesRes.data || []

      // Calculate today's appointments
      const today = new Date().toISOString().split('T')[0]
      const todayApps = allAppointments.filter(apt => apt.date === today)
      setTodayAppointments(todayApps.slice(0, 5))

      // Active patients = distinct patients across all appointments
      const uniquePatients = new Set(
        allAppointments.map((apt) => (apt.phone || apt.patient_name || '').toLowerCase().trim())
      )

      // Calculate stats from real data
      const statsData = [
        {
          title: 'Appointments Today',
          value: todayApps.length,
          icon: FiCalendar,
          color: 'text-blue-500 bg-blue-50'
        },
        {
          title: 'Active Patients',
          value: uniquePatients.size,
          icon: FiUsers,
          color: 'text-green-500 bg-green-50'
        },
        {
          title: 'Clinical Staff',
          value: doctors.length,
          icon: FiUsers,
          color: 'text-purple-500 bg-purple-50'
        },
        {
          title: 'Branches',
          value: branches.length,
          icon: FiMapPin,
          color: 'text-orange-500 bg-orange-50'
        },
      ]

      setStats(statsData)
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'Confirmed': return 'bg-green-100 text-green-700'
      case 'Pending': return 'bg-yellow-100 text-yellow-700'
      case 'Checked In': return 'bg-blue-100 text-blue-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const firstName = user?.full_name?.split(' ')[0] || 'there'

  return (
    <div>
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="font-serif text-2xl text-text-dark">
          Good morning, {firstName}.
        </h1>
        <p className="font-sans text-text-muted text-sm">Here's what's happening today</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <AdminStats key={stat.title} {...stat} />
        ))}
      </div>

      {/* Today's Schedule */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-lg text-text-dark">Today's Schedule</h2>
          <button className="font-sans text-sm text-forest hover:underline">
            View all
          </button>
        </div>

        {loading ? (
          <div className="py-8 text-center text-text-muted">Loading schedule...</div>
        ) : error ? (
          <div className="py-8 text-center text-red-500">Error: {error}</div>
        ) : todayAppointments.length === 0 ? (
          <div className="py-8 text-center text-text-muted">No appointments for today</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-cream-darker">
                  <th className="text-left py-3 font-sans text-xs font-medium text-text-muted uppercase tracking-wider">Time</th>
                  <th className="text-left py-3 font-sans text-xs font-medium text-text-muted uppercase tracking-wider">Patient</th>
                  <th className="text-left py-3 font-sans text-xs font-medium text-text-muted uppercase tracking-wider">Doctor</th>
                  <th className="text-left py-3 font-sans text-xs font-medium text-text-muted uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody>
                {todayAppointments.map((apt) => (
                  <tr key={apt.id} className="border-b border-cream/50 hover:bg-cream/30 transition-colors">
                    <td className="py-3 font-sans text-sm text-text-body">{apt.time}</td>
                    <td className="py-3 font-sans text-sm font-medium text-text-dark">{apt.patient_name}</td>
                    <td className="py-3 font-sans text-sm text-text-body">{apt.doctor_name}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(apt.status)}`}>
                        {apt.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Back to site */}
      <div className="mt-4">
        <a href="/" className="font-sans text-sm text-forest hover:underline">
          ← Back to site
        </a>
      </div>
    </div>
  )
}

export default AdminDashboardPage