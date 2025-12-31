import type { GazeConfig } from '../types/gaze'

/**
 * Gaze Dashboard Configuration
 * This is the main configuration file that defines all pages, layouts, and widgets
 *
 * Three-column layout:
 * - Left: Trending sources (GitHub, HuggingFace)
 * - Middle: News groups and YouTube
 * - Right: Weather and Podcasts
 */
export const gazeConfig = {
  pages: [
    {
      // First page is the homepage (/)
      name: 'Home',
      width: 'wide',
      columns: [
        {
          size: 'small',
          widgets: [
            {
              type: 'rss',
              title: 'GitHub Trending',
              feedUrl: 'https://mshibanami.github.io/GitHubTrendingRSS/daily/all.xml',
              limit: 15,
              style: 'detailed-list',
              collapseAfter: 5,
              hideDate: true,
            },
            {
              type: 'rss',
              title: 'Hugging Face Trending',
              feedUrl: 'https://zernel.github.io/huggingface-trending-feed/feed.xml',
              limit: 15,
              style: 'detailed-list',
              collapseAfter: 5,
              hideDate: true,
            },
            {
              type: 'rss',
              title: 'Product Hunt',
              feedUrl: 'https://www.producthunt.com/feed',
              limit: 15,
              style: 'detailed-list',
              collapseAfter: 5,
              hideDate: true,
            },
          ],
        },
        {
          size: 'full',
          widgets: [
            // Group 1: Hacker News & Lobsters
            {
              type: 'group',
              widgets: [
                {
                  type: 'hacker-news',
                  title: 'Hacker News',
                  limit: 15,
                  collapseAfter: 5,
                  sortBy: 'top',
                },
                {
                  type: 'lobsters',
                  title: 'Lobsters',
                  limit: 15,
                  sortBy: 'hot',
                  collapseAfter: 5,
                },
              ],
            },
            // YouTube: Horizontal scroll with selected channels
            {
              type: 'youtube',
              title: 'YouTube',
              channels: [
                'UC26hLZoe-haxcuLYxzWAiNg', // 脑总MrBrain
                'UChpleBmo18P08aKCIgti38g', // Matt Wolfe
                'UCbRP3c757lWg9M-U7TyEkXA', // Theo - t3.gg
                'UCWXYDYv5STLk-zoxMP2I1Lw', // Dan Koe
              ],
              limit: 20,
              style: 'horizontal-cards',
            },
            // Group 2: arXiv & Reddit
            {
              type: 'group',
              widgets: [
                {
                  type: 'rss',
                  title: 'arXiv CS.AI',
                  feedUrl: 'https://rss.arxiv.org/rss/cs.AI',
                  limit: 15,
                  style: 'detailed-list',
                  collapseAfter: 5,
                },
                {
                  type: 'rss',
                  title: 'r/SaaS',
                  feedUrl: 'https://www.reddit.com/r/SaaS/.rss',
                  limit: 15,
                  style: 'detailed-list',
                  collapseAfter: 5,
                },
                {
                  type: 'rss',
                  title: 'r/IndieHackers',
                  feedUrl: 'https://www.reddit.com/r/indiehackers/.rss',
                  limit: 15,
                  style: 'detailed-list',
                  collapseAfter: 5,
                },
                {
                  type: 'rss',
                  title: 'r/SideProject',
                  feedUrl: 'https://www.reddit.com/r/SideProject/.rss',
                  limit: 15,
                  style: 'detailed-list',
                  collapseAfter: 5,
                },
                {
                  type: 'rss',
                  title: 'r/LocalLLaMA',
                  feedUrl: 'https://www.reddit.com/r/LocalLLaMA/.rss',
                  limit: 15,
                  style: 'detailed-list',
                  collapseAfter: 5,
                },
              ],
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
            {
              type: 'rss',
              title: 'The Changelog',
              feedUrl: 'https://changelog.com/podcast/feed',
              limit: 10,
              style: 'vertical-list',
              collapseAfter: 5,
            },
            {
              type: 'rss',
              title: 'Lex Fridman',
              feedUrl: 'https://lexfridman.com/feed/podcast/',
              limit: 10,
              style: 'vertical-list',
              collapseAfter: 5,
            },
          ],
        },
      ],
    },
  ],
} satisfies GazeConfig
