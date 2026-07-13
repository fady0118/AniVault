import React, { useState } from 'react'
import { useAuth } from '../../../Contexts/AuthContext'
import { account } from '../../../appwrite'

export default function ProfileVerification () {
  const { loggedInUser } = useAuth()
  const [status, setStatus] = useState('idle')

  async function verifyAccount () {
    if (!loggedInUser) return
    try {
      setStatus('sending')
      const currentPath = window.location.origin
      const res = await account.createEmailVerification({
        url: `${currentPath}/emailVerification`
      })
      if (res?.userId === loggedInUser?.$id) {
        setStatus('emailSent')
      } else {
        setStatus('error')
      }
    } catch (error) {
      setStatus('error')
      console.log(error?.message || 'error verifying account')
    }
  }

  return (
    <div className='relative w-full text-dark-amethyst-smoke-50 dark:text-text-dark'>
      <div
        id='verification'
        className='w-full max-w-lg mx-auto min-h-[30vh] flex items-center justify-center'
      >
        <div className='w-full p-5 rounded-md bg-amethyst-smoke-100/80 dark:bg-dark-amethyst-smoke-200/60 border border-amethyst-smoke-600/50 dark:border-dark-amethyst-smoke-500 text-center'>
          {!loggedInUser?.emailVerification ? (
            <>
              <p className='mb-4 capitalize font-medium'>
                Your account is not verified.
              </p>
              {status === 'idle' || status === 'error' ? (
                <button
                  onClick={verifyAccount}
                  className='btn bg-amethyst-500 text-white px-4 py-2 rounded'
                >
                  {status === 'error'
                    ? 'Retry sending verification'
                    : 'Send verification email'}
                </button>
              ) : status === 'sending' ? (
                <button
                  disabled
                  className='btn bg-amethyst-300 text-white px-4 py-2 rounded opacity-80'
                >
                  Sending...
                </button>
              ) : (
                status === 'emailSent' && (
                  <div className='flex flex-col gap-2 items-center'>
                    <p className='text-sm'>
                      Verification email sent. Check your inbox.
                    </p>
                    <div className='flex gap-2'>
                      <button
                        onClick={verifyAccount}
                        className='link link-primary'
                      >
                        Resend
                      </button>
                    </div>
                  </div>
                )
              )}
            </>
          ) : (
            <div className='capitalize font-medium text-emerald-600 dark:text-emerald-400'>
              Your account is verified
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
