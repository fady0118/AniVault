function formatAniListMediaDate (dateObj) {
  if (!dateObj || !dateObj.year) return 'Unknown'

  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ]
  const { year, month, day } = dateObj
  const last_day_digit = day % 10
  const day_ext =
    last_day_digit === 1
      ? 'st'
      : last_day_digit === 2
      ? 'nd'
      : last_day_digit === 3
      ? 'rd'
      : 'th'

  if (month && day) return `${months[month - 1]} ${day}${day_ext} ${year}`
  if (month) return `${months[month - 1]} ${year}`
  return `${year}`
}

export function adaptAnimeDetail (media) {
  const flattenedRelations = (media.relations?.edges ?? []).map(edge => ({
    relation: edge.relationType,
    mal_id: edge.node.idMal,
    title: edge.node.title.english || edge.node.title.romaji,
    type: edge.node.type?.toLowerCase(),
    images: { jpg: { image_url: edge.node.coverImage?.medium } }
  }))

  return {
    id: media.id,
    mal_id: media.idMal,
    type: media.type?.toLowerCase(),
    format: media.format,
    source: media.source,
    mal_url: `https://myanimelist.net/anime/${media.idMal}`,
    title: {
      romaji: media.title?.romaji,
      english: media.title?.english,
      native: media.title?.native
    },
    description: media.description,
    episodes: media.episodes,
    duration: media.duration,
    status: media.status,
    season: media.season,
    seasonYear: media.seasonYear,
    score: media.averageScore ? media.averageScore / 10 : null,
    rank:
      media.rankings?.find(r => r.allTime && r.type === 'RATED')?.rank ?? null,
    popularity:
      media.rankings?.find(r => r.allTime && r.type === 'POPULAR')?.rank ??
      null,
    members: media.popularity,
    favourites: media.favourites,
    genres: (media.genres ?? []).map(name => ({ name })),
    themes: media.tags?.filter(t => t.category?.startsWith('Theme')),
    demographics: media.tags?.filter(t => t.category === 'Demographic'),
    aired: {
      from: media.startDate,
      to: media.endDate,
      string: `from ${formatAniListMediaDate(
        media.startDate
      )}, to ${formatAniListMediaDate(media.endDate)}`
    },
    isAdult: media.isAdult,
    images: {
      coverImage: media.coverImage?.extraLarge,
      bannerImage: media.bannerImage
    },
    trailer: media.trailer
      ? {
          youtube_id:
            media.trailer.site === 'youtube' ? media.trailer.id : null,
          images: { maximum_image_url: media.trailer.thumbnail }
        }
      : null,
    studios: (media.studios?.edges ?? []).map(e => ({
      name: e.node.name,
      mal_id: e.node.id
    })),
    externalLinks: media.externalLinks,
    flattenedRelations
  }
}

export function adaptCharacters (media) {
  const dataArr = (media.characters?.edges ?? []).map(edge => ({
    character: {
      path: 'character',
      role: edge.role.toLowerCase(),
      mal_id: edge.node.id,
      name: edge.node.name.full,
      images: { jpg: { image_url: edge.node.image?.large } }
    },
    voice_actor: edge.voiceActors?.[0]
      ? {
          path: 'people',
          mal_id: edge.voiceActors[0].id,
          name: edge.voiceActors[0].name.full,
          images: { jpg: { image_url: edge.voiceActors[0].image?.large } }
        }
      : null
  }))
  return { dataArr }
}

function bucketReviewTag (score) {
  if (score >= 75) return 'recommended'
  if (score >= 50) return 'mixed feelings'
  return 'not recommended'
}

export function adaptReviews (media) {
  const allReviews = (media.reviews?.nodes ?? []).map(r => ({
    id: r.id,
    review: r.body,
    summary: r.summary,
    score: r.score,
    date: r.updatedAt,
    tags: bucketReviewTag(r.score),
    user: {
      id: r.user?.id,
      username: r.user?.name,
      avatarImg: r.user?.avatar.large
    }
  }))

  const featured = ['recommended', 'mixed feelings', 'not recommended']
    .map(tag => allReviews.find(r => r.tags.includes(tag)))
    .filter(Boolean)

  const rest = allReviews.filter(
    r => !featured.map(f => f.mal_id).includes(r.mal_id)
  )

  const stats = {
    all: allReviews.length,
    recommended: allReviews.filter(r => r.tags.includes('recommended')).length,
    mixedFeelings: allReviews.filter(r => r.tags.includes('mixed feelings'))
      .length,
    notRecommended: allReviews.filter(r => r.tags.includes('not recommended'))
      .length,
    avgScore: allReviews.length
      ? allReviews.reduce((c, r) => c + r.score, 0) / allReviews.length
      : null
  }

  return { featured, rest, stats }
}

export function adaptRecommendations (media) {
  const recommendationsDataArr = (media.recommendations?.nodes ?? []).map(
    n => ({
      recommendation: {
        path: 'anime',
        mal_id: n.mediaRecommendation?.idMal,
        name:
          n.mediaRecommendation?.title?.english ||
          n.mediaRecommendation?.title?.romaji,
        images: {
          jpg: { image_url: n.mediaRecommendation?.coverImage?.large }
        },
        votes: n.rating
      }
    })
  )
  return { recommendationsDataArr }
}

export function adaptAnimeThemes (data) {
  const path = data?.findAnimeByExternalSite[0]
  const adaptedThemes = {
    anime: path?.name,
    animethemes: path?.animethemes.map(t => ({
      type: t.type,
      audio: t.animethemeentries[0].videos.nodes[0].audio
    }))
  }
  return adaptedThemes
}
