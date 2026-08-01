import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { ChevronLeft, ChevronRight, Star, Target, X } from 'lucide-react'
import { dateFormatter } from '../../utility/utils'
import EmptyDataFallback from '../EmptyDataFallback'
import AppwriteReviewCard from './AppwriteReviewCard'

const ARROW_CLASSES =
  'absolute top-1/2 -translate-y-1/2 z-10 flex items-center justify-center rounded-full p-1.5 box-content bg-amethyst-smoke-950/70 text-amethyst-smoke-100 hover:bg-amethyst-smoke-950/50 dark:bg-dark-amethyst-smoke-400/80 dark:hover:bg-dark-amethyst-smoke-400/60 hover:cursor-pointer transition-colors duration-200 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-amethyst-smoke-950/70 dark:disabled:hover:bg-dark-amethyst-smoke-400/80'

const DOT_CLASSES =
  'h-2 rounded-full transition-all duration-300 hover:cursor-pointer'

function TagBadge ({ tag }) {
  const normalized = tag?.toLowerCase()
  const colorClasses =
    normalized === 'recommended'
      ? 'text-blue-800 dark:text-blue-400 border-blue-800/50 dark:border-blue-400/50'
      : normalized === 'not recommended'
      ? 'text-rose-800 dark:text-rose-400 border-rose-800/50 dark:border-rose-400/50'
      : 'text-gray-800 dark:text-gray-400 border-gray-800/50 dark:border-gray-400/50'

  return (
    <span
      className={`inline-flex w-fit items-center gap-x-1 rounded-md border px-1.5 py-0.5 text-[0.75em] font-medium capitalize ${colorClasses}`}
    >
      {tag ?? '—'}
    </span>
  )
}

function AniListReviewCard ({ review }) {
  return (
    <div className='flex w-full flex-col gap-2 rounded-xl border border-amethyst-smoke-500/10 p-4 shadow-sm '>
      {/* Header: avatar + username + date */}
      <div className='flex flex-row items-center gap-x-3'>
        {review.user?.avatarImg ? (
          <div className='h-10 w-10 shrink-0 overflow-hidden rounded-sm'>
            <img
              className='h-full w-full object-cover'
              src={review.user.avatarImg}
              alt={`${review.user.username}-picture`}
            />
          </div>
        ) : (
          <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-amethyst-smoke-400/40 text-sm font-semibold uppercase text-amethyst-smoke-900 dark:bg-dark-amethyst-smoke-400/50 dark:text-amethyst-smoke-100'>
            {review.user?.username?.[0] || '?'}
          </div>
        )}
        <div className='flex min-w-0 flex-1 flex-col gap-0.5'>
          <p className='truncate text-sm font-semibold text-blue-700 dark:text-blue-400'>
            {review.user?.username || 'Unknown user'}
          </p>
          <p className='text-xs font-light text-amethyst-smoke-900 dark:text-amethyst-smoke-400'>
            {dateFormatter(review.date)}
          </p>
        </div>
        <div className='flex shrink-0 flex-col items-end gap-1'>
          <TagBadge tag={review.tags} />
          <div className='inline-flex items-center gap-1 px-1 py-px rounded-md border border-amethyst-smoke-800/70'>
            <Target className='w-3.5 h-3.5 text-amethyst-smoke-900 dark:text-amethyst-smoke-500' />
            <span className='text-xs font-semibold text-amethyst-smoke-900 dark:text-amethyst-smoke-500'>
              Score: {review.score}
            </span>
          </div>
        </div>
      </div>

      {/* Summary: centered title */}
      {review.summary && (
        <p
          className='text-center text-base font-semibold leading-snug text-amethyst-smoke-950 dark:text-amethyst-smoke-100'
          dangerouslySetInnerHTML={{ __html: review.summary }}
        />
      )}

      {/* Full review body: fixed height + scroll */}
      <div className='h-[50vh] p-5 overflow-y-auto rounded-lg border border-amethyst-smoke-500/10 bg-amethyst-smoke-300/20 dark:bg-amethyst-smoke-950/20'>
        <p
          className='whitespace-pre-wrap text-[0.95em] leading-6 text-amethyst-smoke-900 dark:text-amethyst-smoke-300'
          dangerouslySetInnerHTML={{ __html: review.review }}
        />
      </div>
    </div>
  )
}

function ReviewsSlider ({
  reviews,
  activeIndex,
  onPrev,
  onNext,
  onSelect,
  renderCard,
  emptyString
}) {
  const total = reviews.length
  const hasReviews = total > 0
  const current = hasReviews ? activeIndex : 0

  return (
    <div className='relative flex w-full flex-col gap-3'>
      {hasReviews ? (
        <>
          <div className='relative flex w-full items-stretch gap-2 sm:gap-4'>
            <button
              type='button'
              onClick={onPrev}
              disabled={total <= 1}
              className={ARROW_CLASSES}
              style={{ left: '-0.75rem' }}
              aria-label='Previous review'
            >
              <ChevronLeft size={28} />
            </button>

            <div className='min-h-56 flex-1 w-full'>
              <div key={current} className='gallery-image-animation'>
                {renderCard(reviews[current])}
              </div>
            </div>

            <button
              type='button'
              onClick={onNext}
              disabled={total <= 1}
              className={ARROW_CLASSES}
              style={{ right: '-0.75rem' }}
              aria-label='Next review'
            >
              <ChevronRight size={28} />
            </button>
          </div>

          <div className='flex items-center justify-center gap-4'>
            {/* Dots */}
            <div className='flex flex-wrap items-center justify-center gap-1.5'>
              {reviews.map((review, i) => (
                <span
                  key={review?.$id || review?.id || i}
                  onClick={() => onSelect(i)}
                  className={`${DOT_CLASSES} ${
                    i === current
                      ? 'w-5 bg-blue-500/80 dark:bg-blue-400/80'
                      : 'w-2 bg-amethyst-smoke-500/50 hover:bg-amethyst-smoke-500/80 dark:bg-amethyst-smoke-400/50 dark:hover:bg-amethyst-smoke-400/80'
                  }`}
                  style={{ opacity: i === current ? 1 : 0.7 }}
                />
              ))}
            </div>

            {/* Counter */}
            <p className='text-xs font-medium text-amethyst-smoke-900 dark:text-amethyst-smoke-400'>
              {current + 1} / {total}
            </p>
          </div>
        </>
      ) : (
        <EmptyDataFallback string={emptyString} />
      )}
    </div>
  )
}

export default function AllReviewsModal ({
  sanitizedReviewsData,
  setShowAllReviewsModal
}) {
  const targetContainer = document.getElementById('outlet-container')

  const modal = (
    <div className='fixed inset-0 z-50 flex items-center justify-center px-4 py-6'>
      <div className='absolute inset-0 bg-dark-amethyst-smoke-50/90' />

      <div className='relative z-10 flex max-h-full w-full max-w-5xl flex-col overflow-hidden rounded-xl border border-amethyst-smoke-800/40 box-colors shadow-2xl'>
        {/* Header */}
        <div className='flex flex-col gap-4 border-b border-amethyst-smoke-800/20 px-5 py-3 sm:flex-row sm:items-start sm:justify-between sm:gap-6'>
          <div className='space-y-1'>
            <p className='text-[0.95em] uppercase tracking-[0.2em] text-amethyst-smoke-950 dark:text-amethyst-smoke-500'>
              Community reviews
            </p>
          </div>

          <button
            type='button'
            onClick={() => setShowAllReviewsModal(false)}
            className='absolute top-0 right-0 m-1.5 h-8.5 w-8.5 flex items-center justify-center rounded-full border border-amethyst-smoke-700/30 dark:border-amethyst-smoke-400/30 text-amethyst-smoke-800 dark:text-amethyst-smoke-200 box-colors hover:cursor-pointer hover:bg-amethyst-smoke-700/40 dark:hover:bg-amethyst-smoke-800/65 duration-200'
            aria-label='Close all reviews modal'
          >
            <X size={16} />
          </button>
        </div>

        <div className='min-h-0 flex-1 overflow-y-auto p-1 sm:p-2'>
          <AllReviews
            data={sanitizedReviewsData}
            setShowAllReviewsModal={setShowAllReviewsModal}
          />
        </div>
      </div>
    </div>
  )

  return targetContainer ? createPortal(modal, targetContainer) : modal
}

function AllReviews ({ data, setShowAllReviewsModal }) {
  const [activeReviewTab, setActiveReviewTab] = useState(1)
  const [aniListIndex, setAniListIndex] = useState(0)
  const [anivaultIndex, setAnivaultIndex] = useState(0)

  // Full AniList dataset = featured + rest
  const aniListReviews = useMemo(() => {
    const featured = data?.aniList?.featured ?? []
    const rest = data?.aniList?.rest ?? []
    return [...featured, ...rest]
  }, [data?.aniList?.featured, data?.aniList?.rest])

  const anivaultReviews = data?.anivault ?? []

  // Derive safe (clamped) indexes at render time instead of syncing in effects
  const safeAniListIndex =
    aniListReviews.length > 0
      ? Math.min(aniListIndex, aniListReviews.length - 1)
      : 0
  const safeAnivaultIndex =
    anivaultReviews.length > 0
      ? Math.min(anivaultIndex, anivaultReviews.length - 1)
      : 0

  // Reset indexes when switching tabs so each starts at the first review
  const handleTabChange = tab => {
    setActiveReviewTab(tab)
  }

  // Keyboard navigation: left/right cycles the active tab, Escape closes
  useEffect(() => {
    const handleKeyDown = e => {
      if (e.key === 'Escape') {
        setShowAllReviewsModal(false)
        return
      }

      if (activeReviewTab === 1) {
        if (e.key === 'ArrowLeft') {
          e.preventDefault()
          setAniListIndex(prev =>
            aniListReviews.length
              ? (prev - 1 + aniListReviews.length) % aniListReviews.length
              : 0
          )
        } else if (e.key === 'ArrowRight') {
          e.preventDefault()
          setAniListIndex(prev =>
            aniListReviews.length ? (prev + 1) % aniListReviews.length : 0
          )
        }
      } else if (activeReviewTab === 2) {
        if (e.key === 'ArrowLeft') {
          e.preventDefault()
          setAnivaultIndex(prev =>
            anivaultReviews.length
              ? (prev - 1 + anivaultReviews.length) % anivaultReviews.length
              : 0
          )
        } else if (e.key === 'ArrowRight') {
          e.preventDefault()
          setAnivaultIndex(prev =>
            anivaultReviews.length ? (prev + 1) % anivaultReviews.length : 0
          )
        }
      }
    }

    document.documentElement.addEventListener('keydown', handleKeyDown)
    return () =>
      document.documentElement.removeEventListener('keydown', handleKeyDown)
  }, [
    activeReviewTab,
    aniListReviews.length,
    anivaultReviews.length,
    setShowAllReviewsModal
  ])

  const goAniListPrev = () =>
    setAniListIndex(prev =>
      aniListReviews.length
        ? (prev - 1 + aniListReviews.length) % aniListReviews.length
        : 0
    )
  const goAniListNext = () =>
    setAniListIndex(prev =>
      aniListReviews.length ? (prev + 1) % aniListReviews.length : 0
    )

  const goAnivaultPrev = () =>
    setAnivaultIndex(prev =>
      anivaultReviews.length
        ? (prev - 1 + anivaultReviews.length) % anivaultReviews.length
        : 0
    )
  const goAnivaultNext = () =>
    setAnivaultIndex(prev =>
      anivaultReviews.length ? (prev + 1) % anivaultReviews.length : 0
    )

  return (
    <div className='w-full'>
      <div className='tabs tabs-box w-full rounded-md box-colors overflow-hidden'>
        <input
          type='radio'
          name='review_tabs'
          className='tab text-text-light/80 checked:text-text-light dark:text-text-dark/80 dark:checked:text-text-dark checked:bg-amethyst-smoke-400/75 checked:dark:bg-dark-amethyst-smoke-200/75 border-amethyst-smoke-600 dark:border-dark-amethyst-smoke-300 duration-200'
          aria-label='AniList Reviews'
          checked={activeReviewTab === 1}
          readOnly
          onClick={() => handleTabChange(1)}
        />
        <div className='tab-content box-colors border-amethyst-smoke-600 dark:border-dark-amethyst-smoke-300 p-2 sm:p-4'>
          <ReviewsSlider
            reviews={aniListReviews}
            activeIndex={safeAniListIndex}
            onPrev={goAniListPrev}
            onNext={goAniListNext}
            onSelect={setAniListIndex}
            renderCard={review => <AniListReviewCard review={review} />}
            emptyString='No AniList reviews available.'
          />
        </div>

        <input
          type='radio'
          name='review_tabs'
          className='tab text-text-light/80 checked:text-text-light dark:text-text-dark/80 dark:checked:text-text-dark checked:bg-amethyst-smoke-400/75 checked:dark:bg-dark-amethyst-smoke-200/75 border-amethyst-smoke-600 dark:border-dark-amethyst-smoke-300 duration-200'
          aria-label='AniVault Reviews'
          checked={activeReviewTab === 2}
          readOnly
          onClick={() => handleTabChange(2)}
        />
        <div className='tab-content box-colors border-amethyst-smoke-600 dark:border-dark-amethyst-smoke-300 p-2 sm:p-4'>
          <ReviewsSlider
            reviews={anivaultReviews}
            activeIndex={safeAnivaultIndex}
            onPrev={goAnivaultPrev}
            onNext={goAnivaultNext}
            onSelect={setAnivaultIndex}
            renderCard={review => <AppwriteReviewCard review={review} />}
            emptyString='No AniVault reviews yet. Be the first to review this item.'
          />
        </div>
      </div>
    </div>
  )
}
