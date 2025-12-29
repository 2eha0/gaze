/**
 * Weather Widget Type Definitions
 */

import type { WidgetConfig } from '../../types/widget'

/**
 * Weather Widget Configuration
 */
export interface WeatherWidgetConfig extends WidgetConfig {
  type: 'weather'
  latitude?: number // Latitude coordinate
  longitude?: number // Longitude coordinate
  location?: string // Display name for the location
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
