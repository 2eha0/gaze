/**
 * Weather Widget Type Definitions
 */

import type { WidgetConfig } from '../../types/widget'

/**
 * Weather Widget Configuration
 */
export interface WeatherWidgetConfig extends WidgetConfig {
  type: 'weather'
  location: string // Location name (e.g., "London", "New York, US", "Paris, Île-de-France, France")
  showAreaName?: boolean // Show administrative area name
  hideLocation?: boolean // Hide location in footer
  hourFormat?: '12h' | '24h' // Hour format for time labels
  units?: 'metric' | 'imperial' // Temperature units
}

/**
 * Weather bar column data (2-hour aggregated)
 */
export interface WeatherColumn {
  temperature: number // Average temperature for this 2-hour period
  scale: number // Normalized scale 0-1 for bar height
  hasPrecipitation: boolean // Whether precipitation probability > 75%
}

/**
 * Weather Data Structure
 */
export interface WeatherData {
  location: string // Display name
  areaName?: string // Administrative area (e.g., "California")
  temperature: number // Current temperature
  apparentTemperature: number // Feels like temperature
  weatherCode: number // WMO weather code
  condition: string // Human-readable condition
  currentColumn: number // Current 2-hour column index (0-11)
  sunriseColumn: number // Sunrise column index
  sunsetColumn: number // Sunset column index
  columns: WeatherColumn[] // 12 columns for 24 hours (2-hour each)
  timeLabels: string[] // 12 time labels based on hourFormat
}
