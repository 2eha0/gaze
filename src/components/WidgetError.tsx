/**
 * Widget Error Component
 * Displays a consistent error state for widgets that fail to load data
 */

interface WidgetErrorProps {
  widgetType?: string
  error?: string | Error
}

export function WidgetError({ widgetType = 'Widget', error }: WidgetErrorProps) {
  const errorMessage =
    error instanceof Error ? error.message : String(error || 'Unable to fetch data')

  return (
    <div className="flex flex-col items-center justify-center h-full min-h-50 gap-4 p-6 text-center">
      <div className="text-4xl opacity-50">⚠️</div>
      <div>
        <h3 className="text-lg font-semibold text-white/90 mb-2">{widgetType} Failed to Load</h3>
        <p className="text-sm text-white/60">{errorMessage}</p>
      </div>
    </div>
  )
}
