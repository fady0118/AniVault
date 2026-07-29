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
import { MEDIA_DETAIL_QUERY } from '../queries/mediaDetail'

export async function getMangaDetailPage (id) {
  try {
    const aniListResult = await queryAniList(MEDIA_DETAIL_QUERY, {
      id: Number(id),
      mediaType: 'MANGA'
    })

    const mangaDexResults = await getGalleryForManga(aniListResult?.Media)

    const adaptedData = {
      manga: adaptMangaDetail(aniListResult?.Media),
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
