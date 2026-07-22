export const MANGA_DETAIL_QUERY = `
query ($id: Int) {
  Media(id: $id, type: MANGA) {
    id
    idMal
    type
    format
    source
    status
    volumes
    chapters
    title {
      romaji
      english
      native
    }
    description
    genres
    averageScore
    meanScore
    popularity
    favourites
    isAdult
    siteUrl
    coverImage {
      extraLarge
      large
      medium
      color
    }
    bannerImage
    externalLinks {
      site
      url
    }
    tags {
      id
      name
      category
    }
    rankings {
      id
      rank
      type
      allTime
      context
    }
    relations {
      edges {
        relationType
        node {
          id
          idMal
          title {
            romaji
            english
          }
          format
          type
          coverImage {
            medium
            large
          }
        }
      }
    }
    reviews(sort: RATING_DESC, limit: 20) {
      nodes {
        id
        summary
        body
        score
        user {
          id
          name
          avatar {
            large
          }
        }
        updatedAt
        createdAt
      }
    }
    recommendations(sort: RATING_DESC, perPage: 10) {
      nodes {
        rating
        mediaRecommendation {
          id
          idMal
          type
          title {
            romaji
            english
          }
          coverImage {
            large
          }
        }
      }
    }
    startDate {
      year
      month
      day
    }
    endDate {
      year
      month
      day
    }
    staff(sort: [ROLE], perPage: 10) {
      edges {
        role
        node {
          id
          name {
            full
          }
          image {
            large
          }
        }
      }
    }
  }
}
`
