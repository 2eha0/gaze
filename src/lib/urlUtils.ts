/**
 * URL Utilities
 * Shared URL parsing and formatting functions
 */

/**
 * Extract domain from URL (removes www. prefix)
 * @param url - Full URL string
 * @returns Domain name without www., or empty string if invalid
 */
export function extractDomain(url: string): string {
  if (!url) return ''
  try {
    const urlObj = new URL(url)
    return urlObj.hostname.replace(/^www\./, '')
  } catch {
    return ''
  }
}
