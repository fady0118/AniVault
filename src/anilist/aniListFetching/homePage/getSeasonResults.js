import { queryAniList } from '../../client'
import { SEASON_QUERY } from '../../queries/season'

export async function getSeasonResults (vars) {
  try {
    const aniListResult = await queryAniList(SEASON_QUERY, vars)
    return aniListResult
  } catch (error) {
    console.log(error)
  }
}
