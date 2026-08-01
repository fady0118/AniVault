import { ChevronRight, Star } from 'lucide-react'
import {
  adaptText,
  dateFormatter,
  domPurifyParseMarkDown,
  renderReactions
} from '../../utility/utils'
import { Link } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { storage, tablesDB } from '../../appwrite'
import { Query } from 'appwrite'
import { useEffect, useMemo, useState } from 'react'
import AppwriteReviewCard from './AppwriteReviewCard'
import AllReviewsModal from './AllReviewsModal'

export default function Reviews ({ data, item_id, mediaType }) {
  const [reviewsTab, setReviewTab] = useState(1)
  const [showAllReviewsModal, setShowAllReviewsModal] = useState(false)

  const anivaultReviewsQ = useQuery({
    queryKey: ['anivaultReviews', item_id],
    queryFn: async () => {
      if (!item_id) return { rows: [] }
      try {
        const queries = mediaType
          ? [
              Query.equal('mediaType', mediaType),
              Query.equal('item_aniList_id', Number(item_id)),
              Query.select(['*', 'userItem.*', 'userProfile.*'])
            ]
          : [
              Query.equal('item_aniList_id', Number(item_id)),
              Query.select(['*', 'userItem.*', 'userProfile.*'])
            ]
        const res = await tablesDB.listRows({
          databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
          tableId: import.meta.env.VITE_TABLE_ID_REVIEWS,
          queries
        })
        return res || { rows: [] }
      } catch (error) {
        console.error('failed to fetch item reviews', error)
        return { rows: [] }
      }
    },
    enabled: Boolean(item_id)
  })

  const sanitizedAppwriteReviews = Array.isArray(anivaultReviewsQ?.data?.rows)
    ? anivaultReviewsQ.data.rows?.map(review => ({
        ...review,
        review_body: domPurifyParseMarkDown(review.review_body)
      }))
    : []

  const hasAppwriteReviews = sanitizedAppwriteReviews.length > 0
  const hasAniListReviews = data?.featured?.length > 0

  const sanitizedAniListReviewsData = useMemo(() => {
    return hasAniListReviews
      ? {
          featured: data.featured?.length
            ? data.featured.map(rev => ({
                ...rev,
                review: domPurifyParseMarkDown(rev.review),
                summary: domPurifyParseMarkDown(rev.summary)
              }))
            : [],
          rest: data.rest?.length
            ? data.rest.map(rev => ({
                ...rev,
                review: domPurifyParseMarkDown(rev.review),
                summary: domPurifyParseMarkDown(rev.summary)
              }))
            : [],
          stats: data.stats
        }
      : null
  }, [data, hasAniListReviews])

  return (
    <>
      {(hasAniListReviews || hasAppwriteReviews) && (
        <div
          id='reviews'
          className='order-3 rounded-lg w-full py-1 text-2xs/normal sm:text-xs/normal'
        >
          <div class='relative tabs tabs-box rounded-md box-colors overflow-hidden'>
            <input
              type='radio'
              name='reviewTabs'
              class='tab text-text-light/80 checked:text-text-light dark:text-text-dark/80 dark:checked:text-text-dark checked:bg-amethyst-smoke-400/75 checked:dark:bg-dark-amethyst-smoke-200/75 border-amethyst-smoke-600 dark:border-dark-amethyst-smoke-300 duration-200'
              aria-label='AniList'
              checked={reviewsTab === 1}
              readOnly
              onClick={() => {
                setReviewTab(1)
              }}
            />

            <div class='tab-content box-colors border-amethyst-smoke-600 dark:border-dark-amethyst-smoke-300 p-2'>
              <div className='flex flex-col w-full gap-y-2 p-2'>
                <div className='flex flex-row flex-wrap gap-y-1 justify-between bottom-border pb-2'>
                  <div className='flex flex-row items-center gap-x-1 py-1 px-3 bg-amethyst-smoke-700/30 text-2xs'>
                    <p>Avg Score</p>
                    <p className=''>
                      {data?.stats.avgScore?.toFixed(2) ?? '0.00'}
                    </p>
                    <Star size={14} color='yellow' />
                  </div>
                  <div className='flex flex-col py-1 px-2 bg-amethyst-smoke-700/30'>
                    <div className='flex flex-row flex-wrap items-center gap-x-3 rounded-sm text-2xs'>
                      <div className='flex flex-row items-center capitalize gap-x-1 blue-link'>
                        <Star
                          size={12}
                          className='stroke-blue-800 dark:stroke-blue-400'
                        />
                        <p>{data?.stats.recommended ?? 0}</p>
                        <p>recommended</p>
                      </div>
                      <div className='flex flex-row items-center capitalize gap-x-1 gray-link'>
                        <Star
                          size={12}
                          className='stroke-gray-800 dark:stroke-gray-400'
                        />
                        <p>{data?.stats.mixedFeelings ?? 0}</p>
                        <p>mixed feelings</p>
                      </div>
                      <div className='flex flex-row items-center capitalize gap-x-1 rose-link'>
                        <Star
                          size={12}
                          className='stroke-rose-800 dark:stroke-rose-400'
                        />
                        <p>{data?.stats.notRecommended ?? 0}</p>
                        <p>not recommended</p>
                      </div>
                    </div>
                    <div
                      style={{
                        backgroundImage: `linear-gradient(90deg, var(--color-blue-400) ${
                          (((data?.stats.recommended ?? 0) - 1.5) * 100) /
                          (data?.stats.all || 1)
                        }%, var(--color-gray-400) ${
                          (((data?.stats.recommended ?? 0) + 1.5) * 100) /
                          (data?.stats.all || 1)
                        }%, var(--color-gray-400) ${
                          (((data?.stats.recommended ?? 0) +
                            (data?.stats.mixedFeelings ?? 0) -
                            1.5) *
                            100) /
                          (data?.stats.all || 1)
                        }%, var(--color-rose-400) ${
                          (((data?.stats.recommended ?? 0) +
                            (data?.stats.mixedFeelings ?? 0) +
                            1.5) *
                            100) /
                          (data?.stats.all || 1)
                        }%)`
                      }}
                      className='h-1 w-full px-3'
                    ></div>
                  </div>
                  <div></div>
                </div>
                {sanitizedAniListReviewsData?.featured.map(review => (
                  <div key={review.id} className='bottom-border'>
                    <div className='flex flex-col xs:flex-row'>
                      <div className='flex flex-col ml-3 xs:m-0 justify-start w-[5%] min-w-10'>
                        <div className='w-full aspect-square'>
                          <img
                            className='w-full h-full object-cover'
                            src={review.user.avatarImg}
                            alt={`${review.user.username}-picture`}
                          />
                        </div>
                      </div>
                      <div className='flex flex-col w-[95%] px-3'>
                        <div className='flex flex-row justify-between items-center'>
                          <div className='blue-link font-semibold'>
                            {review.user.username}
                          </div>
                          <p className='text-2xs/snug font-light'>
                            {dateFormatter(review.date)}
                          </p>
                        </div>
                        <div className='flex flex-row justify-between items-start gap-x-2.5'>
                          <div className='flex flex-row items-center gap-x-1 px-1.5 border border-dark-amethyst-smoke-50/20 dark:border-amethyst-smoke-400/20'>
                            <Star
                              size={14}
                              className={`${
                                review.tags?.toLowerCase() === 'recommended'
                                  ? 'stroke-blue-800 dark:stroke-blue-400'
                                  : review.tags?.toLowerCase() ===
                                    'not recommended'
                                  ? 'stroke-rose-800 dark:stroke-rose-400'
                                  : 'stroke-gray-800 dark:stroke-gray-400'
                              }`}
                            />
                            <p
                              className={`${
                                review.tags?.toLowerCase() === 'recommended'
                                  ? 'text-blue-800 dark:text-blue-400'
                                  : review.tags?.toLowerCase() ===
                                    'not recommended'
                                  ? 'text-rose-800 dark:text-rose-400'
                                  : 'text-gray-800 dark:text-gray-400'
                              }`}
                            >
                              {review.tags}
                            </p>
                          </div>
                        </div>
                        <div className='flex flex-col gap-y-2 w-full py-3'>
                          <div className='mb-4 rounded-xl box-colors shadow-sm border subtle-border-colors transition-all duration-300'>
                            <input
                              type='checkbox'
                              id={`accordion-${review.id}`}
                              className='peer/accordion hidden'
                            />

                            <label
                              htmlFor={`accordion-${review.id}`}
                              className='block w-full cursor-pointer outline-none peer-checked/accordion:[&_svg]:rotate-180'
                            >
                              <div className='flex items-center justify-between rounded-lg p-4 transition-colors hover:bg-amethyst-smoke-300/40 dark:hover:bg-dark-amethyst-smoke-300/75 duration-200'>
                                <p
                                  id={`reviewSummary-${review.id}`}
                                  className='text-[1.5em] font-semibold leading-snug'
                                  dangerouslySetInnerHTML={{
                                    __html: review.summary
                                  }}
                                />

                                <svg
                                  className='ml-4 h-5 w-5 shrink-0 text-amethyst-smoke-950/50 dark:text-amethyst-smoke-500/50 transition-transform duration-300'
                                  fill='none'
                                  viewBox='0 0 24 24'
                                  stroke='currentColor'
                                >
                                  <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={2}
                                    d='M19 9l-7 7-7-7'
                                  />
                                </svg>
                              </div>
                            </label>

                            <div className='grid grid-rows-[0fr] opacity-0 transition-all duration-500 ease-in-out peer-checked/accordion:grid-rows-[1fr] peer-checked/accordion:opacity-100'>
                              <div className='overflow-hidden'>
                                <div className='py-3 px-3 flex flex-col items-end gap-0.5'>
                                  <input
                                    type='checkbox'
                                    className='peer/text hidden'
                                    name={`review-${review.id}`}
                                    id={`review-${review.id}`}
                                  />

                                  <div
                                    id={`reviewBody-${review.id}`}
                                    dangerouslySetInnerHTML={{
                                      __html: review.review
                                    }}
                                    className='w-full text-[1.15em] whitespace-pre-wrap transition-all duration-300 line-clamp-10 peer-checked/text:line-clamp-none'
                                  />

                                  <label
                                    htmlFor={`review-${review.id}`}
                                    className="w-fit cursor-pointer rounded-xl border subtle-border-colors px-2.5 py-1 text-[1.1em] font-medium transition-all ease-out duration-200 hover:scale-105 hover:bg-amethyst-smoke-300/40 dark:hover:bg-dark-amethyst-smoke-300/75 before:content-['See_more'] peer-checked/text:before:content-['See_less']"
                                  ></label>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <input
              type='radio'
              name='reviewTabs'
              class='tab text-text-light/80 checked:text-text-light dark:text-text-dark/80 dark:checked:text-text-dark checked:bg-amethyst-smoke-400/75 checked:dark:bg-dark-amethyst-smoke-200/75 border-amethyst-smoke-600 dark:border-dark-amethyst-smoke-300 duration-200'
              aria-label='AniVault'
              checked={reviewsTab === 2}
              readOnly
              onClick={() => {
                setReviewTab(2)
              }}
            />

            <div class='tab-content box-colors border-amethyst-smoke-600 dark:border-dark-amethyst-smoke-300 p-2'>
              <div className='flex flex-col w-full gap-y-2 py-2 px-3'>
                {anivaultReviewsQ.isLoading ? (
                  <div className='flex min-h-36 items-center justify-center rounded-xl border border-amethyst-smoke-200/70 bg-white/70 px-6 py-8 text-center text-sm text-amethyst-smoke-700 shadow-sm dark:border-amethyst-smoke-800/70 dark:bg-dark-amethyst-smoke-950/70 dark:text-amethyst-smoke-300'>
                    <p>Loading AniVault reviews...</p>
                  </div>
                ) : hasAppwriteReviews ? (
                  sanitizedAppwriteReviews.map(review => (
                    <AppwriteReviewCard key={review?.$id} review={review} />
                  ))
                ) : (
                  <div className='flex min-h-36 items-center justify-center rounded-xl border border-amethyst-smoke-200/70 bg-white/70 px-6 py-8 text-center text-sm text-amethyst-smoke-700 shadow-sm dark:border-amethyst-smoke-800/70 dark:bg-dark-amethyst-smoke-950/70 dark:text-amethyst-smoke-300'>
                    <div>
                      <p className='font-medium'>No AniVault reviews yet</p>
                      <p className='mt-1 text-xs opacity-80'>
                        Be the first to leave a review for this item.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <button
  type="button"
  className="absolute top-2 right-2 flex items-center gap-1.5 px-3 py-1.5  text-[1em] font-medium border border-dark-amethyst-smoke-50/30 dark:border-amethyst-smoke-50/10 rounded-lg shadow-sm cursor-pointer transition-all duration-200 box-colors hover:bg-amethyst-smoke-300/70 dark:hover:bg-dark-amethyst-smoke-300/95 hover:shadow-md active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
  onClick={() => setShowAllReviewsModal(true)}
>
  All reviews (
  {(sanitizedAniListReviewsData?.stats.all || 0) +
    (sanitizedAppwriteReviews?.length || 0)}
  )
</button>


          </div>
        </div>
      )}
      {showAllReviewsModal && (
        <AllReviewsModal
          sanitizedReviewsData={{
            aniList: sanitizedAniListReviewsData,
            anivault: sanitizedAppwriteReviews
          }}
          setShowAllReviewsModal={setShowAllReviewsModal}
        />
      )}
    </>
  )
}
