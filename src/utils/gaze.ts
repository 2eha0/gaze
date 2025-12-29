import { gazeConfig } from '../config/gaze'
import type { Page, Widget, WidthPreset } from '../types/gaze'
import { WIDTH_PRESETS } from '../types/gaze'

/**
 * Convert a string to kebab-case for URL-friendly slugs
 */
export function toKebabCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim()
}

/**
 * Generate slug from page name if not provided
 */
export function getPageSlug(page: Page, isHomepage = false): string {
  if (isHomepage) return '/'
  return page.slug || toKebabCase(page.name)
}

/**
 * Generate slug from widget title if not provided
 */
export function getWidgetSlug(widget: Widget): string {
  return widget.slug || (widget.title ? toKebabCase(widget.title) : `widget-${widget.type}`)
}

/**
 * Get max-width CSS value from width preset
 */
export function getWidthValue(preset: WidthPreset = 'default'): string {
  return WIDTH_PRESETS[preset]
}

/**
 * Get all page paths for static site generation
 */
export function getAllPagePaths(): Array<{ params: { slug: string | undefined } }> {
  return gazeConfig.pages.map((page, index) => ({
    params: {
      slug: index === 0 ? undefined : getPageSlug(page, false),
    },
  }))
}

/**
 * Get page configuration by slug
 */
export function getPageBySlug(slug: string | undefined): Page | undefined {
  if (!slug || slug === '/') {
    return gazeConfig.pages[0]
  }

  return gazeConfig.pages.find((page, index) => {
    if (index === 0) return false // Skip homepage
    return getPageSlug(page, false) === slug
  })
}

/**
 * Get all pages for navigation
 */
export function getAllPages(): Array<{ name: string; slug: string; isHomepage: boolean }> {
  return gazeConfig.pages.map((page, index) => ({
    name: page.name,
    slug: getPageSlug(page, index === 0),
    isHomepage: index === 0,
  }))
}
