export async function* queryPersonRolesById (query, mediaId) {
  let page = 2 // getPersonPage queries first page
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
          variables: { id: mediaId, page }
        })
      })
      const result = await res.json()

      const personRolesData = result?.data?.Staff.characters
      const edges = personRolesData?.edges || []
      const pageInfo = personRolesData?.pageInfo

      if (edges.length) {
        yield edges
        hasNextPage = pageInfo?.hasNextPage ?? false
        page++
      } else {
        hasNextPage = false
      }
    } catch (error) {
      console.error('Fetch error:', error)
      hasNextPage = false // break on error
    }
  }
}
