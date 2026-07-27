import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import LoaderComponent from '../components/LoaderComponent'
import { getPersonData } from '../anilist/aniListFetching/personPage/getPersonPage'
import { marked } from 'marked'
import { Cake, Calendar, Clock, Droplet, Heart, Home, User } from 'lucide-react'
import { getPersonRolesData } from '../anilist/aniListFetching/personPage/getPersonRoles'

export default function PeoplePage () {
  const { id } = useParams()
  const [showAllVoiceActingRoles, setShowAllVoiceActingRoles] = useState(false)
  const personQ = useQuery({
    queryKey: ['person', id],
    queryFn: async () => {
      const data = await getPersonData(id)
      return data || {}
    }
  })
  const person = personQ?.data

  const personRolesQ = useQuery({
    queryKey: ['personRoles', id],
    queryFn: async () => {
      const data = await getPersonRolesData(id)
      return data || {}
    },
    throwOnError: false
  })

  const personRoles = personRolesQ?.data

  const allVoiceRoles = showAllVoiceActingRoles
    ? [...(person?.voiceRoles || []), ...(personRoles?.voiceRoles || [])]
    : person?.voiceRoles || []

  useEffect(() => {
    if (!person?.about) return

    const aboutBodyElm = document.getElementById('aboutBody')
    aboutBodyElm.innerHTML = marked.parse(person.about)
  }, [person?.about])

  useEffect(() => {
    function handleSpoilerClick (e) {
      const spoiler = e.target.closest('.al-spoiler')
      if (!spoiler) return

      if (!spoiler.classList.contains('revealed')) {
        e.preventDefault()
        spoiler.classList.add('revealed')
      }
    }
    document.addEventListener('click', handleSpoilerClick)
    return () => document.removeEventListener('click', handleSpoilerClick)
  }, [])

  if (personQ.isPending) {
    return (
      <div className='fixed top-1/2 left-1/2 -translate-1/2'>
        <LoaderComponent />
      </div>
    )
  }

  return (
    <>
      <div className='relative left-1/2 -translate-x-1/2 z-10 w-[95%] flex flex-col space-y-3 pt-15 pb-3 text-md lg:text-lg'>
        {/* Header */}
        <div
          id='name'
          className='mt-3 min-w-1/2 w-fit rounded-md px-3 py-1 box-colors flex flex-col'
        >
          <div className='flex flex-wrap items-end gap-2'>
            <span className='text-[0.875em] sm:text-[1.125em] leading-relaxed font-bold'>
              {person?.name?.full}
            </span>
            {person?.nativeName && (
              <span className='text-[0.75em] sm:text-[1em] leading-relaxed font-normal dark:text-text-dark/65'>
                ({person?.nativeName})
              </span>
            )}
          </div>
          {person?.occupations?.length > 0 && (
            <div className='text-[0.75em] text-amethyst-smoke-600 dark:text-amethyst-smoke-400 mt-0.5'>
              {person.occupations.join(', ')}
            </div>
          )}
        </div>

        {/* Image + About */}
        <div className='w-full flex flex-col sm:flex-row gap-3'>
          <div id='image' className='w-1/5 min-w-24 max-w-48'>
            <img
              className='w-full aspect-2/3 object-cover rounded-lg overflow-hidden'
              src={person?.image?.large || person?.image?.medium}
              alt={person?.name?.full}
            />
          </div>
          <div
            id='about'
            className='w-full sm:w-4/5 pt-1 rounded-lg overflow-hidden box-colors'
          >
            <div className='border-b border-amethyst-smoke-200/40 px-3 font-semibold text-[1.15em] leading-relaxed capitalize'>
              About
            </div>
            <div className='p-3 text-[0.75em] font-extralight flex flex-col space-y-2 leading-relaxed'>
              <p id='aboutBody' className='whitespace-pre-wrap' />
            </div>
          </div>
        </div>

        {/* Personal Details */}
        <div className='w-full sm:w-fit flex flex-wrap justify-evenly sm:justify-center items-stretch gap-x-2 sm:gap-x-8 sm:gap-y-3 box-colors rounded-xl sm:px-6 py-3 shadow-sm'>
          {person?.gender ? (
            <div className='flex items-center gap-2'>
              <User className='w-4 h-4 opacity-50' strokeWidth={2} />
              <div className='flex flex-col leading-snug'>
                <span className='font-semibold text-[0.65em] uppercase tracking-wide opacity-60'>
                  Gender
                </span>
                <span className='text-[0.65em] font-medium'>
                  {person.gender}
                </span>
              </div>
            </div>
          ) : (
            ''
          )}

          {person?.age ? (
            <>
              <div className='w-px self-stretch bg-current opacity-25' />
              <div className='flex items-center gap-2'>
                <Cake className='w-4 h-4 opacity-50' strokeWidth={2} />
                <div className='flex flex-col leading-snug'>
                  <span className='font-semibold text-[0.65em] uppercase tracking-wide opacity-60'>
                    Age
                  </span>
                  <span className='text-[0.65em] font-medium'>
                    {person.age}
                  </span>
                </div>
              </div>
            </>
          ) : (
            ''
          )}

          {person?.birthday ? (
            <>
              <div className='w-px self-stretch bg-current opacity-25' />
              <div className='flex items-center gap-2'>
                <Calendar className='w-4 h-4 opacity-50' strokeWidth={2} />
                <div className='flex flex-col leading-snug'>
                  <span className='font-semibold text-[0.65em] uppercase tracking-wide opacity-60'>
                    Birthday
                  </span>
                  <span className='text-[0.65em] font-medium'>
                    {person.birthday}
                  </span>
                </div>
              </div>
            </>
          ) : (
            ''
          )}

          {person?.deathDate ? (
            <>
              <div className='w-px self-stretch bg-current opacity-25' />
              <div className='flex items-center gap-2'>
                <Heart className='w-4 h-4 opacity-50' strokeWidth={2} />
                <div className='flex flex-col leading-snug'>
                  <span className='font-semibold text-[0.65em] uppercase tracking-wide opacity-60'>
                    Died
                  </span>
                  <span className='text-[0.65em] font-medium'>
                    {person.deathDate}
                  </span>
                </div>
              </div>
            </>
          ) : (
            ''
          )}

          {person?.bloodType ? (
            <>
              <div className='w-px self-stretch bg-current opacity-25' />
              <div className='flex items-center gap-2'>
                <Droplet className='w-4 h-4 opacity-50' strokeWidth={2} />
                <div className='flex flex-col leading-snug'>
                  <span className='font-semibold text-[0.65em] uppercase tracking-wide opacity-60'>
                    Blood Type
                  </span>
                  <span className='text-[0.65em] font-medium'>
                    {person.bloodType}
                  </span>
                </div>
              </div>
            </>
          ) : (
            ''
          )}

          {person?.homeTown ? (
            <>
              <div className='w-px self-stretch bg-current opacity-25' />
              <div className='flex items-center gap-2'>
                <Home className='w-4 h-4 opacity-50' strokeWidth={2} />
                <div className='flex flex-col leading-snug'>
                  <span className='font-semibold text-[0.65em] uppercase tracking-wide opacity-60'>
                    Home Town
                  </span>
                  <span className='text-[0.65em] font-medium'>
                    {person.homeTown}
                  </span>
                </div>
              </div>
            </>
          ) : (
            ''
          )}

          {person?.yearsActive?.length ? (
            <>
              <div className='w-px self-stretch bg-current opacity-25' />
              <div className='flex items-center gap-2'>
                <Clock className='w-4 h-4 opacity-50' strokeWidth={2} />
                <div className='flex flex-col leading-snug'>
                  <span className='font-semibold text-[0.65em] uppercase tracking-wide opacity-60'>
                    Years Active
                  </span>
                  <span className='text-[0.65em] font-medium'>
                    {Array.isArray(person.yearsActive)
                      ? person.yearsActive.join(' - ')
                      : person.yearsActive}
                  </span>
                </div>
              </div>
            </>
          ) : (
            ''
          )}
        </div>
        {/* Animeography & Mangaography */}
        <div className='flex flex-col md:flex-row gap-3'>
          {person?.animeography?.length > 0 && (
            <div
              id='Animeography'
              className='box-colors w-full md:w-1/2 rounded-md h-fit'
            >
              <div className='border-b border-amethyst-smoke-200/40 pt-1 px-3 font-semibold text-[1.15em] leading-relaxed capitalize'>
                Animeography
              </div>
              <div className='flex flex-col pt-2 space-y-2'>
                {person.animeography.map(entry => (
                  <div
                    key={entry.id}
                    className='flex w-full px-2 space-x-2 border-b border-amethyst-smoke-400/20'
                  >
                    <Link
                      className='w-16 sm:w-20 md:w-1/4 shrink-0'
                      to={`/anime/${entry.id}`}
                    >
                      <img
                        className='w-full aspect-3/4 object-cover rounded-md overflow-hidden'
                        src={entry.coverImage}
                        alt={entry.title}
                      />
                    </Link>
                    <div className='flex flex-col w-3/4 space-y-1'>
                      <Link to={`/anime/${entry.id}`}>
                        <p className='text-[0.8em] blue-link line-clamp-2'>
                          {entry.title}
                        </p>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {person?.mangaography?.length > 0 && (
            <div
              id='Mangaography'
              className='box-colors w-full md:w-1/2 rounded-md h-fit'
            >
              <div className='border-b border-amethyst-smoke-200/40 pt-1 px-3 font-semibold text-[1.15em] leading-relaxed capitalize'>
                Mangaography
              </div>
              <div className='flex flex-col pt-2 space-y-2'>
                {person.mangaography.map(entry => (
                  <div
                    key={entry.id}
                    className='flex w-full px-2 space-x-2 border-b border-amethyst-smoke-400/20'
                  >
                    <Link
                      className='w-16 sm:w-20 md:w-1/4 shrink-0'
                      to={`/manga/${entry.id}`}
                    >
                      <img
                        className='w-full aspect-3/4 object-cover rounded-md overflow-hidden'
                        src={entry.coverImage}
                        alt={entry.title}
                      />
                    </Link>
                    <div className='flex flex-col w-3/4 space-y-1'>
                      <Link to={`/manga/${entry.id}`}>
                        <p className='text-[0.8em] blue-link line-clamp-2'>
                          {entry.title}
                        </p>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Voice Acting Roles */}
        <div id='VoiceRoles' className='box-colors rounded-md'>
          <div className='border-b border-amethyst-smoke-200/40 pt-1 px-3 font-semibold text-[1.15em] leading-relaxed capitalize'>
            Voice Acting Roles
          </div>
          {allVoiceRoles.length > 0 ? (
            <>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 py-3 px-2'>
                {allVoiceRoles.map(roleEntry => (
                  <div
                    key={roleEntry.character.id}
                    className='flex items-start gap-4 p-3 border subtle-border-colors box-colors rounded-lg'
                  >
                    <Link
                      className='group relative w-24 sm:w-30 shrink-0 transition-transform hover:scale-105 duration-300'
                      to={`/character/${roleEntry.character.id}`}
                    >
                      <img
                        className='w-full aspect-2/3 object-cover rounded-md shadow-sm'
                        src={roleEntry.character.image}
                        alt={roleEntry.character.name}
                      />
                      <p className='absolute bottom-0 inset-x-0 text-[0.65em] sm:text-[0.75em] px-1 py-1 box-colors-medium group-hover:bg-primary group-hover:text-amethyst-smoke-100 blue-link text-center font-semibold rounded-b-md duration-200 truncate'>
                        {roleEntry.character.name}
                      </p>
                    </Link>
                    <div className='flex-1 min-w-0 flex flex-col'>
                      <p className='text-xs sm:text-sm h-5 sm:h-6 text-amethyst-smoke-950/80 dark:text-amethyst-smoke-300/80 font-medium capitalize truncate'>
                        {roleEntry.role}
                      </p>
                      <div className='flex flex-nowrap gap-2 overflow-x-auto snap-x'>
                        {roleEntry.media.map(show => (
                          <Link
                            key={show.id}
                            to={`/${show.type}/${show.id}`}
                            className='group shrink-0 w-23.25 sm:w-29.25 snap-start'
                          >
                            <div className='relative aspect-3/4 overflow-hidden rounded-md shadow-sm'>
                              <img
                                className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
                                src={show.coverImage}
                                alt={show.title}
                              />
                              <div className='absolute inset-x-0 bottom-0 h-15 translate-y-full transition-transform duration-300 ease-out p-1 box-colors-medium flex items-center justify-center group-hover:translate-y-0'>
                                <p className='text-[0.65em] font-medium text-center blue-link w-full mx-auto leading-tight group-hover:brightness-110 line-clamp-2'>
                                  {show.title}
                                </p>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {personRoles?.voiceRoles?.length > 0 &&
              !showAllVoiceActingRoles ? (
                <div className='w-full flex justify-center pt-1 pb-3'>
                  <button
                    onClick={() => {
                      setShowAllVoiceActingRoles(true)
                    }}
                    className='cursor-pointer w-1/2 bg-amethyst-smoke-400/50 dark:bg-dark-amethyst-smoke-200/50 text-amethyst-smoke-950 dark:text-amethyst-smoke-100 flex items-center justify-center py-3 text-[0.85em] font-semibold rounded-md border border-amethyst-smoke-950/10 dark:border-amethyst-smoke-200/10 hover:bg-amethyst-smoke-400/75 dark:hover:bg-dark-amethyst-smoke-200/75 hover:scale-[1.02] hover:shadow-md active:scale-[0.98] transition-all duration-200'
                  >
                    Show more (+ {personRoles?.voiceRoles?.length})
                  </button>
                </div>
              ) : (
                ''
              )}
            </>
          ) : (
            <div className='p-3 text-[0.75em] text-amethyst-smoke-600 dark:text-amethyst-smoke-400'>
              No voice acting roles found
            </div>
          )}
        </div>
      </div>
    </>
  )
}
