/**
 * Widget Registry
 * Central registry for all widgets
 * Import and register all widgets here
 */

import { registerWidget } from '../lib/registry'
import { groupWidget } from './group'
import { hackerNewsWidget } from './hacker-news'
import type { HackerNewsWidgetConfig } from './hacker-news/types'
import { lobstersWidget } from './lobsters'
import type { LobstersWidgetConfig } from './lobsters/types'
import { rssWidget } from './rss'
import type { RSSWidgetConfig } from './rss/types'
import { splitColumnWidget } from './split-column'
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
  registerWidget('split-column', splitColumnWidget)
  registerWidget('group', groupWidget)

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
export type { SplitColumnData, SplitColumnWidgetConfigBase } from './split-column'
export type { GroupData, GroupWidgetConfigBase } from './group'

/**
 * Union type of all registered widget configs (non-container widgets)
 */
type BaseWidgetConfigUnion =
  | WeatherWidgetConfig
  | RSSWidgetConfig
  | YouTubeWidgetConfig
  | LobstersWidgetConfig
  | HackerNewsWidgetConfig

/**
 * Group Widget Configuration with base widget types only
 * Cannot contain split-column or other group widgets
 */
export interface GroupWidgetConfig {
  type: 'group'
  title?: string
  slug?: string
  hideHeader?: boolean
  /** Array of child widget configurations to display in tabs (no group or split-column allowed) */
  widgets: BaseWidgetConfigUnion[]
  /** Index signature for WidgetConfig compatibility */
  [key: string]: unknown
}

/**
 * Split Column Widget Configuration with recursive widget types
 * Allows nested widgets of any type including other split-columns
 */
export interface SplitColumnWidgetConfig {
  type: 'split-column'
  title?: string
  slug?: string
  hideHeader?: boolean
  /** Array of child widget configurations to display side by side */
  widgets: WidgetConfigUnion[]
  /** Maximum number of columns (default: 2, max: 5) */
  maxColumns?: number
  /** Index signature for WidgetConfig compatibility */
  [key: string]: unknown
}

/**
 * Union type of all registered widget configs
 * This enables type-safe widget configuration with autocomplete
 */
export type WidgetConfigUnion = BaseWidgetConfigUnion | GroupWidgetConfig | SplitColumnWidgetConfig
