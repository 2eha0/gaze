/**
 * Shared HTTP utilities for widget fetchers
 * Provides consistent User-Agent and headers across all HTTP requests
 */

import Parser from 'rss-parser'

/**
 * Standard browser User-Agent string
 * Mimics Chrome on macOS to avoid blocking by servers
 */
export const USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'

/**
 * Default headers for all HTTP requests
 */
export const DEFAULT_HEADERS = {
  'User-Agent': USER_AGENT,
  Accept: 'application/json, text/html, application/xhtml+xml, application/xml;q=0.9, */*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
  'Accept-Encoding': 'gzip, deflate, br',
} as const

/**
 * Retry configuration
 */
const MAX_RETRIES = 3
const INITIAL_RETRY_DELAY = 1000 // 1 second

/**
 * Sleep for a specified number of milliseconds
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Calculate exponential backoff delay
 * @param attempt - The attempt number (0-based)
 * @returns Delay in milliseconds
 */
function calculateBackoff(attempt: number): number {
  return INITIAL_RETRY_DELAY * 2 ** attempt
}

/**
 * HTTP client wrapper with standard browser headers and automatic retry
 * Use this instead of bare fetch() in widget fetchers
 *
 * Features:
 * - Automatically retries failed requests up to 3 times
 * - Uses exponential backoff (1s, 2s, 4s)
 * - Only retries on network errors or 5xx server errors
 * - Does not retry on 4xx client errors (bad request, not found, etc.)
 *
 * @param url - The URL to fetch
 * @param options - Standard fetch options (headers will be merged with defaults)
 * @returns Promise that resolves to the Response object
 *
 * @example
 * ```ts
 * const response = await httpFetch('https://api.example.com/data');
 * const data = await response.json();
 * ```
 */
export async function httpFetch(url: string | URL, options?: RequestInit): Promise<Response> {
  const mergedOptions: RequestInit = {
    ...options,
    headers: {
      ...DEFAULT_HEADERS,
      ...options?.headers,
    },
  }

  let lastError: Error | null = null

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(url, mergedOptions)

      // Don't retry on 4xx client errors (bad request, unauthorized, not found, etc.)
      // These are not transient errors and won't be fixed by retrying
      if (!response.ok && response.status >= 400 && response.status < 500) {
        return response
      }

      // Retry on 5xx server errors (internal server error, service unavailable, etc.)
      if (!response.ok && response.status >= 500) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      // Success - return the response
      return response
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))

      // If this is the last attempt, throw the error
      if (attempt === MAX_RETRIES - 1) {
        throw lastError
      }

      // Calculate backoff delay and log retry attempt
      const delay = calculateBackoff(attempt)
      console.warn(
        `[HTTP] Request to ${url} failed (attempt ${attempt + 1}/${MAX_RETRIES}): ${lastError.message}. Retrying in ${delay}ms...`,
      )

      // Wait before retrying
      await sleep(delay)
    }
  }

  // This should never be reached due to the throw in the loop, but TypeScript needs it
  throw lastError || new Error('Request failed after all retries')
}

/**
 * Convenience wrapper for JSON API requests
 * Automatically parses JSON response
 *
 * @param url - The URL to fetch
 * @param options - Standard fetch options (headers will be merged with defaults)
 * @returns Promise that resolves to the parsed JSON data
 *
 * @example
 * ```ts
 * const data = await httpFetchJson<MyDataType>('https://api.example.com/data');
 * ```
 */
export async function httpFetchJson<T = unknown>(
  url: string | URL,
  options?: RequestInit,
): Promise<T> {
  const response = await httpFetch(url, options)

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`)
  }

  return response.json()
}

/**
 * RSS parser wrapper with automatic retry and standard headers
 * Use this instead of bare rss-parser in widget fetchers
 *
 * Features:
 * - Automatically retries failed requests up to 6 times
 * - Uses exponential backoff (1s, 2s, 4s, 8s, 16s, 32s)
 * - Includes standard browser User-Agent to avoid blocking
 * - Adds timestamp to retries to bypass caching
 * - Only retries on network errors or parsing failures
 *
 * @param url - The RSS feed URL to fetch
 * @param customHeaders - Optional custom headers (will be merged with defaults)
 * @returns Promise that resolves to the parsed RSS feed
 *
 * @example
 * ```ts
 * const feed = await rssFetch('https://example.com/feed.xml');
 * console.log(feed.title);
 * feed.items.forEach(item => console.log(item.title));
 * ```
 */
export async function rssFetch<T = Parser.Output<unknown>>(
  url: string,
  customHeaders?: Record<string, string>,
): Promise<T> {
  const parser = new Parser({
    headers: {
      'User-Agent': USER_AGENT,
      ...customHeaders,
    },
  })

  let lastError: Error | null = null

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      // Add timestamp to prevent caching on retries
      const urlWithTimestamp = attempt > 0
        ? `${url}${url.includes('?') ? '&' : '?'}_t=${Date.now()}`
        : url

      const feed = await parser.parseURL(urlWithTimestamp)
      return feed as T
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))

      // If this is the last attempt, throw the error
      if (attempt === MAX_RETRIES - 1) {
        throw lastError
      }

      // Calculate backoff delay and log retry attempt
      const delay = calculateBackoff(attempt)
      console.warn(
        `[RSS] Fetch failed for ${url} (attempt ${attempt + 1}/${MAX_RETRIES}): ${lastError.message}. Retrying in ${delay}ms...`,
      )

      // Wait before retrying
      await sleep(delay)
    }
  }

  // This should never be reached due to the throw in the loop, but TypeScript needs it
  throw lastError || new Error('RSS fetch failed after all retries')
}
