import { X, Loader2, Sparkles, History, Trash2, Clock } from 'lucide-react'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Summary } from '../lib/aiSummary'
import { getSummaries, deleteSummary } from '../lib/aiSummary'
import { MarkdownRenderer } from './MarkdownRenderer'

interface SummaryModalProps {
  isOpen: boolean
  onClose: () => void
  currentSummary?: {
    content: string
    isLoading: boolean
    error?: string
  } | null
  onGenerateSummary: () => void
}

type ViewMode = 'current' | 'history'

export function SummaryModal({
  isOpen,
  onClose,
  currentSummary,
  onGenerateSummary,
}: SummaryModalProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('current')
  const [histories, setHistories] = useState<Summary[]>([])
  const [selectedHistory, setSelectedHistory] = useState<Summary | null>(null)

  useEffect(() => {
    if (isOpen && viewMode === 'history') {
      setHistories(getSummaries())
    }
  }, [isOpen, viewMode])

  const handleDelete = (id: string) => {
    deleteSummary(id)
    setHistories(getSummaries())
    if (selectedHistory?.id === id) {
      setSelectedHistory(null)
    }
  }

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate)
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={handleOverlayClick}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="glass-dark w-full max-w-2xl max-h-[80vh] rounded-lg overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-[hsl(var(--orange-primary))]" />
                <h2 className="text-lg font-semibold text-white">AI Summary</h2>
              </div>
              <div className="flex items-center gap-2">
                {/* View Mode Toggle */}
                <div className="flex items-center gap-1 bg-white/5 rounded p-1">
                  <button
                    type="button"
                    onClick={() => setViewMode('current')}
                    className={`px-3 py-1 text-xs rounded transition-colors ${
                      viewMode === 'current'
                        ? 'bg-[hsl(var(--orange-primary))] text-white'
                        : 'text-white/60 hover:text-white/80'
                    }`}
                  >
                    Current
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('history')}
                    className={`px-3 py-1 text-xs rounded transition-colors flex items-center gap-1 ${
                      viewMode === 'history'
                        ? 'bg-[hsl(var(--orange-primary))] text-white'
                        : 'text-white/60 hover:text-white/80'
                    }`}
                  >
                    <History className="w-3 h-3" />
                    History
                  </button>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1 rounded hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5 text-white/70" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {viewMode === 'current' ? (
                <div>
                  {currentSummary?.isLoading ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <Loader2 className="w-8 h-8 text-[hsl(var(--orange-primary))] animate-spin mb-4" />
                      <p className="text-white/60 text-sm">Generating summary...</p>
                    </div>
                  ) : currentSummary?.error ? (
                    <div className="bg-red-500/10 border border-red-500/20 rounded p-4 text-red-400 text-sm">
                      {currentSummary.error}
                    </div>
                  ) : currentSummary?.content ? (
                    <div className="bg-white/5 rounded-lg p-4">
                      <MarkdownRenderer content={currentSummary.content} />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <Sparkles className="w-12 h-12 text-white/20 mb-4" />
                      <p className="text-white/60 text-sm mb-4">
                        No summary generated yet for this page.
                      </p>
                      <button
                        type="button"
                        onClick={onGenerateSummary}
                        className="px-4 py-2 bg-[hsl(var(--orange-primary))] hover:bg-[hsl(var(--orange-hover))] text-white rounded text-sm transition-colors"
                      >
                        Generate Summary
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {histories.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <History className="w-12 h-12 text-white/20 mb-4" />
                      <p className="text-white/60 text-sm">No summary history yet.</p>
                    </div>
                  ) : selectedHistory ? (
                    <div>
                      <button
                        type="button"
                        onClick={() => setSelectedHistory(null)}
                        className="text-sm text-white/60 hover:text-white mb-4 flex items-center gap-1"
                      >
                        ← Back to list
                      </button>
                      <div className="bg-white/5 rounded-lg p-4">
                        <div className="mb-4 pb-3 border-b border-white/10">
                          <h3 className="text-white font-semibold">{selectedHistory.pageTitle}</h3>
                          <div className="flex items-center gap-2 text-xs text-white/40 mt-1">
                            <Clock className="w-3 h-3" />
                            {formatDate(selectedHistory.createdAt)}
                          </div>
                        </div>
                        <MarkdownRenderer content={selectedHistory.content} />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {histories.map((summary) => (
                        <div
                          key={summary.id}
                          className="bg-white/5 hover:bg-white/10 rounded-lg p-3 transition-colors cursor-pointer group"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div
                              className="flex-1"
                              onClick={() => setSelectedHistory(summary)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  setSelectedHistory(summary)
                                }
                              }}
                            >
                              <h4 className="text-white text-sm font-medium mb-1">
                                {summary.pageTitle}
                              </h4>
                              <div className="flex items-center gap-2 text-xs text-white/40">
                                <Clock className="w-3 h-3" />
                                {formatDate(summary.createdAt)}
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDelete(summary.id)
                              }}
                              className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-500/20 transition-all"
                            >
                              <Trash2 className="w-4 h-4 text-red-400" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
