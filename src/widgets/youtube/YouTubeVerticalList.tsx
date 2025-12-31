/**
 * YouTube Vertical List Component
 * Compact list style showing thumbnail, title, channel, and time
 */

import { useState } from 'react'
import { formatRelativeTime } from '../../lib/dateUtils'
import type { YouTubeVideo } from './types'

interface YouTubeVerticalListProps {
  videos: YouTubeVideo[]
  collapseAfter: number
}

export function YouTubeVerticalList({ videos, collapseAfter }: YouTubeVerticalListProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const shouldCollapse = collapseAfter !== -1 && videos.length > collapseAfter
  const visibleVideos = shouldCollapse && !isExpanded ? videos.slice(0, collapseAfter) : videos
  const hiddenCount = shouldCollapse ? videos.length - collapseAfter : 0

  if (videos.length === 0) {
    return (
      <div className="empty-state text-center py-6">
        <p className="text-white/40 text-sm">No videos available</p>
      </div>
    )
  }

  return (
    <div className="youtube-vertical-list">
      <div className="youtube-items space-y-2">
        {visibleVideos.map((video) => (
          <article
            key={video.videoId}
            className="youtube-item"
          >
            <a
              href={`https://www.youtube.com/watch?v=${video.videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex gap-3 py-1.5 px-2 -mx-2 hover:bg-white/5 rounded transition-colors group"
            >
              <div className="shrink-0 w-24 aspect-video bg-zinc-800/50 rounded overflow-hidden">
                {video.thumbnail ? (
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    width="96"
                    height="54"
                  />
                ) : (
                  <div className="w-full h-full bg-linear-to-br from-zinc-800/30 to-zinc-900/50" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm widget-link line-clamp-2">{video.title}</h3>
                <div className="flex items-center gap-1 mt-1 text-xs text-white/40">
                  <span className="truncate">{video.channelTitle}</span>
                  <span>·</span>
                  <time className="shrink-0">{formatRelativeTime(video.publishedAt)}</time>
                </div>
              </div>
            </a>
          </article>
        ))}
      </div>

      {shouldCollapse && hiddenCount > 0 && (
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-3 text-xs text-white/40 hover:text-white/60 uppercase tracking-wider transition-colors"
        >
          {isExpanded ? 'Show less' : `Show ${hiddenCount} more`}
        </button>
      )}
    </div>
  )
}
