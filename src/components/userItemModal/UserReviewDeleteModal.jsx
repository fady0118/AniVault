import { useEffect } from 'react'
import useFormStatusHandling from './useFormStatusHandling'
import LoaderComponent from '../LoaderComponent'
import { tablesDB } from '../../appwrite'

export default function UserReviewDeleteModal ({
  review,
  closeReviewDeleteModal,
  refetchReviews
}) {
  const { status, setStatus, error, setError } = useFormStatusHandling()
  // close modal by pressing esc
  useEffect(() => {
    const handleKeyDown = e => {
      if (e.key === 'Escape') {
        closeReviewDeleteModal();
      }
    }
    document.documentElement.addEventListener('keydown', handleKeyDown)
    return () =>
      document.documentElement.removeEventListener('keydown', handleKeyDown)
  }, [])

  async function handleDelete () {
    try {
      setStatus('loading')
      await tablesDB.deleteRow({
        databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
        tableId: import.meta.env.VITE_TABLE_ID_REVIEWS,
        rowId: review?.$id
      })
      setStatus('success')
      setError(null)
      refetchReviews()
    } catch (error) {
      setStatus('error')
      return setError('failed to delete review')
    }
  }

  return (
    <div className='fixed inset-0 z-50 bg-dark-amethyst-smoke-50/40 backdrop-blur-lg flex items-center justify-center p-4 text-md'>
      <div className='fixed w-full max-w-lg rounded-lg border border-amethyst-smoke-600/20 shadow-2xl shadow-slate-950/40 px-6 py-4 box-colors-semi-medium'>
        <button
          onClick={closeReviewDeleteModal}
          className='btn btn-ghost btn-sm btn-circle absolute top-1 right-1 sm:right-2 sm:top-2 bg-transparent'
          aria-label='Close delete confirmation modal'
        >
          ✕
        </button>
        <div className='flex flex-col gap-4'>
          {status === 'success' ? (
            <div className='flex flex-col justify-start gap-3 w-full'>
              <p className='text-emerald-500 dark:text-emerald-400 capitalize'>
                list deleted successfully
              </p>
              <div className='w-full flex justify-center'>
                <button
                  onClick={closeReviewDeleteModal}
                  className='btn btn-sm btn-outline px-6 border-amethyst-smoke-600/80 text-amethyst-smoke-900 dark:text-amethyst-smoke-200 hover:bg-amethyst-smoke-600/20 dark:hover:bg-amethyst-smoke-500/20 duration-200 text-[0.85em] capitalize w-full sm:w-auto'
                >
                  return
                </button>
              </div>
            </div>
          ) : (
            <>
              <div>
                <h2 className='text-xl font-semibold text-text-light/85 dark:text-text-dark/85 mt-1'>
                  Delete "{review?.userItem?.title || 'this'}" review ?
                </h2>
                <p className='mt-2 text-sm text-text-light/70 dark:text-text-dark/70'>
                  This action cannot be undone. The review will be permanently
                  removed.
                </p>
              </div>
              <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
                {status !== 'loading' ? (
                  <button
                    onClick={handleDelete}
                    className='btn btn-sm btn-outline border-rose-500/80 text-rose-600 dark:text-rose-300 hover:bg-rose-400/20 dark:hover:bg-rose-600/20 duration-200 text-[0.85em] capitalize w-full sm:w-auto'
                  >
                    Confirm delete
                  </button>
                ) : (
                  <div className='scale-75'>
                    <LoaderComponent />
                  </div>
                )}
                <button
                  onClick={closeReviewDeleteModal}
                  className='btn btn-sm btn-outline border-amethyst-smoke-600/80 text-amethyst-smoke-900 dark:text-amethyst-smoke-200 hover:bg-amethyst-smoke-600/20 dark:hover:bg-amethyst-smoke-500/20 duration-200 text-[0.85em] capitalize w-full sm:w-auto'
                >
                  Cancel
                </button>
              </div>
            </>
          )}
          {status === 'error' && (
            <p className='text-rose-500 dark:text-rose-400 capitalize'>
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
