/**
 * RSS Widget Type Definitions
 */

import type { WidgetConfig } from '../../types/widget'

/**
 * RSS Widget Style
 * - vertical-list: Compact list, suitable for full and small columns
 * - detailed-list: Detailed view with image, description, tags, suitable for full columns
 */
export type RSSWidgetStyle = 'vertical-list' | 'detailed-list'

/**
 * RSS Widget Configuration
 */
export interface RSSWidgetConfig extends WidgetConfig {
  type: 'rss'
  feedUrl: string // RSS feed URL
  limit?: number // Maximum number of items to fetch (default: 10)
  collapseAfter?: number // How many articles visible before "SHOW MORE" button (-1 to never collapse)
  preserveOrder?: boolean // Preserve feed order instead of sorting by date
  singleLineTitles?: boolean // Truncate titles to one line (only for vertical-list)
  style?: RSSWidgetStyle // Widget style (default: vertical-list)
  hideDate?: boolean // Hide date display (useful for feeds without proper pubDate like trending feeds)
  descriptionField?: 'contentSnippet' | 'content' | 'summary' // Which field to use for description (default: contentSnippet, then content)
}

/**
 * RSS Feed Item
 */
export interface RSSItem {
  title: string
  link: string
  pubDate: string
  description?: string
  image?: string // Cover image URL (from enclosure, media:content, or itunes:image)
  author?: string // Author name
  categories?: string[] // Categories/tags
}

/**
 * RSS Feed Data Structure
 */
export interface RSSData {
  feedTitle: string
  items: RSSItem[]
}
