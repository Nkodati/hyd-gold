'use client'

import { useState } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts'

interface TrendData {
  labels: string[]
  '22k': number[]
  '24k': number[]
  '18k': number[]
}

const KARATS = ['22k', '24k', '18k'] as const
type Karat = typeof KARATS[number]

const COLORS: Record<Karat, string> = {
  '22k': '#FFD14D',
  '24k': '#60a5fa',
  '18k': '#4ade80',
}

const LABELS: Record<Karat, string> = {
  '22k': '22K',
  '24k': '24K',
  '18k': '18K',
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: '#1E1E1E',
          border: '0.5px solid rgba(255,193,7,0.2)',
          borderRadius: '10px',
          padding: '10px 14px',
          fontFamily: 'var(--font-mono)',
        }}
      >
        <p style={{ color: 'rgba(245,240,232,0.4)', fontSize: '11px', marginBottom: '4px' }}>{label}</p>
        <p style={{ color: payload[0].color, fontSize: '15px', fontWeight: 500 }}>
          ₹{payload[0].value.toLocaleString('en-IN')}/g
        </p>
      </div>
    )
  }
  return null
}

export default function TrendChart({ data }: { data: TrendData }) {
  const [active, setActive] = useState<Karat>('22k')

  const chartData = data.labels.map((label, i) => ({
    date: label,
    value: data[active][i],
  }))

  const color = COLORS[active]
  const min = Math.min(...data[active])
  const max = Math.max(...data[active])
  const pad = (max - min) * 0.15

  return (
    <div className="card-glass rounded-2xl p-4 sm:p-6">
      {/* Header row — stacks on mobile */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 mb-5 sm:mb-6">
        <div>
          <h2 className="text-sm sm:text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
            Monthly trend
          </h2>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
            Feb 18 — Mar 18, 2026 · per gram
          </p>
        </div>

        {/* Tabs — full width on mobile, auto on desktop */}
        <div className="grid grid-cols-3 gap-2 sm:flex sm:gap-2 sm:w-auto">
          {KARATS.map(k => (
            <button
              key={k}
              onClick={() => setActive(k)}
              className="text-xs font-mono py-2 sm:px-3 sm:py-1.5 rounded-lg border transition-all duration-200"
              style={
                active === k
                  ? { borderColor: `${COLORS[k]}55`, color: COLORS[k], background: `${COLORS[k]}14` }
                  : { borderColor: 'rgba(255,255,255,0.06)', color: 'rgba(245,240,232,0.4)', background: 'transparent' }
              }
            >
              {LABELS[k]}
            </button>
          ))}
        </div>
      </div>

      {/* Chart — shorter on mobile */}
      <div className="h-44 sm:h-60">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 8, right: 4, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.25} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="4 4" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 9, fill: 'rgba(245,240,232,0.3)', fontFamily: 'var(--font-mono)' }}
              axisLine={false}
              tickLine={false}
              interval={3}
            />
            <YAxis
              domain={[min - pad, max + pad]}
              tick={{ fontSize: 9, fill: 'rgba(245,240,232,0.3)', fontFamily: 'var(--font-mono)' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={v => `₹${(v / 1000).toFixed(1)}k`}
              width={46}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: color, strokeWidth: 0.5, strokeDasharray: '3 3' }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={1.5}
              fill="url(#areaGrad)"
              dot={false}
              activeDot={{ r: 4, fill: color, strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
