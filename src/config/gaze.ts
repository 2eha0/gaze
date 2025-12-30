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
              type: 'hacker-news',
              title: 'Hacker News Top Stories',
              limit: 10,
              collapseAfter: 5,
              sortBy: 'top',
            },
            {
              type: 'rss',
              title: 'GitHub Trending',
              feedUrl: 'https://mshibanami.github.io/GitHubTrendingRSS/daily/all.xml',
              limit: 10,
              style: 'vertical-list',
              collapseAfter: 5,
            },
          ],
        },
        {
          size: 'full',
          widgets: [
            {
              type: 'lobsters',
              limit: 15,
              sortBy: 'hot',
              collapseAfter: 7,
            },
            {
              type: 'youtube',
              title: 'Recent Videos',
              channels: [
                'UCXuqSBlHAE6Xw-yeJA0Tunw',
                'UCBJycsmduvYEL83R_U4JriQ',
                'UCHnyfMqiRRG1u-2MsSQLbXA',
              ],
              limit: 25,
              style: 'grid-cards',
              collapseAfter: 8,
            },
          ],
        },
        {
          size: 'small',
          widgets: [
            {
              type: 'weather',
              title: 'Weather',
              location: 'Shanghai',
            },
          ]
        }
      ],
    },
  ],
} satisfies GazeConfig
