import { adaptPerson } from '../../adapters/adaptPerson'
import { queryAniList } from '../../client'
import { PERSON_QUERY } from '../../queries/person'

export async function getPersonData (id) {
  try {
    const aniListResult = await queryAniList(PERSON_QUERY, {
      id: Number(id)
    })
    return adaptPerson(aniListResult)
  } catch (error) {
    console.log(error)
    const customError = new Error("couldn't fetch perosn data")
    customError.status = error?.status || 500
    throw customError
  }
}
