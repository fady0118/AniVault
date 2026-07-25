import { useCallback, useState } from 'react'
import { useParams, useSearchParams, Link } from 'react-router'
import { useQueries } from '@tanstack/react-query'
import {
  ChevronLeft,
  ChevronRight,
  Grid3x2,
  Heart,
  LucideLayoutGrid,
  LucideLayoutList,
  Star
} from 'lucide-react'
import LoaderComponent from '../components/LoaderComponent'
import {
  getStudioDetailsData,
  getStudioMediaData
} from '../anilist/aniListFetching/studioPage/getStudioData'

const classes = {
  gridClasses: {
    smallGrid:
      'grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 auto-rows-fr',
    detailedGrid:
      'grid grid-cols-1 xs:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 auto-rows-fr ',
    tiles: 'grid grid-cols-1 auto-rows-fr '
  }
}

function formatSeason (season, year) {
  if (!season && !year) return null
  const label = season
    ? season.charAt(0).toUpperCase() + season.slice(1).toLowerCase()
    : ''
  return [label, year].filter(Boolean).join(' ')
}

function stripDescription (html) {
  if (!html) return ''
  return html
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/\(Source:[^)]*\)/gi, '')
    .replace(/\s+/g, ' ')
    .trim()
}

export default function ProducerPage () {
  const { id } = useParams()
  const [layout, setLayout] = useState('detailedGrid')
  const [searchParams, setSearchParams] = useSearchParams()

  const currentPage = Number(searchParams.get('page') ?? 1)

  const pageSwap = useCallback(
    newPage => {
      setSearchParams({ page: String(newPage) })
    },
    [setSearchParams]
  )

  const [producerQ, producerMediaQ] = useQueries({
    queries: [
      {
        queryKey: ['producer', id],
        queryFn: async () => {
          const data = await getStudioDetailsData(id)
          return data || {}
        }
      },
      {
        queryKey: ['producerMedia', id, currentPage],
        queryFn: async () => {
          const data = await getStudioMediaData(id, currentPage)
          return data || {}
        }
      }
    ]
  })

  const studio = producerQ?.data
  const mediaResult = producerMediaQ?.data || {}
  const animeList = mediaResult.data || []
  const pagination = mediaResult.pagination || {}
  const isMediaLoading = producerMediaQ.isPending
  const isMediaFetching = producerMediaQ.isFetching

  const currentPageChange = useCallback(
    type => {
      if (type === 'increment') {
        if (pagination.has_next_page) {
          pageSwap(currentPage + 1)
        }
      } else if (type === 'decrement') {
        if (currentPage > 1) {
          pageSwap(currentPage - 1)
        }
      }
    },
    [currentPage, pagination.has_next_page, pageSwap]
  )

  return (
    <>
      {producerQ.isPending ? (
        <div className='fixed top-1/2 left-1/2 -translate-1/2'>
          <LoaderComponent />
        </div>
      ) : (
        <div className='relative left-1/2 -translate-x-1/2 z-10 w-[95%] flex flex-col space-y-3 pt-15 pb-3 text-md lg:text-lg'>
          {/* Header */}
          <div
            id='title'
            className='mt-3 min-w-1/2 w-fit rounded-md px-3 py-1 box-colors flex items-center space-x-2'
          >
            <span className='text-[1em] sm:text-[1.25em] leading-relaxed font-bold'>
              {
                studio?.titles?.find(t => t.type.toLowerCase() === 'default')
                  ?.title
              }
            </span>
            {studio?.url && (
              <Link
                className='w-7 sm:w-9 rounded-sm overflow-hidden'
                to={studio.url}
                target='_blank'
              >
                <img
                  src='https://upload.wikimedia.org/wikipedia/commons/7/7a/MyAnimeList_Logo.png'
                  alt='AniList'
                  className='w-full aspect-2/1 object-cover object-center hover:brightness-125 duration-300'
                />
              </Link>
            )}
          </div>

          {/* Stats */}
          <div className='flex flex-wrap gap-4 text-[0.85em] box-colors rounded-md p-3'>
            <div className='flex items-center gap-2'>
              <Star size={16} className='opacity-70' />
              <span className='font-semibold'>Member Favorites:</span>
              <span className='font-medium'>
                {studio?.favorites?.toLocaleString() || 0}
              </span>
            </div>
          </div>

          {/* Animeography */}
          <div
            id='anime'
            className='flex flex-col w-full box-colors rounded-md'
          >
            <div className='flex flex-row justify-between border-b subtle-border-colors-darker pt-1 px-3 font-semibold text-[1.1em] leading-relaxed capitalize'>
              <span>animeography</span>
              <div id='controls' className='flex flex-row items-center gap-x-2'>
                <div className='flex flex-row gap-x-1 items-center'>
                  <ChevronLeft
                    onClick={() =>
                      !isMediaFetching && currentPageChange('decrement')
                    }
                    size={18}
                    className={`${
                      currentPage <= 1 || isMediaFetching
                        ? 'stroke-text-light/50 dark:stroke-text-dark/50 pointer-events-none cursor-not-allowed'
                        : 'stroke-text-light dark:stroke-text-dark hover:cursor-pointer hover:bg-amethyst-smoke-500/15'
                    } stroke-3 p-2 box-content rounded-full duration-200`}
                  />
                  <span className='text-[0.85em]'>{currentPage}</span>
                  <ChevronRight
                    onClick={() =>
                      !isMediaFetching && currentPageChange('increment')
                    }
                    size={18}
                    className={`${
                      !pagination.has_next_page || isMediaFetching
                        ? 'stroke-text-light/50 dark:stroke-text-dark/50 pointer-events-none cursor-not-allowed'
                        : 'stroke-text-light dark:stroke-text-dark hover:cursor-pointer hover:bg-amethyst-smoke-500/15'
                    } stroke-3 p-2 box-content rounded-full duration-200`}
                  />
                </div>
                <div
                  id='layoutControls'
                  className='flex flex-row items-center gap-x-0.5'
                >
                  <div>
                    <Grid3x2
                      onClick={() => setLayout('smallGrid')}
                      size={18}
                      className={`layout-icon ${
                        layout === 'smallGrid' ? 'active-layout-icon' : ''
                      }`}
                    />
                  </div>
                  <div>
                    <LucideLayoutGrid
                      onClick={() => setLayout('detailedGrid')}
                      size={18}
                      className={`layout-icon ${
                        layout === 'detailedGrid' ? 'active-layout-icon' : ''
                      }`}
                    />
                  </div>
                  <div>
                    <LucideLayoutList
                      onClick={() => setLayout('tiles')}
                      size={18}
                      className={`layout-icon ${
                        layout === 'tiles' ? 'active-layout-icon' : ''
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div
              key={layout}
              className={`w-full text-[0.85em] gap-3 p-3 ${classes.gridClasses[layout]}`}
            >
              {isMediaLoading ? (
                <div className='col-span-full flex items-center justify-center py-16'>
                  <LoaderComponent />
                </div>
              ) : (
                animeList.map((anime, index) => (
                  <div
                    key={`${anime.id}-${index}`}
                    className='capitalize rounded-md overflow-hidden'
                  >
                    {layout === 'smallGrid' ? (
                      <div className='group relative w-full aspect-3/4 rounded-lg overflow-hidden'>
                        <Link to={`/anime/${anime.id}`}>
                          <img
                            className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-105'
                            src={
                              anime?.images?.webp?.image_url ||
                              anime?.images?.jpg?.image_url
                            }
                            alt={anime.title_english || anime.title}
                          />
                        </Link>
                        <div className='pointer-events-none absolute inset-x-0 bottom-0 h-3/5 bg-linear-to-t from-black/90 via-black/50 to-transparent' />

                        <div className='pointer-events-none absolute inset-x-0 bottom-0 p-2.5 flex flex-col gap-1.5'>
                          <div className='flex items-center gap-1.5'>
                            <div className='flex items-center gap-1 rounded-full bg-white/10 backdrop-blur-sm px-2 py-0.5 text-[0.75em] font-semibold text-white ring-1 ring-white/15'>
                              <Star
                                size={11}
                                className='fill-amber-400 text-amber-400'
                              />
                              <span>{anime.score ?? '—'}</span>
                            </div>
                            {anime.episodes && (
                              <span className='rounded-full bg-white/10 backdrop-blur-sm px-2 py-0.5 text-[0.7em] font-medium text-white/85 ring-1 ring-white/15'>
                                {anime.episodes} EP
                              </span>
                            )}
                          </div>

                          <Link
                            to={`/anime/${anime.id}`}
                            className='pointer-events-auto font-semibold text-[0.95em] leading-snug text-white hover:text-amethyst-smoke-200 transition-colors cutoff-text-abs max-lines-2'
                          >
                            {anime.title_english || anime.title}
                          </Link>

                          <p className='text-[0.75em] font-normal text-white/70 max-lines-1'>
                            {[
                              anime.type,
                              formatSeason(anime.season, anime.seasonYear)
                            ]
                              .filter(Boolean)
                              .join(' • ')}
                          </p>
                        </div>
                      </div>
                    ) : layout === 'detailedGrid' ? (
                      <div className='w-full h-full flex flex-col theme-bg-colors'>
                        {/* Titles */}
                        <div className='flex flex-col items-center text-center gap-y-0.5 px-2 py-2 border-b subtle-border-colors'>
                          <Link
                            to={`/anime/${anime.id}`}
                            className='font-semibold text-[1em] leading-snug blue-link hover:cursor-pointer max-lines-1'
                          >
                            {anime.title_english || anime.title}
                          </Link>
                          {anime.title_japanese && (
                            <p className='text-[0.8em] font-normal opacity-80 max-lines-1'>
                              {anime.title_japanese}
                            </p>
                          )}
                        </div>

                        {/* Facts bar */}
                        <div className='grid grid-cols-3 text-center border-b subtle-border-colors'>
                          <div className='flex flex-col gap-y-0.5 py-1.5 border-r subtle-border-colors'>
                            <span className='text-[0.65em] font-medium uppercase tracking-wide opacity-70'>
                              Format
                            </span>
                            <span className='text-[0.8em] font-medium'>
                              {anime.type || '?'}
                            </span>
                          </div>
                          <div className='flex flex-col gap-y-0.5 py-1.5 border-r subtle-border-colors'>
                            <span className='text-[0.65em] font-medium uppercase tracking-wide opacity-70'>
                              Episodes
                            </span>
                            <span className='text-[0.8em] font-medium'>
                              {anime.episodes ?? '?'}
                            </span>
                          </div>
                          <div className='flex flex-col gap-y-0.5 py-1.5'>
                            <span className='text-[0.65em] font-medium uppercase tracking-wide opacity-70'>
                              Season
                            </span>
                            <span className='text-[0.8em] font-medium'>
                              {formatSeason(anime.season, anime.seasonYear) ||
                                '?'}
                            </span>
                          </div>
                        </div>

                        {/* Genres */}
                        <div className='flex flex-row flex-wrap justify-center gap-1.5 px-2 py-1.5 border-b subtle-border-colors'>
                          {anime.genres.slice(0, 3).map((genre, i) => (
                            <span
                              key={i}
                              className='text-[0.75em] font-medium rounded-full px-2 py-0.5 border subtle-border-colors opacity-90'
                            >
                              {genre.name}
                            </span>
                          ))}
                        </div>

                        {/* Poster + description */}
                        <div className='flex flex-row gap-x-2.5 p-2 grow'>
                          <div className='w-2/5 h-fit shrink-0 rounded-md overflow-hidden'>
                            <Link to={`/anime/${anime.id}`}>
                              <img
                                className='w-full aspect-2/3 object-cover hover:scale-105 transition-transform duration-200'
                                src={
                                  anime?.images?.webp?.image_url ||
                                  anime?.images?.jpg?.image_url
                                }
                                alt={anime.title_english || anime.title}
                              />
                            </Link>
                          </div>
                          <div className='flex flex-col gap-2 h-fit'>
                            <div className='peer'>
                              <input
                                type='checkbox'
                                className='hidden'
                                name={`${anime.id}-${index}-checkbox`}
                                id={`${anime.id}-${index}-checkbox`}
                              />
                            </div>

                            <div
                              className='flex-1 min-w-0 h-fit text-[0.8em] font-normal leading-relaxed opacity-90 cutoff-text'
                              style={{ '--max-lines': 4 }}
                            >
                              {stripDescription(anime.description) ||
                                'No description available.'}
                            </div>

                            <label
                              htmlFor={`${anime.id}-${index}-checkbox`}
                              className="before:content-['see_more'] peer-has-checked:before:content-['see_less'] text-[0.85em] cursor-pointer opacity-85 hover:text-amethyst-smoke-600 duration-200"
                            ></label>
                          </div>
                        </div>

                        {/* Community stats */}
                        <div className='flex flex-row items-center border-t subtle-border-colors'>
                          <div className='flex flex-row gap-x-1 py-1.5 w-1/2 justify-center items-center border-r subtle-border-colors'>
                            <Star size={14} className='opacity-70' />
                            <p className='text-[0.8em] font-medium'>
                              {anime.score || '?'}
                            </p>
                          </div>
                          <div className='flex flex-row gap-x-1 py-1.5 w-1/2 justify-center items-center'>
                            <Heart size={14} className='opacity-70' />
                            <p className='text-[0.8em] font-medium'>
                              {anime.members?.toLocaleString() || '?'}
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className='theme-bg-colors'>
                        <div className='flex flex-row'>
                          <Link
                            to={`/anime/${anime.id}`}
                            className='w-28 sm:w-32 shrink-0 aspect-2/3 overflow-hidden'
                          >
                            <img
                              src={
                                anime?.images?.webp?.image_url ||
                                anime?.images?.jpg?.image_url
                              }
                              alt={anime.title_english || anime.title}
                              className='w-full h-full object-cover hover:scale-105 transition-transform duration-200'
                            />
                          </Link>
                          <div className='flex-1 flex flex-col gap-1.5 min-w-0 py-2 px-3'>
                            <div className='flex flex-wrap items-baseline gap-x-2 gap-y-0.5'>
                              <Link
                                to={`/anime/${anime.id}`}
                                className='font-semibold text-[1.05em] blue-link hover:underline leading-snug'
                              >
                                {anime.title_english || anime.title}
                              </Link>
                              {anime.title_japanese && (
                                <span className='text-[0.85em] font-normal opacity-75'>
                                  {anime.title_japanese}
                                </span>
                              )}
                            </div>
                            <p className='text-[0.85em] font-normal leading-relaxed opacity-85 normal-case line-clamp-5'>
                              {stripDescription(anime.description) ||
                                'No description available.'}
                            </p>
                            <div className='flex flex-wrap gap-1 mt-auto'>
                              {anime.genres.slice(0, 4).map((genre, i) => (
                                <span
                                  key={i}
                                  className='text-[0.8em] font-medium rounded-full px-1.5 py-0.5 border subtle-border-colors opacity-90'
                                >
                                  {genre.name}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className='flex flex-wrap items-center border-t subtle-border-colors'>
                          <div className='px-3 py-1.5 border-r subtle-border-colors'>
                            <p className='text-[0.75em] font-medium'>
                              {anime.type || '?'}
                            </p>
                          </div>
                          <div className='px-3 py-1.5 border-r subtle-border-colors'>
                            <p className='text-[0.75em] font-medium'>
                              {anime.episodes ? `${anime.episodes} ep` : '?'}
                            </p>
                          </div>
                          <div className='px-3 py-1.5 border-r subtle-border-colors'>
                            <p className='text-[0.75em] font-medium'>
                              {formatSeason(anime.season, anime.seasonYear) ||
                                '?'}
                            </p>
                          </div>
                          <div className='flex items-center gap-1.5 px-3 py-1.5 border-r subtle-border-colors shrink-0'>
                            <Star size={14} className='opacity-70' />
                            <p className='text-[0.75em] font-medium'>
                              {anime.score || '?'}
                            </p>
                          </div>
                          <div className='flex items-center gap-1.5 px-3 py-1.5 ml-auto shrink-0'>
                            <Heart size={14} className='opacity-70' />
                            <p className='text-[0.75em] font-medium'>
                              {anime.members?.toLocaleString() || '?'}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
