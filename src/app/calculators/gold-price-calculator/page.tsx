import type { Metadata } from 'next'
import GoldCalculator from '@/components/GoldCalculator'
import { getRates } from '@/data/rates'

export const metadata: Metadata = {
  title: 'Gold Price Calculator — Gold Rate India',
  description:
    'Estimate your gold purchase bill using today’s rates, weight, and making charges. Useful for jewellery buyers comparing quotes.',
}

export default async function GoldPriceCalculatorPage() {
  const data = await getRates()
  const baseCity = data.cities.hyderabad

  return (
    <div className="noise-bg grid-bg min-h-screen">
      <main className="static-page">
        <p className="blog-eyebrow">Calculator</p>
        <h1>Gold Price Calculator</h1>
        <p>
          This calculator estimates how a jewellery bill can grow from the daily metal rate once making charges and GST are
          included. It is not a binding quote, but it helps readers compare stores more intelligently.
        </p>

        <GoldCalculator
          cityName={baseCity.name}
          rates={{
            '24k': baseCity.rates['24k'].perGram,
            '22k': baseCity.rates['22k'].perGram,
            '18k': baseCity.rates['18k'].perGram,
          }}
        />

        <h2>How to use this calculator</h2>
        <p>
          Start by selecting the purity you plan to buy, then enter the approximate weight and a making-charge percentage. The
          output gives you an indicative metal value, making-charge amount, GST estimate, and total. This is especially useful
          when two jewellers quote the same daily rate but structure the bill differently.
        </p>
        <p>
          Remember that some invoices also include stone charges, wastage, or design-specific labour. Those extras will not
          always appear in a simple metal-rate comparison, which is why detailed invoices matter so much.
        </p>
      </main>
    </div>
  )
}
