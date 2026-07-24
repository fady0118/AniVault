import { adaptPersonRoles } from '../../adapters/adaptPersonRoles'
import { PERSON_ROLES_QUERY } from '../../queries/personRoles'
import { queryPersonRolesById } from './queryPersonRolesById'

export async function getPersonRolesData (id) {
  try {
    const allEdges = []
    for await (const edgesChunk of queryPersonRolesById(
      PERSON_ROLES_QUERY,
      Number(id)
    )) {
      allEdges.push(...edgesChunk)
    }
    return {
      voiceRoles: adaptPersonRoles(allEdges)
    }
  } catch (error) {
    console.log(error)
    const customError = new Error("couldn't fetch person roles data")
    customError.status = error?.status || 500
    throw customError
  }
}
