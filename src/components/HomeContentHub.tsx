import Link from 'next/link'
import type { GoldRatesData } from '@/components/GoldDashboard'
import { getAllCityContent } from '@/data/cityContent'

export default function HomeContentHub({ data }: { data: GoldRatesData }) {
  const cities = getAllCityContent()

  return (
    <section className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 pb-12 sm:pb-16">
      <div className="content-section mb-8">
        <h2 className="!mt-0">Why readers trust this site</h2>
        <p>
          GoldRateIndia.live is designed to be more than a ticker. We publish daily city-level rates, explanatory market notes,
          buying guides, and practical tools so readers can understand what a quoted gold rate means before they walk into a
          store. The goal is to help users compare prices, verify purity, and avoid confusion around making charges.
        </p>
        <p>
          We keep indicative rates and editorial content together because that is how people actually make decisions: they need
          today&apos;s numbers, but they also need context. If you are planning a jewellery purchase, comparing city trends, or
          simply trying to understand whether 22K or 24K makes more sense, the pages below are a good next step.
        </p>
      </div>

      <div className="section-header">
        <h2>Explore gold rates by city</h2>
        <p>Each city page includes today&apos;s rates, local buying notes, and frequently asked questions.</p>
      </div>
      <div className="city-link-grid">
        {cities.map((city) => {
          const cityRates = data.cities[city.slug].rates
          return (
            <Link key={city.slug} href={`/city/${city.slug}`} className="city-link-card">
              <div className="blog-card-meta">
                <span>{city.cityName}</span>
                <span>22K ₹{cityRates['22k'].perGram.toLocaleString('en-IN')}/g</span>
              </div>
              <h3>{city.title}</h3>
              <p>{city.description}</p>
              <span className="blog-card-link">Open city guide</span>
            </Link>
          )
        })}
      </div>

      <div className="section-header mt-10">
        <h2>Useful tools and essential pages</h2>
        <p>These pages add depth for readers and make the site easier to evaluate as a real publisher property.</p>
      </div>
      <div className="city-link-grid">
        <Link href="/calculators/gold-price-calculator" className="city-link-card">
          <div className="blog-card-meta">
            <span>Calculator</span>
            <span>Plan purchases</span>
          </div>
          <h3>Estimate your gold purchase cost</h3>
          <p>Use today&apos;s rates, weight, and making charges to estimate your total before visiting a jeweller.</p>
          <span className="blog-card-link">Open calculator</span>
        </Link>
        <Link href="/faq" className="city-link-card">
          <div className="blog-card-meta">
            <span>FAQ</span>
            <span>Common questions</span>
          </div>
          <h3>Understand rates, purity, and invoices faster</h3>
          <p>Quick answers to the questions buyers usually ask before spending money on jewellery, coins, or bars.</p>
          <span className="blog-card-link">Read FAQ</span>
        </Link>
        <Link href="/guides" className="city-link-card">
          <div className="blog-card-meta">
            <span>Guides</span>
            <span>Search intent</span>
          </div>
          <h3>Browse evergreen buyer-intent guides</h3>
          <p>Explore pages on purity, making charges, invoices, wedding buying, and investment options.</p>
          <span className="blog-card-link">Open guides</span>
        </Link>
        <Link href="/editorial-policy" className="city-link-card">
          <div className="blog-card-meta">
            <span>Editorial</span>
            <span>Trust page</span>
          </div>
          <h3>See how we write and maintain content</h3>
          <p>Review our editorial standards, data handling approach, and how we present indicative rates responsibly.</p>
          <span className="blog-card-link">Read policy</span>
        </Link>
      </div>
    </section>
  )
}
