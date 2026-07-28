export const ANIME_COLLECTIONS_QUERY = `query (
    $page: Int
    $perPage: Int
    $formatIn: [MediaFormat]
    $sort: [MediaSort],
    $status_in: [MediaStatus]
) {
    Page(page: $page, perPage: $perPage) {
        media(
            sort: $sort
            type: ANIME
            format_in: $formatIn
            status_in: $status_in
        ) {
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
