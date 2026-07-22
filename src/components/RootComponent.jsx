import {
  ChevronDown,
  Info,
  Plus,
  Settings2,
  Square,
  SquarePlus,
  X
} from 'lucide-react'
import { useContext, useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router'
import { delay } from '../utility/utils'
import FilterComponent from '../components/anime/filters/FilterComponent'
import GenresFilter from '../components/anime/filters/GenresFilter'
import KeywordFilter from '../components/anime/filters/KeywordFilter'
import SortFilter from '../components/anime/filters/SortFilter'
import ExtraFilters from '../components/anime/filters/ExtraFilters/ExtraFilters'
import AnimeMangaContainer from '../components/anime/AnimeMangaContainer'
import { RootContext } from '../App'

export default function RootComponent ({
  Root,
  filterData,
  genresData,
  sortData,
  setUserItemModalStates
}) {
  const [searchParams, setSearchParams] = useSearchParams()
  const [showFiltersSideHeader, setShowFiltersSideHeader] = useState(false)
  const filterSideBarStateRef = useRef(false)
  const sidePanelRef = useRef(null)
  const { windowWidth } = useContext(RootContext)
  const collectorStore = useRef({})

  // Updated default search params for AniList
  const defaultSearchParams = new URLSearchParams({
    type: '',
    status: '',
    q: '',
    genres: '',
    genres_exclude: '',
    tags: '',
    tags_exclude: '',
    order_by: 'POPULARITY',
    sort: 'desc',
    min_score: 0,
    max_score: 100,
    start_date: '',
    end_date: ''
  })
  const effectiveSearchParams =
    searchParams.size === 0 ? defaultSearchParams : searchParams

  function handleApplyFilter () {
    const type = collectorStore.current.type?.() || ''
    const status = collectorStore.current.status?.() || ''
    const keyword = collectorStore.current.keyword?.() || ''
    const genres = collectorStore.current.genres?.() || {
      genres: [],
      genres_exclude: []
    }
    const tags = collectorStore.current.tags?.() || {
      tags: [],
      tags_exclude: []
    }
    const sort = collectorStore.current.sort?.() || {
      order_by: 'popularity',
      sort: 'desc'
    }
    const score = collectorStore.current.score?.() || {
      min_score: 0,
      max_score: 100
    }
    const date = collectorStore.current.date?.() || {
      start_date: '',
      end_date: ''
    }

    setSearchParams({
      type: type || '',
      status: status || '',
      q: keyword || '',
      genres: genres.genres.join(','),
      genres_exclude: genres.genres_exclude.join(','),
      tags: tags.tags.join(','),
      tags_exclude: tags.tags_exclude.join(','),
      order_by: sort.order_by,
      sort: sort.sort,
      min_score: score.min_score,
      max_score: score.max_score,
      start_date: date.start_date,
      end_date: date.end_date
    })
  }

  async function closeSidePanel () {
    sidePanelRef.current.classList.add('-translate-x-full', 'duration-300')
    await delay(300)
    setShowFiltersSideHeader(false)
  }

  useEffect(() => {
    if (searchParams.size === 0) {
      setSearchParams(Object.fromEntries(defaultSearchParams.entries()))
    }
    const handleClicksOutside = e => {
      if (
        filterSideBarStateRef.current &&
        !sidePanelRef?.current?.contains(e.target)
      ) {
        closeSidePanel()
      }
    }
    document.addEventListener('mousedown', handleClicksOutside)
    return () => document.removeEventListener('mousedown', handleClicksOutside)
  }, [])

  useEffect(() => {
    filterSideBarStateRef.current = showFiltersSideHeader
  }, [showFiltersSideHeader])

  return (
    <>
      <div className='relative left-1/2 -translate-x-1/2 z-10 w-full flex justify-center space-y-3 pt-15 pb-3 text-sm'>
        <div className='w-[95vw] flex flex-col '>
          <div
            id='title'
            className='order-1 mt-5 px-3 py-1 uppercase font-bold text-[1.6em]'
          >
            Browse {Root}
          </div>

          <div className='order-2 px-3 py-1 text-[0.8em] md:text-[0.9em]'>
            {windowWidth > 600 ? (
              <>
                <div
                  id='disclaimer'
                  className='w-full mb-2 flex flex-row items-center gap-x-2 py-1.5 px-2.5 box-colors-stronger border border-indigo-600/60 rounded-r-md text-[0.5em] xs:text-[0.625em]'
                >
                  <p className='flex flex-row flex-wrap items-center gap-1.5'>
                    <span className='font-medium flex flex-row items-center gap-x-1.5'>
                      <Info size={14} /> AniList API uses AND logic for genre
                      filters.
                    </span>
                    <span className=''>Included genres are recommended at</span>
                    <span className='inline-flex items-center badge badge-outline badge-primary text-[1em] px-1.5 py-0.5 h-fit rounded-full'>
                      1-3 genres
                    </span>
                    <span>excluded genres have no limit.</span>
                  </p>
                </div>
                <div
                  id='header'
                  className='z-30 relative w-full flex flex-wrap flex-row items-center justify-start gap-2 md:gap-3 capitalize font-medium'
                >
                  <KeywordFilter
                    registerCollector={fn =>
                      (collectorStore.current.keyword = fn)
                    }
                  />
                  {Object.keys(filterData).map((key, i) => (
                    <FilterComponent
                      key={i}
                      keyName={key}
                      data={filterData[key]}
                      registerCollector={fn =>
                        (collectorStore.current[key] = fn)
                      }
                    />
                  ))}

                  <GenresFilter
                    keyName='genres'
                    data={genresData.genres}
                    registerCollector={fn =>
                      (collectorStore.current.genres = fn)
                    }
                  />
                  <GenresFilter
                    keyName='tags'
                    data={genresData.tags}
                    registerCollector={fn => (collectorStore.current.tags = fn)}
                  />

                  <SortFilter
                    data={sortData}
                    registerCollector={fn => (collectorStore.current.sort = fn)}
                  />
                  <ExtraFilters
                    registerCollectors={{
                      scoreCollector: fn => (collectorStore.current.score = fn),
                      dateCollector: fn => (collectorStore.current.date = fn)
                    }}
                  />
                  <div
                    id='filterBtn'
                    className=' header-box box-colors-stronger hover:cursor-pointer'
                    onClick={handleApplyFilter}
                  >
                    <p className='px-2'>filter</p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div
                  onClick={() => {
                    setShowFiltersSideHeader(true)
                  }}
                  className='flex flex-row gap-x-1 py-0.5 px-1.5 items-center text-[1.25em] box-colors-stronger rounded-sm w-fit hover:cursor-pointer hover:brightness-115 dark:hover:brightness-125 duration-200'
                >
                  <Settings2 size={14} />
                  <span>Filters</span>
                </div>
              </>
            )}
          </div>
          <AnimeMangaContainer
            searchParams={effectiveSearchParams}
            itemType={Root}
            setUserItemModalStates={setUserItemModalStates}
          />
        </div>
        <div
          id='backgroundImage'
          className='-z-50 absolute top-0 left-0 w-screen h-full min-h-screen overflow-hidden'
        >
          <img
            src='/photo-bg.png'
            alt=''
            className='w-full h-full object-cover bg-no-repeat opacity-30 contrast-125'
          />
        </div>
      </div>
      {showFiltersSideHeader && windowWidth <= 600 ? (
        <>
          <div
            ref={sidePanelRef}
            className='z-50 fixed top-0 left-0 w-3/4 3xs:w-2/3 box-colors backdrop-blur-2xl slide-in-from-left text-[0.8em]'
          >
            <div className='h-screen w-full overflow-y-scroll flex flex-col gap-y-2.5 px-2 mt-3 pb-5'>
              <div className='flex flex-row justify-between'>
                <p className='text-xl capitalize font-bold'>Filters</p>
                <X
                  size={20}
                  className='hover:cursor-pointer hover:scale-105 hover:bg-amethyst-smoke-500/30 box-content p-1 rounded-md duration-200'
                  onClick={closeSidePanel}
                />
              </div>
              <div
                id='disclaimer'
                className='w-full mb-2 flex flex-row items-center py-1.5 px-1.5 box-colors border border-indigo-600/60 rounded-r-md text-[0.5em]'
              >
                <p className='flex flex-row flex-wrap items-center gap-0.5'>
                  <span className='font-medium flex flex-row items-center gap-x-1.5'>
                    <Info size={12} /> AniList API uses AND logic for genre
                    filters.
                  </span>
                  <span className=''>Included genres are recommended at</span>
                  <span className='inline-flex items-center badge badge-outline badge-primary text-[0.9em] px-1.5 py-0.5 h-fit rounded-full'>
                    1-3 genres
                  </span>
                  <span>excluded genres have no limit.</span>
                </p>
              </div>
              <KeywordFilter
                registerCollector={fn => (collectorStore.current.keyword = fn)}
                view='mobile'
              />
              {Object.keys(filterData).map((key, i) => (
                <FilterComponent
                  key={i}
                  keyName={key}
                  data={filterData[key]}
                  registerCollector={fn => (collectorStore.current[key] = fn)}
                  view='mobile'
                />
              ))}

              <GenresFilter
                keyName='genres'
                data={genresData.genres}
                registerCollector={fn => (collectorStore.current.genres = fn)}
                view='mobile'
              />
              <GenresFilter
                keyName='tags'
                data={genresData.tags}
                registerCollector={fn => (collectorStore.current.tags = fn)}
                view='mobile'
              />

              <SortFilter
                data={sortData}
                registerCollector={fn => (collectorStore.current.sort = fn)}
                view='mobile'
              />

              <ExtraFilters
                registerCollectors={{
                  scoreCollector: fn => (collectorStore.current.score = fn),
                  dateCollector: fn => (collectorStore.current.date = fn)
                }}
                view='mobile'
              />
              <div
                id='filterBtn'
                className='text-[0.75em] capitalize small-header-box smallHeaderBox-colors w-fit hover:cursor-pointer'
                onClick={handleApplyFilter}
              >
                <p className='px-2'>filter</p>
              </div>
            </div>
          </div>
        </>
      ) : (
        ''
      )}
    </>
  )
}
