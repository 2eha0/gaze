# AI Summary Feature

This document describes the AI summary feature that has been added to Gaze Dashboard.

## Overview

The AI summary feature allows users to generate AI-powered summaries of the current page content using their own LLM API. Summaries are displayed in a modal with markdown formatting and are stored locally in the browser for future reference.

## Features

### 1. **LLM Configuration**
- Accessible via the settings button (⚙️) in the top-right navigation bar
- Users can configure:
  - **API URL**: The endpoint for the LLM API (OpenAI or OpenAI-compatible)
  - **API Key**: Authentication key for the API
  - **Model**: The model to use (e.g., `gpt-3.5-turbo`, `gpt-4`, etc.)
- Credentials are stored securely in browser's localStorage
- A red indicator dot appears on the AI Summary button if configuration is missing

### 2. **AI Summary Generation**
- Accessible via the sparkles button (✨) in the top-right navigation bar
- Clicking the button when unconfigured prompts the user to configure their LLM API
- When configured, opens the summary modal
- Users can generate a summary from the modal
- Features a non-blocking loading animation during generation
- Automatically extracts page content (up to ~8000 characters to avoid token limits)
- Displays errors if the API request fails

### 3. **Summary Modal**
- **Two View Modes:**
  - **Current**: Shows the currently generated summary for this page
  - **History**: Shows all previously generated summaries across all pages

- **Current View:**
  - Shows the generated summary with markdown rendering
  - Displays loading spinner during generation
  - Shows error messages if generation fails
  - Includes a "Generate Summary" button if no summary exists

- **History View:**
  - Lists all saved summaries with:
    - Page title
    - Timestamp (formatted as "MMM DD, HH:MM")
    - Delete button (appears on hover)
  - Click a summary to view its full content
  - Click "Back to list" to return to the summary list

### 4. **Markdown Rendering**
The custom markdown renderer supports:
- Headers (# ## ###)
- Bold (**text**)
- Italic (*text*)
- Code blocks (```code```)
- Inline code (`code`)
- Links ([text](url))
- Unordered lists (- or *)
- Ordered lists (1. 2. 3.)
- Line breaks

### 5. **Data Storage**
All data is stored in browser's localStorage:
- **LLM Configuration**: `gaze_llm_config`
- **Summary History**: `gaze_summaries`

No data is sent to Gaze servers - all API calls go directly from the user's browser to their configured LLM API.

## Architecture

### Components

1. **`src/lib/aiSummary.ts`**
   - Core utilities for localStorage operations
   - LLM API integration
   - Type definitions for LLMConfig and Summary

2. **`src/components/SettingsModal.tsx`**
   - Modal for configuring LLM API settings
   - Form validation and save functionality

3. **`src/components/SummaryModal.tsx`**
   - Main summary display modal
   - Handles both current and history views
   - Integrates with summary generation logic

4. **`src/components/MarkdownRenderer.tsx`**
   - Simple markdown-to-HTML converter
   - Uses dangerouslySetInnerHTML (content is internally generated, not user input)

5. **`src/components/AIActions.tsx`**
   - Main orchestrator component
   - Handles button clicks and modal states
   - Manages summary generation flow
   - Extracts page content using TreeWalker API

### Integration Points

- **Navigation**: Updated `src/components/Navigation.astro` to include AI action buttons
- **Layouts**: Updated `src/layouts/BaseLayout.astro` to pass current page info
- **Pages**: Updated both `src/pages/index.astro` and `src/pages/[...slug].astro` to provide page context

## User Flow

### First-Time Setup
1. User clicks the sparkles (✨) button
2. Settings modal opens automatically (red dot indicates missing configuration)
3. User enters their LLM API details
4. User clicks "Save Settings"
5. Configuration is stored in localStorage

### Generating a Summary
1. User navigates to any page
2. User clicks the sparkles (✨) button
3. Summary modal opens
4. User clicks "Generate Summary" button
5. Loading animation appears (user can close modal and continue browsing)
6. Summary is generated and displayed in markdown format
7. Summary is automatically saved to history

### Viewing History
1. User clicks the sparkles (✨) button
2. In the summary modal, click the "History" tab
3. Browse previously generated summaries
4. Click any summary to view its full content
5. Hover and click trash icon to delete unwanted summaries

## API Compatibility

The feature supports:
- **OpenAI API**: Direct compatibility with OpenAI's chat completions endpoint
- **OpenAI-Compatible APIs**: Any API that follows the OpenAI chat completions format
  - Examples: Together AI, Groq, Azure OpenAI, local models via LM Studio, etc.

### Example Configurations

**OpenAI:**
```
API URL: https://api.openai.com/v1/chat/completions
API Key: sk-...
Model: gpt-3.5-turbo
```

**Groq:**
```
API URL: https://api.groq.com/openai/v1/chat/completions
API Key: gsk_...
Model: mixtral-8x7b-32768
```

**Local (LM Studio):**
```
API URL: http://localhost:1234/v1/chat/completions
API Key: not-needed
Model: local-model
```

## Technical Details

### Content Extraction
- Uses `TreeWalker` API to extract text nodes from the page
- Filters out script and style tags
- Limits content to 8000 characters to avoid token limits
- Joins text with newlines to preserve structure

### Error Handling
- Configuration validation before API calls
- Network error handling with user-friendly messages
- Failed summaries don't break the page experience
- Errors are displayed in the summary modal

### Performance
- Non-blocking: Users can close the modal while summary generates
- Loading state prevents duplicate requests
- Summaries are cached in localStorage
- Modals use Framer Motion for smooth animations

## Styling

All components follow the Gaze design system:
- Dark mode theme
- Glassmorphism effects (`.glass-dark`)
- Orange accent color (`hsl(var(--orange-primary))`)
- Monospace font family
- Consistent spacing and borders

## Future Enhancements

Possible improvements:
1. Summary customization (tone, length, format)
2. Export summaries to markdown files
3. Share summaries via URL
4. Multiple LLM provider presets
5. Summary comparison across page versions
6. Search functionality in history
7. Tags/categories for summaries
8. Batch summarization for multiple pages
