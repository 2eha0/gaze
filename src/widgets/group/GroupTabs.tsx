/**
 * Group Tabs Component
 * Interactive tab navigation for group widget
 */

import { useState } from 'react'

interface Tab {
  title: string
  index: number
}

interface GroupTabsProps {
  tabs: Tab[]
}

export function GroupTabs({ tabs }: GroupTabsProps) {
  const [activeTab, setActiveTab] = useState(0)

  const handleTabClick = (index: number) => {
    setActiveTab(index)
  }

  return (
    <div className="flex gap-1.5 overflow-x-auto [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.2)_transparent]">
      {tabs.map((tab) => {
        const isActive = tab.index === activeTab

        return (
          <button
            key={tab.index}
            onClick={() => handleTabClick(tab.index)}
            data-index={tab.index}
            className={`group-tab relative px-3 text-xs font-semibold bg-transparent border-none cursor-pointer transition-colors whitespace-nowrap shrink-0 uppercase tracking-wider ${
              isActive ? 'text-white' : 'text-white/50 hover:text-white/70'
            }`}
            type="button"
          >
            {tab.title}
          </button>
        )
      })}
    </div>
  )
}
