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
              descriptionField: 'content',
            },
            {
              type: 'rss',
              title: 'Hugging Face Papers',
              feedUrl: 'https://papers.takara.ai/api/feed',
              limit: 15,
              style: 'detailed-list',
              collapseAfter: 5,
            },
            {
              type: 'rss',
              title: 'Product Hunt',
              feedUrl: 'https://www.producthunt.com/feed',
              limit: 15,
              style: 'detailed-list',
              collapseAfter: 5,
              hideDate: true,
              descriptionField: 'content',
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
                  title: 'Anthropic Engineering Blog',
                  feedUrl: 'https://rss.app/feeds/ABWCP8rMAV5PAwdZ.xml',
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
    {
      name: 'Web Dev',
      width: 'wide',
      headWidgets: [
        // Top: YouTube channels in horizontal cards
        {
          type: 'youtube',
          title: 'Dev Channels',
          channels: [
            'UCsBjURrPoezykLs9EqgamOA', // Fireship
            'UCJZv4d5rbIKd4QHMPkcABCw', // Kevin Powell
            'UCFbNIlppjAuEX4znoulh0Cw', // Web Dev Simplified
            'UCW5YeuERMmlnqo4oq8vwUpg', // Net Ninja
            'UC29ju8bIPH5as8OGnQzwJyA', // Traversy Media
          ],
          limit: 20,
          style: 'horizontal-cards',
        },
      ],
      columns: [
        {
          size: 'small',
          widgets: [
            // Tools & Framework Updates
            {
              type: 'rss',
              title: 'Astro Blog',
              feedUrl: 'https://astro.build/rss.xml',
              limit: 10,
              style: 'vertical-list',
              collapseAfter: 5,
            },
            {
              type: 'rss',
              title: 'Tailwind CSS Blog',
              feedUrl: 'https://tailwindcss.com/feeds/feed.xml',
              limit: 10,
              style: 'vertical-list',
              collapseAfter: 5,
            },
            {
              type: 'rss',
              title: 'Bun Blog',
              feedUrl: 'https://bun.sh/rss.xml',
              limit: 10,
              style: 'vertical-list',
              collapseAfter: 5,
            },
            {
              type: 'rss',
              title: 'Vite',
              feedUrl: 'https://vitejs.dev/blog.rss',
              limit: 10,
              style: 'vertical-list',
              collapseAfter: 5,
            },
          ],
        },
        {
          size: 'full',
          widgets: [
            // Community & Learning Resources
            {
              type: 'group',
              widgets: [
                {
                  type: 'rss',
                  title: 'CSS-Tricks',
                  feedUrl: 'https://css-tricks.com/feed',
                  limit: 15,
                  style: 'detailed-list',
                  collapseAfter: 5,
                },
                {
                  type: 'rss',
                  title: 'Smashing Magazine',
                  feedUrl: 'https://www.smashingmagazine.com/feed',
                  limit: 15,
                  style: 'detailed-list',
                  collapseAfter: 5,
                },
              ],
            },
            {
              type: 'group',
              widgets: [
                {
                  type: 'rss',
                  title: 'r/webdev',
                  feedUrl: 'https://www.reddit.com/r/webdev/.rss',
                  limit: 15,
                  style: 'detailed-list',
                  collapseAfter: 5,
                },
                {
                  type: 'rss',
                  title: 'r/Frontend',
                  feedUrl: 'https://www.reddit.com/r/Frontend/.rss',
                  limit: 15,
                  style: 'detailed-list',
                  collapseAfter: 5,
                },
                {
                  type: 'rss',
                  title: 'DEV Community',
                  feedUrl: 'https://dev.to/feed',
                  limit: 15,
                  style: 'detailed-list',
                  collapseAfter: 5,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'Markets',
      width: 'wide',
      columns: [
        {
          size: 'small',
          widgets: [
            // Crypto News
            {
              type: 'rss',
              title: 'CoinDesk',
              feedUrl: 'https://www.coindesk.com/arc/outboundfeeds/rss/',
              limit: 15,
              style: 'detailed-list',
              collapseAfter: 5,
            },
            {
              type: 'rss',
              title: 'Cointelegraph',
              feedUrl: 'https://cointelegraph.com/rss',
              limit: 15,
              style: 'detailed-list',
              collapseAfter: 5,
            },
            {
              type: 'rss',
              title: 'Bitcoin.com',
              feedUrl: 'https://news.bitcoin.com/feed/',
              limit: 10,
              style: 'vertical-list',
              collapseAfter: 5,
            },
          ],
        },
        {
          size: 'full',
          widgets: [
            // Venture Capital & Funding
            {
              type: 'group',
              widgets: [
                {
                  type: 'rss',
                  title: 'TechCrunch Funding',
                  feedUrl: 'https://techcrunch.com/tag/funding/feed/',
                  limit: 15,
                  style: 'detailed-list',
                  collapseAfter: 5,
                },
                {
                  type: 'rss',
                  title: 'Crunchbase News',
                  feedUrl: 'https://news.crunchbase.com/feed/',
                  limit: 15,
                  style: 'detailed-list',
                  collapseAfter: 5,
                },
              ],
            },
            // Financial News
            {
              type: 'group',
              widgets: [
                {
                  type: 'rss',
                  title: 'WSJ Markets',
                  feedUrl: 'https://feeds.a.dj.com/rss/RSSMarketsMain.xml',
                  limit: 15,
                  style: 'detailed-list',
                  collapseAfter: 5,
                },
                {
                  type: 'rss',
                  title: 'a16z Crypto',
                  feedUrl: 'https://feeds.simplecast.com/JGE3yC0V',
                  limit: 15,
                  style: 'detailed-list',
                  collapseAfter: 5,
                },
                {
                  type: 'rss',
                  title: 'CNBC Economy',
                  feedUrl: 'https://www.cnbc.com/id/10000664/device/rss/rss.html',
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
            // Tech Stocks & China Markets
            {
              type: 'rss',
              title: 'Yahoo Finance Tech',
              feedUrl: 'https://finance.yahoo.com/news/rssindex',
              limit: 10,
              style: 'vertical-list',
              collapseAfter: 5,
            },
            {
              type: 'rss',
              title: '36氪',
              feedUrl: 'https://36kr.com/feed',
              limit: 10,
              style: 'vertical-list',
              collapseAfter: 5,
            },
            {
              type: 'rss',
              title: '虎嗅网',
              feedUrl: 'https://feedx.net/rss/huxiu.xml',
              limit: 10,
              style: 'vertical-list',
              collapseAfter: 5,
            },
          ],
        },
      ],
    }
  ],
} satisfies GazeConfig
