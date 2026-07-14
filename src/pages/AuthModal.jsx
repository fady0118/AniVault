import { useContext, useEffect, useState } from 'react'
import { account, tablesDB, ID } from '../appwrite'
import { useAuth } from '../Contexts/AuthContext'
import LoaderComponent from '../components/LoaderComponent'
import { ArrowLeft } from 'lucide-react'
import useFormStatusHandling from '../components/userItemModal/useFormStatusHandling'

export default function AuthModal ({ setShowAuthModal }) {
  const {
    loggedInUser,
    login,
    register,
    logout,
    init,
    createOAuthSession,
    createUserProfile
  } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [forgotPassword, setForgotPassword] = useState(false)
  const [isLogin, setIsLogin] = useState(true)
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState(null)

  async function handleSubmit (e) {
    e.preventDefault()
    setStatus('loading')
    if (isLogin) {
      try {
        //login
        await login(email, password)
        setStatus('idle')
        setEmail('')
        setPassword('')
        setName('')
      } catch (error) {
        if (error.code === 403) {
          setError('This account has been deleted / blocked')
        } else if (error.code === 401) {
          setError('Please check your email and password and try again.')
        } else {
          setError(error.message)
        }
        setStatus('error')
      }
    } else {
      try {
        //signup
        const user = await register(email, password, name)
        // create a new userProfile table row for the created user
        createUserProfile(user)
        setStatus('idle')
      } catch (error) {
        if (error.code === 409) {
          setError('A user with the same email already exists')
        } else {
          setError(error.message)
        }
        setStatus('error')
      }
    }
  }

  async function handleLogout () {
    try {
      setStatus('loading')
      await logout()
      setStatus('idle')
    } catch (error) {
      setError(error.message)
      setStatus('error')
    }
  }

  useEffect(() => {
    function handleKeyDown (e) {
      if (e.key === 'Escape') {
        setShowAuthModal(false)
      }
    }
    document.documentElement.addEventListener('keydown', handleKeyDown)
    return () =>
      document.documentElement.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className='fixed inset-0 z-50 bg-dark-amethyst-smoke-50/40 backdrop-blur-lg flex items-center justify-center p-4 text-[0.75em]'>
      <div className='relative max-w-md rounded-3xl w-fit flex justify-center box-colors-solid border border-base-200/60 p-8'>
        <button
          onClick={() => setShowAuthModal(false)}
          className='btn btn-ghost btn-sm btn-circle absolute right-4 top-4 bg-transparent'
          aria-label='Close authentication modal'
        >
          ✕
        </button>

        {loggedInUser ? (
          <div className='space-y-6 text-center'>
            <div className='uppercase tracking-[0.35em] text-primary'>
              Welcome back
            </div>
            <h2 className='text-[1.75em] font-semibold'>{loggedInUser.name}</h2>
            <p className='text-text-light/80 dark:text-text-dark/80'>
              You are currently signed in. Use the button below to logout.
            </p>
            {status === 'loading' ? (
              <div className='flex justify-center scale-75'>
                <LoaderComponent type='progress' />
              </div>
            ) : (
              <button onClick={handleLogout} className='btn btn-primary w-full'>
                Logout
              </button>
            )}
            {status === 'error' && (
              <p className='text-rose-500 dark:text-rose-400 capitalize'>
                {error}
              </p>
            )}
          </div>
        ) : (
          <>
            {forgotPassword ? (
              <ResetPassword
                forgotPassword={forgotPassword}
                setForgotPassword={setForgotPassword}
                emailVal={email}
              />
            ) : (
              <div className='flex flex-col gap-y-3'>
                <div className='space-y-2 text-center'>
                  <h2 className='text-[1.75em] font-semibold'>
                    {isLogin ? 'Login to your account' : 'Create a new account'}
                  </h2>
                  <p className='text-text-light/80 dark:text-text-dark/80'>
                    Securely login or register to save your favorites and
                    personalize your experience.
                  </p>
                </div>

                <form className='space-y-4' onSubmit={handleSubmit}>
                  {/* email field */}
                  <div className='form-control'>
                    <label class='input validator bg-transparent w-full outline-0 border-text-light/25 dark:border-text-dark/25'>
                      <p className='text-xs absolute -top-0.5 left-0 -translate-y-1/2 mx-1 px-1 py-0 text-text-light/60 dark:text-text-dark/60 box-colors-solid'>
                        Email
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
                          <rect
                            width='20'
                            height='16'
                            x='2'
                            y='4'
                            rx='2'
                          ></rect>
                          <path d='m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7'></path>
                        </g>
                      </svg>
                      <input
                        className='placeholder:text-text-light/60 dark:placeholder:text-text-dark/60'
                        type='email'
                        placeholder='mail@site.com'
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value.trim())}
                      />
                    </label>
                    <div class='validator-hint hidden'>
                      Enter valid email address
                    </div>
                  </div>

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
                        title='Must be more than 8 characters, including number, lowercase letter, uppercase letter'
                      />
                    </label>
                    <p class='validator-hint hidden'>
                      Must be more than 8 characters
                    </p>
                    {isLogin && !forgotPassword && (
                      <p
                        onClick={() => {
                          setForgotPassword(true)
                        }}
                        className='cursor-pointer w-fit text-indigo-600 dark:text-indigo-400 border-b border-indigo-600 dark:border-indigo-400 hover:brightness-80 dark:hover:brightness-125 duration-200'
                      >
                        forgot password?
                      </p>
                    )}
                  </div>

                  {/* username field */}
                  {!isLogin && (
                    <div className='form-control'>
                      <label class='input validator bg-transparent w-full outline-0 border-text-light/25 dark:border-text-dark/25'>
                        <p className='text-xs absolute -top-0.5 left-0 -translate-y-1/2 mx-1 px-1 py-0 text-text-light/60 dark:text-text-dark/60 box-colors-solid'>
                          Username
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
                            <path d='M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2'></path>
                            <circle cx='12' cy='7' r='4'></circle>
                          </g>
                        </svg>
                        <input
                          className='placeholder:text-text-light/60 dark:placeholder:text-text-dark/60'
                          value={name}
                          onChange={e => setName(e.target.value.trim())}
                          type='text'
                          required
                          placeholder='Username'
                          pattern='[A-Za-z][A-Za-z0-9\-]*'
                          minLength='3'
                          maxLength='30'
                          title='Only letters, numbers or dash'
                        />
                      </label>
                      <p class='validator-hint hidden'>
                        Must be 3 to 30 characters
                        <br />
                        containing only letters, numbers or dash
                      </p>
                    </div>
                  )}
                  {status === 'loading' ? (
                    <div className='flex justify-center scale-75'>
                      <LoaderComponent type='progress' />
                    </div>
                  ) : (
                    <button type='submit' className='btn btn-primary w-full'>
                      {isLogin ? 'Login' : 'Sign Up'}
                    </button>
                  )}
                  {status === 'error' && (
                    <p className='text-rose-500 dark:text-rose-400 capitalize'>
                      {error}
                    </p>
                  )}
                </form>
                {/* google OAuth */}
                <button
                  onClick={createOAuthSession}
                  class='btn bg-amethyst-smoke-200 hover:bg-amethyst-smoke-50 text-black border-[#e5e5e5]'
                >
                  <img
                    className='w-5 h-5 object-cover'
                    src='https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/3840px-Google_%22G%22_logo.svg.png'
                    alt='google logo'
                  />
                  Signup / Login with Google
                </button>
                <div className='flex items-center justify-start gap-1'>
                  {isLogin ? (
                    <>
                      <span className='font-medium'>
                        Don't have an account yet?
                      </span>
                      <span
                        onClick={() => {
                          setIsLogin(false)
                        }}
                        className='font-medium underline cursor-pointer text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 duration-200 '
                      >
                        sign up instead
                      </span>
                    </>
                  ) : (
                    <>
                      <span className='font-medium'>
                        Already have an account?
                      </span>
                      <span
                        onClick={() => {
                          setIsLogin(true)
                        }}
                        className='font-medium underline cursor-pointer text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 duration-200 '
                      >
                        login instead
                      </span>
                    </>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function ResetPassword ({ forgotPassword, setForgotPassword, emailVal }) {
  const { status, setStatus, error, setError } = useFormStatusHandling()
  const [email, setEmail] = useState(emailVal || '')

  async function createRecovery () {
    const currentPath = window.location.origin
    try {
      setStatus('loading')
      const res = await account.createRecovery({
        email: email,
        url: `${currentPath}/passwordReset`
      })
      setStatus('success')
    } catch (error) {
      setStatus('error')
      setError(error.message || 'failed to send recover email')
    }
  }

  async function handleSubmit (e) {
    e.preventDefault()
    createRecovery()
  }

  return (
    <div className='flex flex-col w-fit items-center justify-center gap-y-5'>
      <div className='flex flex-col items-center text-center gap-y-2'>
        <h2 className='text-[1.75em] font-semibold'>Reset your password</h2>
        <p className='w-3/4 text-text-light/80 dark:text-text-dark/80 text-center'>
          Enter your email then head there to reset your password
        </p>
      </div>
      <form className='w-full text-center' onSubmit={handleSubmit}>
        {/* email field */}
        <div className='form-control w-full'>
          <label class='input validator bg-transparent w-full outline-0 border-text-light/25 dark:border-text-dark/25'>
            <p className='text-xs absolute -top-0.5 left-0 -translate-y-1/2 mx-1 px-1 py-0 text-text-light/60 dark:text-text-dark/60 box-colors-solid'>
              Email
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
                <rect width='20' height='16' x='2' y='4' rx='2'></rect>
                <path d='m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7'></path>
              </g>
            </svg>
            <input
              className='placeholder:text-text-light/60 dark:placeholder:text-text-dark/60'
              type='email'
              placeholder='mail@site.com'
              required
              value={email}
              onChange={e => setEmail(e.target.value.trim())}
            />
          </label>
          <div class='validator-hint hidden'>Enter valid email address</div>
        </div>
        {status === 'success' && (
          <p className='text-emerald-600 dark:text-emerald-400 mt-1.5'>
            An email has been sent, check your mail
          </p>
        )}
        <div className='w-fill grid grid-cols-3 justify-items-center mt-3'>
          {status==="success"?
          <div
            onClick={() => {
              setForgotPassword(false)
            }}
            className='col-span-1 col-start-2 w-fit cursor-pointer hover:bg-indigo-500/10 border border-transparent hover:border-indigo-500/20 rounded-md py-2 px-6 duration-200'
          >
            <ArrowLeft size={18} />
          </div>
          :
          <div
            onClick={() => {
              setForgotPassword(false)
            }}
            className='col-span-1 w-fit cursor-pointer hover:bg-indigo-500/10 border border-transparent hover:border-indigo-500/20 rounded-md py-2 px-6 duration-200'
          >
            <ArrowLeft size={18} />
          </div>
          }
          {status === 'idle' ? (
            <button
              type='submit'
              className='col-span-1 btn btn-primary w-fit px-8 rounded-4xl'
            >
              submit
            </button>
          ) : status === 'loading' ? (
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
            </div>
          ) : (
            status === 'error' && <p>{error}</p>
          )}
        </div>
      </form>
    </div>
  )
}
