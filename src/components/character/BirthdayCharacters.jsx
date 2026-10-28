import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { Cake, ChevronDown } from 'lucide-react'
import { Link } from 'react-router'
import LoaderComponent from '../LoaderComponent'
import EmptyDataFallback from '../EmptyDataFallback'
import { getCharacterSearchResults } from '../../anilist/aniListFetching/getCharacterSearchResults'

const VISIBLE_COUNT = 10

function formatBirthday (dateOfBirth) {
  if (!dateOfBirth) return ''
  const { month, day, year } = dateOfBirth
  if (!month || !day) return ''
  const date = new Date(year || 2000, month - 1, day)
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric'
  })
}

export default function BirthdayCharacters () {
  const [showAll, setShowAll] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ['anilistBirthdayCharacters'],
    queryFn: () =>
      getCharacterSearchResults(new URLSearchParams({ isBirthday: 'true' })),
    staleTime: 60 * 60 * 1000,
    gcTime: 2 * 60 * 60 * 1000,
    retry: 2
  })

  const characters = data?.data || []
  const hiddenCount = characters.length - VISIBLE_COUNT

  return (
    <div className='box-colors-brighter backdrop-blur-md rounded-lg shadow-xl border border-white/20 overflow-hidden'>
      <div className='flex flex-row items-center gap-x-2 px-3 py-2.5 border-b border-black/10 dark:border-white/10'>
        <Cake
          size={16}
          className='stroke-indigo-500 dark:stroke-indigo-400 shrink-0'
        />
        <p className='font-bold text-[0.9em] capitalize'>Character Birthdays</p>
      </div>

      <div className='p-2'>
        {isLoading ? (
          <div className='flex justify-center py-6'>
            <LoaderComponent />
          </div>
        ) : !characters.length ? (
          <EmptyDataFallback string='No character birthdays today' />
        ) : (
          <div className='grid grid-cols-2 lg:grid-cols-1 gap-x-3 gap-y-0.5'>
            {characters?.slice(0,10).map(character => (
              <Link
                key={character.id}
                to={`/character/${character.id}`}
                className='group flex flex-row items-center gap-x-2 p-1.5 rounded-md hover:bg-amethyst-smoke-500/10 dark:hover:bg-amethyst-smoke-400/10 duration-200'
              >
                <div className='relative w-9 h-12 shrink-0 overflow-hidden rounded-sm box-colors-accent'>
                  <img
                    src={
                      character.images?.webp?.large_image_url ||
                      character.images?.jpg?.large_image_url
                    }
                    alt={character.title}
                    loading='lazy'
                    className='w-full h-full object-cover group-hover:brightness-75 duration-200'
                  />
                </div>
                <div className='min-w-0 flex-1 flex flex-col text-[0.75em] leading-tight'>
                  <p className='font-semibold truncate text-[1.1em]'>
                    {character.title}
                  </p>
                  <p className='font-light text-text-light/70 dark:text-text-dark/70 truncate'>
                    {formatBirthday(character.dateOfBirth)}
                  </p>
                </div>
                {character.favourites ? (
                  <p className='shrink-0 text-[0.7em] font-light text-text-light/60 dark:text-text-dark/60'>
                    {character.favourites.toLocaleString()}
                  </p>
                ) : null}
              </Link>
            ))}

             {/* Collapsible remaining items */}
             {characters?.length > 10 && (
              <>
                       <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    showAll ? 'max-h-1000' : 'max-h-0'
                  }`}
                ></div>
              </>
            )}

            {hiddenCount > 0 ? (
              <button
                onClick={() => setShowAll(prev => !prev)}
                className='col-span-2 lg:col-span-1 mt-1 flex flex-row items-center justify-center gap-x-1 py-1.5 rounded-md text-[0.85em] font-medium text-indigo-500 dark:text-indigo-400 hover:bg-amethyst-smoke-500/10 dark:hover:bg-amethyst-smoke-400/10 duration-200'
              >
                <span>
                  {showAll ? 'Show less' : `Show more (${hiddenCount})`}
                </span>
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${
                    showAll ? 'rotate-180' : ''
                  }`}
                />
              </button>
            ) : null}
          </div>
        )}
      </div>
    </div>
  )
}
