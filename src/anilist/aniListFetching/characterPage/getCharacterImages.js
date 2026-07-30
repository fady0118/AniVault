import { ExecutionMethod } from 'appwrite'
import { functions } from '../../../appwrite'
import { adaptCharacterGallery } from '../../adapters/adaptCharacterGallery'

export async function getCharacterGallery (characterName, showName) {
  if (!characterName || (!characterName?.last && !characterName?.first)) return
  const payload = { characterName, showName }
  try {
    const execution = await functions.createExecution({
      functionId: import.meta.env.VITE_FUNCTIONS_FETCH_PICTURES,
      body: JSON.stringify(payload),
      async: false,
      method: ExecutionMethod.POST
    })
    if (execution.responseStatusCode >= 400) {
      throw new Error(
        `Safebooru request failed (${execution.responseStatusCode})`
      )
    }
    const data = JSON.parse(execution.responseBody)
    return adaptCharacterGallery(data)
  } catch (err) {
    console.log(err)
    const customError = new Error("couldn't fetch character images")
    customError.status = err?.status || 500
    throw customError
  }
}
