/**
 * Weather Chart React Component
 * Displays weather data with a bar chart visualization
 * Based on Glance design with 12 two-hour columns
 */

import type { WeatherData } from './types'

interface WeatherChartProps {
  data: WeatherData
  hideLocation?: boolean
}

export function WeatherChart({ data, hideLocation }: WeatherChartProps) {
  const {
    condition,
    apparentTemperature,
    location,
    areaName,
    columns,
    timeLabels,
    sunriseColumn,
    sunsetColumn,
  } = data

  // Calculate current column in real-time (frontend)
  const currentColumn = Math.floor(new Date().getHours() / 2)

  return (
    <div className="weather-widget group/widget font-mono">
      {/* Header */}
      <div className="text-xl text-white text-center font-medium">{condition}</div>
      <div className="text-sm text-gray-400 text-center mt-1">
        Feels like {apparentTemperature}°
      </div>

      {/* Weather Columns Container */}
      <div className="relative mt-4 py-2.5">
        {/* Background Glow Effect */}
        <div className="weather-glow absolute inset-0 pointer-events-none blur-lg" />
        {/* Dotted Pattern Overlay */}
        <div className="weather-dots absolute inset-0 pointer-events-none opacity-15" />

        {/* Weather Columns */}
        <div className="relative flex justify-center">
          {columns.map((column, index) => {
            const isCurrent = index === currentColumn
            const isDaylight = index >= sunriseColumn && index <= sunsetColumn
            const isSunrise = index === sunriseColumn
            const isSunset = index === sunsetColumn
            const isNegative = column.temperature < 0
            // Show time labels for columns 2, 6, 10 (3rd, 7th, 11th)
            const showTimeLabel = index === 2 || index === 6 || index === 10

            return (
              <div
                key={index}
                className={`group/col relative flex items-center justify-end flex-col w-[calc(100%/12)] pt-0.5 ${isCurrent ? 'is-current' : ''}`}
              >
                {/* Precipitation overlay */}
                {column.hasPrecipitation && <div className="weather-column-rain absolute inset-0 bottom-[20%] overflow-hidden" />}

                {/* Daylight indicator */}
                {isDaylight && (
                  <div
                    className={`weather-column-daylight absolute inset-0 ${isSunrise ? 'rounded-tl-[20px]' : ''} ${isSunset ? 'rounded-tr-[20px]' : ''}`}
                  />
                )}

                {/* Temperature value */}
                <div
                  className={`weather-column-value relative text-[13px] text-white -tracking-wider mr-0.5 mb-1 select-none opacity-0 translate-y-2 transition-all duration-200 group-hover/col:opacity-100 group-hover/col:translate-y-0 group-hover/widget:opacity-0 group-hover/widget:group-hover/col:opacity-100 group-hover/widget:group-hover/col:translate-y-0 ${isCurrent ? 'opacity-100! translate-y-0!' : ''} ${isNegative ? 'is-negative' : ''}`}
                >
                  {Math.abs(column.temperature)}
                </div>

                {/* Bar */}
                <div
                  className={`weather-bar w-1.5 bg-white/15 rounded-t-md transition-all duration-200 group-hover/col:w-2.5 group-hover/col:bg-white/35 group-hover/col:border-white/45 ${isCurrent ? 'w-2.5! bg-white/35! border-white/45!' : ''}`}
                  style={{ height: `calc(20px + ${column.scale.toFixed(2)} * 40px)` }}
                />

                {/* Time label */}
                <div
                  className={`mt-1 text-[10px] text-white/40 select-none transition-all duration-200 opacity-0 -translate-y-2 group-hover/col:opacity-100 group-hover/col:translate-y-0 group-hover/widget:opacity-0 group-hover/widget:-translate-y-2 group-hover/widget:group-hover/col:opacity-100 group-hover/widget:group-hover/col:translate-y-0 ${showTimeLabel ? 'opacity-100! translate-y-0!' : ''}`}
                >
                  {timeLabels[index]}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Location */}
      {!hideLocation && (
        <div className="flex items-center justify-center mt-4 gap-1.5 text-xs text-white/50">
          <div className="location-icon relative w-[0.8em] h-[0.8em] rounded-[0_50%_50%_50%] bg-current shrink-0" />
          <span className="truncate">{location}{areaName ? `, ${areaName}` : ''}</span>
        </div>
      )}

      <style>{`
        .weather-glow {
          background: radial-gradient(
            ellipse 60% 50% at 50% 70%,
            rgba(251, 191, 36, 0.12) 0%,
            rgba(251, 191, 36, 0.05) 40%,
            transparent 70%
          );
        }

        .weather-dots {
          background-image: radial-gradient(
            circle,
            rgba(255, 255, 255, 0.5) 1px,
            transparent 1px
          );
          background-size: 10px 10px;
          mask-image: radial-gradient(ellipse 80% 60% at 50% 60%, #000 20%, transparent 70%);
          -webkit-mask-image: radial-gradient(ellipse 80% 60% at 50% 60%, #000 20%, transparent 70%);
        }

        .weather-column-value::after {
          position: absolute;
          content: '°';
          left: 100%;
          color: rgba(255, 255, 255, 0.4);
        }

        .weather-column-value.is-negative::before {
          position: absolute;
          content: '-';
          right: 100%;
        }

        .weather-bar {
          mask-image: linear-gradient(0deg, transparent 0, #000 10px);
          -webkit-mask-image: linear-gradient(0deg, transparent 0, #000 10px);
        }

        .weather-column-rain {
          mask-image: linear-gradient(0deg, transparent 40%, #000);
          -webkit-mask-image: linear-gradient(0deg, transparent 40%, #000);
        }

        .weather-column-rain::before {
          content: '';
          position: absolute;
          background: radial-gradient(circle at 4px 4px, hsla(200, 90%, 70%, 0.4) 1px, transparent 0);
          background-size: 8px 8px;
          transform: rotate(45deg) translate(-50%, 25%);
          height: 130%;
          aspect-ratio: 1;
          left: 55%;
        }

        .weather-column-daylight {
          background: linear-gradient(0deg, transparent 30px, hsla(50, 50%, 30%, 0.2));
        }

        .location-icon {
          transform: rotate(225deg) translate(0.1em, 0.1em);
        }

        .location-icon::after {
          content: '';
          position: absolute;
          z-index: 2;
          width: 0.4em;
          height: 0.4em;
          border-radius: 50%;
          background-color: var(--color-widget-background, #1a1a1a);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
      `}</style>
    </div>
  )
}
