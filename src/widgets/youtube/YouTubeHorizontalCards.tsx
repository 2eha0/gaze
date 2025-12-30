/**
 * YouTube Horizontal Cards Component
 * Horizontal scrollable cards layout
 */

import type { YouTubeVideo } from './types'

interface YouTubeHorizontalCardsProps {
  videos: YouTubeVideo[]
}

export function YouTubeHorizontalCards({ videos }: YouTubeHorizontalCardsProps) {
  if (videos.length === 0) {
    return (
      <div className="empty-state text-center py-6">
        <p className="text-white/40 text-sm">No videos available</p>
      </div>
    )
  }

  return (
    <div className="youtube-horizontal-cards overflow-x-auto -mx-6 px-6">
      <div className="flex gap-4 pb-2">
        {videos.map((video) => (
          <a
            key={video.videoId}
            href={`https://www.youtube.com/watch?v=${video.videoId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group cursor-pointer block shrink-0"
            style={{ width: 280 }}
          >
            <div className="aspect-video bg-zinc-800/50 rounded-md mb-2 relative overflow-hidden border border-[#2a2a2a]">
              {video.thumbnail ? (
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  width="280"
                  height="158"
                />
              ) : (
                <div className="absolute inset-0 bg-linear-to-br from-zinc-800/30 to-zinc-900/50 group-hover:from-zinc-700/30 transition-colors" />
              )}
            </div>
            <h3
              className="text-sm font-medium text-zinc-300 group-hover:text-[#ff6b1a] transition-colors line-clamp-2 mb-1"
              style={{ lineHeight: 1.4, minHeight: '2.8em' }}
            >
              {video.title}
            </h3>
            <div className="text-xs text-zinc-500">{video.channelTitle}</div>
          </a>
        ))}
      </div>

      <style>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  )
}
