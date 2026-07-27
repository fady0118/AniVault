import { queryAniList } from '../../client'
import { SCHEDUAL_QUERY } from '../../queries/schedual'

export async function getSchedualData () {
  const allMedia = []

  for await (const scheduleChunk of queryAnimeSchedual()) {
    if (scheduleChunk?.Page?.media) {
      allMedia.push(...scheduleChunk.Page.media)
    }
  }

  // Re-wrap the merged array into the shape adaptSchedule expects
  return adaptSchedule({ Page: { media: allMedia } })
}

export async function* queryAnimeSchedual () {
  let page = 1
  let getNextPage = true

  while (getNextPage) {
    try {
      const data = await queryAniList(SCHEDUAL_QUERY, { page, perPage: 50 })
      yield data 
      if (page < 3) {
        page++
      } else {
        getNextPage = false
      }
    } catch (error) {
      getNextPage = false
      console.error(error)
    }
  }
}

function adaptSchedule (data) {
  return data.Page.media
    .filter(anime => anime.nextAiringEpisode)
    .map(anime => {
      const date = new Date(anime.nextAiringEpisode.airingAt * 1000)

      return {
        id: anime.id,
        title: anime.title.romaji || anime.title.english,
        image: anime.coverImage.medium,
        episode: anime.nextAiringEpisode.episode,
        airingAt: anime.nextAiringEpisode.airingAt,
        timeUntilAiring: anime.nextAiringEpisode.timeUntilAiring,
        weekday: new Intl.DateTimeFormat(undefined, {
          weekday: 'long'
        })
          .format(date)
          .toLowerCase(),
        time: new Intl.DateTimeFormat(undefined, {
          hour: '2-digit',
          minute: '2-digit'
        }).format(date),
        fullDate: date
      }
    })
    .sort((a, b) => a.airingAt - b.airingAt)
}
