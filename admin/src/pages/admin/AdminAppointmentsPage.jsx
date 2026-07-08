import { useState, useEffect } from 'react'
import { FiFilter, FiPlus, FiX, FiCalendar, FiUser, FiMapPin } from 'react-icons/fi'
import useToast from '../../hooks/useToast'
import api from '../../services/api'
import { useAdmin } from '../../hooks/useAdmin'
import { canEditAppointments } from '../../utils/permissions'

const STATUS_FILTERS = ['All', 'Confirmed', 'Pending', 'Checked In', 'Cancelled']
const STATUS_OPTIONS = ['Pending', 'Confirmed', 'Checked In', 'Cancelled']

const TIME_SLOTS = [
  '08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM',
  '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '02:00 PM', '02:30 PM', '03:00 PM',
  '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM',
]

const convertTo24Hour = (timeStr) => {
  if (!timeStr) return timeStr
  const match = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i)
  if (!match) return timeStr
  let [, hours, minutes, modifier] = match
  hours = parseInt(hours, 10)
  if (modifier.toUpperCase() === 'PM' && hours < 12) hours += 12
  if (modifier.toUpperCase() === 'AM' && hours === 12) hours = 0
  return `${hours.toString().padStart(2, '0')}:${minutes}`
}

const AdminAppointmentsPage = () => {
  const toast = useToast()
  const { user } = useAdmin()
  const canEdit = canEditAppointments(user?.role)
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeFilter, setActiveFilter] = useState('All')
  const [showBookingForm, setShowBookingForm] = useState(false)
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [managingAppointment, setManagingAppointment] = useState(null)
  const [newStatus, setNewStatus] = useState('')
  const [statusSaving, setStatusSaving] = useState(false)

  // Options for the booking form — same source data the public site uses
  const [branchOptions, setBranchOptions] = useState([])
  const [serviceOptions, setServiceOptions] = useState([])
  const [doctorOptions, setDoctorOptions] = useState([])

  const [formData, setFormData] = useState({
    patient_name: '',
    phone: '',
    email: '',
    branch: '',
    service: '',
    doctor_id: 'no-preference',
    date: '',
    time: '',
    notes: '',
    status: 'Pending'
  })

  // Filter state
  const [filters, setFilters] = useState({
    doctor: 'All',
    branch: 'All',
    dateFrom: '',
    dateTo: '',
    status: 'All'
  })

  const [tempFilters, setTempFilters] = useState({
    doctor: 'All',
    branch: 'All',
    dateFrom: '',
    dateTo: '',
    status: 'All'
  })

  // Fetch appointments from API
  useEffect(() => {
    fetchAppointments()
    fetchFormOptions()
  }, [])

  const fetchFormOptions = async () => {
    try {
      const [branchesRes, servicesRes, doctorsRes] = await Promise.all([
        api.get('/branches'),
        api.get('/services'),
        api.get('/doctors'),
      ])
      setBranchOptions(branchesRes.data || [])
      setServiceOptions(servicesRes.data || [])
      setDoctorOptions(doctorsRes.data || [])
    } catch (err) {
      // Fall back silently — the form still works with manual entry
      console.error('Failed to load booking form options:', err.message)
    }
  }

  const fetchAppointments = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.get('/appointments')
      setAppointments(response.data || [])
    } catch (err) {
      setError(err.message || 'Failed to load appointments')
    } finally {
      setLoading(false)
    }
  }

  const filteredAppointments = appointments.filter(apt => {
    const matchesStatus = activeFilter === 'All' || apt.status === activeFilter
    const matchesDoctor = filters.doctor === 'All' || apt.doctor_name === filters.doctor
    const matchesBranch = filters.branch === 'All' || apt.branch === filters.branch
    const matchesDateFrom = !filters.dateFrom || apt.date >= filters.dateFrom
    const matchesDateTo = !filters.dateTo || apt.date <= filters.dateTo
    const matchesFilterStatus = filters.status === 'All' || apt.status === filters.status

    return matchesStatus && matchesDoctor && matchesBranch && matchesDateFrom && matchesDateTo && matchesFilterStatus
  })

  const getStatusColor = (status) => {
    switch(status) {
      case 'Confirmed': return 'bg-green-100 text-green-700'
      case 'Pending': return 'bg-yellow-100 text-yellow-700'
      case 'Checked In': return 'bg-blue-100 text-blue-700'
      case 'Cancelled': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const payload = {
        patient_name: formData.patient_name,
        phone: formData.phone,
        email: formData.email,
        service: formData.service,
        date: formData.date,
        time: convertTo24Hour(formData.time),
        notes: formData.notes,
        status: formData.status,
      }

      if (formData.branch && !isNaN(Number(formData.branch))) {
        payload.branch_id = parseInt(formData.branch, 10)
      } else if (formData.branch) {
        payload.branch = formData.branch
      }

      if (formData.doctor_id && formData.doctor_id !== 'no-preference') {
        payload.doctor_id = parseInt(formData.doctor_id, 10)
      }

      await api.post('/appointments', payload)
      await fetchAppointments()
      setShowBookingForm(false)
      toast.success('Appointment booked successfully')
      setFormData({
        patient_name: '',
        phone: '',
        email: '',
        branch: '',
        service: '',
        doctor_id: 'no-preference',
        date: '',
        time: '',
        notes: '',
        status: 'Pending'
      })
    } catch (err) {
      toast.error('Failed to create appointment: ' + err.message)
    }
  }

  const openManageStatus = (appointment) => {
    setManagingAppointment(appointment)
    setNewStatus(appointment.status)
  }

  const handleStatusSave = async () => {
    if (!managingAppointment) return
    setStatusSaving(true)
    try {
      await api.patch(`/appointments/${managingAppointment.id}/status`, { status: newStatus })
      await fetchAppointments()
      toast.success('Appointment status updated successfully')
      setManagingAppointment(null)
    } catch (err) {
      toast.error('Failed to update status: ' + err.message)
    } finally {
      setStatusSaving(false)
    }
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleFilterChange = (e) => {
    setTempFilters({
      ...tempFilters,
      [e.target.name]: e.target.value
    })
  }

  const applyFilters = () => {
    setFilters(tempFilters)
    setShowFilterModal(false)
  }

  const clearFilters = () => {
    const resetFilters = {
      doctor: 'All',
      branch: 'All',
      dateFrom: '',
      dateTo: '',
      status: 'All'
    }
    setTempFilters(resetFilters)
    setFilters(resetFilters)
    setActiveFilter('All')
    setShowFilterModal(false)
  }

  const getActiveFilterCount = () => {
    let count = 0
    if (filters.doctor !== 'All') count++
    if (filters.branch !== 'All') count++
    if (filters.dateFrom) count++
    if (filters.dateTo) count++
    if (filters.status !== 'All') count++
    return count
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl text-text-dark">Appointments</h1>
        {canEdit && (
          <button 
            onClick={() => setShowBookingForm(true)}
            className="btn-primary flex items-center gap-2"
          >
            <FiPlus /> Book Only
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {STATUS_FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeFilter === filter
                  ? 'bg-forest text-white'
                  : 'bg-cream text-text-body hover:bg-cream-darker'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
        <button 
          onClick={() => {
            setTempFilters(filters)
            setShowFilterModal(true)
          }}
          className="btn-outline flex items-center gap-2 relative"
        >
          <FiFilter /> Filter
          {getActiveFilterCount() > 0 && (
            <span className="absolute -top-2 -right-2 bg-forest text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {getActiveFilterCount()}
            </span>
          )}
        </button>
      </div>

      {/* Active Filters Display */}
      {getActiveFilterCount() > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="font-sans text-xs text-text-muted">Active filters:</span>
          {filters.doctor !== 'All' && (
            <span className="bg-cream px-2 py-1 rounded text-xs font-medium text-text-body flex items-center gap-1">
              <FiUser className="text-forest" size={12} /> {filters.doctor}
            </span>
          )}
          {filters.branch !== 'All' && (
            <span className="bg-cream px-2 py-1 rounded text-xs font-medium text-text-body flex items-center gap-1">
              <FiMapPin className="text-forest" size={12} /> {filters.branch}
            </span>
          )}
          {filters.dateFrom && (
            <span className="bg-cream px-2 py-1 rounded text-xs font-medium text-text-body flex items-center gap-1">
              <FiCalendar className="text-forest" size={12} /> From: {filters.dateFrom}
            </span>
          )}
          {filters.dateTo && (
            <span className="bg-cream px-2 py-1 rounded text-xs font-medium text-text-body flex items-center gap-1">
              <FiCalendar className="text-forest" size={12} /> To: {filters.dateTo}
            </span>
          )}
          {filters.status !== 'All' && (
            <span className="bg-cream px-2 py-1 rounded text-xs font-medium text-text-body">
              Status: {filters.status}
            </span>
          )}
          <button 
            onClick={clearFilters}
            className="text-xs text-red-500 hover:underline ml-2"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-cream">
              <tr>
                <th className="text-left px-6 py-3 font-sans text-xs font-medium text-text-muted uppercase tracking-wider">ID</th>
                <th className="text-left px-6 py-3 font-sans text-xs font-medium text-text-muted uppercase tracking-wider">Patient</th>
                <th className="text-left px-6 py-3 font-sans text-xs font-medium text-text-muted uppercase tracking-wider">Doctor</th>
                <th className="text-left px-6 py-3 font-sans text-xs font-medium text-text-muted uppercase tracking-wider">Branch</th>
                <th className="text-left px-6 py-3 font-sans text-xs font-medium text-text-muted uppercase tracking-wider">Date</th>
                <th className="text-left px-6 py-3 font-sans text-xs font-medium text-text-muted uppercase tracking-wider">Time</th>
                <th className="text-left px-6 py-3 font-sans text-xs font-medium text-text-muted uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-3 font-sans text-xs font-medium text-text-muted uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="text-center py-8 text-text-muted">Loading appointments...</td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="8" className="text-center py-8 text-red-500">Error: {error}</td>
                </tr>
              ) : filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-8 text-text-muted">
                    No appointments found matching your filters
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((apt) => (
                  <tr key={apt.id} className="border-b border-cream/50 hover:bg-cream/30 transition-colors">
                    <td className="px-6 py-4 font-sans text-sm font-medium text-text-dark">{apt.appointment_id}</td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-sans text-sm font-medium text-text-dark">{apt.patient_name}</p>
                        <p className="font-sans text-xs text-text-muted">{apt.phone}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-sans text-sm text-text-body">{apt.doctor_name}</td>
                    <td className="px-6 py-4 font-sans text-sm text-text-body">{apt.branch}</td>
                    <td className="px-6 py-4 font-sans text-sm text-text-body">{apt.date}</td>
                    <td className="px-6 py-4 font-sans text-sm text-text-body">{apt.time}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(apt.status)}`}>
                        {apt.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {canEdit ? (
                        <button
                          onClick={() => openManageStatus(apt)}
                          className="font-sans text-sm text-forest hover:underline"
                        >
                          Manage
                        </button>
                      ) : (
                        <span className="font-sans text-xs text-text-muted">View only</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-cream-darker">
              <h2 className="font-serif text-xl text-text-dark">Filter Appointments</h2>
              <button 
                onClick={() => setShowFilterModal(false)}
                className="p-2 hover:bg-cream rounded-lg transition-colors"
              >
                <FiX className="text-xl" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="font-sans text-sm font-medium text-text-dark block mb-1">
                  <FiUser className="inline mr-2 text-forest" /> Doctor
                </label>
                <select
                  name="doctor"
                  value={tempFilters.doctor}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-2 rounded-lg border border-cream-darker focus:border-forest focus:outline-none transition-colors"
                >
                  <option value="All">All Doctors</option>
                </select>
              </div>

              <div>
                <label className="font-sans text-sm font-medium text-text-dark block mb-1">
                  <FiMapPin className="inline mr-2 text-forest" /> Branch
                </label>
                <select
                  name="branch"
                  value={tempFilters.branch}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-2 rounded-lg border border-cream-darker focus:border-forest focus:outline-none transition-colors"
                >
                  <option value="All">All Branches</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-sans text-sm font-medium text-text-dark block mb-1">
                    <FiCalendar className="inline mr-2 text-forest" /> From
                  </label>
                  <input
                    type="date"
                    name="dateFrom"
                    value={tempFilters.dateFrom}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-2 rounded-lg border border-cream-darker focus:border-forest focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="font-sans text-sm font-medium text-text-dark block mb-1">
                    <FiCalendar className="inline mr-2 text-forest" /> To
                  </label>
                  <input
                    type="date"
                    name="dateTo"
                    value={tempFilters.dateTo}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-2 rounded-lg border border-cream-darker focus:border-forest focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="font-sans text-sm font-medium text-text-dark block mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={tempFilters.status}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-2 rounded-lg border border-cream-darker focus:border-forest focus:outline-none transition-colors"
                >
                  <option value="All">All Statuses</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Pending">Pending</option>
                  <option value="Checked In">Checked In</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4 border-t border-cream-darker">
                <button onClick={applyFilters} className="btn-primary flex-1">
                  Apply Filters
                </button>
                <button onClick={clearFilters} className="btn-outline flex-1">
                  Clear All
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Booking Form Modal — mirrors the public site's Book Only page */}
      {showBookingForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-cream-darker">
              <h2 className="font-serif text-xl text-text-dark">Book Only</h2>
              <button 
                onClick={() => setShowBookingForm(false)}
                className="p-2 hover:bg-cream rounded-lg transition-colors"
              >
                <FiX className="text-xl" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-sans text-sm font-medium text-text-dark block mb-1">
                    Patient Name *
                  </label>
                  <input
                    type="text"
                    name="patient_name"
                    placeholder="Full name"
                    value={formData.patient_name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-cream-darker focus:border-forest focus:outline-none transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="font-sans text-sm font-medium text-text-dark block mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+251 9XX XXX XXX"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-cream-darker focus:border-forest focus:outline-none transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="font-sans text-sm font-medium text-text-dark block mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-cream-darker focus:border-forest focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="font-sans text-sm font-medium text-text-dark block mb-1">
                    Branch *
                  </label>
                  <select
                    name="branch"
                    value={formData.branch}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-cream-darker focus:border-forest focus:outline-none transition-colors"
                    required
                  >
                    <option value="">Select branch</option>
                    {branchOptions.length > 0 ? (
                      branchOptions.map((b) => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))
                    ) : (
                      <>
                        <option value="Bole Main Clinic">Bole Main Clinic</option>
                        <option value="Kazanchis Branch">Kazanchis Branch</option>
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <label className="font-sans text-sm font-medium text-text-dark block mb-1">
                    Service *
                  </label>
                  <select
                    name="service"
                    value={formData.service}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-cream-darker focus:border-forest focus:outline-none transition-colors"
                    required
                  >
                    <option value="">Select service</option>
                    {serviceOptions.length > 0 ? (
                      serviceOptions.map((s) => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))
                    ) : (
                      <>
                        <option value="adult-psychiatry">Adult Psychiatry</option>
                        <option value="child-adolescent">Child & Adolescent</option>
                        <option value="psychology">Clinical Psychology</option>
                        <option value="psychotherapy">Psychotherapy</option>
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <label className="font-sans text-sm font-medium text-text-dark block mb-1">
                    Preferred Doctor
                  </label>
                  <select
                    name="doctor_id"
                    value={formData.doctor_id}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-cream-darker focus:border-forest focus:outline-none transition-colors"
                  >
                    <option value="no-preference">No preference</option>
                    {doctorOptions.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-sans text-sm font-medium text-text-dark block mb-1">
                    Preferred Date *
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-cream-darker focus:border-forest focus:outline-none transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="font-sans text-sm font-medium text-text-dark block mb-1">
                    Preferred Time *
                  </label>
                  <select
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-cream-darker focus:border-forest focus:outline-none transition-colors"
                    required
                  >
                    <option value="">Select time</option>
                    {TIME_SLOTS.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-sans text-sm font-medium text-text-dark block mb-1">
                  Notes (optional)
                </label>
                <textarea
                  name="notes"
                  rows={3}
                  placeholder="Is there anything we should know before your visit?"
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-cream-darker focus:border-forest focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="font-sans text-sm font-medium text-text-dark block mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-cream-darker focus:border-forest focus:outline-none transition-colors"
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Checked In">Checked In</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4 border-t border-cream-darker">
                <button type="submit" className="btn-primary flex-1">
                  Book Only
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowBookingForm(false)}
                  className="btn-outline flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Manage Status Modal */}
      {managingAppointment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full">
            <div className="flex items-center justify-between p-6 border-b border-cream-darker">
              <h2 className="font-serif text-xl text-text-dark">Manage Status</h2>
              <button
                onClick={() => setManagingAppointment(null)}
                className="p-2 hover:bg-cream rounded-lg transition-colors"
              >
                <FiX className="text-xl" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <p className="font-sans text-sm text-text-dark font-medium">
                  {managingAppointment.patient_name}
                </p>
                <p className="font-sans text-xs text-text-muted">
                  {managingAppointment.date} · {managingAppointment.time}
                </p>
              </div>

              <div>
                <label className="font-sans text-sm font-medium text-text-dark block mb-1">
                  Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-cream-darker focus:border-forest focus:outline-none transition-colors"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleStatusSave}
                  disabled={statusSaving}
                  className="btn-primary flex-1 disabled:opacity-60"
                >
                  {statusSaving ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={() => setManagingAppointment(null)}
                  className="btn-outline flex-1"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4">
        <a href="/" className="font-sans text-sm text-forest hover:underline">
          ← Back to site
        </a>
      </div>
    </div>
  )
}

export default AdminAppointmentsPage