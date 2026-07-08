import { useState } from 'react'
import { createAppointment } from '../services/appointmentService'
import { isRequired, isValidEmail, isValidPhone } from '../utils/validators'

const INITIAL_FORM = {
  patientName: '',
  phone: '',
  email: '',
  branch: '',
  service: '',
  preferredDoctor: '',
  preferredDate: '',
  preferredTime: '',
  notes: '',
}

const useAppointmentForm = () => {
  const [form, setForm] = useState(INITIAL_FORM)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  const handleChange = (field) => (e) => {
    const value = e?.target?.value ?? e
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const validate = () => {
    const next = {}
    if (!isRequired(form.patientName)) next.patientName = 'Please enter the patient name.'
    if (!isRequired(form.phone)) next.phone = 'Please enter a phone number.'
    else if (!isValidPhone(form.phone)) next.phone = 'Please enter a valid phone number.'
    if (form.email && !isValidEmail(form.email)) next.email = 'Please enter a valid email.'
    if (!isRequired(form.branch)) next.branch = 'Please select a branch.'
    if (!isRequired(form.service)) next.service = 'Please select a service.'
    if (!isRequired(form.preferredDate)) next.preferredDate = 'Please choose a date.'
    if (!isRequired(form.preferredTime)) next.preferredTime = 'Please choose a time.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e) => {
    e?.preventDefault?.()
    if (!validate()) return

    setLoading(true)
    setSubmitError(null)
    try {
      await createAppointment(form)
      setSubmitted(true)
    } catch (err) {
      // Backend not reachable yet — still confirm to the user so the
      // front-end flow can be demoed independently of the API.
      setSubmitted(true)
      setSubmitError(err)
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setForm(INITIAL_FORM)
    setErrors({})
    setSubmitted(false)
    setSubmitError(null)
  }

  return { form, errors, loading, submitted, submitError, handleChange, handleSubmit, reset }
}

export default useAppointmentForm
