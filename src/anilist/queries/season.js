export const SEASON_QUERY = `
query (
    $format_in: [MediaFormat]
    $season: MediaSeason
    $seasonYear: Int
    $page: Int
    $perPage: Int
) {
    Page(page: $page, perPage: $perPage) {
        pageInfo {
            total
            currentPage
            lastPage
            hasNextPage
            perPage
        }
        media(
            season: $season
            seasonYear: $seasonYear
            format_in: $format_in,
            type: ANIME,
            sort: POPULARITY_DESC
        ) {
            id
            title {
                romaji
                english
                native
            }
            description
            season
            seasonYear
            format
            status
            episodes
            duration
            genres
            averageScore
            popularity
            coverImage {
                extraLarge
                large
            }
            bannerImage
            studios(isMain: true) {
                nodes {
                    name
                }
            }
            trailer {
                id
                site
                thumbnail
            }
        }
    }
}
`
