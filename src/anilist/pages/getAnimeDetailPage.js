import { getFriendlyErrorMessage } from '../../utility/errorMapping'
import {
  adaptAnimeDetail,
  adaptAnimeThemes,
  adaptCharacters,
  adaptRecommendations,
  adaptReviews
} from '../adapters/adaptAnime'
import { fetchAnimeThemesById } from '../AnimeThemes/animeThemes'
import { queryAniList } from '../client'
import { ANIME_DETAIL_QUERY } from '../queries/animeDetail'
import { getTmdbImagesAndVideos } from '../TMDB/tmdb'

export async function getAnimeDetailPage (id) {
  try {
    const aniListResult = await queryAniList(ANIME_DETAIL_QUERY, {
      id: Number(id)
    })
    const tmdbResult = await getTmdbImagesAndVideos(
      aniListResult?.Media.title.english,
      Number(id),
      import.meta.env.VITE_TMDB_KEY
    )
    console.log({tmdbResult})
    const animeThemes = await fetchAnimeThemesById(Number(id))

    const adaptedData = {
      anime: adaptAnimeDetail(aniListResult?.Media),
      characters: adaptCharacters(aniListResult?.Media),
      reviews: adaptReviews(aniListResult?.Media),
      recommendations: adaptRecommendations(aniListResult?.Media),
      pictures: tmdbResult?.pictures ?? [],
      videos: tmdbResult?.videos ?? [],
      themes: adaptAnimeThemes(animeThemes)
    }
    return adaptedData
  } catch (error) {
    const message = getFriendlyErrorMessage(error)
    const customError = new Error(message)
    customError.status = error?.status || 500
    throw customError
  }
}
