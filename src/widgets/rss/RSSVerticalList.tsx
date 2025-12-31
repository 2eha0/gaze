/**
 * RSS Vertical List Component
 * Compact list style showing title, time, and author only
 */

import { useState } from 'react'
import { formatRelativeTime } from '../../lib/dateUtils'
import type { RSSItem } from './types'

interface RSSVerticalListProps {
  items: RSSItem[]
  collapseAfter: number
  singleLineTitles: boolean
  hideDate?: boolean
}

export function RSSVerticalList({
  items,
  collapseAfter,
  singleLineTitles,
  hideDate = false,
}: RSSVerticalListProps) {
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
    <div className="rss-vertical-list">
      <div className="rss-items space-y-1">
        {visibleItems.map((item) => (
          <article
            key={item.link}
            className="rss-item"
          >
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block py-1.5 px-2 -mx-2 hover:bg-white/5 rounded transition-colors"
            >
              <h3
                className={`text-sm widget-link ${singleLineTitles ? 'truncate' : 'line-clamp-2'}`}
              >
                {item.title}
              </h3>
              <div className="flex items-center gap-1 mt-0.5 text-xs text-white/40">
                {item.author && (
                  <>
                    <span>{item.author}</span>
                    {!hideDate && <span>·</span>}
                  </>
                )}
                {!hideDate && <time>{formatRelativeTime(item.pubDate)}</time>}
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
