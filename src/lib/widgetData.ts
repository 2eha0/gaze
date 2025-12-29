/**
 * Widget Data Fetching Utilities
 * Handles fetching data for widgets at build time
 */

import pLimit from 'p-limit'
import type { Page } from '../types/gaze'
import type { WidgetConfig, WidgetProps } from '../types/widget'
import { getWidget } from './registry'

// Default concurrency limit for widget data fetching
const DEFAULT_CONCURRENCY = 10

/**
 * Fetch data for a single widget
 * @param config - Widget configuration
 * @returns Widget props with fetched data
 */
export async function fetchWidgetData(config: WidgetConfig): Promise<WidgetProps> {
  const widget = getWidget(config.type)

  if (!widget) {
    console.warn(`[Widget Data] Widget type "${config.type}" not found in registry`)
    return {
      config,
      data: null,
    }
  }

  try {
    console.log(`[Widget Data] Fetching data for widget: ${config.type}`)
    const data = await widget.fetcher(config)

    return {
      config,
      data,
    }
  } catch (error) {
    console.error(`[Widget Data] Failed to fetch data for ${config.type}:`, error)
    return {
      config,
      error: true,
    }
  }
}

/**
 * Fetch data for all widgets in a page
 * @param page - Page configuration
 * @returns Map of widget slug to widget props
 */
export async function fetchPageWidgetData(page: Page): Promise<Map<string, WidgetProps>> {
  const widgetDataMap = new Map<string, WidgetProps>()
  const limit = pLimit(DEFAULT_CONCURRENCY)
  const fetchTasks: Promise<void>[] = []

  // Helper to generate unique slug for widget
  const generateSlug = (config: WidgetConfig, index: number): string => {
    if (config.slug) return config.slug
    return `${config.type}-${index}`
  }

  let widgetIndex = 0

  // Fetch head widgets
  if (page.headWidgets) {
    for (const widgetConfig of page.headWidgets) {
      const slug = generateSlug(widgetConfig, widgetIndex++)
      const task = limit(async () => {
        const props = await fetchWidgetData(widgetConfig)
        widgetDataMap.set(slug, props)
      })
      fetchTasks.push(task)
    }
  }

  // Fetch column widgets
  for (const column of page.columns) {
    if (column.widgets) {
      for (const widgetConfig of column.widgets) {
        const slug = generateSlug(widgetConfig, widgetIndex++)
        const task = limit(async () => {
          const props = await fetchWidgetData(widgetConfig)
          widgetDataMap.set(slug, props)
        })
        fetchTasks.push(task)
      }
    }
  }

  // Wait for all fetches to complete (allow failures)
  await Promise.allSettled(fetchTasks)

  console.log(`[Widget Data] Fetched data for ${widgetDataMap.size} widgets`)
  return widgetDataMap
}
