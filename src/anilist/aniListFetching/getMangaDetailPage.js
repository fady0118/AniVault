import { getFriendlyErrorMessage } from '../../utility/errorMapping'
import { adaptReviews } from '../adapters/adaptAnime'
import {
  adaptMangaDetail,
  adaptCharacters,
  adaptRecommendations,
  adaptPictureResults
} from '../adapters/adaptManga'
import { queryAniList } from '../client'
import { getGalleryForManga } from '../Mangadex/Mangadex'
import { MANGA_DETAIL_QUERY } from '../queries/mangaDetail'

export async function getMangaDetailPage (malId) {
  try {
    const aniListResult = await queryAniList(MANGA_DETAIL_QUERY, {
      id: Number(malId)
    })
    
    const mangaDexResults = await getGalleryForManga(aniListResult?.Media)

    const adaptedData = {
      ...adaptMangaDetail(aniListResult?.Media),
      reviews: adaptReviews(aniListResult?.Media),
      recommendations: adaptRecommendations(aniListResult?.Media),
      pictures: adaptPictureResults(mangaDexResults ?? [])
    }
    return adaptedData
  } catch (error) {
    console.log({ error })
    const message = getFriendlyErrorMessage(error)
    const customError = new Error(message)
    customError.status = error?.status || 500
    throw customError
  }
}
