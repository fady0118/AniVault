import { getFriendlyErrorMessage } from '../../utility/errorMapping'
import {
  adaptAnimeDetail,
  adaptAnimeThemes,
  adaptCharacters,
  adaptRecommendations,
  adaptReviews
} from '../adapters/adaptAnime'
import { fetchAnimeThemesByMalId } from '../AnimeThemes/animeThemes'
import { queryAniList } from '../client'
import { ANIME_DETAIL_QUERY } from '../queries/animeDetail'
import { getTmdbImagesAndVideos } from '../TMDB/tmdb'

export async function getAnimeDetailPage (malId) {
  try {
    const aniListResult = await queryAniList(ANIME_DETAIL_QUERY, {
      id: Number(malId)
    })
    const tmdbResult = await getTmdbImagesAndVideos(
      aniListResult?.Media.title.english,
      Number(malId),
      import.meta.env.VITE_TMDB_KEY
    )
    const animeThemes = await fetchAnimeThemesByMalId(Number(malId))

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
