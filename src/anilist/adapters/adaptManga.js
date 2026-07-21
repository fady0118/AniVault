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
  const lastDayDigit = day % 10
  const dayExt =
    lastDayDigit === 1
      ? 'st'
      : lastDayDigit === 2
      ? 'nd'
      : lastDayDigit === 3
      ? 'rd'
      : 'th'

  if (month && day) return `${months[month - 1]} ${day}${dayExt} ${year}`
  if (month) return `${months[month - 1]} ${year}`
  return `${year}`
}

export function adaptMangaDetail (media) {
  const flattenedRelations = (media.relations?.edges ?? []).map(edge => ({
    relation: edge.relationType,
    id: edge.node.id,
    title: edge.node.title?.english || edge.node.title?.romaji,
    type: edge.node.type?.toLowerCase(),
    images: { jpg: { image_url: edge.node.coverImage?.medium } }
  }))

  return {
    id: media.id,
    mal_id: media.idMal,
    type: media.type?.toLowerCase(),
    format: media.format,
    source: media.source,
    status: media.status,
    url: media.siteUrl || `https://myanimelist.net/manga/${media.idMal}`,
    title: media.title?.english || media.title?.romaji || media.title?.native,
    title_english: media.title?.english,
    title_japanese: media.title?.native,
    title_full: {
      romaji: media.title?.romaji,
      english: media.title?.english,
      native: media.title?.native
    },
    titles: [
      { type: 'romaji', title: media.title?.romaji },
      { type: 'english', title: media.title?.english },
      { type: 'native', title: media.title?.native }
    ].filter(t => t.title),
    description: media.description,
    volumes: media.volumes,
    chapters: media.chapters,
    score: media.averageScore ? media.averageScore / 10 : null,
    scored_by: null,
    rank:
      media.rankings?.find(r => r.allTime && r.type === 'RATED')?.rank ?? null,
    popularity: media.popularity,
    members: media.popularity,
    favorites: media.favourites,
    genres: (media.genres ?? []).map(name => ({ name })),
    themes:
      media.tags
        ?.filter(t => t.category?.startsWith('Theme'))
        .map(t => ({ name: t.name })) ?? [],
    demographics:
      media.tags
        ?.filter(t => t.category === 'Demographic')
        .map(t => ({ name: t.name })) ?? [],
    published: {
      from: media.startDate,
      to: media.endDate,
      string: `from ${formatAniListMediaDate(
        media.startDate
      )}, to ${formatAniListMediaDate(media.endDate)}`
    },
    isAdult: media.isAdult,
    images: {
      jpg: {
        large_image_url:
          media.coverImage?.large ||
          media.coverImage?.extraLarge ||
          media.bannerImage ||
          null
      },
      coverImage: media.coverImage?.extraLarge,
      bannerImage: media.bannerImage
    },
    external: (media.externalLinks ?? []).map(link => ({
      name: link.site,
      url: link.url
    })),
    authors:
      media.staff?.edges?.map(edge => ({
        name: edge.node.name?.full,
        id: edge.node.id,
        role: edge.role,
        type: 'people'
      })) ?? [],
    flattenedRelations
  }
}

export function adaptCharacters (media) {
  const dataArr = (media.characters?.edges ?? []).map(edge => ({
    character: {
      path: 'character',
      role: edge.role.toLowerCase(),
      id: edge.node.id,
      name: edge.node.name.full,
      images: { jpg: { image_url: edge.node.image?.large } }
    }
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
      avatarImg: r.user?.avatar?.large
    }
  }))

  const featured = ['recommended', 'mixed feelings', 'not recommended']
    .map(tag => allReviews.find(r => r.tags === tag))
    .filter(Boolean)

  const rest = allReviews.filter(r => !featured.some(f => f.id === r.id))

  const stats = {
    all: allReviews.length,
    recommended: allReviews.filter(r => r.tags === 'recommended').length,
    mixedFeelings: allReviews.filter(r => r.tags === 'mixed feelings').length,
    notRecommended: allReviews.filter(r => r.tags === 'not recommended').length,
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
        path: n.mediaRecommendation?.type.toLowerCase(),
        id: n.mediaRecommendation?.id,
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

export function adaptPictureResults(pictures) {
  return pictures.map(picture=>({jpg:{image_url:picture}}))||[]
}