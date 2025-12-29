import type { GazeConfig } from '../types/gaze'

/**
 * Gaze Dashboard Configuration
 * This is the main configuration file that defines all pages, layouts, and widgets
 */
export const gazeConfig: GazeConfig = {
  pages: [
    {
      // First page is the homepage (/)
      name: 'Home',
      width: 'default',
      columns: [
        {
          size: 'small',
          widgets: [
            {
              type: 'weather',
              title: 'Weather',
              location: 'San Francisco',
              apiKey: process.env.WEATHER_API_KEY,
            },
          ],
        },
        {
          size: 'full',
          widgets: [
            {
              type: 'rss',
              title: 'YC News',
              feedUrl: 'https://news.ycombinator.com/rss',
              limit: 5,
            },
            {
              type: 'rss',
              title: 'Hacker News',
              feedUrl: 'https://hnrss.org/frontpage',
              limit: 5,
            },
          ],
        },
      ],
    },
  ],
}
