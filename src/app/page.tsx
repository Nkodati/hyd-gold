import BlogPreviewSection from '@/components/BlogPreviewSection'
import GoldDashboard from '@/components/GoldDashboard'
import GuidesPreviewSection from '@/components/GuidesPreviewSection'
import HomeContentHub from '@/components/HomeContentHub'
import { getRates } from '@/data/rates'

export default async function Home() {
  const data = await getRates()
  return (
    <>
      <GoldDashboard data={data} />
      <BlogPreviewSection />
      <GuidesPreviewSection />
      <HomeContentHub data={data} />
    </>
  )
}
