import type { Metadata } from 'next'
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
    'Live gold and silver rates across India — Chennai, Hyderabad, Bangalore, Ahmedabad. 22K, 24K, 18K rates updated daily.',
  keywords: [
    'gold rate india',
    'gold rate today',
    'gold price india',
    '22k gold rate',
    '24k gold rate',
    'live gold rate',
  ],
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${syne.variable} ${dmMono.variable}`}>
        <nav className="site-nav" aria-label="Main">
          <div className="nav-inner">
            <Link href="/" className="nav-logo">
              <span className="shimmer-text">GoldRate</span>
              <span className="nav-logo-india">India</span>
            </Link>
            <div className="nav-links">
              <Link href="/about">About</Link>
              <Link href="/contact">Contact</Link>
            </div>
          </div>
        </nav>
        {children}
        <footer className="site-footer">
          <div className="footer-inner">
            <p className="text-xs sm:text-sm" style={{ color: 'rgba(245,240,232,0.35)' }}>
              © 2026 GoldRateIndia.live — Indicative rates only. Not financial advice.
            </p>
            <div className="footer-links flex flex-wrap gap-4 sm:gap-6">
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
