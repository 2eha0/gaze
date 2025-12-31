/**
 * Hacker News Widget Fetcher
 * Fetches posts from Hacker News Firebase API during build time
 * Based on the Go implementation from Glance
 */

import { httpFetch } from '../../lib/http'
import { extractDomain } from '../../lib/urlUtils'
import type { WidgetFetcher } from '../../types/widget'
import type { HackerNewsData, HackerNewsStory, HackerNewsWidgetConfig } from './types'

/**
 * Hacker News API response for a single post
 */
interface HackerNewsPostResponse {
  id: number
  score: number
  title: string
  url?: string
  descendants: number // comment count
  time: number // Unix timestamp
}

/**
 * Fetch post IDs from Hacker News API
 */
async function fetchPostIds(sortBy: string): Promise<number[]> {
  const response = await httpFetch(`https://hacker-news.firebaseio.com/v0/${sortBy}stories.json`)

  if (!response.ok) {
    throw new Error(`Failed to fetch post IDs: HTTP ${response.status}`)
  }

  return response.json()
}

/**
 * Fetch a single post by ID
 */
async function fetchPost(id: number): Promise<HackerNewsPostResponse | null> {
  try {
    const response = await httpFetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)

    if (!response.ok) {
      console.error(`[HackerNews Fetcher] Failed to fetch post ${id}: HTTP ${response.status}`)
      return null
    }

    return response.json()
  } catch (error) {
    console.error(`[HackerNews Fetcher] Failed to fetch post ${id}:`, error)
    return null
  }
}

/**
 * Fetch multiple posts in parallel with concurrency limit
 */
async function fetchPosts(
  postIds: number[],
  commentsUrlTemplate: string,
): Promise<HackerNewsStory[]> {
  // Fetch posts in parallel (up to 30 concurrent requests like Go version)
  const CONCURRENCY = 30
  const stories: HackerNewsStory[] = []

  for (let i = 0; i < postIds.length; i += CONCURRENCY) {
    const batch = postIds.slice(i, i + CONCURRENCY)
    const results = await Promise.all(batch.map((id) => fetchPost(id)))

    for (const post of results) {
      if (!post) continue

      // Build comments URL
      let commentsUrl: string
      if (commentsUrlTemplate) {
        commentsUrl = commentsUrlTemplate.replace('{POST-ID}', String(post.id))
      } else {
        commentsUrl = `https://news.ycombinator.com/item?id=${post.id}`
      }

      stories.push({
        id: post.id,
        title: post.title,
        url: post.url || commentsUrl, // Some posts are text-only (Ask HN, Show HN, etc.)
        commentsUrl,
        domain: extractDomain(post.url || ''),
        score: post.score,
        commentCount: post.descendants || 0,
        timePosted: new Date(post.time * 1000).toISOString(),
      })
    }
  }

  return stories
}

/**
 * Calculate engagement score for a post
 * Prioritizes posts with high points and comments, with recency bonus
 */
function calculateEngagement(story: HackerNewsStory): number {
  const ageHours = (Date.now() - new Date(story.timePosted).getTime()) / (1000 * 60 * 60)
  const ageDecay = Math.max(1, ageHours / 6) // Decay factor based on age
  return (story.score + story.commentCount * 2) / ageDecay
}

/**
 * Sort stories by engagement score
 */
function sortByEngagement(stories: HackerNewsStory[]): HackerNewsStory[] {
  return [...stories].sort((a, b) => calculateEngagement(b) - calculateEngagement(a))
}

export const hackerNewsFetcher: WidgetFetcher<HackerNewsWidgetConfig, HackerNewsData> = async (
  config,
) => {
  // Validate and set defaults
  const sortBy = (['top', 'new', 'best'] as const).includes(config.sortBy as 'top' | 'new' | 'best')
    ? (config.sortBy as 'top' | 'new' | 'best')
    : 'top'
  const limit = config.limit && config.limit > 0 ? config.limit : 15
  const commentsUrlTemplate = config.commentsUrlTemplate || ''

  console.log(`[HackerNews Fetcher] Fetching ${sortBy} stories...`)

  try {
    // Fetch post IDs
    const postIds = await fetchPostIds(sortBy)

    // Fetch more posts than needed to account for failures and extra sorting
    const fetchLimit = Math.min(postIds.length, 40)
    const limitedIds = postIds.slice(0, fetchLimit)

    // Fetch post details
    let stories = await fetchPosts(limitedIds, commentsUrlTemplate)

    if (stories.length === 0) {
      console.warn('[HackerNews Fetcher] No stories fetched')
      return { stories: [] }
    }

    // Apply extra sorting if requested
    if (config.extraSortBy === 'engagement') {
      stories = sortByEngagement(stories)
    }

    // Apply limit
    const limitedStories = stories.slice(0, limit)

    console.log(`[HackerNews Fetcher] Fetched ${limitedStories.length} stories`)

    return {
      stories: limitedStories,
    }
  } catch (error) {
    console.error('[HackerNews Fetcher] Failed to fetch stories:', error)
    return {
      stories: [],
    }
  }
}
