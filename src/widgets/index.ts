/**
 * Widget Registry
 * Central registry for all widgets
 * Import and register all widgets here
 */

import { registerWidget } from '../lib/registry'
import { hackerNewsWidget } from './hacker-news'
import type { HackerNewsWidgetConfig } from './hacker-news/types'
import { lobstersWidget } from './lobsters'
import type { LobstersWidgetConfig } from './lobsters/types'
import { rssWidget } from './rss'
import type { RSSWidgetConfig } from './rss/types'
import { weatherWidget } from './weather'
import type { WeatherWidgetConfig } from './weather/types'
import { youtubeWidget } from './youtube'
import type { YouTubeWidgetConfig } from './youtube/types'

/**
 * Register all widgets
 * This function is called during module initialization
 */
export function registerAllWidgets(): void {
  registerWidget('weather', weatherWidget)
  registerWidget('rss', rssWidget)
  registerWidget('youtube', youtubeWidget)
  registerWidget('lobsters', lobstersWidget)
  registerWidget('hacker-news', hackerNewsWidget)

  console.log('[Widgets] All widgets registered successfully')
}

// Auto-register widgets on import
registerAllWidgets()

// Re-export widget types for convenience
export type { WeatherData, WeatherWidgetConfig } from './weather'
export type { RSSData, RSSItem, RSSWidgetConfig } from './rss'
export type { YouTubeData, YouTubeVideo, YouTubeWidgetConfig } from './youtube'
export type { LobstersData, LobstersStory, LobstersWidgetConfig } from './lobsters'
export type { HackerNewsData, HackerNewsStory, HackerNewsWidgetConfig } from './hacker-news'

/**
 * Union type of all registered widget configs
 * This enables type-safe widget configuration with autocomplete
 */
export type WidgetConfigUnion =
  | WeatherWidgetConfig
  | RSSWidgetConfig
  | YouTubeWidgetConfig
  | LobstersWidgetConfig
  | HackerNewsWidgetConfig
