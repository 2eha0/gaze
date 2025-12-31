/**
 * Lobsters Widget Fetcher
 * Fetches posts from Lobsters API during build time
 */

import { httpFetch } from '../../lib/http'
import { extractDomain } from '../../lib/urlUtils'
import type { WidgetFetcher } from '../../types/widget'
import type { LobstersData, LobstersStory, LobstersWidgetConfig } from './types'

interface LobstersPostResponse {
  created_at: string
  title: string
  url: string
  score: number
  comment_count: number
  comments_url: string
  tags: string[]
}

/**
 * Build the feed URL based on configuration
 */
function buildFeedUrl(config: LobstersWidgetConfig): string {
  // If custom URL is provided, use it directly
  if (config.customUrl) {
    return config.customUrl
  }

  // Normalize instance URL
  let instanceUrl = config.instanceUrl || 'https://lobste.rs/'
  instanceUrl = `${instanceUrl.replace(/\/+$/, '')}/`

  // Determine sort order (API uses 'hottest'/'newest' instead of 'hot'/'new')
  const sortBy = config.sortBy || 'hot'
  const apiSortBy = sortBy === 'new' ? 'newest' : 'hottest'

  // Build URL based on tags
  if (config.tags && config.tags.length > 0) {
    const tagsStr = config.tags.join(',')
    return `${instanceUrl}t/${tagsStr}.json`
  }

  return `${instanceUrl}${apiSortBy}.json`
}

export const lobstersFetcher: WidgetFetcher<LobstersWidgetConfig, LobstersData> = async (
  config,
) => {
  const feedUrl = buildFeedUrl(config)
  console.log(`[Lobsters Fetcher] Fetching from: ${feedUrl}`)

  try {
    const response = await httpFetch(feedUrl)

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const posts: LobstersPostResponse[] = await response.json()

    const stories: LobstersStory[] = posts.map((post) => ({
      title: post.title,
      url: post.url || post.comments_url, // Some posts are text-only and have no URL
      commentsUrl: post.comments_url,
      domain: extractDomain(post.url),
      score: post.score,
      commentCount: post.comment_count,
      timePosted: post.created_at,
      tags: post.tags || [],
    }))

    // Apply limit
    const limit = config.limit || 15
    const limitedStories = stories.slice(0, limit)

    console.log(`[Lobsters Fetcher] Fetched ${limitedStories.length} stories`)

    return {
      stories: limitedStories,
    }
  } catch (error) {
    console.error(`[Lobsters Fetcher] Failed to fetch from ${feedUrl}:`, error)
    return {
      stories: [],
    }
  }
}
