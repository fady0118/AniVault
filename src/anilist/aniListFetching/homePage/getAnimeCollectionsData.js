import { getCurrentSeason } from '../../../utility/utils'
import { queryAniList } from '../../client'
import { ANIME_COLLECTIONS_QUERY } from '../../queries/animeCollections'
import { TRENDING_QUERY } from '../../queries/trendingMedia'

export async function getAnimeCollectionsData (vars) {
  try {
    const aniListResult = await queryAniList(ANIME_COLLECTIONS_QUERY,vars)
    return adaptTrending(aniListResult)
  } catch (error) {
    console.log(error)
  }
}

function adaptTrending (data) {
  return data?.Page?.media
}


