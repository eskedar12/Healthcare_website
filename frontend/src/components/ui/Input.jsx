const Input = ({
  label,
  id,
  type = 'text',
  placeholder,
  value,
  onChange,
  required = false,
  error,
  className = '',
}) => {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="section-label"
        >
          {label}
          {required && <span className="text-accent ml-1">*</span>}
        </label>
      )}
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className={`form-input ${error ? 'border-red-400 focus:ring-red-300' : ''}`}
      />
      {error && (
        <span className="text-xs text-red-500 font-sans">{error}</span>
      )}
    </div>
  )
}

export default Input