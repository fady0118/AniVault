/**
 * Adapt a single AniList character node into the card shape
 * consumed by the character browse grid.
 */
function adaptCharacterItem (character) {
  if (!character) return null

  const name = character.name || {}
  const fullName =
    name.full || [name.first, name.last].filter(Boolean).join(' ')

  let media = []
  if (Array.isArray(character.media?.edges)) {
    media = character.media.edges
      .map(edge => {
        const node = edge?.node
        if (!node) return null
        return {
          id: node.id,
          type: node.type?.toLowerCase(),
          title:
            node.title?.userPreferred ||
            node.title?.romaji ||
            node.title?.english,
          role: edge.characterRole
        }
      })
      .filter(Boolean)
  }

  return {
    id: character.id,
    // Title fields follow the same shape anime/manga cards expose
    title: fullName,
    title_english: fullName,
    title_japanese: name.native,

    // Images in the same { jpg, webp } structure used by the existing grid
    images: {
      jpg: {
        image_url: character.image?.medium,
        small_image_url: character.image?.medium,
        large_image_url: character.image?.large
      },
      webp: {
        image_url: character.image?.medium,
        small_image_url: character.image?.medium,
        large_image_url: character.image?.large
      }
    },

    // Character-specific metadata
    favourites: character.favourites || 0,
    gender: character.gender,
    age: character.age,
    dateOfBirth: character.dateOfBirth,
    media
  }
}

/**
 * Adapt a full AniList Page.characters response into the
 * { data, pagination } shape used by the browse grid.
 */
export function adaptCharacterSearchResults (anilistResponse) {
  if (!anilistResponse?.Page) {
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

  return {
    data: (Page.characters || [])
      .map(item => adaptCharacterItem(item))
      .filter(Boolean),
    pagination: {
      has_next_page: pageInfo.hasNextPage || false,
      current_page: pageInfo.currentPage || 1,
      last_visible_page: pageInfo.lastPage || 1,
      per_page: pageInfo.perPage || 20,
      total: pageInfo.total || 0
    }
  }
}

export default adaptCharacterSearchResults
