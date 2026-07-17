import BlogCard from '../components/blog/BlogCard'
import SocialSection from '../components/blog/SocialSection'
import useFetch from '../hooks/useFetch'
import { useEditableSection } from '../hooks/useEditableSection'
import EditableText from '../components/editable/EditableText'
import BLOG_POSTS from '../data/blogPosts'

const DEFAULT_HEADER = {
  label: 'Blog',
  title: 'Insights from our clinical team',
}

const BlogPage = () => {
  const { data: headerData } = useFetch('/content/blog')
  const { data: postsData } = useFetch('/posts')
  const fetchedPosts = postsData?.data?.filter((p) => p.is_published !== false)
  const posts = fetchedPosts?.length ? fetchedPosts : BLOG_POSTS
  const headerInitial = { ...DEFAULT_HEADER, ...headerData?.data?.header }
  const { value: header, updateField: updateHeaderField } = useEditableSection(
    'blog',
    'header',
    headerInitial
  )

  return (
    <>
      <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-32 lg:pt-40 pb-20 lg:pb-28">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <EditableText
            as="p"
            value={header.label}
            onChange={(v) => updateHeaderField('label', v)}
            className="section-label mb-3 text-text-muted"
          />
          <EditableText
            as="h1"
            value={header.title}
            onChange={(v) => updateHeaderField('title', v)}
            className="font-serif text-text-dark leading-tight text-balance"
            style={{ fontSize: 'clamp(2.25rem, 4vw, 3.5rem)' }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-14">
          {posts.map((post) => (
            <BlogCard key={post.id || post.slug} post={post} />
          ))}
        </div>
      </div>

      {/* Social media + YouTube videos, shown after the blog list ends */}
      <SocialSection />
    </>
  )
}

export default BlogPage
