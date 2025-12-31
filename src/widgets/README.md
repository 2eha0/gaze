# Widgets Directory

This directory contains all widget implementations for the Gaze dashboard. Each widget is organized in its own subdirectory with a consistent structure.

## Directory Structure

```
src/widgets/
├── index.ts              # Central registry - imports and registers all widgets
├── weather/              # Weather widget
│   ├── WeatherWidget.astro   # UI component
│   ├── fetcher.ts            # Data fetching logic
│   ├── types.ts              # TypeScript type definitions
│   └── index.ts              # Widget export
└── rss/                  # RSS widget
    ├── RSSWidget.astro       # UI component
    ├── fetcher.ts            # Data fetching logic
    ├── types.ts              # TypeScript type definitions
    └── index.ts              # Widget export
```

## Creating a New Widget

To create a new widget, follow this structure:

### 1. Create Widget Directory

```bash
mkdir src/widgets/my-widget
```

### 2. Create Type Definitions (`types.ts`)

```typescript
import type { WidgetConfig } from '../../types/widget'

export interface MyWidgetConfig extends WidgetConfig {
  type: 'my-widget'
  // Add widget-specific config fields
}

export interface MyWidgetData {
  // Add data structure fields
}
```

### 3. Create Fetcher (`fetcher.ts`)

```typescript
import type { WidgetFetcher } from '../../types/widget'
import type { MyWidgetConfig, MyWidgetData } from './types'

export const myWidgetFetcher: WidgetFetcher<MyWidgetConfig, MyWidgetData> = async (config) => {
  // Fetch and return data
  return {
    // ... data
  }
}
```

### 4. Create UI Component (`MyWidget.astro`)

**Note**: Widget components should focus only on rendering content. Error handling and container styling are handled by the parent `Widget.astro` wrapper component.

```astro
---
import type { WidgetProps } from '../../types/widget'
import type { MyWidgetConfig, MyWidgetData } from './types'

interface Props extends WidgetProps<MyWidgetData> {
  config: MyWidgetConfig
}

const { config, data } = Astro.props
---

{data && (
  <!-- Render your widget content here -->
  <!-- The Widget.astro wrapper handles .glass, .rounded-lg, padding, and error states -->
  <div class="my-widget-content">
    <!-- Your content here -->
  </div>
)}
```

**Important**: Do NOT include:
- Container elements with `.glass`, `.rounded-lg`, or padding classes (handled by Widget.astro)
- Error handling logic (handled by Widget.astro)
- WidgetError component imports (handled by Widget.astro)

### 5. Create Widget Export (`index.ts`)

```typescript
import type { WidgetDefinition } from '../../types/widget'
import MyWidget from './MyWidget.astro'
import { myWidgetFetcher } from './fetcher'
import type { MyWidgetConfig, MyWidgetData } from './types'

export const myWidget: WidgetDefinition<MyWidgetConfig, MyWidgetData> = {
  component: MyWidget,
  fetcher: myWidgetFetcher,
}

export type { MyWidgetConfig, MyWidgetData }
```

### 6. Register Widget

Add your widget to `src/widgets/index.ts`:

```typescript
import { myWidget } from './my-widget'

export function registerAllWidgets(): void {
  registerWidget('weather', weatherWidget)
  registerWidget('rss', rssWidget)
  registerWidget('my-widget', myWidget)  // Add this line

  console.log('[Widgets] All widgets registered successfully')
}
```

### 7. Use in Configuration

Add to your `src/config/gaze.ts`:

```typescript
{
  type: 'my-widget',
  title: 'My Widget',
  // ... widget-specific config
}
```

## Best Practices

1. **Error Handling**: Widget error states are automatically handled by Widget.astro wrapper
2. **Type Safety**: Define clear TypeScript interfaces for config and data
3. **Fallback Data**: Fetchers should return empty arrays/objects on error, not throw
4. **Responsive Design**: Use Tailwind utilities for responsive layouts
5. **Accessibility**: Include proper ARIA labels and semantic HTML

## Shared Utilities and Components

To reduce code duplication, use these shared utilities:

### Date/Time Utils (`src/lib/dateUtils.ts`)
```typescript
import { formatRelativeTime } from '../../lib/dateUtils'

// Formats ISO date to "2h ago", "3d ago", etc.
const timeAgo = formatRelativeTime(item.publishedAt)
```

### URL Utils (`src/lib/urlUtils.ts`)
```typescript
import { extractDomain } from '../../lib/urlUtils'

// Extracts domain from URL, removes www prefix
const domain = extractDomain('https://www.example.com/path') // "example.com"
```

### HTTP Utils (`src/lib/http.ts`)
```typescript
import { httpFetch, USER_AGENT } from '../../lib/http'

// Fetch with automatic retry and standard User-Agent
const response = await httpFetch('https://api.example.com/data')
```

### Collapsible List Hook (`src/hooks/useCollapsibleList.ts`)
```typescript
import { useCollapsibleList } from '../../hooks/useCollapsibleList'

const { shouldCollapse, isExpanded, visibleCount, hiddenCount, toggleExpanded } =
  useCollapsibleList({ totalCount: items.length, collapseAfter: 5 })

const visibleItems = items.slice(0, visibleCount)
```

### Shared Components

**CollapseButton** (`src/components/CollapseButton.tsx`)
```typescript
import { CollapseButton } from '../../components/CollapseButton'

{shouldCollapse && hiddenCount > 0 && (
  <CollapseButton isExpanded={isExpanded} hiddenCount={hiddenCount} onToggle={toggleExpanded} />
)}
```

**EmptyState** (`src/components/EmptyState.tsx`)
```typescript
import { EmptyState } from '../../components/EmptyState'

{items.length === 0 && <EmptyState message="No items available" />}
```

## Architecture Benefits

- **Modularity**: Each widget is self-contained
- **Type Safety**: Strong typing across config, fetcher, and component
- **Maintainability**: Easy to find and modify widget code
- **Scalability**: Simple to add new widgets without touching existing code
- **Testability**: Each widget can be tested independently
