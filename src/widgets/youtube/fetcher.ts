/**
 * YouTube Widget Fetcher
 * Fetches recent videos from YouTube channels using RSS feeds at build time
 */

import Parser from 'rss-parser'
import { USER_AGENT } from '../../lib/http'
import type { WidgetFetcher } from '../../types/widget'
import type { YouTubeData, YouTubeVideo, YouTubeWidgetConfig } from './types'

/**
 * YouTube Widget Fetcher
 * Fetches video data from multiple YouTube channels via RSS feeds
 */
export const youtubeFetcher: WidgetFetcher<YouTubeWidgetConfig, YouTubeData> = async (config) => {
  console.log(`[YouTube Fetcher] Fetching videos from ${config.channels.length} channels`)

  try {
    const parser = new Parser({
      headers: {
        'User-Agent': USER_AGENT,
      },
    })

    // Fetch videos from all channels
    const videoPromises = config.channels.map(async (channelId) => {
      try {
        const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`
        console.log(`[YouTube Fetcher] Fetching channel: ${channelId}`)

        const feed = await parser.parseURL(feedUrl)

        // Extract videos from feed
        const videos: YouTubeVideo[] = feed.items.map((item) => {
          // Extract video ID from link
          // Supports: https://www.youtube.com/watch?v=VIDEO_ID
          //           https://www.youtube.com/shorts/VIDEO_ID
          let videoId = ''
          if (item.link?.includes('/shorts/')) {
            videoId = item.link.split('/shorts/')[1]?.split('?')[0] || ''
          } else if (item.link?.includes('v=')) {
            videoId = item.link.split('v=')[1]?.split('&')[0] || ''
          }

          // Extract thumbnail from media fields
          const itemData = item as unknown as Record<string, unknown>
          let thumbnail = ''

          // YouTube RSS feeds have media:group with media:thumbnail
          const mediaGroup = itemData['media:group'] as Record<string, unknown> | undefined
          if (mediaGroup) {
            const mediaThumbnail = mediaGroup['media:thumbnail'] as
              | { $: { url: string } }
              | undefined
            if (mediaThumbnail?.$?.url) {
              thumbnail = mediaThumbnail.$.url
            }
          }

          // Fallback: construct thumbnail URL from video ID if not found
          if (!thumbnail && videoId) {
            thumbnail = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
          }

          // Get channel title from author or feed title
          const channelTitle = (itemData.author as string) || feed.title || 'Unknown Channel'

          return {
            title: item.title || 'Untitled Video',
            videoId,
            channelTitle,
            thumbnail,
            publishedAt: item.pubDate || item.isoDate || new Date().toISOString(),
          }
        })

        console.log(`[YouTube Fetcher] Fetched ${videos.length} videos from ${channelId}`)
        return videos
      } catch (error) {
        console.error(`[YouTube Fetcher] Failed to fetch channel ${channelId}:`, error)
        return [] // Return empty array for failed channels
      }
    })

    // Wait for all channels to be fetched
    const allVideosArrays = await Promise.all(videoPromises)

    // Flatten and combine all videos
    const allVideos = allVideosArrays.flat()

    // Sort by published date (newest first)
    allVideos.sort((a, b) => {
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    })

    // Apply limit (default: 8 total videos)
    const limit = config.limit || 8
    const limitedVideos = allVideos.slice(0, limit)

    console.log(
      `[YouTube Fetcher] Successfully fetched ${limitedVideos.length} videos total (from ${allVideos.length} available)`,
    )

    return {
      videos: limitedVideos,
    }
  } catch (error) {
    console.error('[YouTube Fetcher] Failed to fetch YouTube videos:', error)

    // Return empty data on error
    return {
      videos: [],
    }
  }
}
