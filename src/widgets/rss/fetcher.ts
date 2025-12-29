/**
 * RSS Widget Fetcher
 * Fetches and parses RSS feeds at build time
 */

import type { WidgetFetcher } from '../../types/widget'
import type { RSSData, RSSItem, RSSWidgetConfig } from './types'

/**
 * Simple RSS parser using basic XML parsing
 * In production, consider using a library like 'rss-parser'
 */
async function parseRSS(xmlText: string): Promise<RSSData> {
  // Simple regex-based parsing (for MVP)
  // Note: This is a basic implementation. For production, use a proper XML parser

  const titleMatch = xmlText.match(/<title>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/title>/i)
  const feedTitle = titleMatch ? titleMatch[1].trim() : 'RSS Feed'

  const items: RSSItem[] = []
  const itemRegex = /<item>([\s\S]*?)<\/item>/gi
  let itemMatch: RegExpExecArray | null = itemRegex.exec(xmlText)

  while (itemMatch !== null) {
    const itemContent = itemMatch[1]

    const titleMatch = itemContent.match(/<title>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/title>/i)
    const linkMatch = itemContent.match(/<link>(.*?)<\/link>/i)
    const pubDateMatch = itemContent.match(/<pubDate>(.*?)<\/pubDate>/i)
    const descriptionMatch = itemContent.match(
      /<description>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/description>/i,
    )

    if (titleMatch && linkMatch) {
      items.push({
        title: titleMatch[1].trim(),
        link: linkMatch[1].trim(),
        pubDate: pubDateMatch ? pubDateMatch[1].trim() : new Date().toISOString(),
        description: descriptionMatch
          ? descriptionMatch[1].trim().replace(/<[^>]*>/g, '')
          : undefined,
      })
    }

    itemMatch = itemRegex.exec(xmlText)
  }

  return {
    feedTitle,
    items,
  }
}

/**
 * RSS Widget Fetcher
 * Fetches RSS feed data at build time
 */
export const rssFetcher: WidgetFetcher<RSSWidgetConfig, RSSData> = async (config) => {
  console.log(`[RSS Fetcher] Fetching feed: ${config.feedUrl}`)

  try {
    const response = await fetch(config.feedUrl, {
      headers: {
        'User-Agent': 'Gaze-Dashboard/1.0',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const xmlText = await response.text()
    const data = await parseRSS(xmlText)

    // Apply limit if specified
    const limit = config.limit || 10
    data.items = data.items.slice(0, limit)

    console.log(`[RSS Fetcher] Successfully fetched ${data.items.length} items`)
    return data
  } catch (error) {
    console.error(`[RSS Fetcher] Failed to fetch ${config.feedUrl}:`, error)

    // Return fallback data
    return {
      feedTitle: config.title || 'RSS Feed',
      items: [],
    }
  }
}
