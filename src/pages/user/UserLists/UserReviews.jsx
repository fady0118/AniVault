import { Star } from 'lucide-react'
import { useContext, useEffect, useState } from 'react'
import { RootContext } from '../../../App'
import UserReviewDeleteModal from '../../../components/userItemModal/UserReviewDeleteModal'
import UserReviewEditModal from '../../../components/userItemModal/UserReviewEditModal'
import { marked } from 'marked'

function formatDate (iso) {
  return new Date(iso).toLocaleDateString()
}
const classes = {
  tag_classes: {
    recommended:
      'px-2 py-0.5 rounded border border-blue-500/35 bg-blue-400/50 dark:bg-blue-400/50',
    mixed_feelings:
      'px-2 py-0.5 rounded border border-amethyst-smoke-500/35 bg-amethyst-smoke-500/50 dark:bg-amethyst-smoke-400/50',
    not_recommended:
      'px-2 py-0.5 rounded border border-rose-500/35 bg-rose-400/50 dark:bg-rose-400/50'
  },
  status_classes: {
    watching: 'capitalize text-emerald-800 dark:text-emerald-400',
    completed: 'capitalize text-blue-800 dark:text-blue-400',
    dropped: 'capitalize text-amethyst-smoke-900 dark:text-amethyst-smoke-400'
  }
}

export default function UserReviews ({ data, refetchReviews }) {
  const [showReviewEditModal, setShowReviewEditModal] = useState(false)
  const [showReviewDeleteModal, setShowReviewDeleteModal] = useState(false)
  const [selectedReview, setSelectedReview] = useState(null)

  function openReviewDeleteModal () {
    setShowReviewDeleteModal(true)
  }
  function closeReviewDeleteModal () {
    setShowReviewDeleteModal(false)
  }
  function openReviewEditModal () {
    setShowReviewEditModal(true)
  }
  function closeReviewEditModal () {
    setShowReviewEditModal(false)
  }

  if (!data?.rows?.length) {
    return (
      <div className='flex min-h-36 items-center justify-center rounded-xl border border-amethyst-smoke-200/70 bg-white/70 px-6 py-8 text-center text-sm text-amethyst-smoke-700 shadow-sm dark:border-amethyst-smoke-800/70 dark:bg-dark-amethyst-smoke-950/70 dark:text-amethyst-smoke-300'>
        <div>
          <p className='font-medium'>No reviews yet</p>
          <p className='mt-1 text-xs opacity-80'>
            Your review history will appear here.
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className='flex w-full flex-col gap-3'>
        {data?.rows?.map(r => (
          <ReviewCard
            key={r?.$id}
            review={r}
            setSelectedReview={setSelectedReview}
            openReviewDeleteModal={openReviewDeleteModal}
            openReviewEditModal={openReviewEditModal}
          />
        ))}
      </div>
      {showReviewEditModal && (
        <UserReviewEditModal
          review={selectedReview}
          closeReviewEditModal={closeReviewEditModal}
          refetchReviews={refetchReviews}
        />
      )}
      {showReviewDeleteModal && (
        <UserReviewDeleteModal
          review={selectedReview}
          closeReviewDeleteModal={closeReviewDeleteModal}
          refetchReviews={refetchReviews}
        />
      )}
    </>
  )
}

function ReviewCard ({
  review,
  setSelectedReview,
  openReviewDeleteModal,
  openReviewEditModal
}) {
  const { windowWidth } = useContext(RootContext)
  if (!review) return
  const item = review.userItem || {}
  const tags =
    typeof review?.tags === 'string' ? review?.tags.split(',') : review?.tags || []

  function handleEdit (review) {
    setSelectedReview(review)
    openReviewEditModal()
  }

  function handleDelete (review) {
    setSelectedReview(review)
    openReviewDeleteModal()
  }

    // parse markdown bio
    useEffect(() => {
      if (!review) return;
      if (review?.review_body) {
        document.getElementById(`reviewBodyText-${review?.$id}`).innerHTML = marked.parse(review?.review_body);
      }
    }, [review]);

  return (
    <div className='w-full rounded-xl border border-amethyst-smoke-400/25 dark:border-amethyst-smoke-800/25 box-colors-lighter p-4 transition duration-200 hover:-translate-y-0.5 hover:shadow-md  dark:bg-dark-amethyst-smoke-950/80'>
      <div className='flex flex-row gap-4'>
        {item?.cached_img && (
          <img
            src={item?.cached_img}
            alt={item?.title}
            className='h-28 w-20 shrink-0 rounded-lg object-cover ring-1 ring-black/5 sm:h-32 sm:w-24'
          />
        )}

        <div className='min-w-0 flex-1'>
          <div className='flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3'>
            <div className='flex flex-col gap-1.5'>
              <div className='flex flex-wrap items-center gap-x-2'>
                <h3 className='text-base font-semibold text-dark-amethyst-smoke-900 dark:text-amethyst-smoke-100'>
                  {item?.title}
                </h3>
                {tags?.length > 0 && (
                  <div className='flex flex-wrap gap-2 text-[0.7em]'>
                    {tags.map((t, i) => (
                      <span
                        key={i}
                        className={
                          classes.tag_classes[t?.toLowerCase()] ||
                          'rounded-sm border border-amethyst-smoke-500/25 bg-amethyst-smoke-500/20 px-1.5 py-0.5'
                        }
                      >
                        {t.trim().replace(/_/g, ' ')}
                      </span>
                    ))}
                    {review?.Spoiler_Warning && (
                      <span className='rounded border border-pink-500/35 bg-pink-400/50 px-2 py-0.5 dark:bg-pink-400/50'>
                        Spoiler warning
                      </span>
                    )}
                  </div>
                )}
              </div>
              <div className='flex flex-wrap text-xs items-center gap-2 text-amethyst-smoke-700 dark:text-amethyst-smoke-300/80'>
                {item?.status && (
                  <span
                    className={
                      classes.status_classes[item?.status] ||
                      'text-amethyst-smoke-900 dark:text-amethyst-smoke-400'
                    }
                  >
                    {item?.status}
                  </span>
                )}
                <span className='opacity-60'>•</span>
                <span>
                  {item?.progress
                    ? `Episode ${item?.progress}`
                    : 'Progress not set'}
                </span>
                <span className='opacity-60'>•</span>
                <span className='flex items-center gap-1'>
                  <Star size={12} /> {review?.overall_rating}/10
                </span>
                <span className='opacity-60'>•</span>
                <span>{formatDate(review?.$createdAt)}</span>
              </div>
            </div>

            <div className='flex items-center gap-2 self-start'>
              <button
                onClick={() => handleEdit(review)}
                className='rounded-full border border-blue-500/25 px-2.5 py-1 text-xs font-medium text-blue-600 cursor-pointer duration-200 hover:bg-blue-500/10 dark:text-blue-400'
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(review)}
                className='rounded-full border border-rose-500/25 px-2.5 py-1 text-xs font-medium text-rose-600 cursor-pointer duration-200 hover:bg-rose-500/10 dark:text-rose-400'
              >
                Delete
              </button>
            </div>
          </div>
          {windowWidth >= 640 && (
            <p id={`reviewBodyText-${review?.$id}`} className='mt-3 grow whitespace-pre-wrap rounded-lg px-3 py-2.5 text-sm leading-6 bg-amethyst-smoke-500/15 text-dark-amethyst-smoke-600 dark:bg-amethyst-smoke-950/15 dark:text-amethyst-smoke-300'>
              {review?.review_body || 'No review content provided.'}
            </p>
          )}
        </div>
      </div>
      {windowWidth < 640 && (
        <p id={`reviewBodyText-${review?.$id}`} className='mt-3 grow whitespace-pre-wrap rounded-lg px-3 py-2.5 text-sm leading-6 bg-amethyst-smoke-500/15 text-dark-amethyst-smoke-600 dark:bg-amethyst-smoke-950/15 dark:text-amethyst-smoke-300'>
          {review?.review_body || 'No review content provided.'}
        </p>
      )}
    </div>
  )
}
