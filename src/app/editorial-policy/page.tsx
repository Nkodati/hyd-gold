import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Editorial Policy — Gold Rate India',
  description:
    'Read how GoldRateIndia.live handles indicative rates, editorial content, updates, corrections, and commercial transparency.',
}

export default function EditorialPolicyPage() {
  return (
    <div className="noise-bg grid-bg min-h-screen">
      <main className="static-page">
        <p className="blog-eyebrow">Editorial Policy</p>
        <h1>How we publish rates and editorial content</h1>
        <p>
          GoldRateIndia.live exists to help readers understand gold and silver prices in India without pretending that a simple
          chart is the whole story. We publish indicative rates, city-level explainers, buying guides, and calculators designed
          to make a complex purchase easier to understand.
        </p>

        <h2>Our purpose</h2>
        <p>
          We aim to provide practical, readable information for people comparing daily rates, shopping for jewellery, or trying
          to understand purity and pricing. Our content is educational in nature and should not be read as personal investment,
          legal, or tax advice.
        </p>

        <h2>How rate information is handled</h2>
        <p>
          Rates displayed on the site are indicative references compiled from public market sources and supporting processing
          logic. They are intended to reflect market direction and ballpark pricing, not a binding retail offer. We do not
          guarantee that any jeweller, dealer, or institution will transact at the displayed number.
        </p>

        <h2>How editorial content is written</h2>
        <p>
          Articles, FAQs, and city pages are written to explain how gold pricing works in India, how buyers can compare quotes,
          and what terms they should understand before purchasing. We prefer practical guidance over hype, and we avoid making
          unrealistic promises about returns, perfect market timing, or “secret” buying tricks.
        </p>

        <h2>Corrections and updates</h2>
        <p>
          If we learn that a factual statement, pricing explanation, or city-specific detail is materially wrong, we may update
          the page. Readers can contact us through the <Link href="/contact">contact page</Link> with correction requests or
          clarification notes.
        </p>

        <h2>Commercial transparency</h2>
        <p>
          The site may display advertising or sponsored placements in the future. Commercial relationships should never be
          mistaken for personal recommendations. Where paid placements exist, they should be identified in a way that is fair to
          readers and consistent with platform rules.
        </p>

        <h2>Reader-first approach</h2>
        <p>
          Our standard is simple: if a page does not help a reader make a clearer decision, it does not deserve to exist. That
          is the principle behind our editorial pages, calculator, FAQs, and city guides.
        </p>
      </main>
    </div>
  )
}
