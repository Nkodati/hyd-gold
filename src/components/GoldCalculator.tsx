'use client'

import { useMemo, useState } from 'react'

type Purity = '24k' | '22k' | '18k'

interface GoldCalculatorProps {
  rates: Record<Purity, number>
  cityName: string
}

const PURITY_LABELS: Record<Purity, string> = {
  '24k': '24K',
  '22k': '22K',
  '18k': '18K',
}

export default function GoldCalculator({ rates, cityName }: GoldCalculatorProps) {
  const [purity, setPurity] = useState<Purity>('22k')
  const [grams, setGrams] = useState('10')
  const [makingCharge, setMakingCharge] = useState('12')

  const result = useMemo(() => {
    const parsedGrams = Number(grams) || 0
    const parsedMakingCharge = Number(makingCharge) || 0
    const baseRate = rates[purity]
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
  }, [grams, makingCharge, purity, rates])

  const fmt = (value: number) => `₹${Math.round(value).toLocaleString('en-IN')}`

  return (
    <div className="content-section">
      <h2 className="!mt-0">Gold Price Calculator for {cityName}</h2>
      <p>
        Estimate your bill using today&apos;s indicative rates, your planned weight, and an approximate making-charge percentage.
        This is helpful for comparing quotes before you visit a jeweller.
      </p>

      <div className="calculator-grid">
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
    </div>
  )
}
