export const PERSON_ROLES_QUERY = `
query Staff($id: Int, $page: Int) {
    Staff(id: $id) {
        id
        name {
            first
            last
            full
            native
        }
        characters(sort: [FAVOURITES_DESC], page: $page) {
            edges {
                node {
                    name {
                        full
                    }
                    image {
                        large
                        medium
                    }
                    id
                }
                media {
                    id
                    idMal
                    title {
                        english
                        romaji
                        native
                    }
                    type
                    coverImage {
                        medium
                        large
                    }
                }
                role
            }
            pageInfo {
                currentPage
                lastPage
                hasNextPage
            }
        }
    }
}

`