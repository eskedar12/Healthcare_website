import SectionLabel from '../ui/SectionLabel'
import SectionTitle from '../ui/SectionTitle'
import { SOCIAL_PROFILES, YOUTUBE_VIDEOS } from '../../data/socialMedia'

const SocialSection = () => {
  return (
    <section className="bg-cream-dark py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <SectionLabel>Stay connected</SectionLabel>
          <SectionTitle>Follow us & watch our latest videos</SectionTitle>
          <p className="font-sans text-sm text-text-body mt-4">
            Follow Lebeza on social media for updates, and catch our latest
            videos below.
          </p>
        </div>

        {/* Social profile links */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {SOCIAL_PROFILES.map(({ label, url }) => (
            <a
              key={label}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-sm px-6 py-2.5 rounded-pill border border-cream-darker text-text-body hover:border-forest hover:text-forest transition-all duration-200"
            >
              {label}
            </a>
          ))}
        </div>

        {/* YouTube videos */}
        {YOUTUBE_VIDEOS.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {YOUTUBE_VIDEOS.map((video) => (
              <div key={video.id}>
                <div className="rounded-2xl overflow-hidden aspect-video bg-cream-darker mb-3">
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${video.id}`}
                    title={video.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
                <p className="font-sans text-sm text-text-body">{video.title}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center border border-dashed border-cream-darker rounded-2xl py-14 px-6">
            <p className="font-sans text-sm text-text-muted">
              No videos yet — once Lebeza's YouTube channel goes live, videos
              added to <code className="text-xs">src/data/socialMedia.js</code>{' '}
              will appear here automatically.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

export default SocialSection
