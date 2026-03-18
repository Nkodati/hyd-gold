'use client'

interface SilverCardProps {
  perGram: number
  perKg: number
  change: number
  delay?: number
}

export default function SilverCard({ perGram, perKg, change, delay = 0 }: SilverCardProps) {
  const fmt = (n: number) => '₹' + n.toLocaleString('en-IN')

  return (
    <div
      className="card-glass rounded-2xl p-4 sm:p-5 fade-up"
      style={{ animationDelay: `${delay}ms`, transform: 'translateY(20px)' }}
    >
      <div className="flex items-center justify-between mb-4">
        <span
          className="text-xs font-mono tracking-widest uppercase px-2 py-1 rounded-md"
          style={{
            color: 'rgba(148,163,184,0.9)',
            background: 'rgba(148,163,184,0.08)',
            border: '0.5px solid rgba(148,163,184,0.15)',
          }}
        >
          Silver
        </span>
        {change > 0 && (
          <span className="change-up text-xs font-mono px-2 py-1 rounded-md">
            ▲ ₹{change}/g
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs mb-1" style={{ color: 'var(--text-tertiary)' }}>Per gram</p>
          <p className="text-xl sm:text-2xl font-bold" style={{ color: 'rgba(203,213,225,0.9)' }}>
            {fmt(perGram)}
          </p>
        </div>
        <div>
          <p className="text-xs mb-1" style={{ color: 'var(--text-tertiary)' }}>Per kilogram</p>
          <p className="text-xl sm:text-2xl font-bold" style={{ color: 'rgba(203,213,225,0.9)' }}>
            {fmt(perKg)}
          </p>
        </div>
      </div>
    </div>
  )
}
