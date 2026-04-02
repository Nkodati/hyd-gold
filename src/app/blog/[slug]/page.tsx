import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getAllPosts, getPostBySlug } from '@/data/blogPosts'

type BlogPostPageProps = {
  params: {
    slug: string
  }
}

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = getPostBySlug(params.slug)

  if (!post) {
    return {
      title: 'Article Not Found — Gold Rate India',
    }
  }

  return {
    title: `${post.title} — Gold Rate India`,
    description: post.description,
  }
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = getPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  const relatedPosts = getAllPosts().filter((item) => item.slug !== post.slug).slice(0, 2)
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    author: {
      '@type': 'Organization',
      name: 'GoldRateIndia.live',
    },
    publisher: {
      '@type': 'Organization',
      name: 'GoldRateIndia.live',
    },
    mainEntityOfPage: `https://goldrateindia.live/blog/${post.slug}`,
  }

  return (
    <div className="noise-bg grid-bg min-h-screen">
      <main className="static-page">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
        <p className="blog-eyebrow">{post.category}</p>
        <h1>{post.title}</h1>
        <div className="blog-post-meta">
          <span>{post.readTime}</span>
          <span>{new Date(post.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
        </div>
        <p className="blog-lead">{post.description}</p>

        {post.sections.map((section) => (
          <section key={section.heading}>
            <h2>{section.heading}</h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </section>
        ))}

        <div className="divider-line" />

        <h2>Related reading</h2>
        <div className="city-link-grid">
          {relatedPosts.map((item) => (
            <Link key={item.slug} href={`/blog/${item.slug}`} className="city-link-card">
              <div className="blog-card-meta">
                <span>{item.category}</span>
                <span>{item.readTime}</span>
              </div>
              <h3>{item.title}</h3>
              <p>{item.excerpt}</p>
              <span className="blog-card-link">Read article</span>
            </Link>
          ))}
        </div>

        <div className="divider-line" />

        <p>
          Looking for live city rates as well? Visit the <Link href="/">homepage</Link> for today&apos;s gold and silver prices,
          or browse the full <Link href="/blog">blog index</Link> for more guides.
        </p>
      </main>
    </div>
  )
}
