import type { GazeConfig } from '../types/gaze'

/**
 * Gaze Dashboard Configuration
 * This is the main configuration file that defines all pages, layouts, and widgets
 */
export const gazeConfig = {
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
              location: 'Shanghai',
            },
            {
              type: 'rss',
              title: 'YC News',
              feedUrl: 'https://news.ycombinator.com/rss',
              limit: 5,
            },
          ],
        },
        {
          size: 'full',
          widgets: [
            {
              type: 'rss',
              title: 'GitHub Trending',
              feedUrl: 'https://mshibanami.github.io/GitHubTrendingRSS/daily/all.xml',
              limit: 10,
            },
          ],
        },
      ],
    },
  ],
} satisfies GazeConfig
