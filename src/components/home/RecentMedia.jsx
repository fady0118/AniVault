// RecentMedia.jsx
import { useEffect, useRef, useState } from 'react'
import { delay } from '../../utility/utils'
import { ChevronLeft, ChevronRight, Info } from 'lucide-react'
import { Link } from 'react-router'
import EmptyDataFallback from '../EmptyDataFallback'
import RecentPlaceHolder from './RecentPlaceHolder'
import { useRecentMedia } from './useRecentMedia'
import MediaPopup from './MediaPopup'

const FALLBACK_COVER =
  'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/default.jpg'

export default function RecentMedia ({ varsMap }) {
  const path = Object.keys(varsMap)?.[0]
  const vars = varsMap[path]
  // Select the first format as default
  const formatKeys = Object.keys(vars)
  const [selectedFormat, setSelectedFormat] = useState(formatKeys[0])

  const { dataMap, setPage, pages } = useRecentMedia(vars)

  // current format's data and page-info
  const currentData = dataMap[selectedFormat]
  const currentPage = pages[selectedFormat]

  // Popup state
  const [popupData, setPopupData] = useState(null)
  const [popupPosition, setPopupPosition] = useState({ left: 0, top: 0 })

  // show/hide popup timeoutRefs
  const showTimeoutRef = useRef(null)
  const hideTimeoutRef = useRef(null)

  // --- Pagination (generic) ---
  function swapPage (dir) {
    if (dir === 'prev') {
      setPage(selectedFormat, Math.max(1, currentPage - 1))
    } else if (dir === 'next') {
      if (currentData?.data?.hasNextPage) {
        setPage(selectedFormat, currentPage + 1)
      }
    }
  }

  function checkChevron (dir) {
    if (dir === 'left') return currentPage > 1
    return currentData?.data?.hasNextPage || false
  }

  const handleItemMouseEnter = useCallback((e, item) => {
    // clear timeouts
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current)
    if (showTimeoutRef.current) clearTimeout(showTimeoutRef.current)

    const target = e.currentTarget
    const rect = target.getBoundingClientRect()
    const popupWidth = 256
    const popupHeight = 300

    let left = rect.right - 20
    let top = rect.top + 20

    // Clamp to viewport
    left = Math.min(left, window.innerWidth - popupWidth)
    left = Math.max(left, 0)
    top = Math.min(top, window.innerHeight - popupHeight)
    top = Math.max(top, 0)

    // Set a delay before SHOWING the popup (e.g., 400ms)
    // This prevents flashing when moving the mouse quickly over multiple items
    showTimeoutRef.current = setTimeout(() => {
      setPopupPosition({ left, top })
      setPopupData(item)
    }, 400)
  }, [])

  const handleItemMouseLeave = useCallback(() => {
    // clear timeouts
    if (showTimeoutRef.current) clearTimeout(showTimeoutRef.current)
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current)

    // clear popupData after a delay
    hideTimeoutRef.current = setTimeout(() => {
      setPopupData(null)
    }, 300)
  }, [])

  const handlePopupMouseEnter = useCallback(() => {
    // clear hide timeout on entering the popup
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current)
  }, [])

  const handlePopupMouseLeave = useCallback(() => {
    // Leaving the popup triggers the hide timeout
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current)
    hideTimeoutRef.current = setTimeout(() => {
      setPopupData(null)
    }, 300)
  }, [])

  // timeouts clear on unmount
  useEffect(() => {
    return () => {
      if (showTimeoutRef.current) clearTimeout(showTimeoutRef.current)
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current)
    }
  }, [])

  return (
    <>
      <div id='recent' className='w-full relative flex flex-col gap-y-3 p-3'>
        {/* Header and controls */}
        <div className='w-full flex flex-row flex-wrap justify-between items-center text-md/relaxed sm:text-xl/relaxed font-extrabold uppercase'>
          <div className='text-[0.9em]'>Recent {path}</div>
          <div className='flex flex-row flex-wrap items-center gap-x-5'>
            {/* Pagination */}
            <div
              id='pagination'
              className='flex flex-row gap-x-1.5 items-center text-sm'
            >
              <div onClick={() => swapPage('prev')}>
                <ChevronLeft
                  className={`${
                    checkChevron('left')
                      ? 'stroke-text-light dark:stroke-text-dark hover:cursor-pointer hover:bg-amethyst-smoke-500/15'
                      : 'stroke-text-light/50 dark:stroke-text-dark/50'
                  } stroke-3 p-2 box-content rounded-full duration-200`}
                  size={18}
                />
              </div>
              <div>{currentPage}</div>
              <div onClick={() => swapPage('next')}>
                <ChevronRight
                  className={`${
                    checkChevron('right')
                      ? 'stroke-text-light dark:stroke-text-dark hover:cursor-pointer hover:bg-amethyst-smoke-500/15'
                      : 'stroke-text-light/50 dark:stroke-text-dark/50'
                  } stroke-3 p-2 box-content rounded-full duration-200`}
                  size={18}
                />
              </div>
            </div>

            {/* Tabs */}
            <div
              id='recentTabs'
              className='flex flex-row gap-x-2 items-center text-[0.55em] md:text-[0.65em]'
            >
              {formatKeys.map(key => (
                <div
                  key={key}
                  onClick={() => setSelectedFormat(key)}
                  className={`recentTab ${
                    selectedFormat === key ? 'active-tab' : ''
                  }`}
                >
                  {key.toLowerCase()}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* items' Grid */}
        <div className='w-full max-h-[65vh] grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 overflow-y-scroll snap-y snap-mandatory overflow-x-clip gap-5'>
          {currentData.isPending ? (
            <RecentPlaceHolder />
          ) : currentData?.data?.media?.length ? (
            currentData.data.media.map(item => (
              <div
                data-id={item.id}
                key={item.id}
                onMouseEnter={(e)=>handleItemMouseEnter(e, item)}
                onMouseLeave={handleItemMouseLeave}
                className='snap-start scroll-m-10 wrapper relative flex flex-col gap-y-1.5 justify-start items-center w-full aspect-2/3'
              >
                <Link
                  to={`/${path}/${item.id}`}
                  className='relative group w-full aspect-3/4 rounded-lg overflow-hidden'
                >
                  <img
                    className='w-full h-full object-cover group-hover:scale-105 duration-300'
                    src={item.cover}
                    onError={e => {
                      e.currentTarget.onerror = null
                      e.currentTarget.src = FALLBACK_COVER
                    }}
                    alt={item.title}
                  />
                  <div className="absolute top-0 bottom-0 w-full h-full bg-linear-180 from-transparent from-15% to-transparent group-hover:to-amethyst-smoke-300 dark:group-hover:to-dark-amethyst-smoke-50 duration-300"></div>
                </Link>
                <div className='w-full grow text-sm xs:text-xs lg:text-sm'>
                  <Link
                    to={`/${path}/${item.id}`}
                    className='w-full cutoff-text-abs max-lines-2 text-amethyst-smoke-950 dark:text-amethyst-smoke-300 hover-blue-link duration-200'
                  >
                    {item.title}
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <EmptyDataFallback string='no recent data' />
          )}
        </div>
      </div>
      {popupData ? (
        <MediaPopup
          data={popupData}
          position={popupPosition}
          onMouseEnter={handlePopupMouseEnter}
          onMouseLeave={handlePopupMouseLeave}
        />
      ) : (
        ''
      )}
    </>
  )
}
