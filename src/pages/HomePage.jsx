import HomeSlider from '../components/home/HomeSlider'
import { useQuery } from '@tanstack/react-query'
import { data } from 'react-router'
import RecentMedia from '../components/home/RecentMedia'
import HomeSidePanel from '../components/home/HomeSidePanel'
import AnimeCollections from '../components/home/AnimeCollections'
import LoaderComponent from '../components/LoaderComponent'
import { getSeasonResults } from '../anilist/aniListFetching/homePage/getSeasonResults'
import { getCurrentSeason } from '../utility/utils'

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
      const { season, year } = getCurrentSeason()
      const aniListResult = await getSeasonResults({
        format_in: ['TV', 'MOVIE'],
        season: season.toUpperCase(),
        seasonYear: year,
        page: 1,
        perPage: 15
      })
      return aniListResult?.Page?.media
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

          <div className='shrink-0 py-3 space-y-3 flex flex-col gap-x-5 px-5'>
            <div className='text-md/relaxed sm:text-xl/relaxed font-extrabold uppercase'>
              Latest Updates
            </div>
            <div
              class="grid grid-cols-1 lg:grid-cols-[3fr_1fr]
            [grid-template-areas:'recents''sidebar''collections']
            lg:[grid-template-areas:'recents_sidebar''collections_sidebar']"
            >
              <div class='[grid-area:recents]'>
                <RecentMedia
                  varsMap={{
                    anime: recentQueriesVars.anime
                  }}
                />
                <RecentMedia
                  varsMap={{
                    manga: recentQueriesVars.manga
                  }}
                />
              </div>
              <div class='[grid-area:sidebar]'>
                <HomeSidePanel />
              </div>
              <div class='[grid-area:collections]'>
                <AnimeCollections />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
