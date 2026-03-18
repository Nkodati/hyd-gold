'use client'

interface RateCardProps {
  karat: string
  label: string
  perGram: number
  per10g?: number
  change: number
  delay?: number
  accent?: boolean
}

export default function RateCard({ karat, label, perGram, per10g, change, delay = 0, accent = false }: RateCardProps) {
  const fmt = (n: number) => '₹' + n.toLocaleString('en-IN')

  return (
    <div
      className="card-glass rounded-2xl p-4 sm:p-5 relative overflow-hidden fade-up"
      style={{ animationDelay: `${delay}ms`, transform: 'translateY(20px)' }}
    >
      {accent && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at top left, rgba(255,193,7,0.07) 0%, transparent 60%)' }}
        />
      )}

      {/* Mobile: single row. Desktop: stacked */}
      <div className="flex sm:flex-col gap-3 sm:gap-0">

        {/* Top row — badge + change */}
        <div className="flex items-center justify-between sm:mb-4 min-w-0 flex-1 sm:flex-none">
          <span
            className="text-xs font-mono tracking-widest uppercase px-2 py-1 rounded-md shrink-0"
            style={{
              color: accent ? '#FFD14D' : 'var(--text-tertiary)',
              background: accent ? 'rgba(255,193,7,0.1)' : 'var(--surface-3)',
              border: `0.5px solid ${accent ? 'rgba(255,193,7,0.25)' : 'var(--border-dim)'}`,
            }}
          >
            {karat}
          </span>
          {change > 0 && (
            <span className="change-up text-xs font-mono px-2 py-1 rounded-md ml-2 shrink-0">
              ▲ {fmt(change)}
            </span>
          )}
        </div>

        {/* Price block */}
        <div className="flex-1 sm:flex-none">
          <p className="text-xs mb-0.5 hidden sm:block" style={{ color: 'var(--text-tertiary)' }}>{label}</p>
          <p
            className="text-xl sm:text-3xl font-bold tracking-tight leading-none"
            style={{ color: accent ? '#FFD14D' : 'var(--text-primary)' }}
          >
            {fmt(perGram)}
            <span className="text-xs sm:text-sm font-normal ml-1" style={{ color: 'var(--text-tertiary)' }}>/g</span>
          </p>
          <p className="text-xs mt-0.5 sm:hidden" style={{ color: 'var(--text-tertiary)' }}>{label}</p>
        </div>

        {/* Per 10g — hidden on mobile, shown on desktop */}
        {per10g && (
          <div
            className="hidden sm:flex mt-3 pt-3 items-center justify-between"
            style={{ borderTop: '0.5px solid var(--border-dim)' }}
          >
            <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Per 10g</span>
            <span className="text-sm font-mono font-medium" style={{ color: 'var(--text-secondary)' }}>
              {fmt(per10g)}
            </span>
          </div>
        )}

        {/* Per 10g — mobile inline */}
        {per10g && (
          <div className="sm:hidden text-right shrink-0">
            <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>per 10g</p>
            <p className="text-sm font-mono font-medium" style={{ color: 'var(--text-secondary)' }}>
              {fmt(per10g)}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
