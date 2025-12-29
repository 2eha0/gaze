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

```astro
---
import type { WidgetProps } from '../../types/widget'
import { WidgetError } from '../../components/WidgetError'
import type { MyWidgetData } from './types'

interface Props extends WidgetProps<MyWidgetData> {}

const { config, data } = Astro.props

// Check for errors
const isError = data && typeof data === 'object' && 'error' in data
const errorMessage = isError && 'message' in data ? String(data.message) : 'Failed to fetch data'
---

<div class="my-widget glass rounded-lg p-6">
  {isError ? (
    <WidgetError widgetType="My Widget" error={errorMessage} client:load />
  ) : !data ? (
    <WidgetError widgetType="My Widget" error="No data available" client:load />
  ) : (
    <!-- Render widget content -->
  )}
</div>
```

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

1. **Error Handling**: Always include error state handling in your widget component
2. **Type Safety**: Define clear TypeScript interfaces for config and data
3. **Fallback Data**: Provide fallback/mock data in fetcher if API fails
4. **Loading States**: Consider adding loading indicators for async operations
5. **Responsive Design**: Use Tailwind utilities for responsive layouts
6. **Accessibility**: Include proper ARIA labels and semantic HTML

## Architecture Benefits

- **Modularity**: Each widget is self-contained
- **Type Safety**: Strong typing across config, fetcher, and component
- **Maintainability**: Easy to find and modify widget code
- **Scalability**: Simple to add new widgets without touching existing code
- **Testability**: Each widget can be tested independently
