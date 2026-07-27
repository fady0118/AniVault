export const TRENDING_QUERY = `
query ($page: Int, $perPage: Int, $formatIn: [MediaFormat]) {
  Page(page: $page, perPage: $perPage) {
    media(sort: TRENDING_DESC, type: ANIME, format_in: $formatIn) {
      id
      title {
        romaji
        english
        native
      }
      format
      status
      episodes
      duration
      averageScore
      popularity
      favourites
      genres
      tags {
        name
      }
      studios {
        nodes {
          name
        }
      }
      season
      seasonYear
      startDate {
        year
        month
        day
      }
      coverImage {
        large
        medium
      }
      bannerImage
      description
      siteUrl
    }
  }
}
  `
