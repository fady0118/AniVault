import { ChevronRight, Star } from 'lucide-react'
import { renderReactions } from '../../utility/utils'
import { Link } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { storage, tablesDB } from '../../appwrite'
import { Query } from 'appwrite'
import { useEffect, useState } from 'react'
import AppwriteReviewCard from './AppwriteReviewCard'

export default function Reviews ({ data, mediaType, item_id }) {
  const [reviewsTab, setReviewTab] = useState(1)

  const anivaultReviewsQ = useQuery({
    queryKey: ['anivaultReviews', item_id],
    queryFn: async () => {
      if (!item_id) return { rows: [] }
      try {
        const queries = mediaType
          ? [
              Query.equal('mediaType', mediaType),
              Query.equal('item_mal_id', Number(item_id)),
              Query.select(['*', 'userItem.*', 'userProfile.*'])
            ]
          : [
              Query.equal('item_mal_id', Number(item_id)),
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

  const appwriteReviews = Array.isArray(anivaultReviewsQ?.data?.rows)
    ? anivaultReviewsQ.data.rows
    : []
  const hasAppwriteReviews = appwriteReviews.length > 0
  const hasMyAnimeListReviews = data?.featured?.length > 0

  return (
    <>
      {(hasMyAnimeListReviews || hasAppwriteReviews) && (
        <div id='reviews' className='order-3 rounded-lg w-full py-1'>
          <div class='tabs tabs-box rounded-md box-colors overflow-hidden'>
            <input
              type='radio'
              name='reviewTabs'
              class='tab text-text-light/80 checked:text-text-light dark:text-text-dark/80 dark:checked:text-text-dark checked:bg-amethyst-smoke-400/75 checked:dark:bg-dark-amethyst-smoke-200/75 border-amethyst-smoke-600 dark:border-dark-amethyst-smoke-300 duration-200'
              aria-label='MyAnimeList'
              checked={reviewsTab === 1}
              readOnly
              onClick={() => {
                setReviewTab(1)
              }}
            />

            <div class='tab-content box-colors border-amethyst-smoke-600 dark:border-dark-amethyst-smoke-300 p-2'>
              <div className='flex flex-col w-full text-2xs/normal sm:text-xs/normal gap-y-2 p-2'>
                <div className='flex flex-row flex-wrap gap-y-1 justify-between bottom-border pb-2'>
                  <div className='flex flex-row items-center gap-x-1 py-1 px-3 bg-amethyst-smoke-700/30 text-2xs'>
                    <p>Avg Score</p>
                    <p className=''>
                      {data?.stats?.avgScore?.toFixed(2) ?? '0.00'}
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
                        <p>{data?.stats?.recommended ?? 0}</p>
                        <p>recommended</p>
                      </div>
                      <div className='flex flex-row items-center capitalize gap-x-1 gray-link'>
                        <Star
                          size={12}
                          className='stroke-gray-800 dark:stroke-gray-400'
                        />
                        <p>{data?.stats?.mixedFeelings ?? 0}</p>
                        <p>mixed feelings</p>
                      </div>
                      <div className='flex flex-row items-center capitalize gap-x-1 rose-link'>
                        <Star
                          size={12}
                          className='stroke-rose-800 dark:stroke-rose-400'
                        />
                        <p>{data?.stats?.notRecommended ?? 0}</p>
                        <p>not recommended</p>
                      </div>
                    </div>
                    <div
                      style={{
                        backgroundImage: `linear-gradient(90deg, var(--color-blue-400) ${
                          (((data?.stats?.recommended ?? 0) - 1.5) * 100) /
                          (data?.stats?.all || 1)
                        }%, var(--color-gray-400) ${
                          (((data?.stats?.recommended ?? 0) + 1.5) * 100) /
                          (data?.stats?.all || 1)
                        }%, var(--color-gray-400) ${
                          (((data?.stats?.recommended ?? 0) +
                            (data?.stats?.mixedFeelings ?? 0) -
                            1.5) *
                            100) /
                          (data?.stats?.all || 1)
                        }%, var(--color-rose-400) ${
                          (((data?.stats?.recommended ?? 0) +
                            (data?.stats?.mixedFeelings ?? 0) +
                            1.5) *
                            100) /
                          (data?.stats?.all || 1)
                        }%)`
                      }}
                      className='h-1 w-full px-3'
                    ></div>
                  </div>
                  <div className='flex flex-row items-center gap-x-1 text-2xs'>
                    <ChevronRight size={12} />
                    <p>All reviews ({data?.stats?.all ?? 0})</p>
                  </div>
                </div>
                {data?.featured.map(review => (
                  <div key={review.mal_id} className='bottom-border'>
                    <div className='flex flex-col xs:flex-row'>
                      <div className='flex flex-col ml-3 xs:m-0 justify-start w-[5%] min-w-10'>
                        <div className='w-full aspect-square'>
                          <img
                            className='w-full h-full object-cover'
                            src={review.user.images.webp.image_url}
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
                          {review.tags.map((t, i) => (
                            <div
                              key={i}
                              className='flex flex-row items-center gap-x-1 px-1.5 border border-dark-amethyst-smoke-50/20 dark:border-amethyst-smoke-400/20'
                            >
                              <Star
                                size={14}
                                className={`${
                                  t === 'Recommended'
                                    ? 'stroke-blue-800 dark:stroke-blue-400'
                                    : t === 'Not Recommended'
                                    ? 'stroke-rose-800 dark:stroke-rose-400 '
                                    : 'stroke-gray-800 dark:stroke-gray-400'
                                }`}
                              />
                              <p
                                className={`${
                                  t === 'Recommended'
                                    ? 'text-blue-800 dark:text-blue-400'
                                    : t === 'Not Recommended'
                                    ? 'text-rose-800 dark:text-rose-400'
                                    : 'text-gray-800 dark:text-gray-400'
                                }`}
                              >
                                {t}
                              </p>
                            </div>
                          ))}
                        </div>
                        <div className='flex flex-col gap-y-2 w-full py-3'>
                          <div className='peer'>
                            <input
                              type='checkbox'
                              className='hidden'
                              name={`review-${review.mal_id}`}
                              id={`review-${review.mal_id}`}
                            />
                          </div>
                          <p className='w-full whitespace-pre-wrap max-lines-4 cutoff-text'>
                            {review.review}
                          </p>

                          <div className='w-[97%] flex flex-row gap-x-2 items-center justify-between'>
                            <div className='flex flex-row flex-wrap space-x-1 items-center'>
                              {renderReactions(review.reactions)}
                              <p>{review.reactions.overall}</p>
                            </div>
                            <label
                              htmlFor={`review-${review.mal_id}`}
                              className="text-xs capitalize hover:text-amethyst-smoke-800 dark:hover:text-amethyst-smoke-400 hover:cursor-pointer duration-300
                                                              before:content-['see_more'] peer-has-checked:before:content-['see_less']"
                            ></label>
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
              <div className='flex flex-col w-full text-2xs/normal sm:text-xs/normal gap-y-2 py-2 px-3'>
                {anivaultReviewsQ.isLoading ? (
                  <div className='flex min-h-36 items-center justify-center rounded-xl border border-amethyst-smoke-200/70 bg-white/70 px-6 py-8 text-center text-sm text-amethyst-smoke-700 shadow-sm dark:border-amethyst-smoke-800/70 dark:bg-dark-amethyst-smoke-950/70 dark:text-amethyst-smoke-300'>
                    <p>Loading AniVault reviews...</p>
                  </div>
                ) : hasAppwriteReviews ? (
                  appwriteReviews.map(review => (
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
          </div>
        </div>
      )}
    </>
  )
}
