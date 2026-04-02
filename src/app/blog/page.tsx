import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllPosts } from '@/data/blogPosts'

export const metadata: Metadata = {
  title: 'Gold Buying Blog — Gold Rate India',
  description:
    'Read practical articles about gold rates in India, purity checks, buying timing, and how jewellery pricing works.',
}

export default function BlogIndexPage() {
  const posts = getAllPosts()

  return (
    <div className="noise-bg grid-bg min-h-screen">
      <main className="static-page">
        <div className="mb-8">
          <p className="blog-eyebrow">Editorial</p>
          <h1>Gold buying guides and market explainers</h1>
          <p>
            These articles are written for readers who want more than a raw price ticker. We cover how rates are formed, how to
            compare jewellers, what purity markings mean, and how to think about timing a purchase in India.
          </p>
        </div>

        <div className="blog-index-grid">
          {posts.map((post) => (
            <article key={post.slug} className="blog-card">
              <div className="blog-card-meta">
                <span>{post.category}</span>
                <span>{post.readTime}</span>
              </div>
              <h2>{post.title}</h2>
              <p>{post.excerpt}</p>
              <Link href={`/blog/${post.slug}`} className="blog-card-link">
                Read article
              </Link>
            </article>
          ))}
        </div>
      </main>
    </div>
  )
}
