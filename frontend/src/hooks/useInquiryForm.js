import { useState } from 'react'
import { createInquiry } from '../services/inquiryService'
import { isRequired, isValidEmail } from '../utils/validators'

const INITIAL_FORM = {
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
}

const useInquiryForm = () => {
  const [form, setForm] = useState(INITIAL_FORM)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const handleChange = (field) => (e) => {
    const value = e?.target?.value ?? e
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const validate = () => {
    const next = {}
    if (!isRequired(form.name)) next.name = 'Please enter your name.'
    if (!isRequired(form.email)) next.email = 'Please enter your email.'
    else if (!isValidEmail(form.email)) next.email = 'Please enter a valid email.'
    if (!isRequired(form.message)) next.message = 'Please enter a message.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e) => {
    e?.preventDefault?.()
    if (!validate()) return

    setLoading(true)
    setSubmitError('')
    try {
      await createInquiry(form)
      setSubmitted(true)
    } catch (err) {
      setSubmitError(
        err?.response?.data?.message || "Something went wrong sending your message. Please try again."
      )
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setForm(INITIAL_FORM)
    setErrors({})
    setSubmitted(false)
    setSubmitError('')
  }

  return { form, errors, loading, submitted, submitError, handleChange, handleSubmit, reset }
}

export default useInquiryForm
