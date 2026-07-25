export function adaptStudioDetails (data) {
  const studio = data?.Studio
  if (!studio) return {}

  const titles = []
  if (studio.name) titles.push({ type: 'default', title: studio.name })

  return {
    id: studio.id,
    titles,
    isAnimationStudio: studio.isAnimationStudio,
    favorites: studio.favourites || 0,
    siteUrl: studio.siteUrl || null,
    url: `https://anilist.co/studio/${studio.id}`
  }
}

export function adaptStudioMedia (data) {
  const studio = data?.Studio
  if (!studio) return { data: [], pagination: {} }

  const mediaEdges = studio.media?.edges || []
  const deduplicatedResults = deduplicateEdges(mediaEdges)
  const anime = deduplicatedResults.map(edge => {
    const node = edge.node
    return {
      id: node.id,
      mal_id: node.idMal || node.id,
      title_english: node.title?.english || node.title?.userPreferred,
      title:
        node.title?.romaji || node.title?.userPreferred || node.title?.english,
      title_japanese: node.title?.native,

      description: node.description,
      episodes: node.episodes,
      season: node.season,
      seasonYear: node.seasonYear,

      images: {
        webp: { image_url: node.coverImage?.large || node.coverImage?.medium },
        jpg: { image_url: node.coverImage?.medium || node.coverImage?.large }
      },
      score: node.averageScore ? node.averageScore / 10 : null,
      members: node.favourites || null,
      type: node.format || 'Unknown',
      genres: (node.genres || []).map(name => ({ name }))
    }
  })

  const pageInfo = studio.media?.pageInfo || {}
  const pagination = {
    current_page: pageInfo.currentPage || 1,
    last_visible_page: pageInfo.lastPage || null,
    has_next_page: pageInfo.hasNextPage || false,
    per_page: 25,
    total: pageInfo.currentPage ? anime.length : 0
  }

  return {
    data: anime,
    pagination
  }
}

function deduplicateEdges (edges) {
  return [...new Map(edges.map(edge => [edge.node.id, edge])).values()]
}
