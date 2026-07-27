// AnimePopup.jsx
import { Baby, ShieldAlert, Play, Star } from 'lucide-react'
import { Link } from 'react-router'

export default function MediaPop ({
  data,
  position,
  onMouseLeave,
  onMouseEnter
}) {
  if (!data) return null

  const { left, top } = position

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        position: 'fixed',
        left: `${left}px`,
        top: `${top}px`,
        width: '256px', // w-64
        zIndex: 50
      }}
      className='rounded-lg bg-amethyst-smoke-200 dark:bg-dark-amethyst-smoke-200 animate-opacity shadow-lg'
    >
      <div className='w-full h-full p-3 flex flex-col gap-y-2 text-xs text-dark-amethyst-smoke-400 dark:text-amethyst-smoke-400'>
        <div
          id='titles'
          className='flex flex-col gap-y-1 grow-0 items-start justify-center pb-1 capitalize'
        >
          <p className='font-bold text-[1.2em]'>{data.title}</p>
          <p className='text-[0.9em]'>{data.titleNative}</p>
        </div>
        <div className='text-[0.75em] flex flex-row flex-wrap gap-x-1.5 justify-start items-center'>
          <div
            className={`flex flex-row gap-x-1 items-center px-2 py-1 rounded-xl border transition-colors duration-200 ${
              data.isAdult
                ? 'text-red-600 dark:text-red-400 border-red-600/40 bg-red-500/10'
                : 'text-green-600 dark:text-green-400 border-green-600/40 bg-green-500/10'
            }`}
          >
            {data.isAdult ? <ShieldAlert size={10} /> : <Baby size={10} />}
            <p>{data.isAdult ? 'NSFW' : 'SFW'}</p>
          </div>
          <div className='flex flex-row gap-x-1 items-center px-2 py-1 rounded-xl border subtle-border-colors'>
            <Star size={10} />
            <p>{data.score ? `${data.score}%` : '?'}</p>
          </div>
        </div>
        <div id='synopsis'>
          <p className='font-light max-lines-4 cutoff-text-abs text-[0.8em]'>
            {data.description || 'No description found.'}
          </p>
        </div>
        <div className='flex flex-col gap-y-0.5 text-[0.8em]'>
          <div className='flex flex-row gap-x-1 items-center'>
            <p className='font-light'>Aired:</p>
            <p className='font-medium'>{data.aired}</p>
          </div>
          <div className='flex flex-row gap-x-1 items-center'>
            <p className='font-light'>Status:</p>
            <p className='font-medium'>{data.status}</p>
          </div>
          <div className='flex flex-row items-center'>
            <p className='font-light'>Genres:</p>
            <div className='flex flex-row items-start flex-wrap'>
              {data.genres?.map(genre => (
                <p
                  key={genre}
                  className='font-medium text-[0.9em] m-0.5 px-1 rounded-xl border subtle-border-colors'
                >
                  {genre}
                </p>
              ))}
            </div>
          </div>
        </div>
        <Link id='details' to={`/anime/${data.id}`}>
          <div className='w-full px-3 py-1.5 mt-1 flex flex-row items-center justify-between rounded-3xl text-dark-amethyst-smoke-300 dark:text-amethyst-smoke-300 bg-pink-400 dark:bg-pink-500 group hover:cursor-pointer'>
            <p className='font-extrabold text-[1.25em] dark:group-hover:text-dark-amethyst-smoke-200 group-hover:text-amethyst-smoke-200'>
              More Details
            </p>
            <Play
              size={18}
              className='fill-text-light dark:fill-text-dark stroke-0 group-hover:fill-amethyst-smoke-200 dark:group-hover:fill-dark-amethyst-smoke-200 group-hover:-translate-x-5 duration-300'
            />
          </div>
        </Link>
      </div>
    </div>
  )
}
