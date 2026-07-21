import { useEffect, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ChevronDown, ChevronUp, Search, X } from 'lucide-react'
import { dateFormatter } from '../../utility/utils'
import EmptyDataFallback from '../EmptyDataFallback'
import LoaderComponent from '../LoaderComponent'
import { getTmdbEpisodes } from '../../anilist/TMDB/tmdb'

const SORT_OPTIONS = [
  { key: 'episode_number', label: 'Episode' },
  { key: 'air_date', label: 'Air date' },
  { key: 'vote_average', label: 'Rating' }
]

export default function EpisodesModal ({ title, id, setShowEpisodesModal }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('episode_number')
  const [order, setOrder] = useState('ascending')

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['tmdbEpisodes', id, title],
    queryFn: async () =>
      getTmdbEpisodes(title, id, import.meta.env.VITE_TMDB_KEY),
    enabled: Boolean(title && id),
    staleTime: 1000 * 60 * 5,
    throwOnError: false
  })

  const episodes = data?.details?.episodes ?? []
  const seasonName =
    data?.details?.name || `Season ${data?.details?.season_number ?? '?'}`
  const seasonAirDate = data?.details?.air_date

  const toggleSort = key => {
    if (sortBy === key) {
      setOrder(prev => (prev === 'ascending' ? 'descending' : 'ascending'))
      return
    }
    setSortBy(key)
    setOrder('ascending')
  }

  const filteredEpisodes = useMemo(() => {
    if (!episodes.length) return []
    const normalizedSearch = searchTerm.trim().toLowerCase()

    const matchesSearch = episode => {
      if (!normalizedSearch) return true
      return [episode.name, episode.overview].some(text =>
        text?.toLowerCase()?.includes(normalizedSearch)
      )
    }

    const sorted = [...episodes].filter(matchesSearch)
    sorted.sort((a, b) => {
      const valueA = a[sortBy]
      const valueB = b[sortBy]

      if (sortBy === 'air_date') {
        return order === 'ascending'
          ? new Date(valueA || 0) - new Date(valueB || 0)
          : new Date(valueB || 0) - new Date(valueA || 0)
      }

      const numericA = Number(valueA ?? 0)
      const numericB = Number(valueB ?? 0)
      return order === 'ascending' ? numericA - numericB : numericB - numericA
    })

    return sorted
  }, [episodes, searchTerm, sortBy, order])

  useEffect(() => {
    const handleKeyDown = e => {
      if (e.key === 'Escape') {
        setShowEpisodesModal(false)
      }
    }
    document.documentElement.addEventListener('keydown', handleKeyDown)
    return () =>
      document.documentElement.removeEventListener('keydown', handleKeyDown)
  }, [setShowEpisodesModal])

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center px-4 py-6'>
      <div className='absolute inset-0 bg-dark-amethyst-smoke-50/90' />

      <div className='relative py-2 z-10 w-full max-w-5xl overflow-hidden rounded-xl border border-amethyst-smoke-800/40 box-colors shadow-2xl'>
        <div className='flex flex-col gap-4 border-b border-amethyst-smoke-800/20 px-5 py-2 sm:flex-row sm:items-start sm:justify-between sm:gap-6'>
          <div className='space-y-1'>
            <p className='text-xs uppercase tracking-[0.24em] text-amethyst-smoke-950 dark:text-amethyst-smoke-500'>
              Season details
            </p>
            <div className='flex items-center gap-x-3'>
              <h2 className='text-xl font-semibold tracking-tight text-amethyst-smoke-950 dark:text-amethyst-smoke-500'>
                {seasonName}
              </h2>
              <p className='text-sm text-amethyst-smoke-950/80 dark:text-amethyst-smoke-500/80'>
                {episodes.length} episode{episodes.length === 1 ? '' : 's'}
                {seasonAirDate ? ` · ${dateFormatter(seasonAirDate)}` : ''}
              </p>
            </div>
          </div>

          <button
            type='button'
            onClick={() => setShowEpisodesModal(false)}
            className='inline-flex h-10 w-10 items-center justify-center rounded-full border border-amethyst-smoke-700/30 dark:border-amethyst-smoke-400/30 text-amethyst-smoke-800 dark:text-amethyst-smoke-200 box-colors hover:cursor-pointer hover:bg-amethyst-smoke-700/40 dark:hover:bg-amethyst-smoke-800/65 duration-200'
            aria-label='Close episodes modal'
          >
            <X size={18} />
          </button>
        </div>

        <div className='space-y-2 p-3 sm:px-6'>
          {data?.details?.overview ? (
            <p className='text-sm leading-6 text-amethyst-smoke-900 dark:text-amethyst-smoke-400'>
              {data.details.overview}
            </p>
          ) : (
            <p className='text-sm leading-6 text-amethyst-smoke-900 dark:text-amethyst-smoke-400'>
              No season overview available.
            </p>
          )}

          <div className='grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center'>
            <div className='relative w-full max-w-lg'>
              <Search className='pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-amethyst-smoke-900 dark:text-amethyst-smoke-400' />
              <input
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder='Search episodes by title or synopsis'
                className='w-full rounded-md border border-amethyst-smoke-500/20 box-colors bg-amethyst-smoke-200/20 dark:bg-dark-amethyst-smoke-600/25 py-3 pl-10 pr-4 text-sm text-amethyst-smoke-900 outline-0 transition focus:border-amethyst-400 dark:text-amethyst-smoke-100 dark:focus:border-amethyst-smoke-300'
              />
            </div>

            <div className='flex flex-wrap gap-2'>
              {SORT_OPTIONS.map(option => {
                const active = sortBy === option.key
                return (
                  <button
                    key={option.key}
                    type='button'
                    onClick={() => toggleSort(option.key)}
                    className={`flex items-center gap-1 rounded-sm border px-3 py-2 text-xs font-medium transition duration-300 ${
                      active
                        ? 'border-amethyst-smoke-800 dark:border-amethyst-smoke-300 bg-amethyst-smoke-800/65 dark:bg-amethyst-smoke-800/65 text-amethyst-smoke-300 dark:text-amethyst-smoke-100'
                        : 'border-amethyst-smoke-500/20 box-colors bg-amethyst-smoke-200/20 dark:bg-dark-amethyst-smoke-600/25 text-amethyst-smoke-800 hover:border-amethyst-smoke-400 dark:text-amethyst-smoke-300'
                    }`}
                  >
                    <span>{option.label}</span>
                    {active ? (
                      order === 'ascending' ? (
                        <ChevronDown size={14} />
                      ) : (
                        <ChevronUp size={14} />
                      )
                    ) : null}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        <div className='max-h-[60vh] overflow-y-auto px-5 pb-5 sm:px-6'>
          {isLoading ? (
            <div className='flex h-64 items-center justify-center'>
              <LoaderComponent type='progress' />
            </div>
          ) : isError ? (
            <div className='py-8'>
              <EmptyDataFallback
                string={'Unable to load episodes.'}
              />
            </div>
          ) : !filteredEpisodes.length ? (
            <div className='py-8'>
              <EmptyDataFallback
                string={
                  episodes.length
                    ? 'No matching episodes.'
                    : 'No episodes found.'
                }
              />
            </div>
          ) : (
            <div className='space-y-4 pb-4'>
              {filteredEpisodes.map(episode => (
                <article
                  key={
                    episode.id || `${episode.episode_number}-${episode.name}`
                  }
                  className='grid gap-4 rounded-lg border border-amethyst-smoke-500/10 bg-amethyst-smoke-200/20 dark:bg-dark-amethyst-smoke-600/25 text-amethyst-smoke-800 dark:text-amethyst-smoke-300 p-4 shadow-sm'
                >
                  <div className='grid gap-4 sm:grid-cols-[280px_1fr] sm:items-start'>
                    <div className='relative w-full'>
                      <div className='absolute top-2 left-2 z-10 flex items-center justify-center rounded-md border border-amethyst-smoke-300/40 bg-amethyst-smoke-200/75 dark:bg-dark-amethyst-smoke-600/75 px-2 py-1 text-sm font-semibold text-amethyst-smoke-900 dark:text-amethyst-smoke-100'>
                        {String(episode.episode_number ?? '?').padStart(2, '0')}
                      </div>
                      {episode.still_path ? (
                        <img
                          src={`https://image.tmdb.org/t/p/w500${episode.still_path}`}
                          alt={`Episode ${episode.episode_number} still`}
                          className='aspect-video w-full rounded-lg object-cover sm:h-full'
                        />
                      ) : (
                        <div className='aspect-video w-full rounded-lg bg-amethyst-smoke-100 flex items-center justify-center text-sm dark:bg-amethyst-smoke-700'>
                          No image available
                        </div>
                      )}
                    </div>

                    <div className='space-y-3'>
                      <div className='flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between'>
                        <div className='space-y-1'>
                          <h3 className='text-base font-semibold text-amethyst-smoke-900 dark:text-amethyst-smoke-100'>
                            {episode.name || 'Untitled episode'}
                          </h3>
                          <p className='text-sm text-amethyst-smoke-800 dark:text-amethyst-smoke-300'>
                            {episode.episode_type
                              ? `${episode.episode_type} · `
                              : ''}
                            {episode.air_date
                              ? dateFormatter(episode.air_date)
                              : 'Air date unknown'}
                          </p>
                        </div>

                        <div className='flex flex-wrap gap-2 text-xs'>
                          {episode.runtime ? (
                            <span>{episode.runtime} min</span>
                          ) : null}
                          {episode.vote_average ? (
                            <span>⭐ {episode.vote_average.toFixed(1)}</span>
                          ) : null}
                          {episode.vote_count ? (
                            <span>({episode.vote_count} votes)</span>
                          ) : null}
                        </div>
                      </div>

                      <p className='text-sm leading-6 '>
                        {episode.overview || 'No episode synopsis available.'}
                      </p>

                      <div className='flex flex-wrap gap-2 text-xs'>
                        {episode.production_code ? (
                          <span className='rounded-full border border-amethyst-smoke-300/50 px-2 py-1'>
                            {episode.production_code}
                          </span>
                        ) : null}
                        {episode.crew?.length ? (
                          <span className='rounded-full border border-amethyst-smoke-300/50 px-2 py-1'>
                            {episode.crew[0].job}: {episode.crew[0].name}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
