const ANIME_THEMES_QUERY = `
query ($id: [Int!]) {
    findAnimeByExternalSite(site: ANILIST, id: $id) {
        name
        animethemes {
            type
            animethemeentries {
                videos {
                    nodes {
                        audio {
                            filename
                            link
                        }
                    }
                }
            }
        }
    }
}
`

export async function fetchAnimeThemesById (id) {
  try {
    const res = await fetch('https://graphql.animethemes.moe/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: ANIME_THEMES_QUERY,
        variables: { id: id }
      })
    })
    if (!res.ok) throw new Error(`AniList ${res.status} - ${res.statusText}`)
    const json = await res.json()

    if (json.errors) throw new Error(json.errors.map(e => e.message).join('; '))
    return json.data
  } catch (error) {
    console.log(error)
  }
}
