import { MetadataRoute } from 'next'
import { getAllPosts } from '@/data/blogPosts'
import { getAllCityContent } from '@/data/cityContent'
import { getAllGuides } from '@/data/guides'

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts()
  const cities = getAllCityContent()
  const guides = getAllGuides()

  return [
    {
      url: 'https://goldrateindia.live',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: 'https://goldrateindia.live/faq',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: 'https://goldrateindia.live/city',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: 'https://goldrateindia.live/guides',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    ...guides.map((guide) => ({
      url: `https://goldrateindia.live/guides/${guide.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
    {
      url: 'https://goldrateindia.live/editorial-policy',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: 'https://goldrateindia.live/calculators/gold-price-calculator',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    ...cities.map((city) => ({
      url: `https://goldrateindia.live/city/${city.slug}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    })),
    {
      url: 'https://goldrateindia.live/blog',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    ...posts.map((post) => ({
      url: `https://goldrateindia.live/blog/${post.slug}`,
      lastModified: new Date(post.publishedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
    {
      url: 'https://goldrateindia.live/about',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: 'https://goldrateindia.live/privacy-policy',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: 'https://goldrateindia.live/contact',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ]
}
