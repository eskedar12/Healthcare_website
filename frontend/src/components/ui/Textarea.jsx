const Textarea = ({
  label,
  id,
  placeholder,
  value,
  onChange,
  required = false,
  rows = 4,
  error,
  className = '',
}) => {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="section-label">
          {label}
          {required && <span className="text-accent ml-1">*</span>}
        </label>
      )}
      <textarea
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        rows={rows}
        className={`form-input resize-none ${
          error ? 'border-red-400 focus:ring-red-300' : ''
        }`}
      />
      {error && (
        <span className="text-xs text-red-500 font-sans">{error}</span>
      )}
    </div>
  )
}

export default Textarea