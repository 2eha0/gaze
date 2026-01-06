import { Settings, Sparkles } from 'lucide-react'
import { useState, useEffect } from 'react'
import { SettingsModal } from './SettingsModal'
import { SummaryModal } from './SummaryModal'
import { getLLMConfig, generateAISummary, saveSummary } from '../lib/aiSummary'

interface AIActionsProps {
  pageTitle: string
  pageSlug: string
}

export function AIActions({ pageTitle, pageSlug }: AIActionsProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isSummaryOpen, setIsSummaryOpen] = useState(false)
  const [hasConfig, setHasConfig] = useState(false)
  const [currentSummary, setCurrentSummary] = useState<{
    content: string
    isLoading: boolean
    error?: string
  } | null>(null)

  useEffect(() => {
    // Check if LLM config exists
    const config = getLLMConfig()
    setHasConfig(!!config?.apiUrl && !!config?.apiKey)
  }, [isSettingsOpen])

  const extractPageContent = (): string => {
    // Extract text content from the page
    const mainContent = document.querySelector('main')
    if (!mainContent) return ''

    // Get all text nodes, excluding scripts and styles
    const walker = document.createTreeWalker(mainContent, NodeFilter.SHOW_TEXT, {
      acceptNode: (node) => {
        const parent = node.parentElement
        if (!parent) return NodeFilter.FILTER_REJECT

        const tagName = parent.tagName.toLowerCase()
        if (tagName === 'script' || tagName === 'style') {
          return NodeFilter.FILTER_REJECT
        }

        const text = node.textContent?.trim()
        if (!text) return NodeFilter.FILTER_REJECT

        return NodeFilter.FILTER_ACCEPT
      },
    })

    const textParts: string[] = []
    let currentNode: Node | null = walker.nextNode()

    while (currentNode) {
      const text = currentNode.textContent?.trim()
      if (text && text.length > 0) {
        textParts.push(text)
      }
      currentNode = walker.nextNode()
    }

    return textParts.join('\n').slice(0, 8000) // Limit to ~8k chars to avoid token limits
  }

  const handleGenerateSummary = async () => {
    if (!hasConfig) {
      setIsSettingsOpen(true)
      return
    }

    setIsSummaryOpen(true)
    setCurrentSummary({ content: '', isLoading: true })

    try {
      const pageContent = extractPageContent()
      const summaryContent = await generateAISummary(pageContent, pageTitle)

      setCurrentSummary({ content: summaryContent, isLoading: false })

      // Save to history
      saveSummary({
        pageTitle,
        pageSlug,
        content: summaryContent,
      })
    } catch (error) {
      setCurrentSummary({
        content: '',
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to generate summary',
      })
    }
  }

  const handleSummaryClick = () => {
    if (!hasConfig) {
      setIsSettingsOpen(true)
    } else {
      setIsSummaryOpen(true)
    }
  }

  return (
    <>
      <div className="flex items-center gap-2">
        {/* AI Summary Button */}
        <button
          type="button"
          onClick={handleSummaryClick}
          className="p-2 rounded hover:bg-white/10 transition-colors group relative"
          title="AI Summary"
        >
          <Sparkles className="w-4 h-4 text-white/70 group-hover:text-[hsl(var(--orange-primary))]" />
          {!hasConfig && (
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
          )}
        </button>

        {/* Settings Button */}
        <button
          type="button"
          onClick={() => setIsSettingsOpen(true)}
          className="p-2 rounded hover:bg-white/10 transition-colors group"
          title="Settings"
        >
          <Settings className="w-4 h-4 text-white/70 group-hover:text-white" />
        </button>
      </div>

      {/* Modals */}
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      <SummaryModal
        isOpen={isSummaryOpen}
        onClose={() => setIsSummaryOpen(false)}
        currentSummary={currentSummary}
        onGenerateSummary={handleGenerateSummary}
      />
    </>
  )
}
