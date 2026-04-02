import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getAllGuides, getGuideBySlug } from '@/data/guides'

type GuidePageProps = {
  params: {
    slug: string
  }
}

export function generateStaticParams() {
  return getAllGuides().map((guide) => ({ slug: guide.slug }))
}

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const guide = getGuideBySlug(params.slug)

  if (!guide) {
    return {
      title: 'Guide Not Found — Gold Rate India',
    }
  }

  return {
    title: `${guide.title} — Gold Rate India`,
    description: guide.description,
  }
}

export default function GuidePage({ params }: GuidePageProps) {
  const guide = getGuideBySlug(params.slug)

  if (!guide) {
    notFound()
  }

  const related = getAllGuides().filter((item) => item.slug !== guide.slug).slice(0, 3)
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.title,
    description: guide.description,
    author: {
      '@type': 'Organization',
      name: 'GoldRateIndia.live',
    },
    publisher: {
      '@type': 'Organization',
      name: 'GoldRateIndia.live',
    },
    mainEntityOfPage: `https://goldrateindia.live/guides/${guide.slug}`,
  }

  return (
    <div className="noise-bg grid-bg min-h-screen">
      <main className="static-page">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
        <p className="blog-eyebrow">{guide.eyebrow}</p>
        <h1>{guide.title}</h1>
        <p className="blog-lead">{guide.description}</p>

        {guide.sections.map((section) => (
          <section key={section.heading}>
            <h2>{section.heading}</h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </section>
        ))}

        <div className="divider-line" />

        <h2>Continue reading</h2>
        <div className="city-link-grid">
          {related.map((item) => (
            <Link key={item.slug} href={`/guides/${item.slug}`} className="city-link-card">
              <div className="blog-card-meta">
                <span>{item.eyebrow}</span>
                <span>Guide</span>
              </div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <span className="blog-card-link">Read guide</span>
            </Link>
          ))}
        </div>

        <div className="divider-line" />
        <p>
          Return to the <Link href="/guides">guides library</Link>, browse the <Link href="/blog">blog</Link>, or compare live
          city rates on the <Link href="/">homepage</Link>.
        </p>
      </main>
    </div>
  )
}
