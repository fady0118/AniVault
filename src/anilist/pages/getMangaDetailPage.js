import { getFriendlyErrorMessage } from '../../utility/errorMapping'
import {
  adaptMangaDetail,
  adaptCharacters,
  adaptRecommendations,
  adaptReviews,
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
    
    const title = aniListResult?.Media.title.english??aniListResult?.Media.title.native??null
    const mangaDexResults = await getGalleryForManga(aniListResult?.Media)

    const adaptedData = {
      ...adaptMangaDetail(aniListResult?.Media),
      characters: adaptCharacters(aniListResult?.Media),
      reviews: adaptReviews(aniListResult?.Media),
      recommendations: adaptRecommendations(aniListResult?.Media),
      pictures: adaptPictureResults(mangaDexResults ?? [])
    }
    // console.log(adaptedData)
    return adaptedData
  } catch (error) {
    console.log({ error })
    const message = getFriendlyErrorMessage(error)
    const customError = new Error(message)
    customError.status = error?.status || 500
    throw customError
  }
}
