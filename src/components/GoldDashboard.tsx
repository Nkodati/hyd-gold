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
          <h2 className="!mt-0">Understanding Gold Rates in {cityName}</h2>
          <p>
            In India, many jewellers and financial platforms reference benchmark bullion prices that align with Indian Bullion
            and Jewellers Association (IBJA)–style indications. These figures help standardise how 22 karat, 24 karat, and 18
            karat gold are quoted before local taxes, making charges, and stone weights are added at the counter.
          </p>
          <p>
            Twenty-two karat gold is the alloy most commonly used for traditional jewellery; twenty-four karat is purer but
            softer, so it is often priced higher per gram; eighteen karat contains a lower gold percentage and is popular for
            lighter or fashion-forward pieces. The relationship is not arbitrary—purity directly affects both price per gram and
            how durable the piece will be for daily wear.
          </p>
          <p>
            Domestic gold prices respond to international spot rates, currency movement (INR vs USD), import duties, seasonal
            demand (festivals and weddings), and central bank policy. Because {cityName} sits within this national market,
            local display rates typically track the same drivers while reflecting slight regional spreads.
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
