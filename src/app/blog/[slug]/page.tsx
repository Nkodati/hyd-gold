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

  return (
    <div className="noise-bg grid-bg min-h-screen">
      <main className="static-page">
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

        <p>
          Looking for live city rates as well? Visit the <Link href="/">homepage</Link> for today&apos;s gold and silver prices,
          or browse the full <Link href="/blog">blog index</Link> for more guides.
        </p>
      </main>
    </div>
  )
}
