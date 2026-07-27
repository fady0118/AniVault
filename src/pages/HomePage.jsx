import HomeSlider from '../components/home/HomeSlider'
import { useQuery } from '@tanstack/react-query'
import { data } from 'react-router'
import RecentMedia from '../components/home/RecentMedia'
import HomeSidePanel from '../components/home/HomeSidePanel'
import AnimeCollections from '../components/home/AnimeCollections'
import LoaderComponent from '../components/LoaderComponent'
import { getSeasonResults } from '../anilist/aniListFetching/homePage/getSeasonResults'

const recentQueriesVars = {
  anime: {
    TV: { perPage: 20, format: 'TV' },
    MOVIE: { perPage: 20, format: 'MOVIE' }
  },
  manga: {
    MANGA: { perPage: 20, format: 'MANGA' },
    NOVEL: { perPage: 20, format: 'NOVEL' }
  }
}

export default function HomePage () {
  const seasonQ = useQuery({
    queryKey: ['seasonListData'],
    queryFn: async () => {
      const data = await getSeasonResults()
      return data
    }
  })

  return (
    <div className='relative w-screen'>
      {seasonQ.isPending ? (
        <div className='fixed top-1/2 left-1/2 -translate-1/2'>
          <LoaderComponent />
        </div>
      ) : (
        <>
          <HomeSlider season={seasonQ?.data} />

          <div className='flex flex-col md:flex-row gap-x-5 px-5'>
            <div className='w-full md:w-2/3 lg:w-3/4 shrink-0 py-3 gap-y-2 flex flex-col'>
              <div className='text-md/relaxed sm:text-xl/relaxed font-extrabold uppercase'>
                Latest Updates
              </div>
              {/* <RecentMedia
                varsMap={{
                  anime: recentQueriesVars.anime
                }}
              />
              <RecentMedia
                varsMap={{
                  manga: recentQueriesVars.manga
                }}
              /> */}
            </div>
            <HomeSidePanel />
          </div>
          {/* <AnimeCollections /> */}
        </>
      )}
    </div>
  )
}
