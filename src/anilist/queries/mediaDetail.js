export const MEDIA_DETAIL_QUERY = `
  query ($id: Int, $mediaType: MediaType) {
    Media(id: $id, type: $mediaType) {
      # Common fields
      id
      idMal
      type
      format
      source
      status
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
      synonyms

      # Anime-only fields (null for manga)
      episodes
      duration
      season
      seasonYear
      nextAiringEpisode {
        airingAt
        episode
      }
      trailer {
        id
        site
        thumbnail
      }
      studios(isMain: true) {
        edges {
          node {
            id
            name
          }
        }
      }

      # Manga-only fields (null for anime)
      volumes
      chapters
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
`;