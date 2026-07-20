import { SEARCH_QUERY } from '../queries/search'

/**
 * Convert URL search parameters to AniList GraphQL variables
 * Filters out empty, null, and undefined values
 */
function buildVariables (searchParams, itemType) {
  console.log({searchParams})
  const vars = {
    page: parseInt(searchParams.get('page')) || 1,
    perPage: 30,
    mediaType: itemType === 'anime' ? 'ANIME' : 'MANGA'
  }

  // Search term
  if (searchParams.get('q')) {
    vars.search = searchParams.get('q')
  }

  // Genres (included)
  const genres = searchParams.get('genres')
  if (genres) {
    vars.genre_in = genres.split(',').filter(g => g.trim())
  }

  // Genres (excluded)
  const genresExclude = searchParams.get('genres_exclude')
  if (genresExclude) {
    vars.genre_not_in = genresExclude.split(',').filter(g => g.trim())
  }

  // Tags (included)
  const tags = searchParams.get('tags')
  if (tags) {
    vars.tag_in = tags.split(',').filter(t => t.trim())
  }

  // Tags (excluded)
  const tagsExclude = searchParams.get('tags_exclude')
  if (tagsExclude) {
    vars.tag_not_in = tagsExclude.split(',').filter(t => t.trim())
  }


  // Score range
  const minScore = parseInt(searchParams.get('min_score'))
  const maxScore = parseInt(searchParams.get('max_score'))
  if (minScore && minScore > 0) {
    vars.minScore = minScore
  }
  if (maxScore && maxScore < 100) {
    vars.maxScore = maxScore
  }

  // Status
  const status = searchParams.get('status')
  if (status) {
    const anilistStatus = status.split(',')
    if (anilistStatus) {
      vars.status = anilistStatus
    }
  }

  // Type (format for AniList)
  const type = searchParams.get('type')
  if (type) {
    const anilistFormat = type.split(',')
    if (anilistFormat) {
      vars.format = anilistFormat
    }
  }

  // Start and end dates (convert from YYYY-MM-DD to FuzzyDateInt: YYYYMMDD)
  const startDate = searchParams.get('start_date')
  if (startDate) {
    const fuzzyDate = parseInt(startDate.replace(/-/g, ''))
    if (!isNaN(fuzzyDate)) {
      vars.startDateGreater = fuzzyDate
    }
  }

  const endDate = searchParams.get('end_date')
  if (endDate) {
    const fuzzyDate = parseInt(endDate.replace(/-/g, ''))
    if (!isNaN(fuzzyDate)) {
      vars.startDateLesser = fuzzyDate
    }
  }

  // Sorting
  const orderBy = searchParams.get('order_by')
  const sortDir = searchParams.get('sort') === 'asc' ? 'ASC' : 'DESC'
  const sortMap = {
    start_date: `START_DATE_${sortDir}`,
    score: `SCORE_${sortDir}`,
    popularity: `POPULARITY_${sortDir}`,
    title: `TITLE_${sortDir}`,
    trending: `TRENDING_${sortDir}`,
    updated_at: `UPDATED_TIME_${sortDir}`
  }

  const anilistSort = sortMap[orderBy] || `POPULARITY_${sortDir}`
  vars.sort = [anilistSort]

  // Adult content filter
  vars.isAdult = false

  return vars
}

/**
 * Fetch search results from AniList GraphQL API
 * @param {URLSearchParams|Object} searchParams - Search parameters from URL
 * @param {string} itemType - 'anime' or 'manga'
 * @returns {Promise<Object>} AniList Page data with pageInfo and media
 */
export async function getAniListSearchResults (
  searchParams,
  itemType = 'anime'
) {
  try {
    const variables = buildVariables(searchParams, itemType)

    const response = await fetch('https://graphql.anilist.co', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: SEARCH_QUERY,
        variables
      })
    })
    if (!response.ok) {
      const error = new Error('Failed to fetch search results')
      error.status = response.status
      throw error
    }
    const json = await response.json()
    return json.data
  } catch (error) {
    throw error
  }
}
