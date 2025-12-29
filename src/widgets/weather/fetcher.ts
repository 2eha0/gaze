/**
 * Weather Widget Fetcher
 * Fetches current weather data at build time using Open-Meteo API
 */

import type { WidgetFetcher } from '../../types/widget'
import type { WeatherData, WeatherWidgetConfig } from './types'

/**
 * WMO Weather Code to description mapping
 * Based on WMO Code 4677
 */
const WMO_CODES: Record<number, string> = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Foggy',
  48: 'Depositing rime fog',
  51: 'Light drizzle',
  53: 'Moderate drizzle',
  55: 'Dense drizzle',
  61: 'Slight rain',
  63: 'Moderate rain',
  65: 'Heavy rain',
  71: 'Slight snow',
  73: 'Moderate snow',
  75: 'Heavy snow',
  77: 'Snow grains',
  80: 'Slight rain showers',
  81: 'Moderate rain showers',
  82: 'Violent rain showers',
  85: 'Slight snow showers',
  86: 'Heavy snow showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm with slight hail',
  99: 'Thunderstorm with heavy hail',
}

/**
 * Fetch weather data from Open-Meteo API
 * Free, no API key required
 */
async function fetchFromOpenMeteo(
  latitude: number,
  longitude: number,
  location: string,
): Promise<WeatherData> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&temperature_unit=celsius&wind_speed_unit=kmh`

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Open-Meteo API error: ${response.status}`)
  }

  const data = await response.json()
  const current = data.current

  // Map WMO weather code to description
  const weatherCode = current.weather_code as number
  const condition = WMO_CODES[weatherCode] || 'Unknown'

  return {
    location,
    temperature: current.temperature_2m,
    condition,
    humidity: current.relative_humidity_2m,
    windSpeed: current.wind_speed_10m,
    lastUpdated: current.time,
  }
}

/**
 * Weather Widget Fetcher
 * Fetches weather data at build time using Open-Meteo API
 */
export const weatherFetcher: WidgetFetcher<WeatherWidgetConfig, WeatherData> = async (config) => {
  // Default to San Francisco coordinates if not provided
  const latitude = config.latitude ?? 37.7749
  const longitude = config.longitude ?? -122.4194
  const location = config.location || 'San Francisco'

  console.log(`[Weather Fetcher] Fetching weather for: ${location} (${latitude}, ${longitude})`)

  const data = await fetchFromOpenMeteo(latitude, longitude, location)
  console.log(
    `[Weather Fetcher] Successfully fetched weather: ${data.temperature}°C, ${data.condition}`,
  )
  return data
}
