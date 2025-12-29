import { cn } from '../lib/utils'

interface DashboardCardProps {
  children: React.ReactNode
  className?: string
  title?: string
  titleClassName?: string
}

export function DashboardCard({ children, className, title, titleClassName }: DashboardCardProps) {
  return (
    <div
      className={cn(
        'border-2 border-zinc-200 dark:border-[#2a2a2a] rounded-md bg-white dark:bg-black p-4 transition-colors',
        className,
      )}
    >
      {title && (
        <h2
          className={cn(
            'text-[13px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-3',
            titleClassName,
          )}
        >
          {title}
        </h2>
      )}
      {children}
    </div>
  )
}
