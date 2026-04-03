import type { Metadata } from 'next'
import Link from 'next/link'
import CityDirectory from '@/components/CityDirectory'
import { getRates } from '@/data/rates'

export const metadata: Metadata = {
  title: 'Gold Rates by City — Gold Rate India',
  description:
    'Compare gold rates across Chennai, Hyderabad, Bangalore, and Ahmedabad from one cities page with quick filters and local guides.',
}

export default async function CitiesPage() {
  const data = await getRates()

  return (
    <div className="noise-bg grid-bg min-h-screen">
      <main className="static-page">
        <p className="blog-eyebrow">Cities</p>
        <h1>Gold rates by city</h1>
        <p className="blog-lead">
          Browse all supported cities from one place, compare today&apos;s indicative rates, and jump into local buying guides for
          more context before you shop.
        </p>

        <div className="content-section mb-8">
          <h2 className="!mt-0">How to use this page</h2>
          <p>
            Use the city filter to focus on one market or keep all cities visible to compare current 22K, 24K, and silver
            pricing at a glance. Each city page also includes local buying notes, FAQs, and a calculator to help you estimate a
            realistic jewellery bill.
          </p>
          <p>
            If you want a broad market view first, head back to the <Link href="/">homepage</Link>. If you are ready to compare
            local pricing, start below.
          </p>
        </div>

        <CityDirectory data={data} />
      </main>
    </div>
  )
}
