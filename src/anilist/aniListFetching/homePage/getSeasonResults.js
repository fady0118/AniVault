import { getCurrentSeason } from '../../../utility/utils'
import { queryAniList } from '../../client'
import { SEASON_QUERY } from '../../queries/season'

export async function getSeasonResults () {
  try {
    const { season, year } = getCurrentSeason()
    const aniListResult = await queryAniList(SEASON_QUERY, {
      season: season.toUpperCase(),
      seasonYear: year,
      page: 1,
      perPage: 15
    })
    return adaptSeason(aniListResult)
  } catch (error) {
    console.log(error)
  }
}

function adaptSeason(data) {
    return data?.Page?.media
}