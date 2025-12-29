/**
 * Weather Widget
 * Exports widget definition for registration
 */

import type { WidgetDefinition } from '../../types/widget'
import WeatherWidget from './WeatherWidget.astro'
import { weatherFetcher } from './fetcher'
import type { WeatherData, WeatherWidgetConfig } from './types'

export const weatherWidget: WidgetDefinition<WeatherWidgetConfig, WeatherData> = {
  component: WeatherWidget,
  fetcher: weatherFetcher,
}

export type { WeatherData, WeatherWidgetConfig }
