import { getCurrentSeason } from '../../../utility/utils'
import { queryAniList } from '../../client'
import { SEASON_QUERY } from '../../queries/season'
import { TRENDING_QUERY } from '../../queries/trendingMedia'

export async function getTrendingMedia () {
  try {
    const aniListResult = await queryAniList(TRENDING_QUERY, {
      page: 1,
      perPage: 10,
      formatIn: ['TV', 'MOVIE']
    })
    return adaptTrending(aniListResult)
  } catch (error) {
    console.log(error)
  }
}

function adaptTrending (data) {
  return data?.Page?.media
}
