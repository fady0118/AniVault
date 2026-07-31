import { adaptText } from '../../utility/utils'

const ANILIST_TYPE_MAP = {
  anime: 'anime',
  manga: 'manga',
  character: 'character',
  staff: 'people',
  studio: 'producer'
}

function adaptDescriptionText (text) {
  const adaptedText = adaptText(text)
  return adaptedText
    .replace(
      /(?<=\])\(https?:\/\/anilist\.co\/(anime|manga|character|staff|studio)\/(\d+)\/([^)]+)\)/g,
      (_, type, id, slug) =>
        `(/${ANILIST_TYPE_MAP[type] || type}/${id}/${slug})`
    )
    .replace(
      /~!([\s\S]+?)!~/g,
      '<span class="al-spoiler" tabindex="0">$1</span>'
    )
}

export function adaptCharacter (data) {
  if (!data?.Character) return null
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
    name: character.name,
    nativeName: character.name?.native,
    alternativeNames: (character.name?.alternative || []).filter(Boolean),
    image: character.image?.large || character.image?.medium,
    about: character.description
      ? adaptDescriptionText(character.description)
      : 'No biography written.',
    favorites: character.favourites || 0,
    gender: character.gender,
    age: character.age,
    anime,
    manga,
    voiceActors: Array.from(voiceActorMap.values())
  }
}
