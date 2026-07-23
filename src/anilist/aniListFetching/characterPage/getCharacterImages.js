import { functions } from '../../../appwrite'
import { adaptCharacterGallery } from '../../adapters/adaptCharacterGallery'

export async function getCharacterGallery (characterName) {
  if (!characterName || !characterName?.last || !characterName?.first) return
  console.log({characterName})
  const characterTag = `${characterName.last}_${characterName.first}`
  const path = `/?tags=${encodeURIComponent(characterTag)}&limit=100`

  try {
    const execution = await functions.createExecution({
      functionId: '6a625b62003276b9befc',
      body: '',
      async: false,
      xpath: path,
      method: 'GET'
    })
    if (execution.responseStatusCode >= 400) {
      throw new Error(
        `Safebooru request failed (${execution.responseStatusCode})`
      )
    }
    const data = JSON.parse(execution.responseBody)
    console.log({data})
    return adaptCharacterGallery(data)
  } catch (err) {
    console.log(err)
    const customError = new Error("couldn't fetch character images")
    customError.status = err?.status || 500
    throw customError
  }
}
