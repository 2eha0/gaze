/**
 * Hacker News Widget Type Definitions
 */

import type { WidgetConfig } from '../../types/widget'

/**
 * Hacker News Widget Configuration
 */
export interface HackerNewsWidgetConfig extends WidgetConfig {
  type: 'hacker-news'
  limit?: number // Maximum number of posts to show (default: 15)
  collapseAfter?: number // How many posts visible before "SHOW MORE" button (default: 5, -1 to never collapse)
  sortBy?: 'top' | 'new' | 'best' // Sort order for posts (default: top)
  extraSortBy?: 'engagement' // Additional sort applied on top of sortBy
  commentsUrlTemplate?: string // Custom URL template for comments (default: https://news.ycombinator.com/item?id={POST-ID})
}

/**
 * Hacker News Post/Story
 */
export interface HackerNewsStory {
  id: number
  title: string
  url: string
  commentsUrl: string
  domain: string
  score: number
  commentCount: number
  timePosted: string // ISO date string
}

/**
 * Hacker News Data Structure
 */
export interface HackerNewsData {
  stories: HackerNewsStory[]
}
