import { useParams, Link } from 'react-router-dom'
import SectionLabel from '../components/ui/SectionLabel'
import Button from '../components/ui/Button'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import useFetch from '../hooks/useFetch'
import { formatDate } from '../utils/formatDate'
import BLOG_POSTS from '../data/blogPosts'

const BlogDetailPage = () => {
  const { slug } = useParams()
  const { data, loading } = useFetch(`/posts/slug/${slug}`)
  const post = data?.data || BLOG_POSTS.find((p) => p.slug === slug)

  if (loading) {
    return (
      <div className="py-32 flex justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!post) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-24 text-center">
        <h1 className="font-serif text-2xl text-text-dark mb-4">Post not found</h1>
        <p className="font-sans text-text-body text-sm mb-8">
          We couldn't find the article you're looking for.
        </p>
        <Link to="/blog">
          <Button variant="primary" size="md">Back to blog</Button>
        </Link>
      </div>
    )
  }

  return (
    <article className="max-w-3xl mx-auto px-6 lg:px-10 pt-32 lg:pt-40 pb-20 lg:pb-28">
      <Link
        to="/blog"
        className="font-sans text-sm text-text-muted hover:text-forest transition-colors inline-flex items-center gap-1 mb-8"
      >
        ← Back to blog
      </Link>

      <div className="flex items-center gap-3 mb-5">
        <span className="section-label text-forest text-[0.65rem]">
          {post.category}
        </span>
        <span className="text-text-muted/30">·</span>
        <span className="section-label text-[0.65rem]">
          {formatDate(post.date)}
        </span>
      </div>

      <h1
        className="font-serif text-text-dark leading-tight text-balance mb-6"
        style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
      >
        {post.title}
      </h1>

      {post.author && (
        <p className="font-sans text-sm text-text-muted mb-10">
          By {post.author}
        </p>
      )}

      <div className="rounded-2xl overflow-hidden bg-cream-darker aspect-[16/9] mb-10">
        {post.image ? (
          <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-cream-dark to-cream-darker flex items-center justify-center">
            <span className="text-text-muted/30 font-serif text-6xl">L</span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-5">
        {(post.content?.length ? post.content : [post.excerpt]).map((paragraph, i) => (
          <p key={i} className="font-sans text-text-body text-base leading-relaxed">
            {paragraph}
          </p>
        ))}
      </div>

      <div className="mt-14 pt-8 border-t border-cream-darker flex flex-wrap items-center justify-between gap-4">
        <Link to="/blog">
          <Button variant="outline" size="md">All articles</Button>
        </Link>
        <Link to="/contact">
          <Button variant="primary" size="md">
            Talk to our team
            <span className="text-xs">↗</span>
          </Button>
        </Link>
      </div>
    </article>
  )
}

export default BlogDetailPage
