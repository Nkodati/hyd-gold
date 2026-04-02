'use client'

import { useState } from 'react'
import RateCard from '@/components/RateCard'
import SilverCard from '@/components/SilverCard'
import TrendChart from '@/components/TrendChart'

export type CityKey = 'chennai' | 'hyderabad' | 'bangalore' | 'ahmedabad'

export interface CityRatesBlock {
  name: string
  rates: {
    '22k': { perGram: number; per10g: number; change: number }
    '24k': { perGram: number; per10g: number; change: number }
    '18k': { perGram: number; per10g: number; change: number }
    silver: { perGram: number; perKg: number; change: number }
  }
  monthlyTrend: {
    labels: string[]
    '22k': number[]
    '24k': number[]
    '18k': number[]
  }
}

export interface GoldRatesData {
  lastUpdated: string
  marketUpdate: string
  cities: Record<CityKey, CityRatesBlock>
}

const CITY_ORDER: CityKey[] = ['chennai', 'hyderabad', 'bangalore', 'ahmedabad']

export default function GoldDashboard({ data }: { data: GoldRatesData }) {
  const [activeCity, setActiveCity] = useState<CityKey>('chennai')
  const city = data.cities[activeCity]
  const { rates, monthlyTrend, name: cityName } = city

  const updatedAt = new Date(data.lastUpdated).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Kolkata',
  })
  const updatedDate = new Date(data.lastUpdated).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Kolkata',
  })
  const marketCommentary = data.marketUpdate
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean)

  return (
    <div className="noise-bg grid-bg min-h-screen relative">
      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-14">
        <div className="city-filter fade-up" style={{ animationDelay: '0ms', transform: 'translateY(20px)' }}>
          {CITY_ORDER.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveCity(key)}
              className={`city-btn ${activeCity === key ? 'active' : ''}`}
            >
              {data.cities[key].name}
            </button>
          ))}
        </div>

        <div className="mb-8 sm:mb-10 fade-up" style={{ animationDelay: '40ms', transform: 'translateY(20px)' }}>
          <div className="flex items-center gap-2 mb-2 sm:mb-3">
            <div className="glow-dot" />
            <span className="text-xs font-mono tracking-widest uppercase" style={{ color: 'var(--text-tertiary)' }}>
              Live Rates · India
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-1 sm:mb-2">
            <span className="shimmer-text">Gold Rates</span>
          </h1>
          <p className="text-xs sm:text-sm" style={{ color: 'var(--text-tertiary)' }}>
            {cityName} &nbsp;·&nbsp; {updatedDate} &nbsp;·&nbsp; Updated at {updatedAt} IST
          </p>
        </div>

        <div
          className="content-section mb-6 sm:mb-8 fade-up"
          style={{ animationDelay: '80ms', transform: 'translateY(20px)' }}
        >
          <h2 className="!mt-0">Gold Market Update — {updatedDate}</h2>
          <p>{marketCommentary.join(' ')}</p>
        </div>

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
            per10g={rates['18k'].per10g}
            change={rates['18k'].change}
            delay={260}
          />
        </div>

        <div className="mb-6 sm:mb-8">
          <SilverCard
            perGram={rates.silver.perGram}
            perKg={rates.silver.perKg}
            change={rates.silver.change}
            delay={340}
          />
        </div>

        <div className="fade-up" style={{ animationDelay: '420ms', transform: 'translateY(20px)' }}>
          <TrendChart data={monthlyTrend} />
        </div>

        <div
          className="content-section mt-8 sm:mt-10 fade-up"
          style={{ animationDelay: '500ms', transform: 'translateY(20px)' }}
        >
          <h2 className="!mt-0">Why gold rates vary by city</h2>
          <p>
            Gold prices in Indian cities usually start from a common benchmark published by the Indian Bullion and Jewellers
            Association, or IBJA. IBJA reference rates are widely used across the trade because they reflect wholesale bullion
            pricing for different purities before retail-level additions are applied. That gives jewellers and buyers a base
            number for 24K, 22K, and other purity levels on any given day.
          </p>
          <p>
            From that base, city-level premiums can push the displayed rate slightly higher or lower. Retailers account for
            freight, insurance, secure handling, and the cost of moving bullion into local markets. Transportation and logistics
            may seem minor per gram, but across a supply chain they can affect the final quote, especially in markets that rely
            on a constant inflow of inventory.
          </p>
          <p>
            Demand also matters. When wedding purchases, festive buying, or investment demand rise sharply in a city like
            {cityName}, local dealers may adjust premiums depending on stock availability and replacement cost. That is why two
            cities can track the same national trend yet still show small differences in daily gold rates.
          </p>
          <p>
            The key takeaway for buyers is that the benchmark rate is only the starting point. Final shop prices can vary based
            on purity, city premium, local competition, and inventory conditions on the day you buy.
          </p>
        </div>

        <div
          className="content-section mt-8 sm:mt-10 fade-up"
          style={{ animationDelay: '580ms', transform: 'translateY(20px)' }}
        >
          <h2 className="!mt-0">Buying Guide</h2>
          <p>
            The best time to buy gold depends on your goal. If you are buying jewellery for an event, compare a few days of
            price movement instead of chasing only intraday dips, and keep making charges in view because they often affect your
            total bill more than a small daily fluctuation. If you are buying as an investment, consider staggered purchases so
            you do not commit the full amount at one short-term peak.
          </p>
          <p>
            For purity, 24K gold is closer to pure gold and is preferred for coins, bars, and some investment-oriented
            purchases. Twenty-two karat is slightly less pure but stronger, which makes it the more practical choice for most
            jewellery worn regularly. Choose 24K when purity matters most, and 22K when durability and design flexibility are
            more important.
          </p>
          <p>
            To verify purity, check for a BIS Hallmark, confirm the karat marking, and ask for a detailed invoice that clearly
            separates gold value, wastage, making charges, and GST. Reputed jewellers should also explain weight deductions for
            stones or non-gold components. If you are spending a meaningful amount, ask for a purity test or buyback policy
            before payment so you know exactly what you are getting.
          </p>
        </div>

        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 sm:gap-2">
          <p className="text-xs font-mono" style={{ color: 'var(--text-tertiary)' }}>
            Rates are indicative. Excludes GST & making charges.
          </p>
          <p className="text-xs font-mono" style={{ color: 'var(--text-tertiary)' }}>
            Multi-city indicative rates · GoldRateIndia.live
          </p>
        </div>
      </div>
    </div>
  )
}
