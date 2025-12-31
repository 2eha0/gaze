/**
 * CollapseButton Component
 * Reusable toggle button for collapsible lists
 */

interface CollapseButtonProps {
  isExpanded: boolean
  hiddenCount: number
  onToggle: () => void
}

export function CollapseButton({ isExpanded, hiddenCount, onToggle }: CollapseButtonProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="mt-2 text-xs text-white/40 hover:text-white/60 uppercase tracking-wider transition-colors"
    >
      {isExpanded ? 'Show less' : `Show ${hiddenCount} more`}
    </button>
  )
}
