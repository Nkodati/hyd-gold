import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About — Gold Rate India',
  description: 'Learn what GoldRateIndia.live provides, how we present rates, and important disclaimers.',
}

export default function AboutPage() {
  return (
    <div className="noise-bg grid-bg min-h-screen">
      <main className="static-page">
        <h1>About GoldRateIndia.live</h1>
        <p>
          GoldRateIndia.live is an independent reference site that brings together indicative gold and silver price information
          for major Indian cities. Our goal is simple: give you a fast, readable snapshot of 22 karat, 24 karat, and 18 karat
          gold alongside silver, so you can compare trends before you visit a jeweller, speak to a distributor, or review an
          investment idea. We focus on clarity—large numerals, consistent units, and charts that show how local benchmarks have
          moved over recent weeks.
        </p>

        <h2>What We Provide</h2>
        <p>
          The homepage highlights live-style rates for Chennai, Hyderabad, Bangalore, and Ahmedabad, with the ability to switch
          cities in one tap. Each view includes per-gram and per-10-gram figures where applicable, directional change hints, a
          silver panel, and a monthly trend visualisation powered by Recharts. We also publish contextual articles on this About
          page to explain how purity works and why bullion markets fluctuate, because understanding the mechanics behind the
          number is as important as the number itself.
        </p>
        <p>
          GoldRateIndia.live does not sell jewellery, coins, or ETFs, nor do we execute trades. Think of us as a digital ticker
          board and explainer rolled into one—a starting point for homework, not a substitute for invoices or contract terms
          from your vendor.
        </p>

        <h2>How Are Rates Calculated</h2>
        <p>
          The values you see are compiled from publicly reported bullion benchmarks, exchange-traded references, and reputable
          media aggregators that track Indian spot markets. Where multiple sources disagree slightly, we normalise to a single
          indicative line that reflects the mid-market tone for each city on the stated date. Making charges, GST, wastage, stone
          weight, and buy-back spreads are intentionally excluded so that you can compare the underlying metal cost apples to
          apples.
        </p>
        <p>
          Because global spot prices move throughout the trading day and the Indian rupee shifts against the dollar, intraday
          variance is normal. If you need a binding quote, always confirm with your jeweller or bank at the time of purchase.
        </p>

        <h2>Why Gold Matters in India</h2>
        <p>
          Gold is woven into India&apos;s cultural and financial fabric—weddings, festivals, family savings, and even informal
          emergency funds often lean on physical metal. Silver, though less discussed in headlines, anchors industrial demand and
          many traditional gift cycles. When policy rates, import duties, or currency sentiment shift, bullion reacts quickly,
          which is why we emphasise both absolute prices and the gentle slopes in our charts.
        </p>
        <p>
          We believe transparent, city-level visibility helps households plan better: knowing whether Chennai and Hyderabad are
          diverging, or whether Bangalore is tracking the national average, can inform timing and negotiation—even if the final
          decision still rests with you and your trusted jeweller.
        </p>

        <h2>How To Use The Site</h2>
        <p>
          Start on the homepage if you want a quick snapshot of today&apos;s rates. If you need more depth, our city pages add local
          buying context, our <Link href="/blog">blog</Link> explains concepts such as purity and timing, our{' '}
          <Link href="/guides">guides library</Link> targets deeper buyer questions, the{' '}
          <Link href="/faq">FAQ</Link> answers common buyer questions, and our{' '}
          <Link href="/calculators/gold-price-calculator">gold calculator</Link> helps estimate total purchase cost.
        </p>
        <p>
          We also publish an <Link href="/editorial-policy">editorial policy</Link> so readers understand how we handle indicative
          prices and educational content.
        </p>

        <h2>Disclaimer</h2>
        <p>
          Information on GoldRateIndia.live is provided for general educational purposes only. It is not investment, tax, or legal
          advice. Markets are volatile; past trend lines do not guarantee future prices. We make reasonable efforts to keep data
          accurate and timely, but errors or delays may occur. Always verify rates, purity, and charges in writing before you
          transact.
        </p>

        <div className="divider-line" />

        <p>
          Questions or corrections?{' '}
          <Link href="/contact">Contact us</Link>—we read every message, though we cannot respond to all immediately.
        </p>
      </main>
    </div>
  )
}
