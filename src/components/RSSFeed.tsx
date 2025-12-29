import { DashboardCard } from './DashboardCard'

const rssFeedItems = [
  { title: 'CSS display contents', author: 'Rachel Andrew', time: '1d' },
  { title: 'Understanding React Server Components', author: 'Dan Abramov', time: '2d' },
  { title: 'The Future of JavaScript', author: 'Axel Rauschmayer', time: '3d' },
  { title: 'Web Performance in 2024', author: 'Addy Osmani', time: '4d' },
]

export function RSSFeed() {
  return (
    <DashboardCard title="RSS Feed">
      <div className="space-y-3">
        {rssFeedItems.map((item, idx) => (
          <div
            key={`rss-${idx}-${item.title}`}
            className="border-b border-zinc-200 dark:border-[#1a1a1a] last:border-b-0 pb-3 last:pb-0"
          >
            <span className="text-zinc-700 dark:text-zinc-300 text-[14px] font-mono hover:text-[#ff6b1a] transition-colors block mb-1 cursor-pointer">
              {item.title}
            </span>
            <div className="flex items-center gap-1.5 text-[13px] font-mono text-zinc-500 dark:text-zinc-600">
              <span>{item.author}</span>
              <span>•</span>
              <span>{item.time}</span>
            </div>
          </div>
        ))}
      </div>
    </DashboardCard>
  )
}
