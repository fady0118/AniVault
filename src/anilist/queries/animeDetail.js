export const ANIME_DETAIL_QUERY = 
`
query ($id: Int) {
    Media(id: $id, type: ANIME) {
        id
        idMal
        type
        title {
            romaji
            english
            native
        }
        description
        episodes
        duration
        status
        season
        seasonYear
        genres
        averageScore
        meanScore
        format
        source
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
        popularity
        favourites
        isAdult
        coverImage {
            extraLarge
            large
            color
        }
        bannerImage
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
                    name
                    id
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
        nextAiringEpisode {
            airingAt
            episode
        }
    }
}

`