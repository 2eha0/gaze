# Gaze Configuration System

## Overview

Gaze now features a **configuration-driven layout system** that allows you to build custom dashboards by simply modifying the `src/config/gaze.ts` file. No need to touch React components or Astro pages - just configure your pages, columns, and widgets declaratively.

## Quick Start

1. Edit the configuration file: [src/config/gaze.ts](src/config/gaze.ts)
2. Run `bun run dev` to preview changes
3. Run `bun run build` to generate static pages

## Configuration Structure

### Root Configuration

```typescript
interface GazeConfig {
  pages: Page[]; // List of pages, first page is the homepage
}
```

### Page Configuration

Each page represents a route in your dashboard:

```typescript
interface Page {
  name: string;        // Display name in navigation
  slug?: string;       // URL path (auto-generated from name if omitted)
  width?: WidthPreset; // Container max-width: 'slim' | 'default' | 'wide'
  headWidgets?: Widget[]; // Widgets spanning full width at top
  columns: Column[];   // Column layout (required)
}
```

**Width Presets:**
- `slim`: 1100px
- `default`: 1600px (default if omitted)
- `wide`: 1920px

**Slug Generation:**
- If `slug` is omitted, it's auto-generated from `name` in kebab-case
- Example: `"My Dashboard"` → `"my-dashboard"`
- First page automatically becomes the homepage `/`

### Column Configuration

Pages use a flexible column system (max 3 columns):

```typescript
interface Column {
  size: 'small' | 'full'; // Column width
  widgets?: Widget[];      // Widgets in this column
}
```

**Column Sizes:**
- `small`: Fixed 300px width on desktop
- `full`: Takes remaining space (flex-1)

**Layout Rules:**
- Each page must have 1 or 2 `full` columns
- On mobile (<768px), all columns stack vertically
- On desktop, columns render side-by-side

### Widget Configuration

Widgets are the building blocks of your dashboard:

```typescript
interface BaseWidget {
  type: string;         // Widget type identifier
  title?: string;       // Widget title in header
  slug?: string;        // Unique ID (auto-generated from title if omitted)
  hideHeader?: boolean; // Hide the title bar
}
```

**Available Widget Types:**
- `welcome` - Welcome message
- `calendar` - Calendar widget
- `weather` - Weather information
- `rss-feed` - RSS feed reader
- `bookmarks` - Quick links
- `clock` - World clock
- `notes` - Quick notes
- `stats` - Statistics display
- `charts` - Analytics charts
- `notifications` - Alerts
- `markdown` - Markdown content

*Note: Most widgets are placeholders. Implement custom widgets by editing [src/components/Widget.astro](src/components/Widget.astro)*

## Example Configurations

### Three-Column Layout

```typescript
{
  name: 'Home',
  width: 'default',
  columns: [
    {
      size: 'small',
      widgets: [
        { type: 'calendar', title: 'Calendar' },
        { type: 'weather', title: 'Weather' }
      ]
    },
    {
      size: 'full',
      widgets: [
        { type: 'rss-feed', title: 'News Feed' }
      ]
    },
    {
      size: 'small',
      widgets: [
        { type: 'clock', title: 'World Clock' }
      ]
    }
  ]
}
```

### Two-Column Layout

```typescript
{
  name: 'Dashboard',
  slug: 'dashboard',
  width: 'wide',
  columns: [
    {
      size: 'full',
      widgets: [
        { type: 'stats', title: 'System Stats' },
        { type: 'charts', title: 'Analytics' }
      ]
    },
    {
      size: 'small',
      widgets: [
        { type: 'notifications', title: 'Alerts' }
      ]
    }
  ]
}
```

### Single-Column Layout

```typescript
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
          hideHeader: true // No title bar
        }
      ]
    }
  ]
}
```

### Using Head Widgets

Head widgets span the full width above columns:

```typescript
{
  name: 'Home',
  headWidgets: [
    {
      type: 'welcome',
      title: 'Welcome to Gaze',
      hideHeader: false
    }
  ],
  columns: [
    // ... column configuration
  ]
}
```

## File Structure

```
src/
├── config/
│   └── gaze.ts              # Main configuration file
├── types/
│   └── gaze.ts              # TypeScript type definitions
├── utils/
│   └── gaze.ts              # Helper functions (slug generation, etc.)
├── components/
│   ├── Navigation.astro     # Top navigation bar
│   ├── GazeLayout.astro     # Page layout renderer
│   └── Widget.astro         # Widget container and renderer
├── layouts/
│   └── BaseLayout.astro     # HTML base layout
└── pages/
    ├── index.astro          # Homepage
    └── [...slug].astro      # Dynamic routes for all other pages
```

## Responsive Behavior

### Desktop (≥768px)
- Small columns: Fixed 300px width
- Full columns: Flex to fill remaining space
- Multiple columns render side-by-side

### Mobile (<768px)
- All columns stack vertically
- All columns become full-width
- Order preserved from configuration

## Customization

### Adding New Widget Types

1. Edit [src/components/Widget.astro](src/components/Widget.astro)
2. Add a new conditional block for your widget type:

```astro
{widget.type === 'my-custom-widget' && (
  <div class="my-widget">
    <!-- Your widget implementation -->
  </div>
)}
```

3. Use it in [src/config/gaze.ts](src/config/gaze.ts):

```typescript
{
  type: 'my-custom-widget',
  title: 'My Custom Widget'
}
```

### Styling

The system uses Tailwind CSS v4 with custom CSS variables defined in [src/styles/globals.css](src/styles/globals.css).

**Available Utility Classes:**
- `.glass` - Glassmorphism effect for cards
- `.glass-dark` - Darker glassmorphism variant
- Standard Tailwind utilities for spacing, colors, typography

## TypeScript Support

Full type safety is enforced through:
- [src/types/gaze.ts](src/types/gaze.ts) - Core type definitions
- TypeScript will catch configuration errors at build time
- IDE autocomplete for all configuration options

## Build Output

Running `bun run build` generates static pages:
- `/` - Homepage (first page in config)
- `/dashboard/` - Additional pages by slug
- `/minimal/` - Additional pages by slug

All pages are completely static with no runtime JavaScript for data fetching (following the SSG architecture).

## Best Practices

1. **Start Simple**: Begin with one page and add complexity gradually
2. **Use Descriptive Names**: Clear page and widget names improve maintainability
3. **Leverage Auto-Generation**: Let slugs auto-generate unless you need custom URLs
4. **Test Responsive**: Check mobile and desktop layouts
5. **Type Safety**: Let TypeScript guide you - don't bypass type checks

## Troubleshooting

**Build Fails:**
- Check TypeScript errors: `bun run check`
- Verify all required fields in configuration
- Ensure at least one `full` column per page

**Page Not Showing:**
- Verify page is in `pages` array in [src/config/gaze.ts](src/config/gaze.ts)
- Check slug doesn't conflict with existing routes
- Rebuild: `bun run build`

**Widget Not Rendering:**
- Verify widget type exists in [src/components/Widget.astro](src/components/Widget.astro)
- Check for typos in widget type string
- Review browser console for errors
