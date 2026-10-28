export const CHARACTER_SEARCH_QUERY = `
query (
    $page: Int
    $perPage: Int
    $search: String
    $isBirthday: Boolean
    $sort: [CharacterSort]
) {
    Page(page: $page, perPage: $perPage) {
        pageInfo {
            hasNextPage
            currentPage
            lastPage
            perPage
            total
        }
        characters(
            search: $search
            isBirthday: $isBirthday
            sort: $sort
        ) {
            id
            name {
                first
                last
                full
                native
            }
            image {
                large
                medium
            }
            favourites
            gender
            age
            dateOfBirth {
                year
                month
                day
            }
            media(sort: FAVOURITES_DESC, perPage: 3) {
                edges {
                    characterRole
                    node {
                        id
                        type
                        title {
                            romaji
                            english
                            native
                            userPreferred
                        }
                    }
                }
            }
        }
    }
}
`
