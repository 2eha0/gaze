import type { GazeConfig } from '../types/gaze';

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
      headWidgets: [
        {
          type: 'welcome',
          title: 'Welcome to Gaze',
          hideHeader: false,
        },
      ],
      columns: [
        {
          size: 'small',
          widgets: [
            {
              type: 'calendar',
              title: 'Calendar',
            },
            {
              type: 'weather',
              title: 'Weather',
            },
          ],
        },
        {
          size: 'full',
          widgets: [
            {
              type: 'rss-feed',
              title: 'Latest News',
            },
            {
              type: 'bookmarks',
              title: 'Quick Links',
            },
          ],
        },
        {
          size: 'small',
          widgets: [
            {
              type: 'clock',
              title: 'World Clock',
            },
            {
              type: 'notes',
              title: 'Quick Notes',
            },
          ],
        },
      ],
    },
    {
      name: 'Dashboard',
      slug: 'dashboard',
      width: 'wide',
      columns: [
        {
          size: 'full',
          widgets: [
            {
              type: 'stats',
              title: 'System Statistics',
            },
            {
              type: 'charts',
              title: 'Analytics',
            },
          ],
        },
        {
          size: 'small',
          widgets: [
            {
              type: 'notifications',
              title: 'Alerts',
            },
          ],
        },
      ],
    },
    {
      name: 'Minimal',
      slug: 'minimal',
      width: 'slim',
      columns: [
        {
          size: 'full',
          widgets: [
            {
              type: 'markdown',
              title: 'Content',
              hideHeader: true,
            },
          ],
        },
      ],
    },
  ],
};
