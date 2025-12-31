/**
 * RSS Widget Fetcher
 * Fetches and parses RSS feeds at build time using rss-parser
 */

import Parser from 'rss-parser'
import { USER_AGENT } from '../../lib/http'
import type { WidgetFetcher } from '../../types/widget'
import type { RSSData, RSSItem, RSSWidgetConfig } from './types'

// Extended RSS item type for non-standard fields
interface ExtendedRSSItem {
  'itunes:image'?: { href?: string }
  'media:content'?: { url?: string }
  'media:thumbnail'?: { url?: string }
  'dc:creator'?: string
}

/**
 * RSS Widget Fetcher
 * Fetches RSS feed data at build time using rss-parser library
 */
export const rssFetcher: WidgetFetcher<RSSWidgetConfig, RSSData> = async (config) => {
  console.log(`[RSS Fetcher] Fetching feed: ${config.feedUrl}`)

  try {
    const parser = new Parser({
      headers: {
        'User-Agent': USER_AGENT,
      },
    })

    const feed = await parser.parseURL(config.feedUrl)

    // Convert parsed feed to our data structure
    const items: RSSItem[] = feed.items.map((item) => {
      const extItem = item as typeof item & ExtendedRSSItem

      // Extract image from various RSS formats
      let imageUrl: string | undefined

      // Try enclosure (common in podcasts and media feeds)
      if (item.enclosure?.url && item.enclosure.type?.startsWith('image/')) {
        imageUrl = item.enclosure.url
      }

      // Try itunes:image (common in podcast feeds)
      if (!imageUrl && extItem['itunes:image']?.href) {
        imageUrl = extItem['itunes:image'].href
      }

      // Try media:content (common in YouTube and media RSS)
      if (!imageUrl && extItem['media:content']?.url) {
        imageUrl = extItem['media:content'].url
      }

      // Try media:thumbnail
      if (!imageUrl && extItem['media:thumbnail']?.url) {
        imageUrl = extItem['media:thumbnail'].url
      }

      // Extract author
      const author = item.creator || item.author || extItem['dc:creator'] || undefined

      // Extract categories/tags
      let categories: string[] | undefined
      if (item.categories && item.categories.length > 0) {
        categories = item.categories.map((cat) =>
          typeof cat === 'string'
            ? cat
            : (cat as { _?: string; term?: string })._ ||
              (cat as { _?: string; term?: string }).term ||
              String(cat),
        )
      }

      // Extract description based on config
      let description: string | undefined

      if (config.descriptionField) {
        // Use the specified field
        const fieldValue = item[config.descriptionField]
        if (fieldValue) {
          // Strip HTML tags if present
          description = fieldValue.replace(/<[^>]*>/g, '').trim()
        }
      } else {
        // Default behavior: try contentSnippet first, then content
        if (item.contentSnippet) {
          description = item.contentSnippet.trim()
        } else if (item.content) {
          description = item.content.replace(/<[^>]*>/g, '').trim()
        }
      }

      return {
        title: item.title || 'Untitled',
        link: item.link || '#',
        pubDate: item.pubDate || item.isoDate || new Date().toISOString(),
        description,
        image: imageUrl,
        author,
        categories,
      }
    })

    // Apply limit if specified
    const limit = config.limit || 10
    const limitedItems = items.slice(0, limit)

    console.log(`[RSS Fetcher] Successfully fetched ${limitedItems.length} items`)

    return {
      feedTitle: feed.title || config.title || 'RSS Feed',
      items: limitedItems,
    }
  } catch (error) {
    console.error(`[RSS Fetcher] Failed to fetch ${config.feedUrl}:`, error)

    // Return fallback data
    return {
      feedTitle: config.title || 'RSS Feed',
      items: [],
    }
  }
}
