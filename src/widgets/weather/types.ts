/**
 * Weather Widget Type Definitions
 */

import type { WidgetConfig } from '../../types/widget'

/**
 * Weather Widget Configuration
 */
export interface WeatherWidgetConfig extends WidgetConfig {
  type: 'weather'
  location?: string // City name or coordinates
  apiKey?: string // Optional API key for weather service
}

/**
 * Weather Data Structure
 */
export interface WeatherData {
  location: string
  temperature: number // in Celsius
  condition: string
  humidity: number // percentage
  windSpeed: number // km/h
  icon?: string // Weather icon code
  lastUpdated: string
}
