# Group Widget

Group multiple widgets into one using tabs. Widgets are defined using a `widgets` property exactly as you would on a page column.

## Features

- **Tab Navigation**: Display multiple widgets in a single space with tab switching
- **Interactive UI**: Smooth tab transitions with Framer Motion animations
- **Build-time Fetching**: All widget data is fetched during build, following SSG architecture
- **Error Handling**: Graceful error display for failed widgets

## Limitations

- Cannot contain `group` or `split-column` widgets (only base widgets allowed)
- Each child widget is fetched independently during build

## Configuration

```yaml
- type: group
  widgets:
    - type: rss
      url: https://example.com/feed.xml
      title: Tech News
    - type: weather
      location: Shanghai
      title: Weather
    - type: youtube
      channels:
        - UCXuqSBlHAE6Xw-yeJA0Tunw
      limit: 5
      title: Videos
```

## Example: Reddit-style Tabs

```yaml
- type: group
  widgets:
    - type: rss
      url: https://reddit.com/r/gamingnews.rss
      title: Gaming News
      style: detailed
      collapse-after: 6
    - type: rss
      url: https://reddit.com/r/games.rss
      title: Games
    - type: rss
      url: https://reddit.com/r/pcgaming.rss
      title: PC Gaming
      style: detailed
```

## Implementation Details

- **Component**: `GroupWidgetAstro.astro` - Main Astro component
- **Tabs**: `GroupTabs.tsx` - React component for interactive tabs
- **Fetcher**: `fetcher.ts` - Parallel data fetching with concurrency control (max 10)
- **Frameless**: Set to `true` (manages its own card styling)

## Styling

The widget uses the following CSS classes:

- `.group-widget` - Main container
- `.group-tabs` - Tab navigation bar
- `.group-tab` - Individual tab button
- `.group-tab-indicator` - Active tab indicator (animated)
- `.group-panels` - Content area
- `.group-panel` - Individual widget panel
- `.group-panel.active` - Visible panel
