import { Cloud } from 'lucide-react'
import { DashboardCard } from './DashboardCard'

const hourlyTemps = [
  { hour: '12', temp: 14, height: 50 },
  { hour: '13', temp: 15, height: 55 },
  { hour: '14', temp: 17, height: 65 },
  { hour: '15', temp: 18, height: 70 },
  { hour: '16', temp: 19, height: 75 },
  { hour: '17', temp: 18, height: 70 },
  { hour: '18', temp: 16, height: 60 },
  { hour: '19', temp: 14, height: 50 },
  { hour: '20', temp: 13, height: 45 },
  { hour: '21', temp: 12, height: 40 },
]

export function Weather() {
  return (
    <DashboardCard>
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Cloud className="w-4 h-4 text-zinc-400 dark:text-zinc-500" />
          <span className="text-[14px] font-mono text-zinc-700 dark:text-zinc-300">
            Partly Cloudy
          </span>
        </div>
        <div className="text-[13px] font-mono text-zinc-500 dark:text-zinc-600">
          Feels like 16°C
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-[13px] font-mono text-zinc-400 dark:text-zinc-700 uppercase tracking-wider">
          Hourly Forecast
        </div>
        <div className="flex items-end justify-between gap-0.5 h-20">
          {hourlyTemps.map((item, idx) => (
            <div
              key={`hour-${idx}-${item.hour}`}
              className="flex flex-col items-center gap-1 flex-1"
            >
              <div className="text-[13px] font-mono text-zinc-500 dark:text-zinc-600">
                {item.temp}°
              </div>
              <div
                className="w-full bg-zinc-300 dark:bg-zinc-700 rounded-sm"
                style={{ height: `${item.height}%` }}
              />
              <div className="text-[13px] font-mono text-zinc-400 dark:text-zinc-700">
                {item.hour}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardCard>
  )
}
