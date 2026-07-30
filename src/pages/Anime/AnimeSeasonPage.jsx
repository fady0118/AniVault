import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams, useSearchParams, Link } from 'react-router'
import {
  ChevronDown,
  ChevronLeft,
  Leaf,
  Rose,
  Snowflake,
  Star,
  Sun,
  SunSnow
} from 'lucide-react'
import { useContext, useEffect, useState } from 'react'
import { RootContext } from '../../App'
import LoaderComponent from '../../components/LoaderComponent'
import { getSeasonResults } from '../../anilist/aniListFetching/homePage/getSeasonResults'
import { type_status_map } from '../../utility/utils'

const seasons = [
  { name: 'winter', icon: <Sun size={12} /> },
  { name: 'spring', icon: <Rose size={12} /> },
  { name: 'summer', icon: <Sun size={12} /> },
  { name: 'fall', icon: <Leaf size={12} /> }
]
const types = ['TV', 'MOVIE', 'TV_SHORT', 'SPECIAL', 'ONA', 'OVA', 'MUSIC']

function formatAniListDate (dateObj) {
  if (!dateObj || !dateObj.year) return ''
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ]
  const { year, month, day } = dateObj
  if (month && day) return `${months[month - 1]} ${day}, ${year}`
  if (month) return `${months[month - 1]} ${year}`
  return `${year}`
}

export default function AnimeSeasonPage () {
  //SFW filter
  const { SFW } = useContext(RootContext)
  // seasons nav checkbox
  const [seasonsCheckBoxValue, setSeasonsCheckBoxValue] = useState(false)
  // destructure current season/year from url
  const { season, year } = useParams()
  // searchParams for filter param
  const [searchParams, setSearchParams] = useSearchParams()
  // pagination state
  const [currentPage, setCurrentPage] = useState(1)
  // types filter state
  const [typesFilter, setTypesFilter] = useState(
    searchParams.get('filter') || ''
  )
  // utility for navigating
  const navigate = useNavigate()
  // data fetch
  const queryClient = useQueryClient()

  const seasonQ = useQuery({
    queryKey: ['season', season, year, typesFilter, currentPage, SFW],
    queryFn: async () => {
      const aniListResult = await getSeasonResults({
        format_in: typesFilter
          ? [typesFilter]
          : ['TV', 'MOVIE', 'TV_SHORT', 'SPECIAL', 'ONA', 'OVA', 'MUSIC'],
        season: season.toUpperCase(),
        seasonYear: Number(year),
        page: currentPage,
        perPage: 30
      })
      return aniListResult
    }
  })

  // Derive pagination info from AniList response
  const pageInfo = seasonQ?.data?.Page?.pageInfo
  const lastPageIndex = pageInfo?.lastPage ?? 1
  const hasNextPage = pageInfo?.hasNextPage ?? false
  const mediaList = seasonQ?.data?.Page?.media ?? []

  // types change function
  function changeFilter (val) {
    setTypesFilter(prevState => (prevState === val ? '' : val))
    setCurrentPage(1)
    setSearchParams(prevState => {
      return prevState.get('filter') === val ? { filter: '' } : { filter: val }
    })
  }
  // invalidate query on params change
  useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: ['season', season, year, typesFilter, currentPage],
      exact: true
    })
  }, [searchParams])

  return (
    <>
      {seasonQ.isPending ? (
        <div className='fixed top-1/2 left-1/2 -translate-1/2'>
          <LoaderComponent />
        </div>
      ) : (
        <>
          <div className='relative left-1/2 -translate-x-1/2 z-10 w-full flex justify-center space-y-3 pt-15 pb-3'>
            <div
              className='w-[95vw] flex flex-col'
              style={{ fontSize: 'clamp(0.6rem, 0.3rem + 0.6vw, 0.75rem)' }}
            >
              <div
                id='heading'
                className='order-1 mt-3 mb-1 flex items-center gap-2'
              >
                {
                  seasons.find(s => s.name === season?.toLowerCase().trim())
                    ?.icon
                }
                <h1 className='capitalize font-semibold tracking-tight text-[1.6em] leading-none'>
                  {season} {year}
                </h1>
              </div>

              <div
                id='filtering'
                className='order-2 flex flex-col md:flex-row md:flex-wrap md:items-center md:justify-between gap-3 py-2'
              >
                <div
                  id='seasons'
                  className='relative flex flex-row flex-wrap items-center gap-3 md:text-[1.15em]'
                >
                  <label
                    htmlFor='seasons-nav'
                    className='peer flex flex-row items-center gap-1.5 capitalize px-2.5 py-1 rounded-full box-colors hover:cursor-pointer border border-transparent hover:border-dark-amethyst-smoke-50/20 dark:hover:border-amethyst-smoke-50/20 duration-200 select-none'
                  >
                    <SunSnow size={15} aria-hidden='true' /> seasons
                    <input
                      type='checkbox'
                      name='seasons-nav'
                      id='seasons-nav'
                      hidden
                      className='peer/seasonsToggle'
                      checked={seasonsCheckBoxValue}
                      onChange={() => {
                        setSeasonsCheckBoxValue(s => !s)
                      }}
                    />
                    <ChevronDown
                      size={14}
                      aria-hidden='true'
                      className='transition-transform duration-200 peer-checked/seasonsToggle:rotate-180'
                    />
                  </label>

                  <div className='md:z-30 md:flex-nowrap md:absolute md:top-9 md:left-0 md:px-2 md:py-2 w-fit md:bg-amethyst-smoke-300 md:dark:bg-dark-amethyst-smoke-200 rounded-lg md:shadow-lg md:shadow-black/10 dark:md:shadow-black/30 hidden peer-has-checked:flex flex-row flex-wrap gap-x-2 gap-y-1.5 items-center'>
                    {seasons.map((s, i) => {
                      const isActive = s.name === season.toLowerCase().trim()
                      return (
                        <button
                          key={i}
                          type='button'
                          aria-current={isActive ? 'page' : undefined}
                          onClick={() => {
                            navigate(
                              `/anime/seasons/${year}/${s.name}?filter=${typesFilter}`
                            )
                          }}
                          className={`font-medium capitalize text-[0.9em] flex flex-row items-center gap-1 px-2 py-1 rounded-full duration-200 slide-in-from-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dark-amethyst-smoke-50/40 dark:focus-visible:ring-amethyst-smoke-50/40 ${
                            isActive
                              ? 'blue-link box-colors font-medium'
                              : 'hover-blue-link hover:bg-amethyst-smoke-400/75 dark:hover:bg-dark-amethyst-smoke-200/75'
                          }`}
                        >
                          {s.icon}
                          <span className='text-nowrap'>
                            {s.name} {year}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div
                  id='types'
                  role='group'
                  aria-label='Filter by media type'
                  className='flex flex-row flex-wrap items-center gap-1.5 text-[0.9em] md:text-[1em]'
                >
                  {types.map((type, i) => {
                    const isActive = type === typesFilter
                    return (
                      <button
                        key={i}
                        type='button'
                        aria-pressed={isActive}
                        onClick={() => {
                          changeFilter(type)
                        }}
                        className={`font-medium capitalize px-2.5 py-1 rounded-full cursor-pointer duration-200 slide-in-from-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dark-amethyst-smoke-50/40 dark:focus-visible:ring-amethyst-smoke-50/40 ${
                          isActive
                            ? 'blue-link box-colors font-medium'
                            : 'hover-blue-link hover:bg-amethyst-smoke-400/75 dark:hover:bg-dark-amethyst-smoke-200/75'
                        }`}
                      >
                        {type.split('_').join(' ')}
                      </button>
                    )
                  })}
                </div>

                <div
                  id='pagination'
                  className='w-fit flex flex-row items-center gap-1 md:gap-2 px-1 py-1 text-[0.8em] md:text-[1em] box-colors rounded-full'
                >
                  <button
                    type='button'
                    aria-label='Previous page'
                    disabled={currentPage <= 1}
                    onClick={() => {
                      setCurrentPage(prevState =>
                        prevState > 1 ? prevState - 1 : prevState
                      )
                    }}
                    className={`p-1 rounded-full duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dark-amethyst-smoke-50/40 dark:focus-visible:ring-amethyst-smoke-50/40 ${
                      currentPage > 1
                        ? 'hover:cursor-pointer hover:bg-amethyst-smoke-800/20 dark:hover:bg-amethyst-smoke-400/20'
                        : 'stroke-text-light/25 dark:stroke-text-dark/25 cursor-not-allowed'
                    }`}
                  >
                    <ChevronLeft size={18} aria-hidden='true' />
                  </button>

                  <div className='tabular-nums'>
                    Page {currentPage} of {lastPageIndex}
                  </div>

                  <button
                    type='button'
                    aria-label='Next page'
                    disabled={!hasNextPage}
                    onClick={() => {
                      setCurrentPage(prevState =>
                        prevState < lastPageIndex ? prevState + 1 : prevState
                      )
                    }}
                    className={`p-1 rounded-full duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dark-amethyst-smoke-50/40 dark:focus-visible:ring-amethyst-smoke-50/40 ${
                      hasNextPage
                        ? 'hover:cursor-pointer hover:bg-amethyst-smoke-800/20 dark:hover:bg-amethyst-smoke-400/20'
                        : 'stroke-text-light/25 dark:stroke-text-dark/25 cursor-not-allowed'
                    }`}
                  >
                    <ChevronLeft
                      size={18}
                      aria-hidden='true'
                      className='rotate-180'
                    />
                  </button>
                </div>
              </div>

              {mediaList.length ? (
                <div
                  id='animeContainer'
                  className='order-last py-2 grid grid-cols-1 3xs:grid-cols-2 2xs:grid-cols-3 xs:grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 xl:grid-cols-8 gap-3 md:gap-4'
                >
                  {mediaList.map(item => {
                    const title =
                      item.title?.english ||
                      item.title?.romaji ||
                      item.title?.native
                    const imageUrl =
                      item.coverImage?.extraLarge ||
                      item.coverImage?.large ||
                      item.coverImage?.medium
                    const statusText =
                      type_status_map.status.ANIME[item.status] || item.status
                    const score = item.averageScore
                      ? (item.averageScore / 10).toFixed(1)
                      : null
                    const isNotYetAired = item.status === 'NOT_YET_RELEASED'
                    const airedStr = formatAniListDate(item.startDate)
                    const genres = item.genres || []
                    const visibleGenres = genres.slice(0, 3)
                    const extraGenreCount = genres.length - visibleGenres.length

                    return (
                      <Link
                        key={item.id}
                        to={`/anime/${item.id}`}
                        className='group relative flex flex-col justify-end w-full aspect-2/3 rounded-lg overflow-hidden duration-200 hover:scale-105 hover:cursor-pointer focus-visible:outline-none focus-visible:scale-105 focus-visible:ring-2 focus-visible:ring-dark-amethyst-smoke-50/40 dark:focus-visible:ring-amethyst-smoke-50/40'
                      >
                        <img
                          src={imageUrl}
                          alt={title}
                          className='absolute inset-0 w-full h-full object-cover duration-200 group-hover:brightness-65 group-focus-visible:brightness-65'
                        />

                        {score ? (
                          <div className='absolute top-1.5 right-1.5 z-10 flex items-center gap-0.5 rounded-full px-1.5 py-0.5 font-medium box-colors-accent'>
                            <Star
                              size={10}
                              aria-hidden='true'
                              className='fill-current'
                            />
                            {score}
                          </div>
                        ) : null}

                        <div className='relative z-10 w-full min-h-3/10 box-colors-medium'>
                          <div className='flex flex-col gap-1 p-1.5'>
                            <p className='text-[1.25em] font-bold leading-tight line-clamp-2'>
                              {title}
                            </p>
                            <p className='text-text-light/70 dark:text-text-dark/70'>
                              {statusText}
                              {isNotYetAired ? (
                                <>&nbsp;·&nbsp;{airedStr}</>
                              ) : null}
                            </p>

                            {genres.length ? (
                              <div className='grid grid-rows-[0fr] group-hover:grid-rows-[1fr] group-focus-visible:grid-rows-[1fr] overflow-hidden transition-[grid-template-rows] duration-200 ease-out'>
                                <div className='flex flex-row flex-wrap gap-1 overflow-hidden min-h-0 text-[0.8em]'>
                                  {visibleGenres.map((genreName, i) => (
                                    <span
                                      key={i}
                                      className='font-light rounded-full px-1.5 py-px box-colors-accent'
                                    >
                                      {genreName}
                                    </span>
                                  ))}
                                  {extraGenreCount > 0 ? (
                                    <span className='font-light rounded-full px-1.5 py-px box-colors-accent'>
                                      +{extraGenreCount}
                                    </span>
                                  ) : null}
                                </div>
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              ) : (
                <div className='order-last flex flex-col items-center gap-2 py-16 text-center box-colors-medium rounded-lg'>
                  <SunSnow
                    size={28}
                    aria-hidden='true'
                    className='opacity-50'
                  />
                  <p className='font-semibold'>
                    no anime found for {season} {year}
                  </p>
                  <p className='text-text-light/70 dark:text-text-dark/70'>
                    try a different season or type
                  </p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  )
}
