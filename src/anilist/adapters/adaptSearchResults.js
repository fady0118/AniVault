/**
 * Map AniList genres (strings) to objects with name and mal_id
 * This mapping bridges AniList's genre names to Jikan's mal_id format
 * for backward compatibility with the existing UI
 */
const ANILIST_GENRE_MAP = {
  Action: 1,
  Adventure: 2,
  Comedy: 4,
  Drama: 8,
  Fantasy: 10,
  Horror: 14,
  Mystery: 7,
  Romance: 22,
  'Sci-Fi': 24,
  'Slice of Life': 36,
  Sports: 30,
  Supernatural: 37,
  Suspense: 41,
  'Avant Garde': 5,
  'Award Winning': 46,
  'Boys Love': 28,
  'Girls Love': 26,
  Gourmet: 47,
  Harem: 35,
  Historical: 13,
  'Martial Arts': 17,
  Mecha: 18,
  Music: 19,
  Parody: 20,
  Racing: 3,
  Samurai: 21,
  School: 23,
  Space: 29,
  'Super Power': 31,
  Vampire: 32,
  Mythology: 6,
  Detective: 39,
  Military: 38,
  Psychological: 40,
  'Strategy Game': 11,
  Kids: 15,
  Josei: 43,
  Seinen: 42,
  Shoujo: 25,
  Shounen: 27,
  'Adult Cast': 50,
  Anthropomorphic: 51,
  CGDCT: 52,
  Childcare: 53,
  'Combat Sports': 54,
  Crossdressing: 81,
  Delinquents: 55,
  Educational: 56,
  'Gag Humor': 57,
  Gore: 58,
  'High Stakes Game': 59,
  'Idols (Female)': 60,
  'Idols (Male)': 61,
  Isekai: 62,
  Iyashikei: 63,
  'Love Polygon': 64,
  'Magical Sex Shift': 65,
  'Mahou Shoujo': 66,
  Medical: 67,
  'Organized Crime': 68,
  'Otaku Culture': 69,
  'Performing Arts': 70,
  Pets: 71,
  Reincarnation: 72,
  'Reverse Harem': 73,
  'Love Status Quo': 74,
  Showbiz: 75,
  Survival: 76,
  'Team Sports': 77,
  'Time Travel': 78,
  'Video Game': 79,
  'Visual Arts': 80,
  Workplace: 48,
  'Urban Fantasy': 82,
  Villainess: 83
}

/**
 * Format status from AniList to human-readable format
 */
function formatStatus (status, mediaType) {
  const statusMap = {
    ANIME: {
      FINISHED: 'Finished airing',
      RELEASING: 'Currently airing',
      NOT_YET_RELEASED: 'Not yet aired',
      CANCELLED: 'Cancelled',
      HIATUS: 'On hiatus'
    },
    MANGA: {
      FINISHED: 'Finished publishing',
      RELEASING: 'Currently publishing',
      NOT_YET_RELEASED: 'Not yet published',
      CANCELLED: 'Cancelled',
      HIATUS: 'On hiatus'
    }
  }
  return statusMap[mediaType][status] || status
}

/**
 * Format date object from AniList (year, month, day) to readable string
 */
function formatDateString (dateObj) {
  if (!dateObj || !dateObj.year) return null

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ]

  const { year, month, day } = dateObj
  let dateStr = months[month - 1] || `${month}`

  if (day) {
    dateStr = `${dateStr} ${day}, ${year}`
  } else {
    dateStr = `${dateStr}, ${year}`
  }

  return dateStr
}

/**
 * Convert AniList media item to Jikan-compatible format
 * This maintains backward compatibility with the existing UI rendering
 */
function adaptMediaItem (anilistItem) {
  if (!anilistItem) return null

  // Map genres from AniList format (array of strings) to Jikan format
  const genres = (anilistItem.genres || []).map(genreName => ({
    name: genreName,
    mal_id: ANILIST_GENRE_MAP[genreName] || 0
  }))

  // Format aired string based on status and dates
  let airedString = ''
  if (anilistItem.startDate && anilistItem.startDate.year) {
    const startStr = formatDateString(anilistItem.startDate)
    const endStr =
      anilistItem.endDate && anilistItem.endDate.year
        ? formatDateString(anilistItem.endDate)
        : null

    airedString = endStr ? `${startStr} to ${endStr}` : startStr
  }

  return {
    // Use idMal if available (for linking), fallback to AniList id
    mal_id: anilistItem.idMal || anilistItem.id,
    id: anilistItem.id,
    idMal: anilistItem.idMal,

    // Title - prefer English, fallback to Romaji
    title:
      anilistItem.title.userPreferred ||
      anilistItem.title.english ||
      anilistItem.title.romaji,
    title_english: anilistItem.title.english,
    title_japanese: anilistItem.title.native,

    // Images
    images: {
      jpg: {
        image_url: anilistItem.coverImage.medium,
        small_image_url: anilistItem.coverImage.medium,
        large_image_url: anilistItem.coverImage.large
      },
      webp: {
        image_url: anilistItem.coverImage.medium,
        small_image_url: anilistItem.coverImage.medium,
        large_image_url: anilistItem.coverImage.large
      }
    },

    // Ratings and popularity
    score: anilistItem.averageScore ? anilistItem.averageScore / 10 : 0,
    averageScore: anilistItem.averageScore,
    popularity: anilistItem.popularity,
    trending: anilistItem.trending,

    // Status
    status: formatStatus(anilistItem.status, anilistItem.type),
    airing: anilistItem.status === 'AIRING',
    aired: {
      string: airedString,
      from: anilistItem.startDate,
      to: anilistItem.endDate
    },

    // Content details
    genres,
    format: anilistItem.format,
    type: anilistItem.type === 'ANIME' ? 'anime' : 'manga',
    episodes: anilistItem.episodes,
    chapters: anilistItem.chapters,
    volumes: anilistItem.volumes,
    duration: anilistItem.duration, // minutes per episode for anime

    // Additional info
    isAdult: anilistItem.isAdult,
    season: anilistItem.season,
    seasonYear: anilistItem.seasonYear,

    // Next airing episode info
    nextAiringEpisode: anilistItem.nextAiringEpisode || null,
    favourites: anilistItem.favourites
  }
}

/**
 * Adapt AniList search results response to match existing UI expectations
 * Transforms the Page data structure and all media items
 */
export function adaptSearchResults (anilistResponse) {
  if (!anilistResponse || !anilistResponse.Page) {
    return {
      data: [],
      pagination: {
        has_next_page: false,
        current_page: 1,
        last_visible_page: 1
      }
    }
  }

  const { Page } = anilistResponse
  const pageInfo = Page.pageInfo || {}
  const mediaItems = Page.media || []

  // Adapt each media item
  const adaptedData = mediaItems.map(item => adaptMediaItem(item))

  return {
    data: adaptedData,
    pagination: {
      has_next_page: pageInfo.hasNextPage || false,
      current_page: pageInfo.currentPage || 1,
      last_visible_page: pageInfo.lastPage || 1,
      per_page: pageInfo.perPage || 20,
      total: pageInfo.total || 0
    }
  }
}

export default adaptSearchResults
