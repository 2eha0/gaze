/**
 * YouTube Grid Cards Component
 * Grid layout with video cards that can collapse after specified rows
 */

import { useState } from 'react'
import { formatRelativeTime } from '../../lib/dateUtils'
import type { YouTubeVideo } from './types'

interface YouTubeGridCardsProps {
  videos: YouTubeVideo[]
  collapseAfter: number
}

export function YouTubeGridCards({ videos, collapseAfter }: YouTubeGridCardsProps) {
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
    <div className="youtube-grid-cards">
      <div
        className="gap-4"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        }}
      >
        {visibleVideos.map((video) => (
          <article
            key={video.videoId}
            className="youtube-card"
          >
            <a
              href={`https://www.youtube.com/watch?v=${video.videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block group"
            >
              <div className="aspect-video bg-zinc-800/50 rounded-md mb-2 relative overflow-hidden border border-[#2a2a2a]">
                {video.thumbnail ? (
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    width="200"
                    height="113"
                  />
                ) : (
                  <div className="absolute inset-0 bg-linear-to-br from-zinc-800/30 to-zinc-900/50 group-hover:from-zinc-700/30 transition-colors" />
                )}
              </div>
              <h3
                className="text-sm font-medium widget-link line-clamp-2 mb-1"
                style={{ lineHeight: 1.4, minHeight: '2.8em' }}
              >
                {video.title}
              </h3>
              <div className="flex items-center gap-1 text-xs text-zinc-500">
                <span className="truncate">{video.channelTitle}</span>
                <span>·</span>
                <time className="shrink-0">{formatRelativeTime(video.publishedAt)}</time>
              </div>
            </a>
          </article>
        ))}
      </div>

      {shouldCollapse && hiddenCount > 0 && (
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-4 text-xs text-white/40 hover:text-white/60 uppercase tracking-wider transition-colors"
        >
          {isExpanded ? 'Show less' : `Show ${hiddenCount} more`}
        </button>
      )}
    </div>
  )
}
