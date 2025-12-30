import { useEffect, useState } from 'react'
import { cn } from '../lib/utils'

type Theme = 'light' | 'dark' | 'system'

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('dark')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // 读取 localStorage 中的主题设置
    const savedTheme = localStorage.getItem('theme') as Theme | null
    if (savedTheme) {
      setTheme(savedTheme)
    } else {
      setTheme('dark')
    }
  }, [])

  useEffect(() => {
    if (!mounted) return

    const root = document.documentElement

    // 移除所有主题类
    root.classList.remove('light', 'dark')

    if (theme === 'system') {
      // 跟随系统
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      root.classList.add(systemTheme)
    } else {
      root.classList.add(theme)
    }

    // 保存到 localStorage
    localStorage.setItem('theme', theme)
  }, [theme, mounted])

  const cycleTheme = () => {
    setTheme((current) => {
      if (current === 'system') return 'light'
      if (current === 'light') return 'dark'
      return 'system'
    })
  }

  if (!mounted) {
    return (
      <button
        type="button"
        className={cn(
          'px-3 h-8 rounded-md flex items-center gap-2 glass hover:bg-white/10 transition-colors',
          'text-xs font-mono',
        )}
        aria-label="Toggle theme"
      >
        <span className="text-sm">🌓</span>
        <span className="hidden sm:inline text-zinc-400 invisible">System</span>
      </button>
    )
  }

  const getIcon = () => {
    if (theme === 'light') return '☀️'
    if (theme === 'dark') return '🌙'
    return '🌓'
  }

  const getLabel = () => {
    if (theme === 'light') return 'Light'
    if (theme === 'dark') return 'Dark'
    return 'System'
  }

  return (
    <button
      type="button"
      onClick={cycleTheme}
      className={cn(
        'px-3 h-8 rounded-md flex items-center gap-2 glass hover:bg-white/10 transition-colors',
        'text-xs font-mono',
      )}
      aria-label={`Current theme: ${getLabel()}. Click to cycle.`}
      title={`Current: ${getLabel()}`}
    >
      <span className="text-sm">{getIcon()}</span>
      <span className="hidden sm:inline text-zinc-400">{getLabel()}</span>
    </button>
  )
}
