import { DashboardCard } from './DashboardCard'

const videos = [
  { title: '3D Printing Tips', views: '234K', duration: '12:34' },
  { title: 'CSS Flexbox', views: '567K', duration: '8:22' },
  { title: 'Zen 5 Review', views: '123K', duration: '15:47' },
  { title: 'REST API Guide', views: '890K', duration: '22:15' },
]

export function Videos() {
  return (
    <DashboardCard title="Videos">
      <div className="grid grid-cols-4 gap-3">
        {videos.map((video, idx) => (
          <div
            key={`video-${idx}-${video.title}`}
            className="group cursor-pointer"
          >
            <div className="aspect-video bg-zinc-200 dark:bg-zinc-800/50 rounded-sm mb-2 relative overflow-hidden border border-zinc-300 dark:border-[#2a2a2a]">
              <div className="absolute inset-0 bg-linear-to-br from-zinc-300/30 to-zinc-400/50 dark:from-zinc-800/30 dark:to-zinc-900/50 group-hover:from-zinc-400/30 dark:group-hover:from-zinc-700/30 transition-colors" />
              <div className="absolute bottom-1 right-1 bg-black/90 px-1.5 py-0.5 rounded-sm text-[13px] font-mono text-zinc-200 dark:text-zinc-400">
                {video.duration}
              </div>
            </div>
            <h3 className="text-[13px] font-mono text-zinc-600 dark:text-zinc-400 group-hover:text-[#ff6b1a] transition-colors line-clamp-2 leading-tight">
              {video.title}
            </h3>
            <div className="text-[13px] font-mono text-zinc-400 dark:text-zinc-700 mt-1">
              {video.views} views
            </div>
          </div>
        ))}
      </div>
    </DashboardCard>
  )
}
