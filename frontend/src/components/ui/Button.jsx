const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  type = 'button',
  disabled = false,
  className = '',
  icon,
}) => {
  const base =
    'inline-flex items-center gap-2 font-sans font-medium rounded-pill transition-all duration-200 active:scale-95 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed'

  const variants = {
    primary: 'bg-forest text-cream hover:bg-forest-mid',
    outline: 'border border-forest text-forest hover:bg-forest hover:text-cream',
    ghost: 'text-forest hover:bg-cream-dark',
    light: 'bg-cream text-forest hover:bg-cream-dark border border-cream-darker',
  }

  const sizes = {
    sm: 'text-xs px-5 py-2',
    md: 'text-sm px-7 py-3',
    lg: 'text-base px-9 py-4',
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
      {icon && <span>{icon}</span>}
    </button>
  )
}

export default Button