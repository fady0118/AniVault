export const SEARCH_QUERY = `
query (
    $page: Int
    $perPage: Int
    $search: String
    $genre_in: [String]
    $genre_not_in: [String]
    $tag_in: [String]
    $tag_not_in: [String]
    
    $minScore: Int
    $maxScore: Int
    $season: MediaSeason
    $seasonYear: Int
    $startDateGreater: FuzzyDateInt
    $startDateLesser: FuzzyDateInt
    $status: [MediaStatus]
    $format: [MediaFormat]
    $source: [MediaSource]
    $isAdult: Boolean
    $sort: [MediaSort]
    $mediaType: MediaType
) {
    Page(page: $page, perPage: $perPage) {
        pageInfo {
            hasNextPage
            currentPage
            lastPage
            perPage
            total
        }
        media(
            search: $search
            genre_in: $genre_in
            genre_not_in: $genre_not_in
            tag_in: $tag_in               
            tag_not_in: $tag_not_in
            averageScore_greater: $minScore
            averageScore_lesser: $maxScore
            season: $season
            seasonYear: $seasonYear
            startDate_greater: $startDateGreater
            startDate_lesser: $startDateLesser
            status_in: $status
            format_in: $format
            source_in: $source
            isAdult: $isAdult
            sort: $sort
            type: $mediaType
        ) {
            id
            idMal
            title {
                romaji
                english
                native
                userPreferred
            }
            coverImage {
                large
                medium
                color
            }
            averageScore
            genres
            status
            format
            episodes
            chapters
            duration
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
            season
            seasonYear
            nextAiringEpisode {
                airingAt
                timeUntilAiring
                episode
            }
            popularity
            trending
            favourites
            isAdult
            type
        }
    }
}

`
