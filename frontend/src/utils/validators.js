export const isRequired = (value) =>
  value !== undefined && value !== null && String(value).trim().length > 0

export const isValidEmail = (value) =>
  !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

export const isValidPhone = (value) =>
  !value || /^[+]?[\d\s()-]{7,20}$/.test(value)

export const minLength = (value, min) => !value || String(value).trim().length >= min

export default { isRequired, isValidEmail, isValidPhone, minLength }
