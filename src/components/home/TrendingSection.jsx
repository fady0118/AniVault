import { useQuery } from '@tanstack/react-query'
import { getTrendingMedia } from '../../anilist/aniListFetching/homePage/getTrendingMedia'
import { Trophy } from 'lucide-react'
import LoaderComponent from '../LoaderComponent'
import { Link } from 'react-router'

export default function TrendingSection () {
  const TrendingAnimeQ = useQuery({
    queryKey: ['trendingAnime'],
    queryFn: async () => {
      return await getTrendingMedia()
    }
  })
  return (
    <div className='w-full xs:w-1/2 md:w-full box-colors-brighter backdrop-blur-md rounded-lg shadow-xl border border-white/20 dark:border-amethyst-smoke-700/30 py-3 sm:py-4 transition-all'>
      {/* Header */}
      <div className='text-sm px-3 sm:px-4 mb-3'>
        <div className='flex items-center gap-2 text-[1.1em]'>
            <Trophy
              size={20}
              className='text-amethyst-smoke-700 dark:text-amethyst-smoke-400'
            />
            <span className='text[0.8em] font-semibold uppercase tracking-wider text-amethyst-smoke-800 dark:text-amethyst-smoke-400'>
              Trending
            </span>
            <span className='h-4 w-px bg-amethyst-smoke-800/30 dark:bg-amethyst-smoke-400/30' />
            <span className='text-[0.75em] text-amethyst-smoke-700 dark:text-amethyst-smoke-500'>
              TV & Movies
        </span>
        </div>
      </div>

      {/* List */}
      <div className='flex flex-col'>
        {TrendingAnimeQ.isPending ? (
          <div className='flex justify-center py-12'>
            <LoaderComponent />
          </div>
        ) : TrendingAnimeQ?.data?.length ? (
          TrendingAnimeQ?.data.slice(0, 10).map(item => (
            <Link
              key={item.id}
              to={`/anime/${item.id}`}
              className='group flex items-center gap-3 px-3 sm:px-4 py-1.5 hover:bg-blue-600/5 dark:hover:bg-blue-300/5 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.01]'
            >
              <img
                src={item.coverImage?.large || item.coverImage?.medium || ''}
                alt={item.title?.english || item.title?.romaji || ''}
                className='w-9 h-12 rounded-lg object-cover shadow-sm shrink-0'
                loading='lazy'
              />
              <div className='flex-1 min-w-0'>
                <p className='text-sm font-semibold text-amethyst-smoke-800 dark:text-amethyst-smoke-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors'>
                  {item.title?.english ||
                    item.title?.romaji ||
                    item.title?.native ||
                    'Untitled'}
                </p>
                <div className='flex items-center gap-2 mt-0.5 text-xs text-amethyst-smoke-500 dark:text-amethyst-smoke-400'>
                  <span>{item.format}</span>
                  {item.episodes && (
                    <>
                      <span>•</span>
                      <span>{item.episodes} eps</span>
                    </>
                  )}
                  {item.duration && (
                    <>
                      <span>•</span>
                      <span>{item.duration} min</span>
                    </>
                  )}
                </div>
              </div>
              <div className='shrink-0'>
                <span className='inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100/80 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 shadow-sm'>
                  {item.averageScore ? `${item.averageScore}%` : 'N/A'}
                </span>
              </div>
            </Link>
          ))
        ) : (
          <EmptyDataFallback string='No trending anime found' />
        )}
      </div>
    </div>
  )
}
