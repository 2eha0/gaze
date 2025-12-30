/**
 * Hacker News Widget
 * Exports widget definition for registration
 */

import type { WidgetDefinition } from '../../types/widget'
import HackerNewsWidget from './HackerNewsWidget.astro'
import { hackerNewsFetcher } from './fetcher'
import type { HackerNewsData, HackerNewsStory, HackerNewsWidgetConfig } from './types'

export const hackerNewsWidget: WidgetDefinition<HackerNewsWidgetConfig, HackerNewsData> = {
  component: HackerNewsWidget,
  fetcher: hackerNewsFetcher,
}

export type { HackerNewsData, HackerNewsStory, HackerNewsWidgetConfig }
