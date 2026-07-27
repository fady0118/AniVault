// Schedual.jsx
import { useQuery } from '@tanstack/react-query'
import { CalendarDays, ChevronDown, ChevronLeft } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import LoaderComponent from '../LoaderComponent'
import EmptyDataFallback from '../EmptyDataFallback'
import { getSchedualData } from '../../anilist/aniListFetching/homePage/getSchedualData'

export default function Schedual() {
  const baseDays = [
    { long: 'sunday', short: 'SUN' },
    { long: 'monday', short: 'MON' },
    { long: 'tuesday', short: 'TUE' },
    { long: 'wednesday', short: 'WED' },
    { long: 'thursday', short: 'THU' },
    { long: 'friday', short: 'FRI' },
    { long: 'saturday', short: 'SAT' }
  ]
  const days = [...baseDays, ...baseDays, ...baseDays]
  const OFFSET = 7
  const date = new Date()
  const sliderRef = useRef(null)
  
  const [currentIndex, setCurrentIndex] = useState(
    Number(date.getDay()) + OFFSET
  )
  const [showMore, setShowMore] = useState(false)

  const schedule = useQuery({
    queryKey: ['schedual'],
    queryFn: async () => {
      return await getSchedualData()
    }
  })

  const filtered = schedule?.data?.filter(
    anime => anime.weekday === days[currentIndex].long
  ) || []

  function getCountdown(seconds) {
    if (seconds <= 0) return 'Aired'
    const days = Math.floor(seconds / 86400)
    const hours = Math.floor((seconds % 86400) / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`
    } else {
      return `${minutes}m`
    }
  }

  function scrollIntoView(index, animate = true) {
    const container = sliderRef.current
    if (!container) return
    const dayNodes = container.querySelectorAll('div.day')
    const dayNode = dayNodes[index]
    if (!dayNode) return
    
    const containerRect = container.getBoundingClientRect()
    const nodeRect = dayNode.getBoundingClientRect()
    const left =
      container.scrollLeft +
      (nodeRect.left - containerRect.left) -
      container.clientWidth / 2 +
      nodeRect.width / 2
      
    container.scrollTo({ left, behavior: animate ? 'smooth' : 'instant' })
  }

  function shift(dir) {
    setCurrentIndex(s => s + dir)
    if (currentIndex >= OFFSET * 2) {
      setCurrentIndex(s => s - OFFSET)
    } else if (currentIndex < OFFSET) {
      setCurrentIndex(s => s + OFFSET)
    }
  }

  useEffect(() => {
    scrollIntoView(currentIndex)
  }, [currentIndex])

  return (
    <div className="w-full xs:w-1/2 md:w-full box-colors-brighter backdrop-blur-md rounded-lg shadow-xl border border-white/20 dark:border-amethyst-smoke-700/30 py-3 sm:py-4 transition-all">
      
      {/* Header */}
      <div className="flex items-center justify-between text-sm gap-2 px-3 sm:px-4 mb-3">
        <div className="flex items-center gap-2 text-[1.1em]">
          <CalendarDays
              size={20}
              className='text-amethyst-smoke-700 dark:text-amethyst-smoke-400'
            />
          <span className="text[0.8em] font-semibold uppercase tracking-wider text-amethyst-smoke-800 dark:text-amethyst-smoke-400">
            Schedule
          </span>
          <span className="h-4 w-px bg-amethyst-smoke-800 dark:bg-amethyst-smoke-400" />
          <span className="text-[0.75em] text-amethyst-smoke-700 dark:text-amethyst-smoke-500">
            {Intl.DateTimeFormat().resolvedOptions().timeZone.replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* Day selector */}
      <div className="flex items-center gap-1 px-3 sm:px-4 mb-4">
        <button
          onClick={() => shift(-1)}
          className="p-1 rounded-full hover:bg-amethyst-smoke-50 dark:hover:bg-amethyst-smoke-600/40 transition-colors duration-200"
        >
          <ChevronLeft size={18} className="text-amethyst-smoke-600 dark:text-amethyst-smoke-300 hover:cursor-pointer" />
        </button>

        <div
          ref={sliderRef}
          className="flex-1 flex items-center gap-1 overflow-x-auto no-scrollbar scroll-smooth py-1"
        >
          {days.map((day, i) => {
            const isActive = i === currentIndex
            return (
              <div
                key={i}
                data-index={i}
                onClick={() => setCurrentIndex(i)}
                className={`
                  day relative px-3 py-1.5 text-xs font-medium rounded-full cursor-pointer
                  transition-all duration-200 select-none whitespace-nowrap
                  ${isActive
                    ? 'bg-linear-to-r from-blue-500 to-indigo-500 text-white shadow-md shadow-blue-500/30'
                    : 'text-amethyst-smoke-600 dark:text-amethyst-smoke-300 hover:bg-amethyst-smoke-200/50 dark:hover:bg-amethyst-smoke-700/50'
                  }
                `}
              >
                {day.short}
              </div>
            )
          })}
        </div>

        <button
          onClick={() => shift(1)}
          className="p-1 rounded-full hover:bg-amethyst-smoke-50 dark:hover:bg-amethyst-smoke-600/40 transition-colors duration-200"
        >
          <ChevronLeft size={18} className="rotate-180 text-amethyst-smoke-600 dark:text-amethyst-smoke-300 hover:cursor-pointer" />
        </button>
      </div>

      {/* Schedule list */}
      <div className="w-full">
        {schedule?.isPending ? (
          <div className="flex justify-center py-12">
            <LoaderComponent />
          </div>
        ) : filtered.length ? (
          <div className="">
            {filtered.slice(0, 10).map((item) => (
              <Link
                to={`/anime/${item.id}`}
                key={item.id}
                className="group flex items-center gap-3 px-3 sm:px-4 py-1.5 hover:bg-blue-600/5 dark:hover:bg-blue-300/5 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.01]"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-9 h-12 rounded-lg object-cover shadow-sm shrink-0"
                  loading="lazy"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-amethyst-smoke-800 dark:text-amethyst-smoke-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {item.title}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-amethyst-smoke-500 dark:text-amethyst-smoke-400">
                    <span>Ep {item.episode}</span>
                    <span>•</span>
                    <span>{item.time}</span>
                  </div>
                </div>
                <div className="shrink-0">
                  <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100/80 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 shadow-sm">
                    {getCountdown(item.timeUntilAiring)}
                  </span>
                </div>
              </Link>
            ))}

            {/* Collapsible remaining items */}
            {filtered.length > 10 && (
              <>
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  showMore ? 'max-h-500' : 'max-h-0'
                }`}>
                  <div className="space-y-1.5 pt-1.5">
                    {filtered.slice(10).map((item) => (
                      <Link
                        to={`/anime/${item.id}`}
                        key={item.id}
                        className="group flex items-center gap-3 py-2 px-3 rounded-xl bg-white/50 dark:bg-amethyst-smoke-800/50 hover:bg-white dark:hover:bg-amethyst-smoke-800 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.01]"
                      >
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-9 h-12 rounded-lg object-cover shadow-sm shrink-0"
                          loading="lazy"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-amethyst-smoke-800 dark:text-amethyst-smoke-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {item.title}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5 text-xs text-amethyst-smoke-500 dark:text-amethyst-smoke-400">
                            <span>Ep {item.episode}</span>
                            <span>•</span>
                            <span>{item.time}</span>
                          </div>
                        </div>
                        <div className="shrink-0">
                          <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100/80 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 shadow-sm">
                            {getCountdown(item.timeUntilAiring)}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Toggle button */}
                <button
                  onClick={() => setShowMore(!showMore)}
                  className="flex items-center justify-end gap-1 w-full mt-1 text-xs text-amethyst-smoke-800 dark:text-amethyst-smoke-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors select-none cursor-pointer"
                >
                  <span>{showMore ? 'Show less' : `Show more (${filtered.length - 10})`}</span>
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-300 ${showMore ? 'rotate-180' : ''}`}
                  />
                </button>
              </>
            )}
          </div>
        ) : (
          <EmptyDataFallback string="No schedule data found for this day" />
        )}
      </div>
    </div>
  )
}