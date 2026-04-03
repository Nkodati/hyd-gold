'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import type { GoldRatesData, CityKey } from '@/components/GoldDashboard'
import { getAllCityContent } from '@/data/cityContent'

type FilterKey = 'all' | CityKey

export default function CityDirectory({ data }: { data: GoldRatesData }) {
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all')

  const cities = useMemo(() => {
    const allCities = getAllCityContent()
    if (activeFilter === 'all') {
      return allCities
    }
    return allCities.filter((city) => city.slug === activeFilter)
  }, [activeFilter])

  return (
    <>
      <div className="directory-filter">
        <button
          type="button"
          onClick={() => setActiveFilter('all')}
          className={`directory-chip ${activeFilter === 'all' ? 'active' : ''}`}
        >
          All cities
        </button>
        {getAllCityContent().map((city) => (
          <button
            key={city.slug}
            type="button"
            onClick={() => setActiveFilter(city.slug)}
            className={`directory-chip ${activeFilter === city.slug ? 'active' : ''}`}
          >
            {city.cityName}
          </button>
        ))}
      </div>

      <div className="city-link-grid">
        {cities.map((city) => {
          const rates = data.cities[city.slug].rates
          return (
            <Link key={city.slug} href={`/city/${city.slug}`} className="city-link-card">
              <div className="blog-card-meta">
                <span>{city.cityName}</span>
                <span>22K ₹{rates['22k'].perGram.toLocaleString('en-IN')}/g</span>
              </div>
              <h3>{city.title}</h3>
              <p>{city.description}</p>
              <div className="city-card-stats">
                <span>24K: ₹{rates['24k'].perGram.toLocaleString('en-IN')}/g</span>
                <span>Silver: ₹{rates.silver.perGram.toLocaleString('en-IN')}/g</span>
              </div>
              <span className="blog-card-link">Open city page</span>
            </Link>
          )
        })}
      </div>
    </>
  )
}
