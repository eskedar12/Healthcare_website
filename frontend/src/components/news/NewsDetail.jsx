import { Link } from 'react-router-dom'
import { formatDate } from '../../utils/formatDate'
import SectionLabel from '../ui/SectionLabel'
import Button from '../ui/Button'

const NewsDetail = ({ article }) => {
  if (!article) return null

  const { title, date, category, image, content, excerpt } = article

  return (
    <article className="max-w-3xl mx-auto px-6 lg:px-10 py-16 lg:py-24">
      <div className="flex items-center gap-3 mb-5">
        <SectionLabel className="mb-0 text-forest">{category}</SectionLabel>
        <span className="text-text-muted/30">·</span>
        <SectionLabel className="mb-0">{formatDate(date)}</SectionLabel>
      </div>

      <h1
        className="font-serif text-text-dark leading-tight mb-8"
        style={{ fontSize: 'clamp(2rem, 4vw, 3.25rem)' }}
      >
        {title}
      </h1>

      {image && (
        <div className="rounded-2xl overflow-hidden bg-cream-darker aspect-[16/9] mb-10">
          <img src={image} alt={title} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="font-sans text-text-body text-base leading-relaxed space-y-5">
        {(content ? content.split('\n\n') : [excerpt || 'Full article content coming soon.']).map(
          (para, i) => (
            <p key={i}>{para}</p>
          )
        )}
      </div>

      <div className="mt-14 pt-8 border-t border-cream-darker">
        <Link to="/news">
          <Button variant="outline" size="md">
            ← All articles
          </Button>
        </Link>
      </div>
    </article>
  )
}

export default NewsDetail
