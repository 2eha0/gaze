import { ArrowUp, MessageSquare } from 'lucide-react'
import { DashboardCard } from './DashboardCard'

const redditPosts = [
  {
    title: 'Apple announces new Vision Pro features',
    upvotes: 1234,
    comments: 456,
    domain: 'apple.com',
    thumbnail: 'bg-gradient-to-br from-gray-700 to-gray-900',
  },
  {
    title: "Google's new AI model surpasses GPT-4",
    upvotes: 2345,
    comments: 789,
    domain: 'google.com',
    thumbnail: 'bg-gradient-to-br from-blue-700 to-blue-900',
  },
  {
    title: 'Microsoft acquires AI startup for $10B',
    upvotes: 567,
    comments: 123,
    domain: 'microsoft.com',
    thumbnail: 'bg-gradient-to-br from-green-700 to-green-900',
  },
  {
    title: 'Tesla unveils new battery technology',
    upvotes: 890,
    comments: 234,
    domain: 'tesla.com',
    thumbnail: 'bg-gradient-to-br from-red-700 to-red-900',
  },
]

export function Subreddits() {
  return (
    <DashboardCard title="/r/Technology">
      <div className="space-y-3">
        {redditPosts.map((post, idx) => (
          <div
            key={`reddit-${idx}-${post.title}`}
            className="flex gap-3 border-b border-zinc-200 dark:border-[#1a1a1a] last:border-b-0 pb-3 last:pb-0"
          >
            <div className={`w-16 h-16 ${post.thumbnail} rounded-sm shrink-0`} />
            <div className="flex-1 min-w-0">
              <span className="text-[14px] font-mono text-zinc-700 dark:text-zinc-300 hover:text-[#ff6b1a] transition-colors block mb-1 line-clamp-2 cursor-pointer">
                {post.title}
              </span>
              <div className="flex items-center gap-2 text-[13px] font-mono text-zinc-500 dark:text-zinc-600">
                <span className="flex items-center gap-1">
                  <ArrowUp className="w-3 h-3" />
                  {post.upvotes}
                </span>
                <span className="flex items-center gap-1">
                  <MessageSquare className="w-3 h-3" />
                  {post.comments}
                </span>
                <span className="text-zinc-400 dark:text-zinc-700">{post.domain}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </DashboardCard>
  )
}
