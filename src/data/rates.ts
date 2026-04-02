import { promises as fs } from 'fs'
import path from 'path'
import type { GoldRatesData, CityKey } from '@/components/GoldDashboard'

export async function getRates(): Promise<GoldRatesData> {
  const filePath = path.join(process.cwd(), 'public', 'rates.json')
  const raw = await fs.readFile(filePath, 'utf-8')
  return JSON.parse(raw) as GoldRatesData
}

export async function getCityRates(city: CityKey) {
  const data = await getRates()
  return {
    data,
    city,
    cityData: data.cities[city],
  }
}
