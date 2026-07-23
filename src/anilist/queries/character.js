export const CHARACTER_QUERY = `
query ($id: Int) {
    Character(id: $id) {
        id
        name {
            full
            native
            first
            last
        }
        image {
            large
            medium
        }
        description
        favourites
        media(sort: POPULARITY_DESC, perPage: 50) {
            edges {
                characterRole
                node {
                    id
                    type
                    title {
                        userPreferred
                        romaji
                        english
                    }
                    coverImage {
                        large
                        medium
                    }
                }
                voiceActors(sort: [FAVOURITES_DESC]) {
                    id
                    name {
                        first
                        last
                    }
                    language
                    image {
                        large
                        medium
                    }
                }
            }
        }
        gender
        dateOfBirth {
            year
            month
            day
        }
        age
    }
}

`
