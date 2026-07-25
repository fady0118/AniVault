import { STUDIO_DETAILS_QUERY, STUDIO_MEDIA_QUERY } from '../../queries/studio'
import { queryAniList } from '../../client'
import { adaptStudioDetails, adaptStudioMedia } from '../../adapters/adaptStudio'

export async function getStudioDetailsData(id) {
  try {
    const aniListResult = await queryAniList(STUDIO_DETAILS_QUERY, {
      id: Number(id)
    })
    return adaptStudioDetails(aniListResult)
  } catch (error) {
    console.log({ error })
    const customError = new Error(error?.message || 'Failed to fetch studio details')
    customError.status = error?.status || 500
    throw customError
  }
}

export async function getStudioMediaData(id, page) {
  try {
    const aniListResult = await queryAniList(STUDIO_MEDIA_QUERY, {
      id: Number(id),
      page
    })
    return adaptStudioMedia(aniListResult)
  } catch (error) {
    console.log({ error })
    const customError = new Error(error?.message || 'Failed to fetch studio media')
    customError.status = error?.status || 500
    throw customError
  }
}