import { DashboardCard } from './DashboardCard'

const twitchUsers = [
  { name: 'zackrawrr', status: 'Just Chatting', isLive: true },
  { name: 'ThePrimeagen', status: 'Science & Technology', isLive: true },
  { name: 'cohhcarnage', status: 'Offline', isLive: false },
  { name: 'lirik', status: 'Offline', isLive: false },
]

export function TwitchChannels() {
  return (
    <DashboardCard title="Twitch">
      <div className="space-y-3">
        {twitchUsers.map((user, idx) => (
          <div
            key={`twitch-${idx}-${user.name}`}
            className="flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center shrink-0">
              <span className="text-[13px] font-mono text-zinc-500 dark:text-zinc-600">
                {user.name[0].toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[14px] font-mono text-zinc-700 dark:text-zinc-300 truncate">
                  {user.name}
                </span>
                {user.isLive && (
                  <span className="px-1.5 py-0.5 text-[13px] font-mono text-white bg-red-600 rounded-sm">
                    LIVE
                  </span>
                )}
              </div>
              <div className="text-[13px] font-mono text-zinc-500 dark:text-zinc-600 truncate">
                {user.status}
              </div>
            </div>
          </div>
        ))}
      </div>
    </DashboardCard>
  )
}
