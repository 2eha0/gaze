import { DashboardCard } from './DashboardCard'

const daysOfWeek = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']

// September 2024 calendar data
const calendarDays = [
  { day: '', empty: true },
  { day: '', empty: true },
  { day: '', empty: true },
  { day: '', empty: true },
  { day: '', empty: true },
  { day: '', empty: true },
  { day: '1', empty: false },
  { day: '2', empty: false },
  { day: '3', empty: false },
  { day: '4', empty: false },
  { day: '5', empty: false },
  { day: '6', empty: false },
  { day: '7', empty: false },
  { day: '8', empty: false },
  { day: '9', empty: false },
  { day: '10', empty: false },
  { day: '11', empty: false },
  { day: '12', empty: false },
  { day: '13', empty: false },
  { day: '14', empty: false },
  { day: '15', empty: false },
  { day: '16', empty: false },
  { day: '17', empty: false },
  { day: '18', empty: false },
  { day: '19', empty: false },
  { day: '20', empty: false },
  { day: '21', empty: false },
  { day: '22', empty: false },
  { day: '23', empty: false },
  { day: '24', empty: false },
  { day: '25', empty: false },
  { day: '26', empty: false },
  { day: '27', empty: false },
  { day: '28', empty: false },
  { day: '29', empty: false },
  { day: '30', empty: false },
]

const currentDay = 15 // Example: 15th is current day

export function Calendar() {
  return (
    <DashboardCard>
      {/* Custom header */}
      <div className="flex justify-between items-center mb-3 pb-2 border-b border-zinc-200 dark:border-[#2a2a2a]">
        <span className="text-[14px] font-mono text-zinc-700 dark:text-zinc-300">September</span>
        <span className="text-[13px] font-mono text-zinc-400 dark:text-zinc-600">
          Week 36 - 2024
        </span>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {daysOfWeek.map((day) => (
          <div
            key={day}
            className="text-center text-zinc-400 dark:text-zinc-700 text-[13px] font-mono mb-1"
          >
            {day}
          </div>
        ))}
        {calendarDays.map((item, idx) => (
          <div
            key={`day-${idx}-${item.day}`}
            className={`
              text-center text-[13px] font-mono py-1
              ${item.empty ? '' : 'text-zinc-600 dark:text-zinc-500'}
              ${item.day === currentDay.toString() ? 'text-white font-normal bg-[#ff6b1a] rounded-full w-7 h-7 flex items-center justify-center mx-auto' : ''}
            `}
          >
            {item.day}
          </div>
        ))}
      </div>
    </DashboardCard>
  )
}
