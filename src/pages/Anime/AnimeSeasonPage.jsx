import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams, useSearchParams, Link } from 'react-router'
import { ChevronLeft, Leaf, Rose, Snowflake, Sun, SunSnow } from 'lucide-react'
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
          <div className='relative left-1/2 -translate-x-1/2 z-10 w-full flex justify-center space-y-3 pt-15 pb-3 text-2xs sm:text-xs'>
            <div className='w-[95vw] flex flex-col '>
              <div
                id='heading'
                className='order-1 mt-3 capitalize font-semibold text-[1.5em]'
              >
                {season} {year}
              </div>
              <div
                id='filtering'
                className='order-2 flex flex-col md:flex-row md:justify-between gap-2 py-2'
              >
                <div
                  id='seasons'
                  className='relative flex flex-row flex-wrap items-center gap-3 md:text-[1.15em]'
                >
                  <label
                    className='peer flex flex-row items-center gap-1 capitalize box-border px-1 py-0.5 rounded-sm box-colors hover:cursor-pointer border-2 border-transparent hover:border-dark-amethyst-smoke-50/20 dark:hover:border-amethyst-smoke-50/20 duration-200'
                    htmlFor='seasons nav'
                  >
                    <SunSnow size={15} /> seasons
                    <input
                      type='checkbox'
                      name='seasons nav'
                      id='seasons nav'
                      hidden
                      checked={seasonsCheckBoxValue}
                      onChange={() => {
                        setSeasonsCheckBoxValue(s => !s)
                      }}
                    />
                  </label>
                  <div className='md:z-30 md:flex-nowrap md:absolute md:top-8 md:left-0 md:px-2 md:py-1.5 w-fit md:bg-amethyst-smoke-300 md:dark:bg-dark-amethyst-smoke-200 rounded-md hidden peer-has-checked:flex flex-row flex-wrap gap-x-2.5 gap-y-1 items-center'>
                    {seasons.map((s, i) => (
                      <div
                        key={i}
                        onClick={() => {
                          navigate(
                            `/anime/seasons/${year}/${s.name}?filter=${typesFilter}`
                          )
                        }}
                        className={`capitalize text-[0.9em] flex flex-row items-center gap-x-1 px-1.5 py-0.5 rounded-sm hover:cursor-pointer duration-200 slide-in-from-left ${
                          s.name === season.toLowerCase().trim()
                            ? 'blue-link box-colors'
                            : 'hover-blue-link hover:bg-amethyst-smoke-400/75 dark:hover:bg-dark-amethyst-smoke-200/75'
                        }`}
                      >
                        {s.icon}
                        <div className='text-nowrap'>
                          {s.name} {year}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div
                  id='types'
                  className='flex flex-row flex-wrap items-center gap-x-1 text-[0.9em] md:text-[1em]'
                >
                  {types.map((type, i) => (
                    <div
                      key={i}
                      className={`capitalize px-1 py-0.5 rounded-sm hover:cursor-pointer duration-200 slide-in-from-left ${
                        type === typesFilter
                          ? 'blue-link box-colors'
                          : 'hover-blue-link hover:bg-amethyst-smoke-400/75 dark:hover:bg-dark-amethyst-smoke-200/75'
                      }`}
                      onClick={() => {
                        changeFilter(type)
                      }}
                    >
                      {type.split('_').join(' ')}
                    </div>
                  ))}
                </div>
                <div
                  id='pagination'
                  className='w-fit flex flex-row items-center md:py-0.5 md:px-1 text-[0.8em] md:text-[1em] box-colors rounded-lg'
                >
                  <div className='flex flex-row items-center gap-x-2'>
                    <ChevronLeft
                      onClick={() => {
                        setCurrentPage(prevState => {
                          if (prevState > 1) return prevState - 1
                        })
                      }}
                      size={20}
                      className={`p-0.5 rounded-md box-content duration-200 scale-85 md:scale-100 ${
                        currentPage > 1
                          ? 'hover:cursor-pointer hover:bg-amethyst-smoke-800/20 dark:hover:bg-amethyst-smoke-400/20'
                          : 'stroke-text-light/25 dark:stroke-text-dark/25'
                      }`}
                    />
                    <div>
                      Page {currentPage} of {lastPageIndex}
                    </div>
                    <ChevronLeft
                      onClick={() => {
                        setCurrentPage(prevState => {
                          if (prevState < lastPageIndex) return prevState + 1
                        })
                      }}
                      size={20}
                      className={`rotate-180 p-0.5 rounded-md box-content duration-200 scale-75 md:scale-100 ${
                        hasNextPage
                          ? 'hover:cursor-pointer hover:bg-amethyst-smoke-800/20 dark:hover:bg-amethyst-smoke-400/20'
                          : 'stroke-text-light/25 dark:stroke-text-dark/25'
                      }`}
                    />
                  </div>
                </div>
              </div>
              {mediaList.length ? (
                <div
                  id='animeContainer'
                  className='order-last py-2 grid grid-cols-2 2xs:grid-cols-3 xs:grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 xl:grid-cols-8 gap-3 md:gap-4'
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
                    const statusText = type_status_map.status.ANIME[item.status] || item.status
                    const score = item.averageScore
                      ? (item.averageScore / 10).toFixed(1)
                      : null
                    const isNotYetAired = item.status === 'NOT_YET_RELEASED'
                    const airedStr = formatAniListDate(item.startDate)
                    const genres = item.genres || []

                    return (
                      <div
                        key={item.id}
                        className='group relative w-full aspect-2/3 rounded-md overflow-hidden flex-col hover:scale-105 hover:cursor-pointer duration-200'
                      >
                        <Link to={`/anime/${item.id}`}>
                          <img
                            src={imageUrl}
                            alt={title}
                            className='w-full h-full object-cover text-2xs group-hover:brightness-65 duration-200'
                          />
                        </Link>
                        <div className='absolute bottom-0 left-0 w-full max-h-2/3 box-colors-medium translate-y-full group-hover:translate-y-0.5 duration-200'>
                          <div className='w-full h-full flex flex-col p-1.5 gap-y-1 text-3xs'>
                            <p className='text-[1.3em] font-bold'>{title}</p>
                            <div className='flex flex-row items-center flex-wrap'>
                              <p className=''>{statusText}</p>
                              {isNotYetAired ? (
                                <p>&nbsp;-&nbsp;{airedStr}</p>
                              ) : (
                                <>
                                  {score ? (
                                    <p className=''>&nbsp;-&nbsp;{score}</p>
                                  ) : (
                                    ''
                                  )}
                                </>
                              )}
                            </div>
                            {genres.length ? (
                              <div className='flex flex-row flex-wrap gap-x-1'>
                                {genres.map((genreName, i) => (
                                  <span
                                    key={i}
                                    className='font-light rounded-full px-1 m-0.5 box-colors-accent'
                                  >
                                    {genreName}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              ''
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                ''
              )}
            </div>
          </div>
        </>
      )}
    </>
  )
}
