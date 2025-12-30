/**
 * Weather Widget Fetcher
 * Fetches current weather data at build time using Open-Meteo API
 * Refactored based on Glance Go implementation
 */

import type { WidgetFetcher } from '../../types/widget'
import type { WeatherColumn, WeatherData, WeatherWidgetConfig } from './types'

/**
 * WMO Weather Code to description mapping
 */
const WEATHER_CODE_TABLE: Record<number, string> = {
  0: 'Clear Sky',
  1: 'Mainly Clear',
  2: 'Partly Cloudy',
  3: 'Overcast',
  45: 'Fog',
  48: 'Rime Fog',
  51: 'Drizzle',
  53: 'Drizzle',
  55: 'Drizzle',
  56: 'Drizzle',
  57: 'Drizzle',
  61: 'Rain',
  63: 'Moderate Rain',
  65: 'Heavy Rain',
  66: 'Freezing Rain',
  67: 'Freezing Rain',
  71: 'Snow',
  73: 'Moderate Snow',
  75: 'Heavy Snow',
  77: 'Snow Grains',
  80: 'Rain',
  81: 'Moderate Rain',
  82: 'Heavy Rain',
  85: 'Snow',
  86: 'Snow',
  95: 'Thunderstorm',
  96: 'Thunderstorm',
  99: 'Thunderstorm',
}

const TIME_LABELS_12H = [
  '2am',
  '4am',
  '6am',
  '8am',
  '10am',
  '12pm',
  '2pm',
  '4pm',
  '6pm',
  '8pm',
  '10pm',
  '12am',
]
const TIME_LABELS_24H = [
  '02:00',
  '04:00',
  '06:00',
  '08:00',
  '10:00',
  '12:00',
  '14:00',
  '16:00',
  '18:00',
  '20:00',
  '22:00',
  '00:00',
]

const COMMON_COUNTRY_ABBREVIATIONS: Record<string, string> = {
  US: 'United States',
  USA: 'United States',
  UK: 'United Kingdom',
}

interface OpenMeteoPlace {
  name: string
  admin1?: string // Administrative area
  latitude: number
  longitude: number
  timezone: string
  country: string
}

interface OpenMeteoPlacesResponse {
  results?: OpenMeteoPlace[]
}

interface OpenMeteoWeatherResponse {
  daily: {
    sunrise: number[]
    sunset: number[]
  }
  hourly: {
    temperature_2m: number[]
    precipitation_probability: number[]
  }
  current: {
    temperature_2m: number
    apparent_temperature: number
    weather_code: number
  }
}

/**
 * Expand common country abbreviations
 */
function expandCountryAbbreviations(name: string): string {
  const trimmed = name.trim()
  return COMMON_COUNTRY_ABBREVIATIONS[trimmed] || name
}

/**
 * Parse place name into location and area filter
 * Format: "City, Area, Country" or "City, Country" or "City"
 */
function parsePlaceName(name: string): { location: string; area: string } {
  const parts = name.split(',').map((p) => p.trim())

  if (parts.length === 1) {
    return { location: name, area: '' }
  }

  if (parts.length === 2) {
    return {
      location: `${parts[0]}, ${expandCountryAbbreviations(parts[1])}`,
      area: '',
    }
  }

  // 3+ parts: City, Area, Country
  return {
    location: `${parts[0]}, ${expandCountryAbbreviations(parts[2])}`,
    area: parts[1].toLowerCase(),
  }
}

/**
 * Fetch place coordinates from Open-Meteo Geocoding API
 */
async function fetchOpenMeteoPlace(locationName: string): Promise<OpenMeteoPlace> {
  const { location, area } = parsePlaceName(locationName)
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=20&language=en&format=json`

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Geocoding API error: ${response.status}`)
  }

  const data: OpenMeteoPlacesResponse = await response.json()

  if (!data.results || data.results.length === 0) {
    throw new Error(`No places found for: ${locationName}`)
  }

  let place: OpenMeteoPlace | undefined

  if (area) {
    // Filter by administrative area if provided
    place = data.results.find((p) => p.admin1?.toLowerCase() === area)
    if (!place) {
      throw new Error(`No place found for ${location} in ${area}`)
    }
  } else {
    place = data.results[0]
  }

  return place
}

/**
 * Fetch weather data for a place
 */
async function fetchWeatherForPlace(
  place: OpenMeteoPlace,
  units: 'metric' | 'imperial',
): Promise<OpenMeteoWeatherResponse> {
  const temperatureUnit = units === 'imperial' ? 'fahrenheit' : 'celsius'

  const params = new URLSearchParams({
    latitude: place.latitude.toString(),
    longitude: place.longitude.toString(),
    timeformat: 'unixtime',
    timezone: place.timezone,
    forecast_days: '1',
    current: 'temperature_2m,apparent_temperature,weather_code',
    hourly: 'temperature_2m,precipitation_probability',
    daily: 'sunrise,sunset',
    temperature_unit: temperatureUnit,
  })

  const url = `https://api.open-meteo.com/v1/forecast?${params.toString()}`
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Weather API error: ${response.status}`)
  }

  return response.json()
}

/**
 * Process weather response into WeatherData
 */
function processWeatherData(
  weatherResponse: OpenMeteoWeatherResponse,
  place: OpenMeteoPlace,
  config: WeatherWidgetConfig,
): WeatherData {
  const { current, hourly, daily } = weatherResponse
  const timeLabels = config.hourFormat === '24h' ? TIME_LABELS_24H : TIME_LABELS_12H

  // Get current time in the place's timezone
  const now = new Date()
  // Note: For SSG, we use UTC-based calculation. Frontend will adjust currentColumn
  const currentHour = now.getUTCHours()
  const currentColumn = Math.floor(currentHour / 2)

  // Calculate sunrise/sunset columns
  const sunriseTime = new Date(daily.sunrise[0] * 1000)
  const sunsetTime = new Date(daily.sunset[0] * 1000)
  const sunriseColumn = Math.floor(sunriseTime.getUTCHours() / 2)
  let sunsetColumn = Math.floor((sunsetTime.getUTCHours() - 1) / 2)
  if (sunsetColumn < 0) sunsetColumn = 0

  // Process 24 hourly temperatures into 12 columns (2-hour each)
  const temperatures: number[] = []
  const precipitations: boolean[] = []

  const hourlyTemps = hourly.temperature_2m
  const hourlyPrecip = hourly.precipitation_probability

  if (hourlyTemps.length === 24) {
    for (let i = 0; i < 24; i += 2) {
      const colIndex = i / 2
      if (colIndex === currentColumn) {
        // Use current temperature for current column
        temperatures.push(Math.round(current.temperature_2m))
      } else {
        // Average of 2 hours
        temperatures.push(Math.round((hourlyTemps[i] + hourlyTemps[i + 1]) / 2))
      }
      // Precipitation if average > 75%
      precipitations.push((hourlyPrecip[i] + hourlyPrecip[i + 1]) / 2 > 75)
    }
  }

  // Calculate scale for bar heights
  const minTemp = Math.min(...temperatures)
  const maxTemp = Math.max(...temperatures)
  const tempRange = maxTemp - minTemp

  const columns: WeatherColumn[] = temperatures.map((temp, i) => ({
    temperature: temp,
    scale: tempRange > 0 ? (temp - minTemp) / tempRange : 1,
    hasPrecipitation: precipitations[i],
  }))

  // Build location display name
  let locationDisplay = place.name
  if (config.showAreaName && place.admin1) {
    locationDisplay = `${place.name}, ${place.admin1}`
  }

  return {
    location: locationDisplay,
    areaName: place.admin1,
    temperature: Math.round(current.temperature_2m),
    apparentTemperature: Math.round(current.apparent_temperature),
    weatherCode: current.weather_code,
    condition: WEATHER_CODE_TABLE[current.weather_code] || 'Unknown',
    currentColumn,
    sunriseColumn,
    sunsetColumn,
    columns,
    timeLabels,
  }
}

/**
 * Weather Widget Fetcher
 */
export const weatherFetcher: WidgetFetcher<WeatherWidgetConfig, WeatherData> = async (config) => {
  const location = config.location || 'San Francisco'
  const units = config.units || 'metric'
  const hourFormat = config.hourFormat || '12h'

  console.log(`[Weather Fetcher] Fetching weather for: ${location}`)

  // Step 1: Geocode location name to coordinates
  const place = await fetchOpenMeteoPlace(location)
  console.log(
    `[Weather Fetcher] Found place: ${place.name}, ${place.admin1 || ''}, ${place.country} (${place.latitude}, ${place.longitude})`,
  )

  // Step 2: Fetch weather data
  const weatherResponse = await fetchWeatherForPlace(place, units)

  // Step 3: Process into WeatherData
  const data = processWeatherData(weatherResponse, place, {
    ...config,
    hourFormat,
    units,
  })

  console.log(`[Weather Fetcher] Successfully fetched weather: ${data.temperature}°, ${data.condition}`)

  return data
}
