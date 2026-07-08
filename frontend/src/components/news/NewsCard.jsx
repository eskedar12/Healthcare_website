import { Link } from 'react-router-dom'
import { formatDate } from '../../utils/formatDate'

const NewsCard = ({ article }) => (
  <Link to={`/news/${article.slug}`} className="group flex flex-col">
    <div className="rounded-2xl overflow-hidden bg-cream-darker aspect-[16/9] mb-5">
      {article.image ? (
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-cream-dark to-cream-darker flex items-center justify-center">
          <span className="text-text-muted/30 font-serif text-4xl">L</span>
        </div>
      )}
    </div>

    <div className="flex items-center gap-3 mb-3">
      <span className="section-label text-forest text-[0.65rem]">
        {article.category}
      </span>
      <span className="text-text-muted/30">·</span>
      <span className="section-label text-[0.65rem]">
        {formatDate(article.date)}
      </span>
    </div>

    <h3 className="font-serif text-text-dark text-xl leading-snug mb-3 group-hover:text-forest transition-colors">
      {article.title}
    </h3>

    <p className="font-sans text-sm text-text-body leading-relaxed line-clamp-2 mb-4">
      {article.excerpt}
    </p>

    <span className="font-sans text-xs text-forest font-medium flex items-center gap-1 mt-auto">
      Read more{' '}
      <span className="group-hover:translate-x-1 transition-transform">→</span>
    </span>
  </Link>
)

export default NewsCard
