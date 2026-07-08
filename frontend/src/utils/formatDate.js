export const formatDate = (dateInput, options) => {
  if (!dateInput) return ''
  const date = new Date(dateInput)
  if (Number.isNaN(date.getTime())) return ''

  return date.toLocaleDateString(
    'en-US',
    options || { month: 'long', day: 'numeric', year: 'numeric' }
  )
}

export const formatShortDate = (dateInput) =>
  formatDate(dateInput, { month: 'short', day: 'numeric', year: 'numeric' })

export const formatTime = (timeInput) => {
  if (!timeInput) return ''
  return timeInput
}

export default { formatDate, formatShortDate, formatTime }
