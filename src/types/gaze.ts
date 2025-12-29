/**
 * Gaze Configuration Type Definitions
 * Configuration-driven layout system for dashboard pages
 */

import type { WidgetConfigUnion } from '../widgets'

/**
 * Width preset for page container
 * default: 1600px, slim: 1100px, wide: 1920px
 */
export type WidthPreset = 'default' | 'slim' | 'wide'

/**
 * Column size configuration
 * - small: Fixed 300px width
 * - full: Takes remaining space (flex-1)
 */
export type ColumnSize = 'small' | 'full'

/**
 * Base widget properties shared by all widget types
 */
export interface BaseWidget {
  type: string // Widget type identifier
  title?: string // Widget title displayed in header
  slug?: string // Unique identifier, auto-generated from title if not provided
  hideHeader?: boolean // Hide the widget header/title bar
  [key: string]: unknown // Additional widget-specific config
}

/**
 * Widget type - Union of all registered widget configs
 * This provides type-safe autocomplete and type checking for widget configurations
 * Each widget type gets its own config interface with proper type hints
 */
export type Widget = WidgetConfigUnion

/**
 * Column configuration
 * Each page can have up to 3 columns
 * Must have 1 or 2 'full' columns per page
 */
export interface Column {
  size: ColumnSize
  widgets?: Widget[]
}

/**
 * Page configuration - top-level layout unit
 */
export interface Page {
  name: string // Display name in navigation
  slug?: string // URL-friendly identifier, auto-generated from name if not provided
  width?: WidthPreset // Desktop max-width preset
  headWidgets?: Widget[] // Widgets spanning all columns at the top
  columns: Column[] // Column layout (required)
}

/**
 * Root configuration object
 */
export interface GazeConfig {
  pages: Page[] // Page list, first page is the homepage
}

/**
 * Width preset mapping to pixel values
 */
export const WIDTH_PRESETS: Record<WidthPreset, string> = {
  slim: '1100px',
  default: '1600px',
  wide: '1920px',
}
