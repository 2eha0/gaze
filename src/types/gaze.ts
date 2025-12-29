/**
 * Gaze Configuration Type Definitions
 * Configuration-driven layout system for dashboard pages
 */

/**
 * Width preset for page container
 * default: 1600px, slim: 1100px, wide: 1920px
 */
export type WidthPreset = 'default' | 'slim' | 'wide';

/**
 * Column size configuration
 * - small: Fixed 300px width
 * - full: Takes remaining space (flex-1)
 */
export type ColumnSize = 'small' | 'full';

/**
 * Base widget properties shared by all widget types
 */
export interface BaseWidget {
  type: string; // Widget type identifier
  title?: string; // Widget title displayed in header
  slug?: string; // Unique identifier, auto-generated from title if not provided
  hideHeader?: boolean; // Hide the widget header/title bar
}

/**
 * Widget type - extensible for future widget implementations
 */
export type Widget = BaseWidget;

/**
 * Column configuration
 * Each page can have up to 3 columns
 * Must have 1 or 2 'full' columns per page
 */
export interface Column {
  size: ColumnSize;
  widgets?: Widget[];
}

/**
 * Page configuration - top-level layout unit
 */
export interface Page {
  name: string; // Display name in navigation
  slug?: string; // URL-friendly identifier, auto-generated from name if not provided
  width?: WidthPreset; // Desktop max-width preset
  headWidgets?: Widget[]; // Widgets spanning all columns at the top
  columns: Column[]; // Column layout (required)
}

/**
 * Root configuration object
 */
export interface GazeConfig {
  pages: Page[]; // Page list, first page is the homepage
}

/**
 * Width preset mapping to pixel values
 */
export const WIDTH_PRESETS: Record<WidthPreset, string> = {
  slim: '1100px',
  default: '1600px',
  wide: '1920px',
};
