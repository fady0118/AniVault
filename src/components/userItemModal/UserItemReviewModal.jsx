import { useEffect, useState } from 'react'
import { tablesDB } from '../../appwrite'
import { ID, Query } from 'appwrite'
import { useAuth } from '../../Contexts/AuthContext'
import TextAreaToolBox from '../textareaToolbox/TextAreaToolBox'
import useTextAreaToolBox from '../textareaToolbox/useTextAreaToolBox'
import useFormStatusHandling from './useFormStatusHandling'
import LoaderComponent from '../LoaderComponent'

export default function UserItemReviewModal ({
  jikanData,
  mediaType,
  userItemData,
  refetchReviews
}) {
  const { loggedInUser } = useAuth()
  // data local states
  const [reviewData, setReviewData] = useState(null)
  const [hasFetched, setHasFetched] = useState(false)
  const [modified, setModified] = useState(false)

  // status handling
  const { status, setStatus, error, setError } = useFormStatusHandling()
  // review body TextArea
  const { textAreaData, setTextAreaData, insertTextStyle } = useTextAreaToolBox(
    reviewData?.review_body || ''
  )
  // local form states
  const [rating, setRating] = useState(reviewData?.overall_rating ?? null)
  const [selectedTag, setSelectedTag] = useState(reviewData?.tags ?? '')
  const [spoilers, setSpoilers] = useState(reviewData?.Spoiler_Warning ?? null)

  const [errors, setErrors] = useState({
    body: null,
    rating: null,
    tag: null,
    spoilers: null
  })
  const [submitted, setSubmitted] = useState(false)

  const tagsEnum = [
    { label: 'Recommended', value: 'Recommended' },
    { label: 'Mixed Feelings', value: 'Mixed_Feelings' },
    { label: 'Not Recommended', value: 'Not_Recommended' }
  ]
  // appwrite data fetch
  async function fetchReviewFromDB () {
    try {
      const res = await tablesDB.listRows({
        databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
        tableId: import.meta.env.VITE_TABLE_ID_REVIEWS,
        queries: [
          Query.equal('item_mal_id', jikanData?.mal_id || userItemData?.mal_id),
          Query.equal('userProfile', loggedInUser?.$id)
        ]
      })
      setReviewData(res?.rows[0] || null)
      setHasFetched(true)
    } catch (error) {
      setStatus(error)
      setError(error.message)
    }
  }

  // sync local states with reviewData
  useEffect(() => {
    if (reviewData) {
      setTextAreaData(reviewData?.review_body ?? null)
      setRating(reviewData?.overall_rating ?? 0)
      setSpoilers(reviewData?.Spoiler_Warning ?? null)
      setSelectedTag(reviewData?.tags ?? '')
    }
  }, [reviewData])

  // check if user made changes
  useEffect(() => {
    if (!hasFetched) return
    const modified =
      textAreaData !== reviewData?.review_body ||
      rating !== reviewData?.overall_rating ||
      spoilers !== reviewData?.Spoiler_Warning ||
      selectedTag !== reviewData?.tags
    setModified(modified)
  }, [textAreaData, rating, spoilers, selectedTag])

  // fetch review data on mount
  useEffect(() => {
    fetchReviewFromDB()
  }, [])

  // form validation helpers
  const validate = () => {
    const errors = {
      body: !(textAreaData && textAreaData.trim().length > 0),
      rating: !(rating && Number(rating) > 0),
      tag: !selectedTag,
      spoilers: spoilers === null
    }
    setErrors(errors)
    return errors
  }

  async function handleSubmit (e) {
    e.preventDefault()
    setSubmitted(true)
    const validationErrors = validate()
    if (
      validationErrors?.body ||
      validationErrors?.rating ||
      validationErrors?.tag ||
      validationErrors?.spoilers
    ) {
      setStatus('error')
      setError('Please fill all required fields.')
      return
    }
    setStatus('loading')
    try {
      const payload = {
        mediaType: mediaType,
        review_body: textAreaData,
        overall_rating: Number(rating),
        tags: selectedTag,
        Spoiler_Warning: Boolean(spoilers),
        user_id_str: loggedInUser?.$id,
        item_mal_id: jikanData?.mal_id || userItemData?.mal_id,
        userProfile: loggedInUser?.$id,
        userItem: userItemData?.$id,
        anime_progress: userItemData?.progress || null,
        manga_vols: userItemData?.manga_vols || null,
        manga_chaps: userItemData?.manga_chaps || null,
      }
      console.log('Saving review:', payload)
      let res
      if (reviewData?.$id) {
        // update existing row
        res = await tablesDB.updateRow({
          databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
          tableId: import.meta.env.VITE_TABLE_ID_REVIEWS,
          rowId: reviewData?.$id,
          data: payload
        })
      } else {
        // create new row
        res = await tablesDB.createRow({
          databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
          tableId: import.meta.env.VITE_TABLE_ID_REVIEWS,
          rowId: ID.unique(),
          data: payload
        })
      }
      setStatus('success')
      setError(null)
      setModified(false)
      if (refetchReviews) {
        refetchReviews()
      }
    } catch (error) {
      setStatus('error')
      setError(error?.message || 'Failed to save review')
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className='rounded-2xl border border-white/10 section-colors-medium p-4 shadow-inner shadow-slate-900/30 text-xs xs:text-sm'
    >
      <div className='w-full grid grid-cols-1 xs:grid-cols-5 gap-x-4 gap-y-2 min-h-36'>
        <div
          id='reviewBody'
          className='col-span-1 xs:col-span-3 flex flex-col gap-3'
        >
          <div className='flex items-center justify-between'>
            <h3 className='font-semibold text-sm'>
              Review Text <span className='text-rose-500'>*</span>
            </h3>
          </div>
          <TextAreaToolBox
            metaData={{
              title: 'Review Text',
              placeholder: `Share your thoughts on this ${
                mediaType || 'item'
              }...`
            }}
            textAreaData={textAreaData}
            setTextAreaData={setTextAreaData}
            insertTextStyle={insertTextStyle}
          />
          {submitted && errors?.body && (
            <p className='text-xs text-rose-500'>
              Please add your review text.
            </p>
          )}

          <div>
            <h4 className='font-semibold text-sm'>
              Overall rating <span className='text-rose-500'>*</span>
            </h4>
            <div className='flex gap-x-1 flex-nowrap w-full max-w-xs py-2'>
              {Array.from({ length: 10 }, (_, i) => i + 1).map(i => (
                <button
                  type='button'
                  key={i}
                  onClick={() => setRating(i)}
                  aria-pressed={rating === i}
                  aria-label={`Rate ${i}`}
                  className={`@container w-1/10 aspect-square flex justify-center items-center rounded-sm border duration-150 cursor-pointer px-2 py-1 ${
                    rating === i
                      ? 'bg-indigo-500 text-white border-indigo-500'
                      : 'bg-transparent border-amethyst-smoke-800/20 hover:border-indigo-500'
                  }`}
                >
                  <p className='text-xs @2cxs:text-xs @cxs:text-sm'>{i}</p>
                </button>
              ))}
            </div>
            {submitted && errors?.rating && (
              <p className='text-xs text-rose-500'>Please select a rating.</p>
            )}
          </div>
        </div>

        <div
          id='reviewMeta'
          className='flex flex-col gap-3 col-span-1 xs:col-span-2'
        >
          <div className='flex flex-col gap-1'>
            <label className='font-semibold'>
              Would you recommend this? <span className='text-rose-500'>*</span>
            </label>
            <div className='flex flex-col gap-2'>
              {tagsEnum.map(opt => (
                <label
                  key={opt.value}
                  className='flex items-center gap-x-2 text-sm'
                >
                  <input
                    type='radio'
                    name='tags'
                    aria-required
                    className='radio radio-xs scale-90 checked:bg-indigo-500 checked:border-indigo-500'
                    value={opt.value}
                    checked={selectedTag === opt.value}
                    onChange={e => setSelectedTag(e.target.value)}
                  />
                  <span className='truncate'>{opt.label}</span>
                </label>
              ))}
            </div>
            {submitted && errors?.tag && (
              <p className='text-xs text-rose-500'>
                Choose one of the options.
              </p>
            )}
          </div>

          <div className='flex flex-col gap-1'>
            <label className='font-semibold'>
              Spoiler Warning <span className='text-rose-500'>*</span>
            </label>
            <div className='flex flex-col gap-2'>
              <label className='flex items-center gap-x-2 text-sm'>
                <input
                  type='radio'
                  name='spoilers'
                  value='true'
                  checked={spoilers === true}
                  onChange={() => setSpoilers(true)}
                  className='radio radio-xs scale-90 checked:bg-indigo-500 checked:border-indigo-500'
                />
                <span>Includes spoilers</span>
              </label>
              <label className='flex items-center gap-x-2 text-sm'>
                <input
                  type='radio'
                  name='spoilers'
                  value='false'
                  checked={spoilers === false}
                  onChange={() => setSpoilers(false)}
                  className='radio radio-xs scale-90 checked:bg-indigo-500 checked:border-indigo-500'
                />
                <span>Spoiler free</span>
              </label>
            </div>
            {submitted && errors?.spoilers && (
              <p className='text-xs text-rose-500'>
                Please indicate whether your review contains spoilers.
              </p>
            )}
          </div>
        </div>
        <div className='flex flex-col gap-1.5 col-span-full'>
          <div className='flex flex-row items-center gap-2'>
            <button
              type='submit'
              className='btn btn-primary btn-sm w-fit disabled:bg-amethyst-smoke-400/25 disabled:border-amethyst-smoke-600/60 disabled:text-amethyst-smoke-700'
              disabled={!modified}
            >
              {reviewData ? 'Update Review' : 'Save Review'}
            </button>
            {status === 'loading' && (
              <div className='scale-75'>
                <LoaderComponent />
              </div>
            )}
          </div>
          {status === 'error' && error && (
            <p className='text-xs text-rose-500'>{error}</p>
          )}
          {status === 'success' && (
            <p className='text-xs text-emerald-500'>Saved successfully.</p>
          )}
        </div>
      </div>
    </form>
  )
}
