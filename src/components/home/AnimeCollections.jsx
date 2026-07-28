// AnimeCollections.jsx
import { useQueries } from '@tanstack/react-query'
import { ExternalLink } from 'lucide-react'
import { Link } from 'react-router'
import LoaderComponent from '../LoaderComponent'
import EmptyDataFallback from '../EmptyDataFallback'
import { getAnimeCollectionsData } from '../../anilist/aniListFetching/homePage/getAnimeCollectionsData'

const classes = {
  collectionClass:
    'min-h-64 w-full flex flex-col rounded-lg overflow-hidden bg-linear-0 from-0% from-amethyst-smoke-300/15 dark:from-dark-amethyst-smoke-50/15 to-100% to-indigo-600/5',
  gradient: [
    'bg-dark-amethyst-smoke-600/21',
    'bg-dark-amethyst-smoke-600/18',
    'bg-dark-amethyst-smoke-600/15',
    'bg-dark-amethyst-smoke-600/12',
    'bg-dark-amethyst-smoke-600/9',
    'bg-dark-amethyst-smoke-600/6',
    'bg-dark-amethyst-smoke-600/3',
    'bg-dark-amethyst-smoke-600/0'
  ]
}

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

  return (
    <>
      <div className='mt-5 grid grid-cols-1 xs:grid-cols-2 gap-x-6 px-5 w-full lg:w-4/5 capitalize text-sm sm:text-md md:text-lg'>
        <div id='top' className='relative w-full flex flex-col py-1 gap-y-1'>
          <div className='uppercase font-extrabold flex flex-row items-center gap-x-3'>
            <p>top anime</p>
            <Link to='/anime?type=tv&order_by=score&sort=desc' target='_blank'>
              <ExternalLink
                className='stroke-2 hover:cursor-pointer hover:stroke-blue-600/80 dark:hover:stroke-blue-300/80 duration-200'
                size={20}
              />
            </Link>
          </div>
          <div className={`${classes.collectionClass}`}>
            {topAnimeQ.isPending ? (
              <div className='absolute top-1/2 left-1/2 -translate-1/2'>
                <LoaderComponent />
              </div>
            ) : topAnimeQ?.data?.length ? (
              <>
                {topAnimeQ?.data?.map((anime, i) => (
                  <Link
                    to={`/anime/${anime.id}`}
                    key={i}
                    className={`group w-full px-3 py-2.5 flex flex-row items-center justify-start gap-x-3 text-[0.85em] hover:bg-indigo-300/10 duration-200 ${
                      classes.gradient[i] ||
                      classes.gradient[classes.gradient.length - 1]
                    }`}
                  >
                    <img
                      className='rounded-full aspect-square object-cover w-1/9 max-w-17 min-w-12'
                      src={anime?.coverImage.medium || anime?.coverImage.large}
                      alt={
                        anime?.title.romaji ||
                        anime?.title.english ||
                        anime?.title.native
                      }
                    />
                    <p className='group-hover:text-blue-600/80 dark:group-hover:text-blue-300/80 duration-200'>
                      {anime?.title.romaji ||
                        anime?.title.english ||
                        anime?.title.native}
                    </p>
                  </Link>
                ))}
              </>
            ) : (
              <EmptyDataFallback string='no top anime data found' />
            )}
          </div>
        </div>
        <div
          id='upcoming'
          className='relative w-full flex flex-col py-1 gap-y-1'
        >
          <div className='uppercase font-extrabold flex flex-row items-center gap-x-3'>
            <p>upcoming anime</p>
            <Link
              to='/anime?type=tv&status=upcoming&order_by=popularity&sort=asc'
              target='_blank'
            >
              <ExternalLink
                className='stroke-2 hover:cursor-pointer hover:stroke-blue-600/80 dark:hover:stroke-blue-300/80 duration-200'
                size={20}
              />
            </Link>
          </div>
          <div className={`${classes.collectionClass}`}>
            {upcomingAnimeQ.isPending ? (
              <div className='absolute top-1/2 left-1/2 -translate-1/2'>
                <LoaderComponent />
              </div>
            ) : upcomingAnimeQ?.data?.length ? (
              <>
                {upcomingAnimeQ?.data?.map((anime, i) => (
                  <Link
                    to={`/anime/${anime.id}`}
                    key={i}
                    className={`group w-full px-3 py-2.5 flex flex-row items-center justify-start gap-x-3 text-[0.85em] hover:bg-indigo-300/10 duration-200 ${
                      classes.gradient[i] ||
                      classes.gradient[classes.gradient.length - 1]
                    }`}
                  >
                    <img
                      className='rounded-full aspect-square object-cover w-1/9 max-w-17 min-w-12'
                      src={anime?.coverImage.medium || anime?.coverImage.large}
                      alt={
                        anime?.title.romaji ||
                        anime?.title.english ||
                        anime?.title.native
                      }
                    />
                    <p className='group-hover:text-blue-600/80 dark:group-hover:text-blue-300/80 duration-200'>
                      {anime?.title.romaji ||
                        anime?.title.english ||
                        anime?.title.native}
                    </p>
                  </Link>
                ))}
              </>
            ) : (
              <EmptyDataFallback string='no upcoming anime data found' />
            )}
          </div>
        </div>
      </div>
    </>
  )
}
