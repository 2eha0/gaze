/**
 * RSS Widget
 * Exports widget definition for registration
 */

import type { WidgetDefinition } from '../../types/widget'
import RSSWidget from './RSSWidget.astro'
import { rssFetcher } from './fetcher'
import type { RSSData, RSSItem, RSSWidgetConfig } from './types'

export const rssWidget: WidgetDefinition<RSSWidgetConfig, RSSData> = {
  component: RSSWidget,
  fetcher: rssFetcher,
}

export type { RSSData, RSSItem, RSSWidgetConfig }
