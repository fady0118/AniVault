import data from '../mappings.json'
const TMDB_BASE = 'https://api.themoviedb.org/3'

async function tmdbFetch (path, apiKey) {
  const res = await fetch(
    `${TMDB_BASE}${path}${path.includes('?') ? '&' : '?'}api_key=${apiKey}`
  )
  if (!res.ok) throw new Error(`TMDB ${res.status} - ${res.statusText}`)
  return res.json()
}

// find the id by title.
async function findTmdbShowId (title, apiKey) {
  try {
    const res = await tmdbFetch(
      `/search/tv?query=${encodeURIComponent(title)}`,
      apiKey
    )
    const data = await res.json()
    return data?.results?.[0]?.id ?? null
  } catch (error) {
    return null
  }
}
// get TMDB url
async function getdTmdbMappings (title, malId, apiKey) {
  const mappingData = data[`mal:${malId}`] || {}
  let tmdbKey = Object.keys(mappingData)?.find(k => k?.startsWith('tmdb_show'))
  let url
  if (tmdbKey) {
    const [_, tmdbId, seasonPart] = tmdbKey.split(':')
    const seasonNum = parseInt(seasonPart.slice(1))
    return { tmdbId, seasonNum }
  } else {
    const tmdbId = await findTmdbShowId(title, apiKey)
    return { tmdbId }
  }
}

// get images & videos
export async function getTmdbImagesAndVideos (title, malId, apiKey) {
  const { tmdbId } = await getdTmdbMappings(title, malId, apiKey)
  if (!tmdbId) return { pictures: [], videos: [], matched: false }
  const details = await tmdbFetch(
    `/tv/${tmdbId}?append_to_response=images,videos`,
    apiKey
  )

  const pictures = (details.images?.backdrops ?? [])
    .concat(details.images?.posters ?? [])
    .map(img => ({
      jpg: { image_url: `https://image.tmdb.org/t/p/w780${img.file_path}` },
      large_image_url: `https://image.tmdb.org/t/p/original${img.file_path}`
    }))

  const videos = (details.videos?.results ?? [])
    .filter(v => v.site === 'YouTube')
    .map(v => ({
      title: v.name,
      youtube_id: v.key,
      type: v.type
    }))

  return { pictures, videos, matched: true }
}

// get episodes data
export async function getTmdbEpisodes (title, malId, apiKey) {
  const { tmdbId, seasonNum } = await getdTmdbMappings(title, malId, apiKey)
  const details = await tmdbFetch(`/tv/${tmdbId}/season/${seasonNum}`, apiKey)
  return { details }
}
