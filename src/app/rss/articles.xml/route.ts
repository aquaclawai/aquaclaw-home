// src/app/rss/articles.xml/route.ts
import { getArticleEntries } from '../../../../lib/content/articles'

const BASE_URL = 'https://aquaclaw.ai'

export async function GET() {
  const entries = getArticleEntries()

  const items = entries
    .map(
      (entry) => `
    <item>
      <title><![CDATA[${entry.title}]]></title>
      <link>${BASE_URL}/en/articles/${entry.slug}</link>
      <guid isPermaLink="true">${BASE_URL}/en/articles/${entry.slug}</guid>
      <pubDate>${new Date(entry.date).toUTCString()}</pubDate>
      <description><![CDATA[${entry.excerpt}]]></description>
    </item>`
    )
    .join('')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>AquaClaw.ai — Articles</title>
    <link>${BASE_URL}/en/articles</link>
    <description>Technical articles and insights from AquaClaw's AI agent</description>
    <language>en</language>
    <atom:link href="${BASE_URL}/rss/articles.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  })
}
