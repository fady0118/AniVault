import { useNavigate } from 'react-router'
import useFormStatusHandling from '../../../components/userItemModal/useFormStatusHandling'
import { account } from '../../../appwrite'
import { useEffect, useMemo, useState } from 'react'

export default function PasswordResetRedirect () {
  const { status, setStatus, error, setError } = useFormStatusHandling()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')

  const rules = useMemo(
    () => [
      { test: v => v.length >= 8, message: 'at least 8 characters' },
      { test: v => /[a-z]/.test(v), message: 'a lowercase letter' },
      { test: v => /[A-Z]/.test(v), message: 'an uppercase letter' },
      { test: v => /[0-9]/.test(v), message: 'a number' }
    ],
    []
  )

  const failed = rules.filter(r => !r.test(password))

  const hintText = failed.length
    ? `Must include ${failed.map(r => r.message).join(', ')}`
    : ''

  function credentailsCheck () {
    const urlParams = new URLSearchParams(window.location.search)
    const userId = urlParams.get('userId')
    const secret = urlParams.get('secret')

    if (!userId || !secret) {
      setStatus('error')
      setError('Invalid verification link.')
      return null
    } else {
      return { userId, secret }
    }
  }

  async function resetPasswordHandler() {
    const credentails = credentailsCheck()
    try {
      if(!credentails) {throw new Error("false credentails")}
      const { userId, secret } = credentails;
      setStatus('loading')
      if (!password) return setError('password must be at least 8 characters')
        console.log(`updated recovery with password ${password}`)
      await account.updateRecovery({ userId, secret, password })
      setStatus('success')
    } catch (err) {
      setStatus('error')
      setError(err?.message || 'Failed to reset password.')
    }
  }

  useEffect(() => {
    credentailsCheck()
  }, [])
  return (
    <>
      <div className='relative w-full px-[2.5vw] flex flex-col items-center pt-15 pb-3 text-dark-amethyst-smoke-50 dark:text-text-dark'>
        <div className='w-full max-w-xl min-h-[50vh] flex items-center justify-center'>
          <div className='w-full p-6 rounded-lg bg-amethyst-smoke-100/80 dark:bg-gray-800/60 border border-amethyst-smoke-500 dark:border-gray-700 shadow-sm text-center'>
            {status === 'loading' ? (
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
            ) : status === 'idle' ? (
              <>
                <form className='space-y-4' onSubmit={resetPasswordHandler}>
                  {/* password field */}
                  <div className='form-control'>
                    <label class='input validator bg-transparent w-full outline-0 border-text-light/25 dark:border-text-dark/25'>
                      <p className='text-xs absolute -top-0.5 left-0 -translate-y-1/2 mx-1 px-1 py-0 text-text-light/60 dark:text-text-dark/60 box-colors-solid'>
                        Password
                      </p>
                      <svg
                        class='h-[1.25em] opacity-50'
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox='0 0 24 24'
                      >
                        <g
                          strokeLinejoin='round'
                          strokeLinecap='round'
                          strokeWidth='2.5'
                          fill='none'
                          stroke='currentColor'
                        >
                          <path d='M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z'></path>
                          <circle
                            cx='16.5'
                            cy='7.5'
                            r='.5'
                            fill='currentColor'
                          ></circle>
                        </g>
                      </svg>
                      <input
                        className='placeholder:text-text-light/60 dark:placeholder:text-text-dark/60'
                        value={password}
                        onChange={e => setPassword(e.target.value.trim())}
                        type='password'
                        required
                        placeholder='Password'
                        minLength='8'
                        pattern='(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}'
                        title='Must be more than 8 characters, including number, lowercase letter, uppercase letter'
                      />
                    </label>
                    {failed.length > 0 && (
                      <p className='validator-hint'>{hintText}</p>
                    )}
                  </div>

                  {status === 'loading' ? (
                    <div className='flex justify-center scale-75'>
                      <LoaderComponent type='progress' />
                    </div>
                  ) : (
                    <button
                      type='submit'
                      className='btn btn-primary px-8 w-fit'
                    >
                      Submit
                    </button>
                  )}
                  {status === 'error' && (
                    <p className='text-rose-500 dark:text-rose-400 capitalize'>
                      {error}
                    </p>
                  )}
                </form>
              </>
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
                    onClick={resetPasswordHandler}
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
    </>
  )
}
