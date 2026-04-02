import Link from 'next/link'
import { getAllPosts } from '@/data/blogPosts'

export default function BlogPreviewSection() {
  const posts = getAllPosts().slice(0, 3)

  return (
    <section className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 pb-12 sm:pb-16">
      <div className="mb-5 sm:mb-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="glow-dot" />
          <span className="text-xs font-mono tracking-widest uppercase" style={{ color: 'var(--text-tertiary)' }}>
            Editorial Guides
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
          Practical reads for gold buyers
        </h2>
        <p className="text-sm sm:text-base" style={{ color: 'var(--text-secondary)' }}>
          Beyond daily rates, these articles explain how pricing, purity, and buying decisions work in the real market.
        </p>
      </div>

      <div className="grid gap-4">
        {posts.map((post, index) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="blog-card fade-up"
            style={{ animationDelay: `${120 + index * 80}ms`, transform: 'translateY(20px)' }}
          >
            <div className="blog-card-meta">
              <span>{post.category}</span>
              <span>{post.readTime}</span>
            </div>
            <h3>{post.title}</h3>
            <p>{post.excerpt}</p>
            <span className="blog-card-link">Read article</span>
          </Link>
        ))}
      </div>

      <div className="mt-5">
        <Link href="/blog" className="blog-index-link">
          View all articles
        </Link>
      </div>
    </section>
  )
}
