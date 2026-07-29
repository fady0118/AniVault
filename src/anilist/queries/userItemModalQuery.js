export const USER_ITEM_MODAL_QUERY = `
query ($id: Int) {
  Media(id: $id) {
    id
    idMal
    type
    title {
      romaji
      english
      native
    }
    status
    episodes
    volumes
    chapters
    coverImage {
      extraLarge
      large
      medium
      color
    }
    bannerImage
  }
}
`
