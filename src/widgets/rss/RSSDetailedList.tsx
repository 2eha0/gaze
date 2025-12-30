/**
 * RSS Detailed List Component
 * Detailed view with image, description, and categories
 */

import { useState } from 'react'
import type { RSSItem } from './types'
import { formatRelativeTime } from './utils'

interface RSSDetailedListProps {
  items: RSSItem[]
  collapseAfter: number
}

export function RSSDetailedList({ items, collapseAfter }: RSSDetailedListProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const shouldCollapse = collapseAfter !== -1 && items.length > collapseAfter
  const visibleItems = shouldCollapse && !isExpanded ? items.slice(0, collapseAfter) : items
  const hiddenCount = shouldCollapse ? items.length - collapseAfter : 0

  if (items.length === 0) {
    return (
      <div className="empty-state text-center py-6">
        <p className="text-white/40 text-sm">No items available</p>
      </div>
    )
  }

  return (
    <div className="rss-detailed-list">
      <div className="rss-items space-y-4">
        {visibleItems.map((item) => (
          <article
            key={item.link}
            className="rss-item"
          >
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block hover:bg-white/5 rounded-md p-2 -mx-2 transition-colors"
            >
              <div className="flex gap-3">
                {item.image && (
                  <div className="shrink-0">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-24 h-16 object-cover rounded bg-white/5"
                      loading="lazy"
                      width="96"
                      height="64"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-white/90 mb-1 hover:text-blue-400 transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-xs text-white/50 line-clamp-2 mb-1.5">{item.description}</p>
                  )}
                  <div className="flex items-center gap-2 text-xs text-white/40">
                    {item.author && <span>{item.author}</span>}
                    {item.author && <span>·</span>}
                    <time>{formatRelativeTime(item.pubDate)}</time>
                  </div>
                  {item.categories && item.categories.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {item.categories.slice(0, 3).map((cat) => (
                        <span
                          key={cat}
                          className="px-1.5 py-0.5 text-[10px] bg-white/10 text-white/50 rounded"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  )}
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
