export async function* queryAniListCharactersById (mediaId, query, mediaType) {
  let page = 1
  let hasNextPage = true

  while (hasNextPage) {
    try {
      const res = await fetch('https://graphql.anilist.co', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          query,
          variables: { id: mediaId, page, mediaType }
        })
      })
      const result = await res.json()
      if (result?.errors) {
        throw new Error(result.errors[0]?.message || 'AniList API Error')
      }
      // Safely extract edges and pageInfo
      const charactersData = result?.data?.Media?.characters
      const edges = charactersData?.edges || []
      const pageInfo = charactersData?.pageInfo

      if (edges.length === 0) {
        hasNextPage = false
      } else {
        // Yield current page's edges to the consumer
        yield edges
        hasNextPage = pageInfo?.hasNextPage ?? false
        page++
      }
    } catch (error) {
      console.error('Fetch error:', error)
      hasNextPage = false // break on error
    }
  }
}
