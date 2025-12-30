/**
 * Lobsters List Component
 * Displays lobsters posts with tags, points, comments, and score
 */

import { useState } from 'react'
import type { LobstersStory } from './types'
import { formatRelativeTime } from './utils'

interface LobstersListProps {
  stories: LobstersStory[]
  collapseAfter: number
}

export function LobstersList({ stories, collapseAfter }: LobstersListProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const shouldCollapse = collapseAfter !== -1 && stories.length > collapseAfter
  const visibleStories = shouldCollapse && !isExpanded ? stories.slice(0, collapseAfter) : stories
  const hiddenCount = shouldCollapse ? stories.length - collapseAfter : 0

  if (stories.length === 0) {
    return (
      <div className="empty-state text-center py-6">
        <p className="text-white/40 text-sm">No stories available</p>
      </div>
    )
  }

  return (
    <div className="lobsters-list">
      <div className="lobsters-items space-y-1">
        {visibleStories.map((story, index) => (
          <article
            key={story.commentsUrl + index}
            className="lobsters-item"
          >
            <a
              href={story.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block py-2 px-2 -mx-2 hover:bg-white/5 rounded transition-colors"
            >
              {/* Title + Tags row */}
              <div className="flex items-center gap-2">
                <h3 className="text-sm text-white/90 hover:text-blue-400 transition-colors shrink-0 max-w-[70%] truncate">
                  {story.title}
                </h3>
                {/* Tags - left aligned, next to title */}
                {story.tags.length > 0 && (
                  <div className="flex gap-1 shrink-0">
                    {story.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-block px-1.5 py-0.5 text-[10px] font-medium rounded bg-white/10 text-white/60"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Meta info: points, comments, domain, time */}
              <div className="flex items-center flex-wrap gap-x-2 gap-y-0.5 mt-1.5 text-xs text-white/40">
                {/* Score/Points */}
                <span className="flex items-center gap-0.5">
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 15l7-7 7 7"
                    />
                  </svg>
                  {story.score}
                </span>

                {/* Comments */}
                <span
                  className="flex items-center gap-0.5 hover:text-white/60 transition-colors cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation()
                    window.open(story.commentsUrl, '_blank', 'noopener,noreferrer')
                  }}
                >
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  {story.commentCount}
                </span>

                {/* Separator */}
                <span>·</span>

                {/* Domain */}
                {story.domain && (
                  <>
                    <span className="text-white/30">{story.domain}</span>
                    <span>·</span>
                  </>
                )}

                {/* Time */}
                <time>{formatRelativeTime(story.timePosted)}</time>
              </div>
            </a>
          </article>
        ))}
      </div>

      {shouldCollapse && hiddenCount > 0 && (
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-2 text-xs text-white/40 hover:text-white/60 uppercase tracking-wider transition-colors"
        >
          {isExpanded ? 'Show less' : `Show ${hiddenCount} more`}
        </button>
      )}
    </div>
  )
}
