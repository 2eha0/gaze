/**
 * Widget System Type Definitions
 * Defines the interface for the plugin-based widget architecture
 */

import type { AstroComponentFactory } from 'astro/runtime/server/index.js'

/**
 * Widget Configuration - User-provided configuration for a widget instance
 */
export interface WidgetConfig {
  type: string // Widget type identifier (must match registry key)
  title?: string // Widget title
  slug?: string // Unique identifier
  hideHeader?: boolean // Hide widget header
  [key: string]: unknown // Additional widget-specific config
}

/**
 * Widget Data Fetcher Function
 * Async function that fetches and processes data at build time
 * @param config - The widget configuration from gaze.ts
 * @returns Promise resolving to the processed data for the widget
 */
export type WidgetFetcher<TConfig = WidgetConfig, TData = unknown> = (
  config: TConfig,
) => Promise<TData>

/**
 * Widget Definition
 * Combines the UI component with its data fetching logic
 */
export interface WidgetDefinition<TConfig = WidgetConfig, TData = unknown> {
  /**
   * Astro component responsible for rendering the widget
   * Receives the fetched data as props
   */
  component: AstroComponentFactory

  /**
   * Data fetcher function
   * Called during build time to fetch widget data
   */
  fetcher: WidgetFetcher<TConfig, TData>
}

/**
 * Widget Registry Type
 * Maps widget type identifiers to their definitions
 */
export type WidgetRegistry = Record<string, WidgetDefinition>

/**
 * Widget Props - Data passed to widget components
 */
export interface WidgetProps<TData = unknown> {
  config: WidgetConfig // Original configuration
  data?: TData // Fetched data
  error?: boolean // Indicates if there was an error fetching data
}
