export const ANIME_MANGA_CHARACTERS_QUERY = `
query ($id: Int, $page: Int, $mediaType: MediaType) {
    Media(id: $id, type: $mediaType) {
        id
        characters(page: $page, sort: [RELEVANCE]) {
            edges {
                role
                voiceActors(language: JAPANESE) {
                    id
                    name {
                        full
                    }
                    image {
                        large
                        medium
                    }
                }
                node {
                    id
                    name {
                        full
                    }
                    image {
                        large
                        medium
                    }
                }
            }
            pageInfo {
                currentPage
                hasNextPage
                lastPage
            }
        }
    }
}

`