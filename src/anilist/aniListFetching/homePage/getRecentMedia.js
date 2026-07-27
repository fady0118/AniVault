import { queryAniList } from '../../client'
import { RECENT_MEDIA } from '../../queries/recentMedia'

export async function getRecentMedia (vars) {
  try {
    const aniListResult = await queryAniList(RECENT_MEDIA, vars)
    return adapt(aniListResult)
  } catch (error) {
    console.log(error)
  }
}

function adapt (result) {
  const page = result?.data?.Page ?? result?.Page
  const rawMedia = page?.media ?? []

  const media = dedupeById(rawMedia).map(adaptMediaItem)

  return {
    media,
    hasNextPage: Boolean(page?.pageInfo?.hasNextPage)
  }
}

function dedupeById (mediaList) {
  const seen = new Map()
  for (const item of mediaList) {
    if (!seen.has(item.id)) seen.set(item.id, item)
  }
  return Array.from(seen.values())
}

function adaptMediaItem (item) {
  return {
    id: item.id, // AniList id - used for routing (idMal is nullable/unreliable)
    title: pickTitle(item.title),
    titleNative: item.title?.native ?? '',
    cover: pickCover(item.coverImage),
    description: sanitizeDescription(item.description),
    genres: (item.genres ?? []).slice(0, 3),
    score: item.averageScore ?? null,
    isAdult: Boolean(item.isAdult),
    status: formatStatus(item.status),
    aired: formatAiredRange(item.startDate, item.endDate),
    episodes: item.episodes ?? null,
    chapters: item.chapters ?? null,
    volumes: item.volumes ?? null,
    siteUrl: item.siteUrl ?? null
  }
}

function pickTitle (title) {
  return title?.romaji || title?.english || title?.native || 'Untitled'
}

const DEFAULT_COVER =
  'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/default.jpg'

function pickCover (coverImage) {
  return (
    coverImage?.large ||
    coverImage?.extraLarge ||
    coverImage?.medium ||
    DEFAULT_COVER
  )
}

function formatStatus (status) {
  if (!status) return 'Unknown'
  return status
    .toLowerCase()
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function formatDate ({ year, month, day } = {}) {
  if (!year) return null
  if (!month) return `${year}`
  const monthName = new Date(
    Date.UTC(year, month - 1, day || 1)
  ).toLocaleString('en-US', {
    month: 'short'
  })
  return day ? `${monthName} ${day}, ${year}` : `${monthName} ${year}`
}

function formatAiredRange (startDate, endDate) {
  const start = formatDate(startDate)
  const end = formatDate(endDate)
  if (!start) return 'TBA'
  if (!end || end === start) return start
  return `${start} - ${end}`
}

function sanitizeDescription (html) {
  if (!html) return ''
  return html
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<\/?(i|b|em|strong|p)>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim()
}
