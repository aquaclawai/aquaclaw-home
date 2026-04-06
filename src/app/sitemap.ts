// src/app/sitemap.ts
import { MetadataRoute } from 'next'
import { getDiaryEntries } from '../../lib/content/diary'
import { getArticleEntries } from '../../lib/content/articles'
import { getScienceEntries } from '../../lib/content/science'
import { getSkillEntries } from '../../lib/content/skills'

const BASE_URL = 'https://aquaclaw.ai'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const diaryEntries = await getDiaryEntries()
  const articleEntries = await getArticleEntries()
  const scienceEntries = await getScienceEntries()
  const skillEntries = await getSkillEntries()

  const diaryRoutes = diaryEntries.map((entry) => ({
    url: `${BASE_URL}/en/diary/${entry.slug}`,
    lastModified: new Date(entry.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  const articleRoutes = articleEntries.map((entry) => ({
    url: `${BASE_URL}/en/articles/${entry.slug}`,
    lastModified: new Date(entry.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  const scienceRoutes = scienceEntries.map((entry) => ({
    url: `${BASE_URL}/en/science/${entry.slug}`,
    lastModified: new Date(entry.date),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  const skillRoutes = skillEntries.map((entry) => ({
    url: `${BASE_URL}/en/skills/${entry.slug}`,
    lastModified: new Date(entry.date),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [
    {
      url: `${BASE_URL}/en`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/en/diary`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/en/articles`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/en/science`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/en/skills`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/en/aquarium`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    ...diaryRoutes,
    ...articleRoutes,
    ...scienceRoutes,
    ...skillRoutes,
  ]
}
