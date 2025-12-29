# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Gaze is a **Pure SSG Dashboard** (Static Site Generator) following the Glance-like architecture. The critical architectural constraint is **zero runtime fetch** - all data must be fetched during the CI/CD build process, not at runtime.

## Core Architecture: Build-Time Data Pipeline

The application fetches all data during Astro's build process:

1. **Page Rendering** - Astro builds pages from configuration
2. **Widget Data Fetch** - Each page calls `fetchPageWidgetData()` from `src/lib/widgetData.ts`
3. **Parallel Fetching** - Widget fetchers run concurrently (max 10 simultaneous requests)
4. **Error Handling** - Failed widgets show error state instead of breaking the build
5. **Static Output** - Pure HTML/CSS/JS with pre-fetched data embedded

This means:
- Never add `fetch()` calls in React components or Astro pages
- All dynamic data must be fetched through widget fetchers during build
- Each widget's `fetcher` function runs once per page build

## Development Commands

### Essential Workflow
```bash
# Install dependencies (requires Bun runtime)
bun install

# Development server (fetches data automatically during dev)
bun run dev

# Production build (includes TypeScript checking and data fetching)
bun run build

# Preview production build
bun run preview
```

### Code Quality
```bash
# Check only (no fixes)
bun run lint

# Format files
bun run format

# Check and auto-fix
bun run check
```

## Tech Stack Configuration

### Tailwind CSS v4 (Oxide Engine)
- **NO** `@astrojs/tailwind` integration (removed due to v4 incompatibility)
- Uses `@tailwindcss/postcss` directly via PostCSS
- Configuration: `postcss.config.cjs` + `tailwind.config.ts`
- **Important**: Do not use `@apply` with custom CSS variables in v4 - use inline styles or regular CSS instead
- Global styles use CSS variables defined in `:root` without `@layer` directives

### Astro + React Islands
- React components use `client:load` directive for interactivity
- Framer Motion must be in `vite.ssr.noExternal` (already configured)
- Vite CSS transformer set to `postcss` (required for Tailwind v4)

### Code Quality with Biome
- Biome handles both linting and formatting (no ESLint/Prettier)
- Config: `biome.json`
- Enforces single quotes, trailing commas, 2-space indentation

## Adding New Widgets

To add a new widget with data fetching:

1. **Create widget directory** in `src/widgets/my-widget/`
2. **Define types** in `types.ts` (config and data interfaces)
3. **Create fetcher** in `fetcher.ts` (async function that returns data)
4. **Create component** in `MyWidget.astro` (UI with error handling)
5. **Export widget** in `index.ts` (combine component + fetcher)
6. **Register widget** in `src/widgets/index.ts`

See `src/widgets/README.md` for detailed guide.

Widget fetchers:
- Run during build time only (zero runtime fetching)
- Support concurrency control (max 10 parallel requests)
- Must handle errors gracefully (return error object on failure)
- Can use environment variables for API keys

## Widget Data Flow

During page build:
1. Page imports `fetchPageWidgetData` from `src/lib/widgetData.ts`
2. Function collects all widgets from page configuration
3. Uses p-limit to fetch data concurrently (max 10 parallel)
4. Each widget's fetcher runs independently
5. Returns Map of slug → widget props (config + data)
6. Page renders widgets with fetched data

Error handling:
- Failed fetchers return `{ error: true, message: string }`
- Widget components check for error and display error state
- Build continues even if some widgets fail

## Design System

### Theme
- Dark mode only (no light mode toggle)
- Glassmorphism effects via `.glass` and `.glass-dark` utility classes
- CSS variables for colors in `src/styles/globals.css`

### Layout Pattern: Bento Grid
- Component: `src/components/BentoGrid.tsx`
- Responsive CSS Grid (1 col mobile → 2 col tablet → 4 col desktop)
- Cards support span props: `sm` (1 col), `md` (2 col), `lg` (3 col), `full` (4 col)
- All cards have Framer Motion entrance animations

### Styling Guidelines
- Use Tailwind utilities for spacing, typography, colors
- Use `.glass` for glassmorphism cards
- Color palette via CSS variables (e.g., `hsl(var(--background))`)
- Animations via Framer Motion, not CSS transitions

## Common Pitfalls

1. **Don't use @astrojs/tailwind** - The integration is incompatible with Tailwind v4. PostCSS is configured directly.

2. **Widget fetchers must be async** - All widget fetchers must return a Promise, even if data is static.

3. **React component hydration** - Interactive components need `client:load` directive in Astro files.

4. **Environment variables** - Use `.env` for local development (copy from `.env.example`). CI/CD needs secrets configured.

5. **Error handling in widgets** - Always check for error state in widget components before rendering data.

## CI/CD Considerations

GitHub Actions workflow should:
1. Install Bun
2. Run `bun install`
3. Run `bun run build` (fetches data automatically during build)
4. Deploy `dist/` directory

The build process fetches fresh data each time, so no separate data refresh step is needed.
