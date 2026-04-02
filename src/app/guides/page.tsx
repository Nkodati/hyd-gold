import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllGuides } from '@/data/guides'

export const metadata: Metadata = {
  title: 'Gold Guides — Gold Rate India',
  description:
    'Browse practical guides about gold purity, making charges, invoices, wedding planning, and investment options in India.',
}

export default function GuidesIndexPage() {
  const guides = getAllGuides()

  return (
    <div className="noise-bg grid-bg min-h-screen">
      <main className="static-page">
        <p className="blog-eyebrow">Guides</p>
        <h1>Gold buying guides for real decisions</h1>
        <p>
          This library is built for high-intent readers who are close to making a purchase and want practical clarity before
          they spend. These pages focus on invoices, purity, pricing logic, timing, and purchase planning.
        </p>

        <div className="blog-index-grid">
          {guides.map((guide) => (
            <article key={guide.slug} className="blog-card">
              <div className="blog-card-meta">
                <span>{guide.eyebrow}</span>
                <span>Evergreen</span>
              </div>
              <h2>{guide.title}</h2>
              <p>{guide.description}</p>
              <Link href={`/guides/${guide.slug}`} className="blog-card-link">
                Read guide
              </Link>
            </article>
          ))}
        </div>
      </main>
    </div>
  )
}
