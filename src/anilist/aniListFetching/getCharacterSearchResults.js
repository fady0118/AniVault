import { CHARACTER_SEARCH_QUERY } from '../queries/characterSearch'
import { queryAniList } from '../client'
import { adaptCharacterSearchResults } from '../adapters/adaptCharacterSearchResults'

/**
 * Convert URL search parameters to AniList GraphQL variables
 * for the character search query.
 */
function buildVariables (searchParams) {
  const vars = {
    page: parseInt(searchParams.get('page')) || 1,
    perPage: 30
  }

  // Search term filter
  const search = searchParams.get('q')
  if (search) {
    vars.search = search
  }

  // Birthday filter for the birthday sidePanel
  if (searchParams.get('isBirthday') === 'true') {
    vars.isBirthday = true
    vars.sort = 'FAVOURITES_DESC'
    return vars
  }

  // Sorting by searchMatch if the user enter a keyword otherwise by favourites
  vars.sort = search? 'SEARCH_MATCH': 'FAVOURITES_DESC'

  return vars
}

export async function getCharacterSearchResults (searchParams) {
  try {
    const variables = buildVariables(searchParams)
    const response = await queryAniList(CHARACTER_SEARCH_QUERY, variables)
    return adaptCharacterSearchResults(response)
  } catch (error) {
    const wrapped = new Error("couldn't fetch character search results")
    wrapped.status = error.status || 500
    throw wrapped
  }
}
