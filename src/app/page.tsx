import { promises as fs } from 'fs'
import path from 'path'
import BlogPreviewSection from '@/components/BlogPreviewSection'
import GoldDashboard, { type GoldRatesData } from '@/components/GoldDashboard'

async function getRates(): Promise<GoldRatesData> {
  const filePath = path.join(process.cwd(), 'public', 'rates.json')
  const raw = await fs.readFile(filePath, 'utf-8')
  return JSON.parse(raw) as GoldRatesData
}

export default async function Home() {
  const data = await getRates()
  return (
    <>
      <GoldDashboard data={data} />
      <BlogPreviewSection />
    </>
  )
}
