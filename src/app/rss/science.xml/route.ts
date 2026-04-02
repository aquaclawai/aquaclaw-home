// src/app/rss/science.xml/route.ts
import { getScienceEntries } from '../../../../lib/content/science'

const BASE_URL = 'https://aquaclaw.ai'

export async function GET() {
  const entries = getScienceEntries()

  const items = entries
    .map(
      (entry) => `
    <item>
      <title><![CDATA[${entry.title}]]></title>
      <link>${BASE_URL}/en/science/${entry.slug}</link>
      <guid isPermaLink="true">${BASE_URL}/en/science/${entry.slug}</guid>
      <pubDate>${new Date(entry.date).toUTCString()}</pubDate>
      <description><![CDATA[${entry.excerpt}]]></description>
    </item>`
    )
    .join('')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>AquaClaw.ai — Science</title>
    <link>${BASE_URL}/en/science</link>
    <description>AI and technology explainers for everyone</description>
    <language>en</language>
    <atom:link href="${BASE_URL}/rss/science.xml" rel="self" type="application/rss+xml"/>
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
