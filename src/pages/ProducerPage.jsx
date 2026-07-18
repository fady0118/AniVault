import { useContext, useEffect, useState } from 'react'
import { useParams, useSearchParams, Link } from 'react-router'
import { RootContext } from '../App'
import { useQueries } from '@tanstack/react-query'
import { dateFormatter, renderIcon } from '../utility/utils'
import {
  Baby,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Grid3x2,
  Hash,
  LucideLayoutGrid,
  LucideLayoutList,
  Star,
  User,
  Videotape
} from 'lucide-react'
import { jikanFetch } from '../utility/jikanApi'
import LoaderComponent from '../components/LoaderComponent'

const classes = {
  gridClasses: {
    smallGrid:
      'grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 auto-rows-fr',
    detailedGrid:
      'grid grid-cols-1 xs:grid-cols-2 xl:grid-cols-3 auto-rows-fr ',
    tiles: 'grid grid-cols-1 auto-rows-fr '
  }
}

export default function ProducerPage () {
  const { id } = useParams()
  const { windowWidth } = useContext(RootContext)
  const [layout, setLayout] = useState('detailedGrid') // smallGrid, detailedGrid, tiles
  const [searchParams, setSearchParams] = useSearchParams()

  const currentPage = Number(searchParams.get('page') ?? 1)

  const pageSwap = newPage => {
    setSearchParams({ page: newPage })
  }

  const [producerQ, animesQ] = useQueries({
    queries: [
      {
        queryKey: ['producer', id],
        queryFn: async () => {
          const res = await jikanFetch(
            `https://api.jikan.moe/v4/producers/${id}/full`
          )
          const producer_Data = await res.json()
          return producer_Data.data || []
        }
      },
      {
        queryKey: ['animes', id, currentPage],
        queryFn: async () => {
          const res = await jikanFetch(
            `https://api.jikan.moe/v4/anime?producers=${id}&page=${currentPage}`
          )
          const animes_Data = await res.json()
          return animes_Data || []
        }
      }
    ]
  })

  useEffect(() => {
    if (currentPage > animesQ?.data?.pagination?.last_visible_page)
      pageSwap(animesQ?.data?.pagination?.last_visible_page)
  }, [animesQ])

  function currentPageChange (type) {
    if (type == 'increment') {
      if (animesQ?.data?.pagination?.has_next_page) {
        pageSwap(currentPage + 1)
      }
    } else if (type == 'decrement') {
      if (currentPage > 1) {
        pageSwap(currentPage - 1)
      }
    }
  }

  return (
    <>
      {producerQ.isPending ? (
        <div className='fixed top-1/2 left-1/2 -translate-1/2'>
          <LoaderComponent />
        </div>
      ) : (
        <>
          <div className='relative left-1/2 -translate-x-1/2 z-10 w-[95%] flex flex-col space-y-3 pt-15 pb-3 text-dark-amethyst-smoke-50 dark:text-text-dark'>
            <div
              id='title'
              className='mt-3 min-w-1/2 w-fit rounded-md px-3 py-1 box-colors order-1 flex items-center space-x-2'
            >
              <div className='flex flex-row gap-x-2 text-sm/relaxed sm:text-lg/relaxed font-bold dark:text-text-dark'>
                <p>
                  {
                    producerQ?.data?.titles?.find(
                      t => t.type.toLowerCase() === 'default'
                    )?.title
                  }
                </p>
              </div>
              <Link
                className='w-7 sm:w-9 rounded-sm overflow-hidden'
                to={producerQ?.data.url}
                target='_blank'
              >
                <img
                  src='https://upload.wikimedia.org/wikipedia/commons/7/7a/MyAnimeList_Logo.png'
                  alt='MyAnimeList Logo'
                  className='w-full aspect-2/1 object-cover object-center hover:brightness-125 duration-300'
                />
              </Link>
            </div>
            <div className='w-full order-2 flex flex-col sm:justify-start gap-3'>
              <div className='w-full flex flex-col xs:flex-row gap-3'>
                <div id='image' className='w-1/5 min-w-24 max-w-48 '>
                  <img
                    className='w-full aspect-square object-cover order-1 rounded-lg overflow-hidden'
                    src={producerQ?.data?.images?.jpg?.image_url}
                    alt=''
                  />
                </div>
                <div
                  id='info'
                  className='flex flex-col grow rounded-md box-colors h-fit'
                >
                  <div className='border-b border-amethyst-smoke-700/40 dark:border-amethyst-smoke-500/40 pt-0.5 px-3 font-semibold text-md/relaxed capitalize'>
                    About
                  </div>
                  <div className='p-3 text-xs font-light whitespace-pre-wrap'>
                    {producerQ?.data.about
                      ? producerQ?.data.about
                      : 'No biography written.'}
                  </div>
                </div>
              </div>
              <div className='flex flex-col md:flex-row gap-3'>
                <div className='flex flex-col gap-y-3 w-full h-fit md:w-1/6 min-w-40 text-xs font-light box-colors rounded-md'>
                  <div>
                    <div className='border-b border-amethyst-smoke-700/40 dark:border-amethyst-smoke-500/40 pt-0.5 px-3 font-semibold text-md/relaxed capitalize'>
                      Details
                    </div>
                    <div className='flex flex-col p-2 gap-y-2'>
                      <div className='flex flex-row flex-wrap gap-x-3 capitalize'>
                        <p className='font-semibold'>Japanese:</p>
                        <p>
                          {producerQ?.data.titles.find(
                            t => t.type.toLowerCase() === 'japanese'
                          ).title || ''}
                        </p>
                      </div>
                      <div className='flex flex-row flex-wrap gap-x-3 capitalize'>
                        <p className='font-semibold'>established:</p>
                        <p>
                          {dateFormatter(producerQ?.data.established) || ''}
                        </p>
                      </div>
                      <div className='flex flex-row flex-wrap gap-x-3 capitalize'>
                        <p className='font-semibold'>Member Favorites:</p>
                        <p>{producerQ?.data.favorites || ''}</p>
                      </div>
                    </div>
                  </div>
                  {producerQ?.data.external.length ? (
                    <div>
                      <div
                        id='external'
                        className='border-b border-amethyst-smoke-700/40 dark:border-amethyst-smoke-500/40 pt-0.5 px-3 font-semibold text-md/relaxed capitalize'
                      >
                        Available At
                      </div>
                      <div className='flex flex-col p-2 gap-y-2'>
                        {producerQ?.data.external.map((ext, i) => (
                          <p
                            className='flex flex-row items-center gap-1.5'
                            key={i}
                          >
                            {renderIcon(ext.name)}
                            <Link
                              className='blue-link'
                              target='_blank'
                              to={ext.url}
                            >
                              {ext.name}
                            </Link>
                          </p>
                        ))}
                      </div>
                    </div>
                  ) : (
                    ''
                  )}
                </div>

                <div
                  id='anime'
                  className='flex flex-col w-full md:w-5/6 box-colors rounded-md'
                >
                  <div className='flex flex-row justify-between border-b border-amethyst-smoke-700/40 dark:border-amethyst-smoke-500/40 pt-0.5 px-3 font-semibold text-md/relaxed capitalize'>
                    <span>animeography</span>
                    <div
                      id='controls'
                      className='flex flex-row justify-between flex-wrap w-fit gap-x-5'
                    >
                      <div className='flex flex-row gap-x-1 items-center'>
                        <ChevronLeft
                          onClick={() => currentPageChange('decrement')}
                          size={18}
                          className={`${
                            currentPage === 1
                              ? 'stroke-text-light/50 dark:stroke-text-dark/50'
                              : 'stroke-text-light dark:stroke-text-dark hover:cursor-pointer hover:bg-amethyst-smoke-500/15'
                          } stroke-3 p-2 box-content rounded-full duration-200`}
                        />
                        <p>{currentPage}</p>
                        <ChevronRight
                          onClick={() => currentPageChange('increment')}
                          size={18}
                          className={`${
                            !animesQ?.data?.pagination?.has_next_page
                              ? 'stroke-text-light/50 dark:stroke-text-dark/50'
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
                            onClick={() => {
                              setLayout('smallGrid')
                            }}
                            size={18}
                            className={`layout-icon ${
                              layout === 'smallGrid' ? 'active-layout-icon' : ''
                            }`}
                          />
                        </div>
                        <div>
                          <LucideLayoutGrid
                            onClick={() => {
                              setLayout('detailedGrid')
                            }}
                            size={18}
                            className={`layout-icon ${
                              layout === 'detailedGrid'
                                ? 'active-layout-icon'
                                : ''
                            }`}
                          />
                        </div>

                        <div>
                          <LucideLayoutList
                            onClick={() => {
                              setLayout('tiles')
                            }}
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
                    className={`w-full text-2xs gap-4 p-3 ${classes.gridClasses[layout]}`}
                  >
                    {animesQ?.data?.data?.map(anime => (
                      <div
                        key={anime.mal_id}
                        className='capitalize rounded-md overflow-hidden'
                      >
                        {layout === 'smallGrid' ? (
                          <>
                            <div className='w-full h-fit flex flex-col gap-y-1'>
                              <div className='relative w-full h-fit rounded-md overflow-hidden'>
                                <Link to={`/anime/${anime.mal_id}`}>
                                  <img
                                    className='w-full aspect-3/4 object-cover hover:brightness-60 duration-200'
                                    src={`${
                                      anime?.images?.webp?.large_image_url ||
                                      anime?.images?.jpg?.large_image_url
                                    }`}
                                    alt={anime.title_english || anime.title}
                                  />
                                </Link>
                                <div className='pointer-events-none absolute bottom-0 left-0 py-2 px-3 gap-1 flex flex-col w-full text-xs font-light bg-linear-45 from-35% from-amethyst-smoke-400 dark:from-dark-amethyst-smoke-200 to-75% to-transparent'>
                                  <div className='flex items-center gap-2'>
                                    <Star size={15} />
                                    <span>{anime.score}</span>
                                  </div>
                                  <div className='flex items-center gap-2'>
                                    <User size={15} />
                                    <span>
                                      {anime.members?.toLocaleString() || '?'}
                                    </span>
                                  </div>
                                  <div className='flex items-center gap-2'>
                                    <Hash size={15} />
                                    <span>
                                      {anime.rank?.toLocaleString() || '?'}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <Link
                                to={`/anime/${anime.mal_id}`}
                                className='font-bold text-[1.25em] blue-link hover:cursor-pointer cutoff-text-abs max-lines-1'
                              >
                                {anime.title_english || anime.title}
                              </Link>
                            </div>
                          </>
                        ) : layout === 'detailedGrid' ? (
                          <div className='w-full h-full flex flex-col theme-bg-colors'>
                            <div className='flex flex-col grow-0 items-center justify-center text-center py-1.5 border-b subtle-border-colors'>
                              <Link
                                to={`/anime/${anime.mal_id}`}
                                className='font-bold text-[1.25em] blue-link hover:cursor-pointer'
                              >
                                {anime.title_english || anime.title}
                              </Link>
                              <p className='text-[0.9em] font-light'>
                                {anime.title_japanese}
                              </p>
                            </div>
                            <div className='flex flex-row flex-wrap text-center justify-center w-full items-center capitalize border-b subtle-border-colors'>
                              <div className='flex flex-row gap-x-1.5 p-1.5 justify-center items-center h-full w-[30%] border-r subtle-border-colors'>
                                <Calendar size={14} />
                                <p>{dateFormatter(anime.aired.from)}</p>
                              </div>

                              <div className='flex flex-row gap-x-1.5 p-1.5 justify-center items-center h-full w-[40%]  border-r subtle-border-colors'>
                                <Baby size={14} />
                                <p>{anime.rating}</p>
                              </div>

                              <div className='flex flex-row gap-x-1.5 p-1.5 justify-center items-center h-full w-[30%]'>
                                <Videotape size={14} />
                                <span>{anime.type}</span>
                              </div>
                            </div>
                            <div className='flex flex-row justify-evenly items-center py-1.5'>
                              {anime.genres.slice(0, 4).map((genre, i) => (
                                <Link
                                  key={i}
                                  to={genre.url}
                                  className='hover-blue-link duration-150'
                                >
                                  {genre.name}
                                </Link>
                              ))}
                            </div>
                            <div className='w-full flex flex-row items-start grow px-1.5'>
                              <div id='poster' className='w-1/2 md:w-2/5'>
                                <Link to={`/anime/${anime.mal_id}`}>
                                  <img
                                    className='w-full h-full aspect-auto object-cover hover:brightness-60 duration-200'
                                    src={`${
                                      anime?.images?.webp?.large_image_url ||
                                      anime?.images?.jpg?.large_image_url
                                    }`}
                                    alt={anime.title_english || anime.title}
                                  />
                                </Link>
                              </div>
                              <div className='w-1/2 md:w-3/5 flex flex-col gap-y-2 pl-2 pt-2'>
                                <div className='w-full flex flex-col order-1 gap-y-0.5'>
                                  <div className='flex flex-row flex-wrap gap-x-1.5'>
                                    <p className='font-semibold'>Studio</p>
                                    <div className='flex flex-row flex-wrap gap-x-0 5'>
                                      {anime.studios.map((studio, i, arr) => (
                                        <p key={i}>
                                          <Link
                                            className='blue-link'
                                            to={`/producer/${studio.mal_id}`}
                                          >
                                            {studio.name}
                                          </Link>
                                          <span className='mr-1.5'>
                                            {i < arr.length - 1 ? ',' : ''}
                                          </span>
                                        </p>
                                      ))}
                                    </div>
                                  </div>
                                  <div className='flex flex-row items-center flex-wrap gap-x-1.5'>
                                    <p className='font-semibold'>Themes</p>
                                    <div className='flex flex-row flex-wrap gap-x-1'>
                                      {anime.themes.length
                                        ? anime.themes.map((theme, i) => (
                                            <Link
                                              to={theme.url}
                                              key={i}
                                              className='font-light rounded-full px-1.5 py-0.5 border subtle-border-colors hover-blue-link hover:cursor-pointer duration-200'
                                            >
                                              {theme.name}
                                            </Link>
                                          ))
                                        : '-'}
                                    </div>
                                  </div>

                                  <div className='flex flex-row flex-wrap gap-x-1.5'>
                                    <p className='font-semibold'>
                                      demographics
                                    </p>
                                    <div className='flex flex-row flex-wrap gap-x-1'>
                                      {anime.demographics.length
                                        ? anime.demographics.map(
                                            (demographic, i) => (
                                              <p key={i} className='font-light'>
                                                {demographic.name}
                                              </p>
                                            )
                                          )
                                        : '-'}
                                    </div>
                                  </div>
                                </div>
                                <div className='overflow-y-scroll grow w-full max-h-25 order-2'>
                                  <div className='flex flex-col gap-y-1.5 items-end'>
                                    <div className='peer'>
                                      <input
                                        className='hidden'
                                        type='checkbox'
                                        name={`synopsisCheckbox-${anime.mal_id}`}
                                        id={`synopsisCheckbox-${anime.mal_id}`}
                                      />
                                    </div>
                                    <p className='w-full h-full text-xs font-light max-lines-4 cutoff-text'>
                                      {anime.synopsis || 'synopsis missing..'}
                                    </p>
                                    {anime.synopsis ? (
                                      <label
                                        htmlFor={`synopsisCheckbox-${anime.mal_id}`}
                                        className="text-xs capitalize w-fit hover:text-amethyst-smoke-800 dark:hover:text-amethyst-smoke-400 hover:cursor-pointer duration-300
                            before:content-['see_more'] peer-has-checked:before:content-['see_less']"
                                      ></label>
                                    ) : (
                                      ''
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className='flex flex-row justify-evenly items-center capitalize border-t subtle-border-colors'>
                              <div className='flex flex-row gap-x-1 py-1.5 w-1/3 justify-center items-center border-r subtle-border-colors'>
                                <Star size={14} />
                                <p>{anime.score || '?'}</p>
                              </div>
                              <div className='flex flex-row gap-x-1 py-1.5 w-1/3 justify-center items-center border-r subtle-border-colors'>
                                <User size={14} />
                                <p>{anime.members?.toLocaleString() || '?'}</p>
                              </div>
                              <div className='flex flex-row gap-x-1 py-1.5 w-1/3 justify-center items-center'>
                                <Hash size={14} />
                                <p>{anime.rank?.toLocaleString() || '?'}</p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className='theme-bg-colors'>
                            <div className='flex flex-row grow'>
                              <Link
                                to={`/anime/${anime.mal_id}`}
                                className='w-1/10 min-w-22 aspect-auto'
                              >
                                <img
                                  src={
                                    anime?.images?.webp?.image_url ||
                                    anime?.images?.jpg?.image_url
                                  }
                                  alt={anime.title_english || anime.title}
                                  className='w-full object-cover hover:brightness-60 duration-200'
                                />
                              </Link>

                              <div className='flex-1 flex flex-col gap-1.5 min-w-0'>
                                <div className='flex flex-wrap items-center px-3 py-1.5 gap-x-2.5 gap-y-0.5 border-b subtle-border-colors'>
                                  <Link
                                    to={`/anime/${anime.mal_id}`}
                                    className='text-[15px] font-medium blue-link hover:underline leading-snug truncate'
                                  >
                                    {anime.title_english || anime.title}
                                  </Link>
                                  <span className='text-xs font-normal whitespace-pre-wrap'>
                                    {anime.title_japanese}
                                  </span>
                                </div>

                                <div className='px-3 overflow-y-scroll grow w-full max-h-25'>
                                  <div className='flex flex-col gap-y-1.5 items-end'>
                                    <div className='peer'>
                                      <input
                                        className='hidden'
                                        type='checkbox'
                                        name={`synopsisCheckbox-${anime.mal_id}`}
                                        id={`synopsisCheckbox-${anime.mal_id}`}
                                      />
                                    </div>
                                    <p className='w-full h-full text-xs font-light max-lines-4 cutoff-text'>
                                      {anime.synopsis || 'synopsis missing..'}
                                    </p>
                                    {anime.synopsis ? (
                                      <label
                                        htmlFor={`synopsisCheckbox-${anime.mal_id}`}
                                        className="text-xs capitalize w-fit hover:text-amethyst-smoke-800 dark:hover:text-amethyst-smoke-400 hover:cursor-pointer duration-300
                            before:content-['see_more'] peer-has-checked:before:content-['see_less']"
                                      ></label>
                                    ) : (
                                      ''
                                    )}
                                  </div>
                                </div>
                                <div className='flex flex-wrap gap-1 mt-0.5 px-3'>
                                  {anime.genres.slice(0, 4).map((genre, i) => (
                                    <Link
                                      key={i}
                                      to={genre.url}
                                      className='font-light rounded-full px-1.5 py-0.5 border subtle-border-colors hover-blue-link hover:cursor-pointer duration-200'
                                    >
                                      {genre.name}
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            </div>

                            <div className='flex flex-wrap items-center border-t subtle-border-colors text-[1.1em]'>
                              <div className='flex flex-row flex-wrap gap-x-1 px-3.5 justify-center items-center h-full border-r subtle-border-colors'>
                                <Calendar size={14} />
                                <p>{dateFormatter(anime.aired.from)}</p>
                              </div>

                              <div className='flex items-center gap-1.5 px-3.5 py-1.5 border-r subtle-border-colors shrink-0'>
                                <Baby size={14} />
                                <p>{anime.rating}</p>
                              </div>

                              <div className='flex items-center gap-1 px-3.5 py-1.5 border-r subtle-border-colors shrink-0'>
                                <Videotape size={14} />
                                <span>{anime.type}</span>
                              </div>

                              <div className='flex items-center gap-3.5 px-3.5 py-1.5 ml-auto shrink-0'>
                                <div className='flex items-center gap-1'>
                                  <Star size={13} />
                                  <span className='font-medium'>
                                    {anime.score}
                                  </span>
                                </div>
                                <div className='flex items-center gap-1'>
                                  <User size={13} />
                                  <span>
                                    {anime.members?.toLocaleString() || '?'}
                                  </span>
                                </div>
                                <div className='flex items-center gap-1'>
                                  <Hash size={13} className='' />
                                  <span>
                                    {anime.rank?.toLocaleString() || '?'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
