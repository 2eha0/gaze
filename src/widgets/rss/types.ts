/**
 * RSS Widget Type Definitions
 */

import type { WidgetConfig } from '../../types/widget'

/**
 * RSS Widget Configuration
 */
export interface RSSWidgetConfig extends WidgetConfig {
  type: 'rss'
  feedUrl: string // RSS feed URL
  limit?: number // Maximum number of items to fetch (default: 10)
}

/**
 * RSS Feed Item
 */
export interface RSSItem {
  title: string
  link: string
  pubDate: string
  description?: string
}

/**
 * RSS Feed Data Structure
 */
export interface RSSData {
  feedTitle: string
  items: RSSItem[]
}
