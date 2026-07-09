import { useEffect } from 'react'
import UserItemReviewModal from './UserItemReviewModal'

export default function UserReviewEditModal ({
  review,
  closeReviewEditModal,
  refetchReviews
}) {
  // close modal by pressing esc
  useEffect(() => {
    const handleKeyDown = e => {
      if (e.key === 'Escape') {
        closeReviewEditModal()
      }
    }
    document.documentElement.addEventListener('keydown', handleKeyDown)
    return () =>
      document.documentElement.removeEventListener('keydown', handleKeyDown)
  }, [])
  return (
    <div className='fixed inset-0 z-50 bg-dark-amethyst-smoke-50/40 backdrop-blur-lg flex items-center justify-center p-4 text-md'>
      <div className='fixed top-1/2 left-1/2 -translate-1/2 h-fit w-fit min-w-3xl rounded-xl p-3 xs:p-4 box-colors'>
        <button
          onClick={closeReviewEditModal}
          className='btn btn-ghost btn-sm btn-circle absolute top-1 right-1 sm:right-2 sm:top-2 bg-transparent'
          aria-label='Close delete confirmation modal'
        >
          ✕
        </button>
        <div className='flex flex-col gap-2'>
          <p className='font-bold text-xl'>{review?.userItem?.title}</p>
          <div className='flex flex-row gap-2'>
            <img
              className='w-1/8 max-w-32 min-w-24 h-fit aspect-2/3 rounded-md'
              src={review?.userItem?.cached_img}
              alt={review?.userItem?.title}
            />
            <div className='grow'>
              <UserItemReviewModal
                mediaType={review?.mediaType}
                userItemData={review?.userItem}
                refetchReviews={refetchReviews}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
