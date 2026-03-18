import RateCard from '@/components/RateCard'
import TrendChart from '@/components/TrendChart'
import SilverCard from '@/components/SilverCard'
import { promises as fs } from 'fs'
import path from 'path'

async function getRates() {
  const filePath = path.join(process.cwd(), 'public', 'rates.json')
  const raw = await fs.readFile(filePath, 'utf-8')
  return JSON.parse(raw)
}

export default async function Home() {
  const data = await getRates()
  const { rates, monthlyTrend, lastUpdated } = data

  const updatedAt = new Date(lastUpdated).toLocaleTimeString('en-IN', {
    hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata'
  })

  const updatedDate = new Date(lastUpdated).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Kolkata'
  })

  return (
    <div className="noise-bg grid-bg min-h-screen relative">
      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-14">

        {/* Header */}
        <div className="mb-8 sm:mb-10 fade-up" style={{ animationDelay: '0ms', transform: 'translateY(20px)' }}>
          <div className="flex items-center gap-2 mb-2 sm:mb-3">
            <div className="glow-dot" />
            <span className="text-xs font-mono tracking-widest uppercase" style={{ color: 'var(--text-tertiary)' }}>
              Live · Hyderabad
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-1 sm:mb-2">
            <span className="shimmer-text">Gold Rates</span>
          </h1>
          <p className="text-xs sm:text-sm" style={{ color: 'var(--text-tertiary)' }}>
            {updatedDate} &nbsp;·&nbsp; Updated at {updatedAt} IST
          </p>
        </div>

        {/* Gold rate cards — single col mobile, 3-col desktop */}
        <div className="flex flex-col sm:grid sm:grid-cols-3 gap-2 sm:gap-3 mb-2 sm:mb-3">
          <RateCard
            karat="22K"
            label="Standard jewellery"
            perGram={rates['22k'].perGram}
            per10g={rates['22k'].per10g}
            change={rates['22k'].change}
            delay={100}
            accent
          />
          <RateCard
            karat="24K"
            label="Pure gold"
            perGram={rates['24k'].perGram}
            per10g={rates['24k'].per10g}
            change={rates['24k'].change}
            delay={180}
          />
          <RateCard
            karat="18K"
            label="Lightweight jewellery"
            perGram={rates['18k'].perGram}
            change={rates['18k'].change}
            delay={260}
          />
        </div>

        {/* Silver card */}
        <div className="mb-6 sm:mb-8">
          <SilverCard
            perGram={rates.silver.perGram}
            perKg={rates.silver.perKg}
            change={rates.silver.change}
            delay={340}
          />
        </div>

        {/* Trend chart */}
        <div className="fade-up" style={{ animationDelay: '420ms', transform: 'translateY(20px)' }}>
          <TrendChart data={monthlyTrend} />
        </div>

        {/* Footer */}
        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 sm:gap-2">
          <p className="text-xs font-mono" style={{ color: 'var(--text-tertiary)' }}>
            Rates are indicative. Excludes GST & making charges.
          </p>
          <p className="text-xs font-mono" style={{ color: 'var(--text-tertiary)' }}>
            Source: Hyderabad bullion market
          </p>
        </div>

      </div>
    </div>
  )
}
