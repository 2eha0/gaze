import { X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { LLMConfig } from '../lib/aiSummary'
import { getLLMConfig, saveLLMConfig } from '../lib/aiSummary'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [config, setConfig] = useState<LLMConfig>({
    apiUrl: '',
    apiKey: '',
    model: '',
  })
  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    if (isOpen) {
      const savedConfig = getLLMConfig()
      if (savedConfig) {
        setConfig(savedConfig)
      }
    }
  }, [isOpen])

  const handleSave = () => {
    saveLLMConfig(config)
    setIsSaved(true)
    setTimeout(() => {
      setIsSaved(false)
      onClose()
    }, 1000)
  }

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
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
            className="glass-dark w-full max-w-md rounded-lg overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h2 className="text-lg font-semibold text-white">LLM API Settings</h2>
              <button
                type="button"
                onClick={onClose}
                className="p-1 rounded hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5 text-white/70" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4">
              <div className="text-sm text-white/60 mb-4">
                Configure your LLM API to enable AI summary features. We support OpenAI and
                OpenAI-compatible APIs.
              </div>

              {/* API URL */}
              <div>
                <label htmlFor="apiUrl" className="block text-sm font-medium text-white/80 mb-2">
                  API URL
                </label>
                <input
                  id="apiUrl"
                  type="text"
                  placeholder="https://api.openai.com/v1/chat/completions"
                  value={config.apiUrl}
                  onChange={(e) => setConfig({ ...config, apiUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white placeholder-white/30 focus:outline-none focus:border-[hsl(var(--orange-primary))] transition-colors"
                />
              </div>

              {/* API Key */}
              <div>
                <label htmlFor="apiKey" className="block text-sm font-medium text-white/80 mb-2">
                  API Key
                </label>
                <input
                  id="apiKey"
                  type="password"
                  placeholder="sk-..."
                  value={config.apiKey}
                  onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white placeholder-white/30 focus:outline-none focus:border-[hsl(var(--orange-primary))] transition-colors"
                />
              </div>

              {/* Model */}
              <div>
                <label htmlFor="model" className="block text-sm font-medium text-white/80 mb-2">
                  Model
                </label>
                <input
                  id="model"
                  type="text"
                  placeholder="gpt-3.5-turbo"
                  value={config.model}
                  onChange={(e) => setConfig({ ...config, model: e.target.value })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white placeholder-white/30 focus:outline-none focus:border-[hsl(var(--orange-primary))] transition-colors"
                />
              </div>

              {/* Note */}
              <div className="text-xs text-white/40 bg-white/5 p-3 rounded">
                <strong>Note:</strong> Your API credentials are stored locally in your browser and
                never sent to our servers.
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-4 border-t border-white/10">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm text-white/70 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-4 py-2 text-sm bg-[hsl(var(--orange-primary))] hover:bg-[hsl(var(--orange-hover))] text-white rounded transition-colors"
              >
                {isSaved ? '✓ Saved!' : 'Save Settings'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
