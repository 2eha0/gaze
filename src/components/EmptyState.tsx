/**
 * EmptyState Component
 * Displays a message when no data is available
 */

interface EmptyStateProps {
  message?: string
}

export function EmptyState({ message = 'No items available' }: EmptyStateProps) {
  return (
    <div className="empty-state text-center py-6">
      <p className="text-white/40 text-sm">{message}</p>
    </div>
  )
}
