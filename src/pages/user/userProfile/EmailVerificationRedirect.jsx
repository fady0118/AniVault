import { useEffect } from 'react'
import { account } from '../../../appwrite'
import useFormStatusHandling from '../../../components/userItemModal/useFormStatusHandling'
import { useNavigate } from 'react-router'

export default function EmailVerificationRedirect () {
  const { status, setStatus, error, setError } = useFormStatusHandling()
  const navigate = useNavigate()

  async function confirmEmailVerification () {
    const urlParams = new URLSearchParams(window.location.search)
    const userId = urlParams.get('userId')
    const secret = urlParams.get('secret')

    if (!userId || !secret) {
      setStatus('error')
      setError('Invalid verification link.')
      return
    }

    try {
      setStatus('loading')
      await account.updateEmailVerification({ userId, secret })
      setStatus('success')
      setTimeout(() => navigate('/profile'), 900)
    } catch (err) {
      setStatus('error')
      setError(err?.message || 'Failed to verify account.')
      console.log(err?.message || 'failed to verify account')
    }
  }

  useEffect(() => {
    confirmEmailVerification()
  }, [])

  return (
    <div className='relative w-full px-[2.5vw] flex flex-col items-center pt-15 pb-3 text-dark-amethyst-smoke-50 dark:text-text-dark'>
      <div className='w-full max-w-xl min-h-[50vh] flex items-center justify-center'>
        <div className='w-full p-6 rounded-lg bg-white/80 dark:bg-gray-800/60 border border-amethyst-smoke-200 dark:border-gray-700 shadow-sm text-center'>
          {status === 'idle' || status === 'loading' ? (
            <div className='flex flex-col items-center gap-3'>
              <svg
                className='animate-spin h-6 w-6 text-amethyst-500'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
              >
                <circle
                  className='opacity-25'
                  cx='12'
                  cy='12'
                  r='10'
                  stroke='currentColor'
                  strokeWidth='4'
                ></circle>
                <path
                  className='opacity-75'
                  fill='currentColor'
                  d='M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z'
                ></path>
              </svg>
              <p className='capitalize'>
                {status === 'loading'
                  ? 'Verifying your account...'
                  : 'Preparing verification...'}
              </p>
            </div>
          ) : status === 'error' ? (
            <div className='flex flex-col gap-4 items-center'>
              <p className='text-rose-600 dark:text-rose-400'>{error}</p>
              <div className='flex gap-2'>
                <button
                  onClick={() => navigate('/profile')}
                  className='btn bg-transparent border-amethyst-smoke-500/20 px-3 py-1 rounded'
                >
                  Return to profile
                </button>
                <button
                  onClick={confirmEmailVerification}
                  className='btn bg-amethyst-500 text-white px-3 py-1 rounded'
                >
                  Retry
                </button>
              </div>
            </div>
          ) : (
            status === 'success' && (
              <div className='flex flex-col gap-4 items-center'>
                <p className='text-emerald-600 dark:text-emerald-400'>
                  Your account has been verified successfully.
                </p>
                <button
                  onClick={() => navigate('/profile')}
                  className='btn bg-amethyst-500 text-white px-3 py-1 rounded'
                >
                  Go to profile
                </button>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  )
}
