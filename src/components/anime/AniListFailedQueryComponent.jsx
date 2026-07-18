import { CornerDownLeft } from 'lucide-react'
import { useNavigate } from 'react-router'

export function AniListFailedQueryComponent ({ message }) {
  const navigate = useNavigate()
  return (
    <div className='fixed inset-0 flex flex-col gap-3 items-center justify-center p-4'>
      <div className='border border-rose-500/65 text-rose-500 bg-rose-400/5 px-6 py-4 rounded-lg shadow-sm'>
        {message}
      </div>
      <div
        onClick={() => {
          navigate('/')
        }}
        className='flex flex-row gap-4 items-center py-2 px-4 rounded-md border magazine-border-colors hover:cursor-pointer hover:bg-amethyst-smoke-400/75 dark:hover:bg-dark-amethyst-smoke-300/75 duration-200'
      >
        <p>Return</p> <CornerDownLeft size={15} />
      </div>
    </div>
  )
}
