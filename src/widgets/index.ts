/**
 * Widget Registry
 * Central registry for all widgets
 * Import and register all widgets here
 */

import { registerWidget } from '../lib/registry'
import { rssWidget } from './rss'
import type { RSSWidgetConfig } from './rss/types'
import { weatherWidget } from './weather'
import type { WeatherWidgetConfig } from './weather/types'

/**
 * Register all widgets
 * This function is called during module initialization
 */
export function registerAllWidgets(): void {
  registerWidget('weather', weatherWidget)
  registerWidget('rss', rssWidget)

  console.log('[Widgets] All widgets registered successfully')
}

// Auto-register widgets on import
registerAllWidgets()

// Re-export widget types for convenience
export type { WeatherData, WeatherWidgetConfig } from './weather'
export type { RSSData, RSSItem, RSSWidgetConfig } from './rss'

/**
 * Union type of all registered widget configs
 * This enables type-safe widget configuration with autocomplete
 */
export type WidgetConfigUnion = WeatherWidgetConfig | RSSWidgetConfig
