// Large serif editorial headings
const SectionTitle = ({
  children,
  size = 'lg',
  light = false,
  className = '',
  as: Tag = 'h2',
}) => {
  const sizes = {
    xl: 'text-display-xl',
    lg: 'text-display-lg',
    md: 'text-display-md',
    sm: 'text-display-sm',
  }

  return (
    <Tag
      className={`font-serif leading-tight text-balance ${sizes[size]} ${
        light ? 'text-cream' : 'text-text-dark'
      } ${className}`}
    >
      {children}
    </Tag>
  )
}

export default SectionTitle