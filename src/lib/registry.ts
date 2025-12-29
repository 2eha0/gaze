/**
 * Widget Registry
 * Central registry for all widget types (built-in and custom)
 *
 * Architecture:
 * - Developers register widgets with a Component and Fetcher
 * - No distinction between built-in and custom widgets
 * - All widgets are treated equally in the rendering pipeline
 */

import type { WidgetDefinition, WidgetRegistry } from '../types/widget'

/**
 * Global widget registry
 * Maps widget type identifiers to their definitions
 */
const registry: WidgetRegistry = {}

export function registerWidget<TConfig = unknown, TData = unknown>(
  type: string,
  definition: WidgetDefinition<TConfig, TData>,
): void {
  if (registry[type]) {
    console.warn(`[Registry] Widget type "${type}" is already registered. Overwriting...`)
  }

  registry[type] = definition as WidgetDefinition
}

/**
 * Get a widget definition by type
 * @param type - Widget type identifier
 * @returns Widget definition or undefined if not found
 */
export function getWidget(type: string): WidgetDefinition | undefined {
  return registry[type]
}
