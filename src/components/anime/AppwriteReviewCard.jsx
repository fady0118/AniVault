import { Star } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { storage } from '../../appwrite'
import { dateFormatter } from '../../utility/utils'
import { marked } from 'marked'

function formatTag (tag) {
  return tag?.replace(/_/g, ' ') || ''
}

function getReviewUsername (review) {
  return review?.userProfile?.username || review?.user_id_str || 'Unknown'
}

const classes = {
  recommended:
    'py-px px-0.5 rounded border border-blue-500/35 bg-blue-400/50 dark:bg-blue-400/50',
  mixed_feelings:
    'py-px px-0.5 rounded border border-amethyst-smoke-500/35 bg-amethyst-smoke-500/50 dark:bg-amethyst-smoke-400/50',
  not_recommended:
    'py-px px-0.5 rounded border border-rose-500/35 bg-rose-400/50 dark:bg-rose-400/50',
  status_classes: {
    watching: 'capitalize text-emerald-800 dark:text-emerald-400',
    completed: 'capitalize text-blue-800 dark:text-blue-400',
    dropped: 'capitalize text-amethyst-smoke-900 dark:text-amethyst-smoke-400'
  }
}

export default function AppwriteReviewCard ({ review }) {
  const tags = review?.tags ? [review?.tags] : []
  const date = review?.$updatedAt || review?.$createdAt

  const [reviewerAvatar, setReviewerAvatar] = useState(null)

  async function fetchReviewerAvatar () {
    const userAvatarImg = await storage.getFileView({
      bucketId: import.meta.env.VITE_APPWRITE_BUCKET_ID,
      fileId: review?.userProfile?.avatarId
    })
    return setReviewerAvatar(userAvatarImg || null)
  }
  useEffect(() => {
    if (!review) return
    fetchReviewerAvatar()
    if (review?.review_body) {
      document.getElementById(`reviewBodyText-${review?.$id}`).innerHTML =
        marked.parse(review?.review_body)
    }
  }, [review])

  return (
    <div className='bottom-border pb-2'>
      <div className='flex flex-row'>
        <div className='flex flex-col justify-start w-[5%] min-w-10'>
          {review?.userItem?.cached_img ? (
            <Link
              to={`/userProfile/${review?.userProfile?.$id}`}
              className='w-full aspect-square rounded-sm overflow-hidden'
            >
              <img
                className='w-full h-full object-cover'
                src={reviewerAvatar || review?.userItem?.cached_img}
                alt={review?.userItem?.userProfile?.username || ''}
              />
            </Link>
          ) : null}
        </div>
        <div className='flex flex-col w-[95%] px-3 gap-1.5'>
          <div className='flex flex-row justify-between items-center'>
            <div className='flex flex-row flex-wrap gap-x-2 items-center'>
              <Link
                to={`/userProfile/${review?.userProfile?.$id}`}
                className='blue-link font-semibold text-[1.15em]'
              >
                {getReviewUsername(review)}
              </Link>
            </div>
            <p className='text-2xs/snug font-light'>{dateFormatter(date)}</p>
          </div>

          <div className='flex flex-row flex-wrap items-center gap-2'>
            {tags.map((tag, index) => (
              <span
                key={index}
                className={`text-[0.75em] 
                  ${
                    classes[tag?.toLowerCase()] ||
                    'rounded-sm border border-amethyst-smoke-500/25 bg-amethyst-smoke-500/20 py-px px-0.5'
                  }
                `}
              >
                {formatTag(tag)}
              </span>
            ))}
            {review?.Spoiler_Warning && (
              <span className='text-[0.75em] rounded border border-pink-500/35 bg-pink-400/50 py-px px-0.5 dark:bg-pink-400/50'>
                Spoiler warning
              </span>
            )}
            <div className='flex flex-row flex-wrap items-center justify-between gap-2 text-2xs text-amethyst-smoke-700 dark:text-amethyst-smoke-300/80'>
              <div className='flex flex-row flex-wrap items-center gap-x-2'>
                {review?.userItem?.status && (
                  <span
                    className={
                      classes.status_classes[review?.userItem?.status] ||
                      'text-amethyst-smoke-900 dark:text-amethyst-smoke-400'
                    }
                  >
                    {review?.userItem?.status}
                  </span>
                )}
                <span className='flex items-center gap-x-1'>
                  <Star size={12} /> {review?.overall_rating}/10
                </span>
                <span className='opacity-60'>•</span>
                {review?.mediaType === 'anime' ? (
                  <span>
                    {review?.anime_progress
                      ? `Episode ${review.anime_progress}`
                      : 'Progress not set'}
                  </span>
                ) : review?.mediaType === 'manga' ? (
                  <span>
                    {review?.manga_vols || review?.manga_chaps
                      ? `${review?.manga_vols || 0} vols - ${
                          review?.manga_chaps || 0
                        } chaps`
                      : 'Progress not set'}
                  </span>
                ) : (
                  <span>Media not specified</span>
                )}
              </div>
            </div>
          </div>

          <p
            id={`reviewBodyText-${review?.$id}`}
            className='whitespace-pre-wrap rounded-lg px-3 py-2.5 text-[1.25em] leading-6 bg-amethyst-smoke-300/20 text-dark-amethyst-smoke-600 dark:bg-amethyst-smoke-950/20 dark:text-amethyst-smoke-300'
          >
            {review?.review_body || 'No review content provided.'}
          </p>
        </div>
      </div>
    </div>
  )
}
