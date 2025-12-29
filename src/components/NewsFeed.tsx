import { useState } from 'react'
import { cn } from '../lib/utils'
import { DashboardCard } from './DashboardCard'

const hackerNewsItems = [
  {
    title: 'Show HN: Wealthfolio – Open-source investment tracker',
    points: 342,
    comments: 89,
    domain: 'github.com',
  },
  { title: 'Nginx has moved to GitHub', points: 1204, comments: 234, domain: 'github.com' },
  { title: 'A new approach to context-aware AI', points: 567, comments: 123, domain: 'openai.com' },
  { title: 'The state of WebAssembly in 2024', points: 789, comments: 156, domain: 'wasm.org' },
  {
    title: 'Show HN: I built a terminal-based dashboard',
    points: 423,
    comments: 67,
    domain: 'github.com',
  },
]

const lobstersItems = [
  {
    title: "Understanding Rust's ownership system",
    points: 156,
    comments: 34,
    domain: 'rust-lang.org',
  },
  { title: 'Why I switched from Vim to Neovim', points: 234, comments: 89, domain: 'neovim.io' },
  { title: 'Building a compiler from scratch', points: 345, comments: 45, domain: 'dev.to' },
]

export function NewsFeed({ client: _client }: { client?: string }) {
  const [activeTab, setActiveTab] = useState<'hackernews' | 'lobsters'>('hackernews')

  const items = activeTab === 'hackernews' ? hackerNewsItems : lobstersItems

  return (
    <DashboardCard>
      <div className="flex gap-4 mb-3 border-b border-zinc-200 dark:border-[#2a2a2a]">
        <button
          type="button"
          onClick={() => setActiveTab('hackernews')}
          className={cn(
            'text-[13px] font-mono uppercase tracking-wider pb-2 transition-colors',
            activeTab === 'hackernews'
              ? 'text-[#ff6b1a] border-b-2 border-[#ff6b1a]'
              : 'text-zinc-500 dark:text-zinc-600 hover:text-zinc-700 dark:hover:text-zinc-400',
          )}
        >
          Hacker News
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('lobsters')}
          className={cn(
            'text-[13px] font-mono uppercase tracking-wider pb-2 transition-colors',
            activeTab === 'lobsters'
              ? 'text-[#ff6b1a] border-b-2 border-[#ff6b1a]'
              : 'text-zinc-500 dark:text-zinc-600 hover:text-zinc-700 dark:hover:text-zinc-400',
          )}
        >
          Lobsters
        </button>
      </div>

      <div className="space-y-3">
        {items.map((item, idx) => (
          <div
            key={`news-${activeTab}-${idx}-${item.title}`}
            className="border-b border-zinc-200 dark:border-[#1a1a1a] last:border-b-0 pb-3 last:pb-0"
          >
            <span className="text-zinc-800 dark:text-zinc-200 text-[14px] font-mono hover:text-[#ff6b1a] transition-colors block mb-1 cursor-pointer">
              {item.title}
            </span>
            <div className="flex items-center gap-1.5 text-[13px] font-mono text-zinc-500 dark:text-zinc-600">
              <span>{item.points} points</span>
              <span>•</span>
              <span>{item.comments} comments</span>
              <span>•</span>
              <span className="text-zinc-400 dark:text-zinc-700">{item.domain}</span>
            </div>
          </div>
        ))}
      </div>
    </DashboardCard>
  )
}
