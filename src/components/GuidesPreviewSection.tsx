import Link from 'next/link'
import { getAllGuides } from '@/data/guides'

export default function GuidesPreviewSection() {
  const featured = getAllGuides().slice(0, 6)

  return (
    <section className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 pb-12 sm:pb-16">
      <div className="section-header">
        <h2>High-intent guides for gold buyers</h2>
        <p>
          These evergreen pages target the questions people search right before spending money: purity, invoices, making
          charges, wedding buying, and investment choices.
        </p>
      </div>

      <div className="city-link-grid">
        {featured.map((guide) => (
          <Link key={guide.slug} href={`/guides/${guide.slug}`} className="city-link-card">
            <div className="blog-card-meta">
              <span>{guide.eyebrow}</span>
              <span>Guide</span>
            </div>
            <h3>{guide.title}</h3>
            <p>{guide.description}</p>
            <span className="blog-card-link">Open guide</span>
          </Link>
        ))}
      </div>

      <div className="mt-5">
        <Link href="/guides" className="blog-index-link">
          View all guides
        </Link>
      </div>
    </section>
  )
}
