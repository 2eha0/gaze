import { cn } from '../lib/utils'
import { DashboardCard } from './DashboardCard'

interface MarketData {
  symbol: string
  price: string
  change: number
  sparklineData: number[]
}

const markets: MarketData[] = [
  {
    symbol: 'BTC-USD',
    price: '42,345.67',
    change: 2.34,
    sparklineData: [40, 42, 41, 45, 43, 47, 42],
  },
  {
    symbol: 'AMD',
    price: '142.56',
    change: -1.23,
    sparklineData: [145, 143, 144, 142, 141, 143, 142],
  },
  {
    symbol: 'NVDA',
    price: '512.34',
    change: 3.45,
    sparklineData: [495, 500, 505, 510, 508, 512, 512],
  },
  {
    symbol: 'TSLA',
    price: '234.89',
    change: -0.67,
    sparklineData: [237, 236, 235, 234, 235, 236, 234],
  },
]

function Sparkline({ data, isPositive }: { data: number[]; isPositive: boolean }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min

  const points = data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * 60
      const y = 20 - ((value - min) / range) * 20
      return `${x},${y}`
    })
    .join(' ')

  return (
    <svg
      width="60"
      height="20"
      className="shrink-0"
      role="img"
      aria-label={`Price trend chart for market data, ${isPositive ? 'increasing' : 'decreasing'}`}
    >
      <polyline
        points={points}
        fill="none"
        stroke={isPositive ? '#10b981' : '#ef4444'}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function Markets() {
  return (
    <DashboardCard title="Markets">
      <div className="space-y-3">
        {markets.map((market) => {
          const isPositive = market.change >= 0
          return (
            <div
              key={market.symbol}
              className="flex items-center justify-between gap-2 border-b border-zinc-200 dark:border-[#1a1a1a] last:border-b-0 pb-3 last:pb-0"
            >
              <div className="shrink-0 min-w-17.5">
                <div className="text-[14px] font-mono text-zinc-700 dark:text-zinc-300">
                  {market.symbol}
                </div>
              </div>

              <Sparkline
                data={market.sparklineData}
                isPositive={isPositive}
              />

              <div className="shrink-0 text-right min-w-20">
                <div className="text-[14px] font-mono text-zinc-700 dark:text-zinc-300 tabular-nums">
                  ${market.price}
                </div>
                <div
                  className={cn(
                    'text-[13px] font-mono tabular-nums',
                    isPositive ? 'text-green-600' : 'text-red-600',
                  )}
                >
                  {isPositive ? '+' : ''}
                  {market.change}%
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </DashboardCard>
  )
}
