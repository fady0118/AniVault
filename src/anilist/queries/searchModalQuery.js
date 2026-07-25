const SEARCH_MODAL_ANIME_QUERY = `
query SearchAnime($search: String, $page: Int = 1, $perPage: Int = 10) {
  Page(page: $page, perPage: $perPage) {
    anime: media(search: $search, type: ANIME, sort: POPULARITY_DESC) {
      id
      type
      format
      title {
        romaji
        english
        native
      }
      coverImage {
        large
        medium
      }
      startDate {
        year
      }
      status
    }
  }
}
`

const SEARCH_MODAL_MANGA_QUERY = `
query SearchManga($search: String, $page: Int = 1, $perPage: Int = 10) {
  Page(page: $page, perPage: $perPage) {
    manga: media(search: $search, type: MANGA) {
      id
      type
      format
      title {
        romaji
        english
        native
      }
      coverImage {
        large
        medium
      }
      startDate {
        year
      }
      status
    }
  }
}
`

const SEARCH_MODAL_CHARACTERS_QUERY = `
query SearchCharacters($search: String, $page: Int = 1, $perPage: Int = 10) {
  Page(page: $page, perPage: $perPage) {
    characters(search: $search) {
      id
      name {
        full
        native
      }
      image {
        large
        medium
      }
    }
  }
}
`

const SEARCH_MODAL_STAFF_QUERY = `
query SearchStaff($search: String, $page: Int = 1, $perPage: Int = 10) {
  Page(page: $page, perPage: $perPage) {
    staff(search: $search) {
      id
      name {
        full
        native
      }
      image {
        large
        medium
      }
      primaryOccupations
    }
  }
}
`

const SEARCH_MODAL_STUDIO_QUERY = `
query SearchStudios($search: String, $page: Int = 1, $perPage: Int = 10) {
  Page(page: $page, perPage: $perPage) {
    studios(search: $search) {
      id
      name
    }
  }
}
`

export const searchQueriesMap = {
  anime: SEARCH_MODAL_ANIME_QUERY,
  manga: SEARCH_MODAL_MANGA_QUERY,
  characters: SEARCH_MODAL_CHARACTERS_QUERY,
  staff: SEARCH_MODAL_STAFF_QUERY,
  studio: SEARCH_MODAL_STUDIO_QUERY
}
