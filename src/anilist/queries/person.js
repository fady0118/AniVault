export const PERSON_QUERY = `
query Staff($id: Int) {
    Staff(id: $id) {
        id
        name {
            first
            last
            full
            native
        }
        language
        image {
            large
            medium
        }
        description(asHtml: true)
        gender
        primaryOccupations
        dateOfBirth {
            year
            month
            day
        }
        dateOfDeath {
            year
            month
            day
        }
        age
        yearsActive
        homeTown
        bloodType
        staffMedia(sort: [POPULARITY_DESC]) {
            edges {
                node {
                    id
                    title {
                        romaji
                        english
                        native
                    }
                    type
                    coverImage {
                        medium
                        large
                    }
                }
            }
        }
        characters(sort: [FAVOURITES_DESC]) {
            edges {
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
                role
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
            }
        }
    }
}
`