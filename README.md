# Gaze Dashboard

A Glance-like SSG (Static Site Generator) Dashboard built with Astro, React, and Tailwind CSS v4.

![Gaze Dashboard Screenshot](screenshot.png)

## Architecture

**Pure SSG (Snapshot Model)** - Zero runtime fetch architecture:
- All data is fetched during build process via widget fetchers
- No client-side API calls
- Each widget has its own fetcher that runs during Astro build
- Data is embedded directly into static HTML

## Tech Stack

- **Core**: Astro (latest), React (Islands), TypeScript
- **Styling**: Tailwind CSS v4 (Oxide engine), Framer Motion
- **UI**: shadcn/ui, Magic UI, Lucide React icons
- **Layout**: CSS Grid-based Bento Grid (responsive)
- **Tooling**: Biome (Lint/Format), Bun (Runtime & Scripting)

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) (latest version)

### Installation

```bash
# Install dependencies
bun install

# Start development server (fetches data automatically)
bun run dev

# Build for production (includes data fetching)
bun run build

# Preview production build
bun run preview
```

## Deployment

### GitHub Pages Setup

1. Fork this repository
2. Go to **Settings → Pages** and set source to **GitHub Actions**
3. Push any change to trigger the deployment workflow

The site will be deployed to `https://<your-username>.github.io/gaze/`

### Auto-Refresh Schedule

By default, the dashboard rebuilds every 6 hours to fetch fresh data. To change this schedule:

1. Edit [.github/workflows/deploy.yml](.github/workflows/deploy.yml#L8-L10)
2. Modify the `cron` expression in the `schedule` section:
   ```yaml
   schedule:
     - cron: '0 */6 * * *'  # Every 6 hours
   ```

Common schedules:
- Every hour: `'0 * * * *'`
- Every 3 hours: `'0 */3 * * *'`
- Every 12 hours: `'0 */12 * * *'`
- Daily at midnight UTC: `'0 0 * * *'`

Learn more about cron syntax at [crontab.guru](https://crontab.guru/).

## Widget System

The dashboard uses a **widget-based architecture** where each widget fetches its own data during build:

1. Widgets are defined in `src/widgets/` directory
2. Each widget has a `fetcher.ts` that runs during build
3. Add environment variables to `.env` for API keys
4. Widget data is fetched in parallel (max 10 concurrent requests)
5. Failed widgets show error state instead of breaking the build

See [src/widgets/README.md](src/widgets/README.md) for detailed guide on creating widgets.

## Project Structure

```
gaze/
├── src/
│   ├── components/     # React components (BentoGrid, etc.)
│   ├── config/         # Dashboard configuration
│   ├── layouts/        # Astro layouts
│   ├── lib/            # Utility functions (widgetData.ts)
│   ├── pages/          # Astro pages (index.astro)
│   ├── styles/         # Global styles & Tailwind config
│   └── widgets/        # Widget definitions (component + fetcher)
├── public/             # Static assets
└── astro.config.mjs    # Astro configuration
```

## Design Theme

- **Dark Mode** by default
- **Glassmorphism** effect (blur, subtle borders)
- **Instant load** (static HTML)
- **Animated transitions** via Framer Motion

## Development

### Linting & Formatting

```bash
# Check code quality
bun run lint

# Format code
bun run format

# Check and fix
bun run check
```

## Environment Variables

If your widgets require API keys, create a `.env` file (copy from `.env.example`):

```bash
# Weather widget
OPEN_METEO_API_KEY=your_api_key_here

# Add more as needed
```

For CI/CD, add these as secrets in your repository settings (Settings → Secrets and variables → Actions).

## Use as Browser New Tab Page

You can set your deployed Gaze dashboard as your browser's new tab page using the **New Tab Redirect** Chrome extension:

1. Install [New Tab Redirect](https://chrome.google.com/webstore/detail/new-tab-redirect/icpgjfneehieebagbmdbhnlpiopdcmna) from Chrome Web Store
2. Click the extension icon and go to **Options**
3. In the **Redirect URL** field, enter your GitHub Pages URL (e.g., `https://yourusername.github.io/gaze/`)
4. Click **Save**

Now every new tab will open your personalized Gaze dashboard.

## License

MIT
