/**
 * useCollapsibleList Hook
 * Reusable hook for collapsible list functionality
 */

import { useState } from 'react'

interface UseCollapsibleListOptions {
  /** Total items in the list */
  totalCount: number
  /** Number of items to show when collapsed (-1 means no collapsing) */
  collapseAfter: number
}

interface UseCollapsibleListReturn {
  /** Whether the list should be collapsible */
  shouldCollapse: boolean
  /** Whether the list is currently expanded */
  isExpanded: boolean
  /** Number of items currently visible */
  visibleCount: number
  /** Number of hidden items when collapsed */
  hiddenCount: number
  /** Toggle expand/collapse state */
  toggleExpanded: () => void
}

/**
 * Hook for managing collapsible list state
 *
 * @example
 * ```tsx
 * const { shouldCollapse, isExpanded, visibleCount, hiddenCount, toggleExpanded } =
 *   useCollapsibleList({ totalCount: items.length, collapseAfter: 5 })
 *
 * const visibleItems = items.slice(0, visibleCount)
 *
 * {shouldCollapse && (
 *   <button onClick={toggleExpanded}>
 *     {isExpanded ? 'Show less' : `Show ${hiddenCount} more`}
 *   </button>
 * )}
 * ```
 */
export function useCollapsibleList({
  totalCount,
  collapseAfter,
}: UseCollapsibleListOptions): UseCollapsibleListReturn {
  const [isExpanded, setIsExpanded] = useState(false)

  const shouldCollapse = collapseAfter !== -1 && totalCount > collapseAfter
  const visibleCount = shouldCollapse && !isExpanded ? collapseAfter : totalCount
  const hiddenCount = shouldCollapse ? totalCount - collapseAfter : 0

  const toggleExpanded = () => setIsExpanded((prev) => !prev)

  return {
    shouldCollapse,
    isExpanded,
    visibleCount,
    hiddenCount,
    toggleExpanded,
  }
}
