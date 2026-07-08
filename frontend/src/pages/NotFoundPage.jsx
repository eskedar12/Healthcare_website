import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'
import SectionLabel from '../components/ui/SectionLabel'

const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <SectionLabel className="mb-4">404</SectionLabel>
        <h1 className="font-serif text-text-dark text-4xl lg:text-5xl leading-tight mb-6">
          Page not found.
        </h1>
        <p className="font-sans text-text-body text-base leading-relaxed mb-10">
          The page you're looking for doesn't exist or may have moved.
        </p>
        <Link to="/">
          <Button variant="primary" size="md">Back to home</Button>
        </Link>
      </div>
    </div>
  )
}

export default NotFoundPage
