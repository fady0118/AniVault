import { X, ExternalLink } from 'lucide-react'
import { useEffect } from 'react'

export default function VideoModal ({
  closeModal,
  data,
  title = 'Trailer',
  site = 'YouTube'
}) {
  useEffect(() => {
    const handleKeyDown = e => {
      if (e.key === 'Escape') {
        closeModal()
      }
    }
    document.documentElement.addEventListener('keydown', handleKeyDown)
    return () =>
      document.documentElement.removeEventListener('keydown', handleKeyDown)
  }, [closeModal])

  // Strip autoplay for the external link so it doesn't behave weirdly on YouTube directly
  const cleanLink = data?.link?.split('&autoplay')[0] || ''

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center px-4 py-6'>
      {/* Backdrop */}
      <div
        className='absolute inset-0 bg-dark-amethyst-smoke-50/90'
        onClick={closeModal}
      />

      {/* Modal Container */}
      <div className='relative z-10 flex w-full max-w-5xl flex-col overflow-hidden rounded-xl border border-amethyst-smoke-800/40 box-colors shadow-2xl bg-amethyst-smoke-200 dark:bg-dark-amethyst-smoke-600'>
        {/* Header / Metadata Section */}
        <div className='flex flex-col gap-4 border-b border-amethyst-smoke-800/20 px-5 py-2 sm:flex-row sm:items-center sm:justify-between sm:gap-6'>
          {/* Info Left */}
          <p className='text-[0.85em] font-semibold uppercase tracking-[0.16em] text-amethyst-smoke-950/80 dark:text-amethyst-smoke-400'>
            {data?.title || Trailer}
          </p>

          {/* Controls Right */}
          <div className='flex items-center justify-end gap-x-3 w-full sm:w-auto'>
            {cleanLink && (
              <a
                href={cleanLink}
                target='_blank'
                rel='noreferrer'
                className='flex items-center gap-2 rounded-md border border-amethyst-smoke-500/20 box-colors bg-amethyst-smoke-200/20 dark:bg-dark-amethyst-smoke-600/25 px-4 py-2 text-xs font-medium text-amethyst-smoke-800 transition duration-300 hover:border-amethyst-smoke-400 hover:text-indigo-600 dark:text-amethyst-smoke-300 dark:hover:text-indigo-400'
              >
                <span>Watch on {site}</span>
                <ExternalLink size={14} />
              </a>
            )}

            <button
              type='button'
              onClick={closeModal}
              className='inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-amethyst-smoke-700/30 dark:border-amethyst-smoke-400/30 text-amethyst-smoke-800 dark:text-amethyst-smoke-200 box-colors hover:cursor-pointer hover:bg-amethyst-smoke-700/40 dark:hover:bg-amethyst-smoke-800/65 duration-200'
              aria-label='Close video modal'
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Video Player */}
        <div className='w-full aspect-video bg-black/90'>
          <iframe
            className='w-full h-full'
            src={cleanLink}
            title={`${site} video player`}
            frameBorder='0'
            allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
            referrerPolicy='strict-origin-when-cross-origin'
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  )
}
