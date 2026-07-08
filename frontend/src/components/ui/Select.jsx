const Select = ({
  label,
  id,
  value,
  onChange,
  options = [],
  placeholder = 'Select an option',
  required = false,
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
      <select
        id={id}
        value={value}
        onChange={onChange}
        required={required}
        className={`form-input appearance-none cursor-pointer ${
          error ? 'border-red-400 focus:ring-red-300' : ''
        } ${!value ? 'text-text-muted' : 'text-text-dark'}`}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <span className="text-xs text-red-500 font-sans">{error}</span>
      )}
    </div>
  )
}

export default Select