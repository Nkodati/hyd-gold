import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import GoldCalculator from '@/components/GoldCalculator'
import type { CityKey } from '@/components/GoldDashboard'
import { cityContent, getAllCityContent } from '@/data/cityContent'
import { getRates } from '@/data/rates'

type CityPageProps = {
  params: {
    city: CityKey
  }
}

export function generateStaticParams() {
  return getAllCityContent().map((city) => ({ city: city.slug }))
}

export async function generateMetadata({ params }: CityPageProps): Promise<Metadata> {
  const content = cityContent[params.city]

  if (!content) {
    return {
      title: 'City Page Not Found — Gold Rate India',
    }
  }

  return {
    title: `${content.title} — Gold Rate India`,
    description: content.description,
  }
}

export default async function CityPage({ params }: CityPageProps) {
  const content = cityContent[params.city]

  if (!content) {
    notFound()
  }

  const data = await getRates()
  const city = data.cities[params.city]
  const cityOptions = Object.entries(data.cities).map(([key, item]) => ({
    key: key as CityKey,
    name: item.name,
    rates: {
      '24k': item.rates['24k'].perGram,
      '22k': item.rates['22k'].perGram,
      '18k': item.rates['18k'].perGram,
    },
  }))
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: content.faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }

  return (
    <div className="noise-bg grid-bg min-h-screen">
      <main className="static-page">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
        <p className="blog-eyebrow">{content.cityName} City Guide</p>
        <h1>{content.title}</h1>
        <p className="blog-lead">{content.description}</p>

        <div className="stats-inline-grid">
          <div className="stats-inline-card">
            <span>22K today</span>
            <strong>₹{city.rates['22k'].perGram.toLocaleString('en-IN')}/g</strong>
          </div>
          <div className="stats-inline-card">
            <span>24K today</span>
            <strong>₹{city.rates['24k'].perGram.toLocaleString('en-IN')}/g</strong>
          </div>
          <div className="stats-inline-card">
            <span>Silver</span>
            <strong>₹{city.rates.silver.perGram.toLocaleString('en-IN')}/g</strong>
          </div>
        </div>

        {content.overview.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}

        <GoldCalculator cityOptions={cityOptions} initialCity={params.city} />

        <h2>Buying tips for {content.cityName}</h2>
        {content.buyingTips.map((tip) => (
          <p key={tip}>{tip}</p>
        ))}

        <h2>Frequently asked questions</h2>
        {content.faq.map((item) => (
          <div key={item.question} className="faq-item">
            <h3>{item.question}</h3>
            <p>{item.answer}</p>
          </div>
        ))}

        <div className="divider-line" />
        <p>
          Continue exploring the <Link href="/">homepage</Link> for multi-city comparison, visit the{' '}
          <Link href="/blog">blog</Link> for gold buying guides, or open the{' '}
          <Link href="/calculators/gold-price-calculator">calculator</Link> to estimate your total bill.
        </p>
      </main>
    </div>
  )
}
