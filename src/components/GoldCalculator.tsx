'use client'

import { useMemo, useState } from 'react'
import type { CityKey } from '@/components/GoldDashboard'

type Purity = '24k' | '22k' | '18k'

interface CityCalculatorOption {
  key: CityKey
  name: string
  rates: Record<Purity, number>
}

interface GoldCalculatorProps {
  cityOptions: CityCalculatorOption[]
  initialCity?: CityKey
}

const PURITY_LABELS: Record<Purity, string> = {
  '24k': '24K',
  '22k': '22K',
  '18k': '18K',
}

export default function GoldCalculator({ cityOptions, initialCity }: GoldCalculatorProps) {
  const defaultCity = cityOptions.find((city) => city.key === initialCity) ?? cityOptions[0]
  const [selectedCity, setSelectedCity] = useState<CityKey>(defaultCity.key)
  const [purity, setPurity] = useState<Purity>('22k')
  const [grams, setGrams] = useState('10')
  const [makingCharge, setMakingCharge] = useState('12')
  const activeCity = cityOptions.find((city) => city.key === selectedCity) ?? defaultCity

  const result = useMemo(() => {
    const parsedGrams = Number(grams) || 0
    const parsedMakingCharge = Number(makingCharge) || 0
    const baseRate = activeCity.rates[purity]
    const metalValue = parsedGrams * baseRate
    const makingValue = metalValue * (parsedMakingCharge / 100)
    const gst = (metalValue + makingValue) * 0.03
    const total = metalValue + makingValue + gst

    return {
      metalValue,
      makingValue,
      gst,
      total,
    }
  }, [activeCity.rates, grams, makingCharge, purity])

  const fmt = (value: number) => `₹${Math.round(value).toLocaleString('en-IN')}`

  return (
    <div className="content-section">
      <h2 className="!mt-0">Gold Price Calculator for {activeCity.name}</h2>
      <p>
        Estimate your bill using today&apos;s indicative rates, your planned weight, and an approximate making-charge percentage.
        This is helpful for comparing quotes before you visit a jeweller.
      </p>

      <div className="calculator-grid">
        <label className="calculator-field">
          <span>City</span>
          <select value={selectedCity} onChange={(event) => setSelectedCity(event.target.value as CityKey)}>
            {cityOptions.map((city) => (
              <option key={city.key} value={city.key}>
                {city.name}
              </option>
            ))}
          </select>
        </label>

        <label className="calculator-field">
          <span>Purity</span>
          <select value={purity} onChange={(event) => setPurity(event.target.value as Purity)}>
            {Object.entries(PURITY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <label className="calculator-field">
          <span>Weight (grams)</span>
          <input value={grams} onChange={(event) => setGrams(event.target.value)} inputMode="decimal" />
        </label>

        <label className="calculator-field">
          <span>Making charges (%)</span>
          <input value={makingCharge} onChange={(event) => setMakingCharge(event.target.value)} inputMode="decimal" />
        </label>
      </div>

      <div className="calculator-results">
        <div>
          <span>Metal value</span>
          <strong>{fmt(result.metalValue)}</strong>
        </div>
        <div>
          <span>Making charges</span>
          <strong>{fmt(result.makingValue)}</strong>
        </div>
        <div>
          <span>Estimated GST</span>
          <strong>{fmt(result.gst)}</strong>
        </div>
        <div>
          <span>Estimated total</span>
          <strong>{fmt(result.total)}</strong>
        </div>
      </div>

      <p className="mt-4 text-xs" style={{ color: 'var(--text-tertiary)' }}>
        Using today&apos;s {PURITY_LABELS[purity]} indicative rate for {activeCity.name}: {fmt(activeCity.rates[purity])} per gram.
      </p>
    </div>
  )
}
