import { useEffect, useState } from 'react'
import LoaderComponent from '../../../components/LoaderComponent'
import useFormStatusHandling from '../../../components/userItemModal/useFormStatusHandling'
import { useAuth } from '../../../Contexts/AuthContext'

export default function UserNameEditComp () {
  const { userData, updateUserName } = useAuth()
  const { status, setStatus, error, setError } = useFormStatusHandling()
  const [username, setUsername] = useState(userData?.username || '')

  useEffect(() => {
    if (!userData) return
    setUsername(userData?.username || '')
  }, [userData])

  useEffect(() => {
    if (!userData) return
    setStatus(username !== (userData?.username || '') ? 'editing' : 'idle')
  }, [username])

  async function handleSubmit (e) {
    e.preventDefault()
    const trimmedUsername = username.trim()

    if (!trimmedUsername) {
      setError('Username cannot be empty')
      setStatus('error')
      return
    }

    setStatus('uploading')
    setError(null)

    try {
      await updateUserName(trimmedUsername)
      setStatus('success')
    } catch (err) {
      setStatus('error')
      setError(err?.message || 'Failed to update username')
    }
  }

  return (
    <div className='w-full flex flex-col gap-3'>
      <form
        className='flex flex-col gap-2 items-start text-sm'
        onSubmit={handleSubmit}
      >
        <div className='form-control w-full flex flex-col gap-y-1'>
          <label
            className='font-semibold capitalize'
            htmlFor='newUsernameInput'
          >
            username
          </label>
          <input
            type='text'
            autocomplete='off'
            name='newUsernameInput'
            id='newUsernameInput'
            autocomplete='one-time-code'
            placeholder='Enter your username'
            className='input input-primary bg-transparent select-xs outline-0 text-[0.9em]'
            value={username}
            onChange={e => {
              setUsername(e.target.value)
              setStatus('editing')
            }}
          />
        </div>

        <button
          className='btn btn-primary capitalize'
          type='submit'
          disabled={!(status === 'editing' && !error)}
        >
          update username
        </button>

        {status === 'uploading' && (
          <div className='scale-75 py-2'>
            <LoaderComponent />
          </div>
        )}

        {status === 'success' && (
          <div className='text-emerald-600 dark:text-emerald-400 bg-emerald-600/5 rounded-sm px-1.5 py-1 text-[0.8em]'>
            <span>Your username has been updated!</span>
          </div>
        )}

        {status === 'error' && error && (
          <div
            role='alert'
            className='text-rose-600 dark:text-rose-400 bg-rose-600/5 rounded-sm px-1.5 py-1 text-[0.8em]'
          >
            <span>{error}</span>
          </div>
        )}
      </form>
    </div>
  )
}
