export async function queryAniList (query, variables) {
  try {
    const res = await fetch('https://graphql.anilist.co', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({ query, variables })
    })
    const json = await res.json()

    if (!res.ok) {
      const message =
        json?.errors?.[0]?.message || res.statusText || 'GraphQL request failed'
      const error = new Error(message)
      error.status = res.status
      throw error
    }
    return json.data
  } catch (error) {
    if (!error.status) {
      error.status = 500
      error.message = error.message || 'Network error'
    }
    throw error
  }
}
