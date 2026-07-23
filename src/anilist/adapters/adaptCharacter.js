export function adaptCharacter (data) {
  if (!data) return null
  const character = data.Character
  // Deduplicate voice actors across all media appearances
  const voiceActorMap = new Map()

  // Separate media appearances into anime and manga
  const anime = []
  const manga = []

  character.media?.edges?.forEach(edge => {
    const mediaNode = edge.node
    if (!mediaNode) return

    const mediaItem = {
      id: mediaNode.id,
      title:
        mediaNode.title?.userPreferred ||
        mediaNode.title?.english ||
        mediaNode.title?.romaji,
      role: edge.characterRole,
      coverImage: mediaNode.coverImage?.large || mediaNode.coverImage?.medium
    }

    if (mediaNode.type === 'ANIME') {
      anime.push(mediaItem)
    } else if (mediaNode.type === 'MANGA') {
      manga.push(mediaItem)
    }

    // Collect and deduplicate voice actors
    edge.voiceActors?.forEach(va => {
      if (va?.id && !voiceActorMap.has(va.id)) {
        voiceActorMap.set(va.id, {
          id: va.id,
          name: `${va.name?.first || ''} ${va.name?.last || ''}`.trim(),
          language: va.language,
          image: va.image?.large || va.image?.medium
        })
      }
    })
  })

  return {
    id: character.id,
    name: character.name?.full,
    nativeName: character.name?.native,
    image: character.image?.large || character.image?.medium,
    about: character.description
      ? character.description.replace(/<br\s*\/?>/gi, '\n')
      : 'No biography written.',
    favorites: character.favourites || 0,
    gender: character.gender,
    age: character.age,
    anime,
    manga,
    voiceActors: Array.from(voiceActorMap.values())
  }
}
