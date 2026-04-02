import type { Metadata, Viewport } from 'next'
import Link from 'next/link'
import { Syne, DM_Mono } from 'next/font/google'
import './globals.css'

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '500', '600', '700', '800'],
})

const dmMono = DM_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500'],
})

export const metadata: Metadata = {
  title: 'Gold Rate India — Live Gold & Silver Rates Today',
  description:
    'Live gold and silver rates across India with city pages, buying guides, calculators, FAQs, and daily market context.',
  keywords: [
    'gold rate india',
    'gold rate today',
    'gold price india',
    '22k gold rate',
    '24k gold rate',
    'live gold rate',
  ],
  other: {
    'google-adsense-account': 'ca-pub-2917360666100529',
  },
  verification: {
    google: 'WB1hluJUJLZ1SPggfn2XU554hTGeJaeRT9FPr9IPpv0',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2917360666100529"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${syne.variable} ${dmMono.variable}`}>
        <nav className="site-nav" aria-label="Main">
          <div className="nav-inner">
            <Link href="/" className="nav-logo">
              <span className="shimmer-text">GoldRate</span>
              <span className="nav-logo-india">India</span>
            </Link>
            <div className="nav-links">
              <Link href="/city/hyderabad">Cities</Link>
              <Link href="/calculators/gold-price-calculator">Calculator</Link>
              <Link href="/blog">Blog</Link>
              <Link href="/guides">Guides</Link>
              <Link href="/faq">FAQ</Link>
              <Link href="/about">About</Link>
              <Link href="/contact">Contact</Link>
            </div>
          </div>
        </nav>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'GoldRateIndia.live',
              url: 'https://goldrateindia.live',
              email: 'goldratesindia4@gmail.com',
              sameAs: [],
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'GoldRateIndia.live',
              url: 'https://goldrateindia.live',
              potentialAction: {
                '@type': 'SearchAction',
                target: 'https://goldrateindia.live/blog',
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
        {children}
        <footer className="site-footer">
          <div className="footer-inner">
            <p className="text-xs sm:text-sm" style={{ color: 'rgba(245,240,232,0.35)' }}>
              © 2026 GoldRateIndia.live — Indicative rates only. Not financial advice.
            </p>
            <div className="footer-links flex flex-wrap gap-4 sm:gap-6">
              <Link href="/city/hyderabad">Cities</Link>
              <Link href="/calculators/gold-price-calculator">Calculator</Link>
              <Link href="/blog">Blog</Link>
              <Link href="/guides">Guides</Link>
              <Link href="/faq">FAQ</Link>
              <Link href="/editorial-policy">Editorial</Link>
              <Link href="/about">About</Link>
              <Link href="/privacy-policy">Privacy</Link>
              <Link href="/contact">Contact</Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
