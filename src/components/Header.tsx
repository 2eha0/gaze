import { cn } from '../lib/utils'

const navLinks = [
  { name: 'Home', href: '#', active: true },
  { name: 'Markets', href: '#', active: false },
  { name: 'Gaming', href: '#', active: false },
  { name: 'Homelab', href: '#', active: false },
]

export function Header() {
  return (
    <header className="flex items-center gap-4 mb-6 pb-3 border-b border-[#2a2a2a] dark:border-[#2a2a2a]">
      <div className="flex items-center justify-center w-8 h-8 border-2 border-[#ff6b1a] rounded-sm bg-[#ff6b1a]">
        <span className="text-black font-mono font-bold text-[15px]">G</span>
      </div>
      <nav className="flex gap-4 flex-1">
        {navLinks.map((link) => (
          <a
            key={link.name}
            href={link.href}
            className={cn(
              'font-mono text-[14px] tracking-wide transition-colors',
              link.active
                ? 'text-zinc-700 dark:text-zinc-300 border-b-2 border-[#ff6b1a] pb-0.5'
                : 'text-zinc-400 dark:text-zinc-600 hover:text-zinc-600 dark:hover:text-zinc-400',
            )}
          >
            {link.name}
          </a>
        ))}
      </nav>
    </header>
  )
}
