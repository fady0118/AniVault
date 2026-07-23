import { adaptCharacter } from '../../adapters/adaptCharacter'
import { queryAniList } from '../../client'
import { CHARACTER_QUERY } from '../../queries/character'

export async function getCharacterData (id) {
  try {
    const aniListResult = await queryAniList(CHARACTER_QUERY, {
      id: Number(id)
    })
    return {
      character: adaptCharacter(aniListResult)
    }
  } catch (error) {
    console.log(error)
    const customError = new Error("couldn't  fetch anime data")
    customError.status = error?.status || 500
    throw customError
  }
}
