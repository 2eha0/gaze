/**
 * AI Summary Feature - localStorage utilities and types
 */

export interface LLMConfig {
  apiUrl: string
  apiKey: string
  model: string
}

export interface Summary {
  id: string
  pageTitle: string
  pageSlug: string
  content: string
  createdAt: string
}

const STORAGE_KEYS = {
  LLM_CONFIG: 'gaze_llm_config',
  SUMMARIES: 'gaze_summaries',
} as const

/**
 * Get LLM configuration from localStorage
 */
export function getLLMConfig(): LLMConfig | null {
  if (typeof window === 'undefined') return null

  try {
    const config = localStorage.getItem(STORAGE_KEYS.LLM_CONFIG)
    return config ? JSON.parse(config) : null
  } catch (error) {
    console.error('Failed to get LLM config:', error)
    return null
  }
}

/**
 * Save LLM configuration to localStorage
 */
export function saveLLMConfig(config: LLMConfig): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(STORAGE_KEYS.LLM_CONFIG, JSON.stringify(config))
  } catch (error) {
    console.error('Failed to save LLM config:', error)
  }
}

/**
 * Get all summaries from localStorage
 */
export function getSummaries(): Summary[] {
  if (typeof window === 'undefined') return []

  try {
    const summaries = localStorage.getItem(STORAGE_KEYS.SUMMARIES)
    return summaries ? JSON.parse(summaries) : []
  } catch (error) {
    console.error('Failed to get summaries:', error)
    return []
  }
}

/**
 * Save a new summary to localStorage
 */
export function saveSummary(summary: Omit<Summary, 'id' | 'createdAt'>): Summary {
  const newSummary: Summary = {
    ...summary,
    id: `summary_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    createdAt: new Date().toISOString(),
  }

  try {
    const summaries = getSummaries()
    summaries.unshift(newSummary) // Add to beginning
    localStorage.setItem(STORAGE_KEYS.SUMMARIES, JSON.stringify(summaries))
    return newSummary
  } catch (error) {
    console.error('Failed to save summary:', error)
    throw error
  }
}

/**
 * Delete a summary by ID
 */
export function deleteSummary(id: string): void {
  try {
    const summaries = getSummaries()
    const filtered = summaries.filter((s) => s.id !== id)
    localStorage.setItem(STORAGE_KEYS.SUMMARIES, JSON.stringify(filtered))
  } catch (error) {
    console.error('Failed to delete summary:', error)
  }
}

/**
 * Generate AI summary using configured LLM
 */
export async function generateAISummary(
  pageContent: string,
  pageTitle: string,
): Promise<string> {
  const config = getLLMConfig()

  if (!config) {
    throw new Error('LLM configuration not found. Please configure your API settings.')
  }

  if (!config.apiUrl || !config.apiKey) {
    throw new Error('Invalid LLM configuration. Please check your API URL and key.')
  }

  try {
    const response = await fetch(config.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.model || 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content:
              'You are a helpful assistant that summarizes web page content. Create concise, informative summaries in markdown format with bullet points for key information.',
          },
          {
            role: 'user',
            content: `Please summarize the following page titled "${pageTitle}":\n\n${pageContent}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`API request failed: ${response.status} - ${errorText}`)
    }

    const data = await response.json()

    // Support both OpenAI and OpenAI-compatible APIs
    const summary =
      data.choices?.[0]?.message?.content || data.response || 'No summary generated.'

    return summary.trim()
  } catch (error) {
    console.error('Failed to generate AI summary:', error)
    throw error
  }
}
