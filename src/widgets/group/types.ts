/**
 * Group Widget Type Definitions
 * Allows displaying multiple widgets with tab navigation
 */

import type { WidgetConfig, WidgetProps } from '../../types/widget'

/**
 * Base Group Widget Configuration
 * The `widgets` property uses generic WidgetConfig here.
 * For full type safety with all widget types, use GroupWidgetConfig from widgets/index.ts
 */
export interface GroupWidgetConfigBase extends WidgetConfig {
  type: 'group'
  /** Array of child widget configurations to display in tabs */
  widgets: WidgetConfig[]
}

/**
 * Group Widget Data Structure
 * Contains fetched data for all child widgets
 */
export interface GroupData {
  /** Array of widget props with fetched data, in same order as config.widgets */
  childWidgets: WidgetProps[]
}
