export const SCHEDUAL_QUERY = `
query AiringSchedule($page: Int!, $perPage: Int!) {
    Page(page: $page, perPage: $perPage) {
        media(type: ANIME, format: TV, status: RELEASING) {
            id
            title {
                romaji
                english
            }
            coverImage {
                medium
            }
            nextAiringEpisode {
                episode
                airingAt
                timeUntilAiring
            }
        }
    }
}
`