import {
  adaptMangaDetail,
  adaptCharacters,
  adaptRecommendations,
  adaptReviews
} from '../adapters/adaptManga'
import { queryAniList } from '../client'
import { MANGA_DETAIL_QUERY } from '../queries/mangaDetail'
import { getTmdbImagesAndVideos } from '../TMDB/tmdb'

export async function getMangaDetailPage (malId) {
  try {
    const aniListResult = await queryAniList(MANGA_DETAIL_QUERY, {
      id: Number(malId)
    })

    const tmdbResult = await getTmdbImagesAndVideos(
      aniListResult?.Media.title?.english || aniListResult?.Media.title?.romaji,
      Number(malId),
      import.meta.env.VITE_TMDB_KEY
    )

    return {
      ...adaptMangaDetail(aniListResult?.Media),
      characters: adaptCharacters(aniListResult?.Media),
      reviews: adaptReviews(aniListResult?.Media),
      recommendations: adaptRecommendations(aniListResult?.Media),
      pictures: tmdbResult?.pictures ?? [],
    }
  } catch (error) {
    const message = getFriendlyErrorMessage(error)
    const customError = new Error(message)
    customError.status = error?.status || 500
    throw customError
  }
}
