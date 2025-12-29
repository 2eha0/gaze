import { CircleDot, GitFork, GitPullRequest, Star } from 'lucide-react'
import { DashboardCard } from './DashboardCard'

const pullRequests = [
  { title: 'Add dark mode support', number: 123, time: '2d' },
  { title: 'Fix authentication bug', number: 122, time: '3d' },
  { title: 'Update dependencies', number: 121, time: '5d' },
]

const issues = [
  { title: '!bangs at the end', number: 54, time: '25d' },
  { title: 'Calendar widget not updating', number: 53, time: '1mo' },
  { title: 'RSS feed parsing error', number: 52, time: '1mo' },
]

export function Repository() {
  return (
    <DashboardCard>
      <div className="mb-4">
        <h2 className="text-[14px] font-mono text-zinc-700 dark:text-zinc-300 mb-2">
          glanceapp/glance
        </h2>
        <div className="flex items-center gap-3 text-[13px] font-mono text-zinc-500 dark:text-zinc-600">
          <span className="flex items-center gap-1">
            <Star className="w-3 h-3" />
            4.2k
          </span>
          <span className="flex items-center gap-1">
            <GitFork className="w-3 h-3" />
            234
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <GitPullRequest className="w-3 h-3 text-zinc-500 dark:text-zinc-600" />
            <span className="text-[13px] font-mono text-zinc-400 dark:text-zinc-700 uppercase tracking-wider">
              Open pull requests (9 total)
            </span>
          </div>
          <div className="space-y-2">
            {pullRequests.map((pr) => (
              <div
                key={pr.number}
                className="flex justify-between items-start gap-2"
              >
                <span className="text-[14px] font-mono text-zinc-700 dark:text-zinc-300 hover:text-[#ff6b1a] transition-colors flex-1 line-clamp-1 cursor-pointer">
                  #{pr.number} {pr.title}
                </span>
                <span className="text-[13px] font-mono text-zinc-400 dark:text-zinc-700 shrink-0">
                  {pr.time}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <CircleDot className="w-3 h-3 text-zinc-500 dark:text-zinc-600" />
            <span className="text-[13px] font-mono text-zinc-400 dark:text-zinc-700 uppercase tracking-wider">
              Open issues (54 total)
            </span>
          </div>
          <div className="space-y-2">
            {issues.map((issue) => (
              <div
                key={issue.number}
                className="flex justify-between items-start gap-2"
              >
                <span className="text-[14px] font-mono text-zinc-700 dark:text-zinc-300 hover:text-[#ff6b1a] transition-colors flex-1 line-clamp-1 cursor-pointer">
                  #{issue.number} {issue.title}
                </span>
                <span className="text-[13px] font-mono text-zinc-400 dark:text-zinc-700 shrink-0">
                  {issue.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardCard>
  )
}
