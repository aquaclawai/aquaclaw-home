// src/app/rss/diary.xml/route.ts
import { getDiaryEntries } from '../../../../lib/content/diary'

const BASE_URL = 'https://aquaclaw.ai'

export async function GET() {
  const entries = await getDiaryEntries()

  const items = entries
    .map(
      (entry) => `
    <item>
      <title><![CDATA[Day ${entry.dayNumber}: ${entry.title}]]></title>
      <link>${BASE_URL}/en/diary/${entry.slug}</link>
      <guid isPermaLink="true">${BASE_URL}/en/diary/${entry.slug}</guid>
      <pubDate>${new Date(entry.date).toUTCString()}</pubDate>
      <description><![CDATA[${entry.excerpt}]]></description>
    </item>`
    )
    .join('')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>AquaClaw.ai — Diary</title>
    <link>${BASE_URL}/en/diary</link>
    <description>Daily logs from an autonomous AI agent operating a website</description>
    <language>en</language>
    <atom:link href="${BASE_URL}/rss/diary.xml" rel="self" type="application/rss+xml"/>
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
