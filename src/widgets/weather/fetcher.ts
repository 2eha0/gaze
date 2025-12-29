/**
 * Weather Widget Fetcher
 * Fetches current weather data at build time
 */

import type { WidgetFetcher } from '../../types/widget'
import type { WeatherData, WeatherWidgetConfig } from './types'

/**
 * Mock weather data generator (for MVP)
 * In production, replace with actual API calls to services like:
 * - OpenWeatherMap
 * - WeatherAPI
 * - Weather.gov
 */
function generateMockWeatherData(location: string): WeatherData {
  // Generate realistic mock data
  const conditions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Rainy', 'Clear']
  const randomCondition = conditions[Math.floor(Math.random() * conditions.length)]

  return {
    location,
    temperature: Math.floor(Math.random() * 30) + 5, // 5-35°C
    condition: randomCondition,
    humidity: Math.floor(Math.random() * 40) + 40, // 40-80%
    windSpeed: Math.floor(Math.random() * 25) + 5, // 5-30 km/h
    lastUpdated: new Date().toISOString(),
  }
}

/**
 * Fetch weather data from OpenWeatherMap API
 * Requires OPENWEATHER_API_KEY environment variable
 */
async function fetchFromOpenWeather(location: string, apiKey: string): Promise<WeatherData> {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&units=metric&appid=${apiKey}`

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`OpenWeather API error: ${response.status}`)
  }

  const data = await response.json()

  return {
    location: data.name,
    temperature: data.main.temp,
    condition: data.weather[0].description,
    humidity: data.main.humidity,
    windSpeed: data.wind.speed * 3.6, // Convert m/s to km/h
    icon: data.weather[0].icon,
    lastUpdated: new Date().toISOString(),
  }
}

/**
 * Weather Widget Fetcher
 * Fetches weather data at build time
 */
export const weatherFetcher: WidgetFetcher<WeatherWidgetConfig, WeatherData> = async (config) => {
  const location = config.location || 'San Francisco'
  console.log(`[Weather Fetcher] Fetching weather for: ${location}`)

  try {
    // Try to use real API if key is provided
    const apiKey = config.apiKey || process.env.OPENWEATHER_API_KEY

    if (apiKey) {
      console.log('[Weather Fetcher] Using OpenWeatherMap API')
      const data = await fetchFromOpenWeather(location, apiKey)
      console.log(
        `[Weather Fetcher] Successfully fetched weather: ${data.temperature}°C, ${data.condition}`,
      )
      return data
    }

    // Fallback to mock data
    console.log('[Weather Fetcher] No API key found, using mock data')
    return generateMockWeatherData(location)
  } catch (error) {
    console.error('[Weather Fetcher] Failed to fetch weather:', error)

    // Return fallback mock data
    return generateMockWeatherData(location)
  }
}
