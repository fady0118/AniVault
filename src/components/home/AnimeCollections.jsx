// AnimeCollections.jsx
import { useQueries } from '@tanstack/react-query'
import { ExternalLink, CalendarDays, Medal } from 'lucide-react'
import { Link } from 'react-router'
import LoaderComponent from '../LoaderComponent'
import EmptyDataFallback from '../EmptyDataFallback'
import { getAnimeCollectionsData } from '../../anilist/aniListFetching/homePage/getAnimeCollectionsData'
import { formatDate } from '../../utility/utils'

export default function AnimeCollections () {
  const [topAnimeQ, upcomingAnimeQ] = useQueries({
    queries: [
      {
        queryKey: ['topAnime'],
        queryFn: async () => {
          return await getAnimeCollectionsData({
            page: 1,
            perPage: 10,
            formatIn: ['TV', 'MOVIE'],
            sort: 'SCORE_DESC',
            status_in: ['FINISHED', 'RELEASING']
          })
        }
      },
      {
        queryKey: ['upcomingAnime'],
        queryFn: async () => {
          return await getAnimeCollectionsData({
            page: 1,
            perPage: 10,
            formatIn: ['TV', 'MOVIE'],
            sort: 'TRENDING_DESC',
            status_in: ['NOT_YET_RELEASED']
          })
        }
      }
    ]
  })

  const sections = [
    {
      id: 'top',
      icon: Medal,
      label: 'Top Anime',
      subtitle: 'TV & Movies',
      query: topAnimeQ,
      viewAllTo: '/anime?type=tv&order_by=score&sort=desc',
      emptyString: 'no top anime data found'
    },
    {
      id: 'upcoming',
      icon: CalendarDays,
      label: 'Upcoming Anime',
      subtitle: 'TV & Movies',
      query: upcomingAnimeQ,
      viewAllTo: '/anime?type=tv&status=upcoming&order_by=popularity&sort=asc',
      emptyString: 'no upcoming anime data found',
    }
  ]

  return (
    <div className='mt-5 grid grid-cols-1 xs:grid-cols-2 gap-5 px-5 w-full lg:w-4/5 text-sm sm:text-md md:text-lg'>
      {sections.map(section => {
        const Icon = section.icon
        return (
          <div
            key={section.id}
            id={section.id}
            className='w-full box-colors-brighter backdrop-blur-md rounded-lg shadow-xl border border-white/20 dark:border-amethyst-smoke-700/30 py-3 sm:py-4 transition-all'
          >
            {/* Header */}
            <div className='flex items-center justify-between text-sm px-3 sm:px-4 mb-3'>
              <div className='flex items-center gap-2 text-[1.1em]'>
                <Icon
                  size={20}
                  className='text-amethyst-smoke-700 dark:text-amethyst-smoke-400'
                />
                <span className='text-[0.8em] font-semibold uppercase tracking-wider text-amethyst-smoke-800 dark:text-amethyst-smoke-400'>
                  {section.label}
                </span>
                <span className='h-4 w-px bg-amethyst-smoke-800/30 dark:bg-amethyst-smoke-400/30' />
                <span className='text-[0.75em] text-amethyst-smoke-700 dark:text-amethyst-smoke-500'>
                  {section.subtitle}
                </span>
              </div>
              <Link to={section.viewAllTo} target='_blank'>
                <ExternalLink
                  className='stroke-2 hover:cursor-pointer hover:stroke-blue-600/80 dark:hover:stroke-blue-300/80 duration-200'
                  size={18}
                />
              </Link>
            </div>

            {/* List */}
            <div className='flex flex-col'>
              {section.query.isPending ? (
                <div className='flex justify-center py-12'>
                  <LoaderComponent />
                </div>
              ) : section.query?.data?.length ? (
                section.query.data.slice(0, 10).map(anime => {
                   const startDateStr = formatDate(anime?.startDate)
                  return (
                  <Link
                    key={anime.id}
                    to={`/anime/${anime.id}`}
                    className='group flex items-center gap-3 px-3 sm:px-4 py-1.5 hover:bg-blue-600/5 dark:hover:bg-blue-300/5 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.01]'
                  >
                    <img
                      src={
                        anime.coverImage?.large ||
                        anime.coverImage?.medium ||
                        ''
                      }
                      alt={
                        anime.title?.english ||
                        anime.title?.romaji ||
                        anime.title?.native ||
                        ''
                      }
                      className='w-9 h-12 rounded-lg object-cover shadow-sm shrink-0'
                      loading='lazy'
                    />
                    <div className='flex-1 min-w-0'>
                      <p className='text-sm font-semibold text-amethyst-smoke-800 dark:text-amethyst-smoke-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors'>
                        {anime.title?.english ||
                          anime.title?.romaji ||
                          anime.title?.native ||
                          'Untitled'}
                      </p>
                      <div className='flex items-center gap-2 mt-0.5 text-xs text-amethyst-smoke-500 dark:text-amethyst-smoke-400'>
                        <span>{anime.format}</span>
                        {anime.episodes && (
                          <>
                            <span>•</span>
                            <span>{anime.episodes} eps</span>
                          </>
                        )}
                        {anime.duration && (
                          <>
                            <span>•</span>
                            <span>{anime.duration} min</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className='shrink-0'>
                      {section.id==="top"?
                      <span className='inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100/80 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 shadow-sm'>
                        {anime.averageScore ? `${anime.averageScore}%` : 'N/A'}
                      </span>
                      :
                      <span className='inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100/80 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 shadow-sm'>
                        {startDateStr ? startDateStr : 'N/A'}
                      </span>
                      }
                    </div>
                  </Link>
                )
                }
              )
              ) : (
                <EmptyDataFallback string={section.emptyString} />
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}