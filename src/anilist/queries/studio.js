export const STUDIO_DETAILS_QUERY = `
  query StudioDetails($id: Int) {
    Studio(id: $id) {
      id
      name
      isAnimationStudio
      siteUrl
      favourites
    }
  }
`

export const STUDIO_MEDIA_QUERY = `
  query StudioMedia($id: Int, $page: Int) {
    Studio(id: $id) {
      id
      media(page: $page, sort: POPULARITY_DESC) {
        pageInfo {
          currentPage
          hasNextPage
          lastPage
        }
        edges {
          node {
            id
            idMal
            title {
              romaji
              english
              native
            }
            type
            format
            status
            description
            episodes
            season
            seasonYear
            coverImage {
              large
              medium
            }
            bannerImage
            genres
            averageScore
            favourites
          }
        }
      }
    }
  }
`