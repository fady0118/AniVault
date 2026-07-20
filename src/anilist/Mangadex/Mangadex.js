const MANGADEX_BASE = 'https://api.mangadex.org'
const MANGADEX_UPLOADS = 'https://uploads.mangadex.org'

async function searchMangaDexCandidates (title) {
  const url = `${MANGADEX_BASE}/manga?title=${encodeURIComponent(
    title
  )}&limit=20&includes[]=cover_art`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`MangaDex search failed: ${res.status}`)
  const json = await res.json()
  return json.data ?? []
}

function extractMalId (manga) {
  const malLink = manga.attributes?.links?.mal
  if (!malLink) return null
  // links.mal can be a bare id or a full url depending on entry age
  const idPart = malLink.split('/').filter(Boolean).pop()
  return /^\d+$/.test(idPart) ? idPart : null
}

function getAllTitles(manga) {
  const attrs = manga.attributes;
    const titles = [
      ...Object.values(attrs.title||{}), 
      ...(attrs.altTitles||[]).flatMap(t=>Object.values(t))
    ];
  return titles.map(title=>title.toLowerCase().trim())
}

function pickBestMatch (candidates, mangaMeta) {
  // mal_id match
  const malMatch = candidates.find(
    c => extractMalId(c) === String(mangaMeta.idMal)
  )
  if (malMatch) return malMatch

  // fallback: [title+year] match
  if (mangameta.startDate.year) {
    const normalizedTitle = mangaMeta.title.english?.toLowerCase().trim()
    const titleMatches = candidates.filter(c =>
      getAllTitles(c).includes(normalizedTitle)
    )
    const yearMatch = titleMatches.find(
      c => c.attributes.year === mangameta.startDate.year
    )
    if (yearMatch) return yearMatch
  }
  // title not found
  return null
}

async function findMangaDexId (mangaMeta) {
  const candidates = await searchMangaDexCandidates(mangaMeta.title.english)
  const match = pickBestMatch(candidates, mangaMeta)
  return match?.id ?? null
}

async function getMangaDexCovers (mangaDexId) {
  console.log(`getting covers for ${mangaDexId}`)
  const url = `${MANGADEX_BASE}/cover?manga[]=${mangaDexId}&limit=100`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`MangaDex covers failed: ${res.status}`)
  const json = await res.json()
  return json.data.map(
    c => `${MANGADEX_UPLOADS}/covers/${mangaDexId}/${c.attributes.fileName}`
  )
}

export async function getGalleryForManga (mangaMeta) {
  console.log({mangaMeta})
  try {
    const mdId = await findMangaDexId(mangaMeta)
    if (!mdId) {
      console.warn(
        `No confident MangaDex match for "${mangaMeta.title.english}" (mal_id=${mangaMeta.idMal})`
      )
      return []
    }
    return await getMangaDexCovers(mdId)
  } catch (err) {
    console.error(`Gallery fetch failed for "${mangaMeta.title.english}"`, err)
    return []
  }
}
