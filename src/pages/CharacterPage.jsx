import { useEffect, useReducer, useState } from 'react'
import { Link, useParams } from 'react-router'
import Pictures from '../components/character/Pictures'
import Gallery from '../components/character/Gallery'
import useGallery from '../utility/useGallery'
import { useQueries, useQuery } from '@tanstack/react-query'
import { jikanFetch } from '../utility/jikanApi'
import LoaderComponent from '../components/LoaderComponent'
import { getCharacterData } from '../anilist/aniListFetching/characterPage/getCharacterPage'
import { getCharacterGallery } from '../anilist/aniListFetching/characterPage/getCharacterImages'

import { User, Cake, Star } from 'lucide-react'
import { marked } from 'marked'

export default function CharacterPage () {
  const { id } = useParams()
  const characterQ = useQuery({
    queryKey: ['character', id],
    queryFn: async () => {
      const character_Data = await getCharacterData(id)
      return character_Data || {}
    }
  })
  const character = characterQ?.data?.character

  const characterPicturesQ = useQuery({
    queryKey: ['characterPictures', id, character],
    queryFn: async () => {
      const characterPictures = await getCharacterGallery(character?.name)
      return characterPictures || []
    },
    throwOnError: false
  })

  const { dispatch, showModal, openGallery, closeGallery, activeIndex } =
    useGallery(characterPicturesQ?.data ?? [])

  useEffect(() => {
    if (!character?.about) return

    const aboutBodyElm = document.getElementById('aboutBody')
    aboutBodyElm.innerHTML = marked.parse(character?.about)
  }, [characterQ])

  useEffect(() => {
    function handleSpoilerClick (e) {
      if (e.target.classList.contains('al-spoiler')) {
        e.target.classList.toggle('revealed')
      }
    }
    document.addEventListener('click', handleSpoilerClick)
    return () => document.removeEventListener('click', handleSpoilerClick)
  }, [])
  return (
    <>
      {characterQ.isPending ? (
        <div className='fixed top-1/2 left-1/2 -translate-1/2'>
          <LoaderComponent />
        </div>
      ) : (
        <div className='relative left-1/2 -translate-x-1/2 z-10 w-[95%] flex flex-col space-y-3 pt-15 pb-3 text-md lg:text-lg'>
          {/* Header */}
          <div
            id='name'
            className='mt-3 min-w-1/2 w-fit rounded-md px-3 py-1 box-colors order-1 flex flex-col'
          >
            <div className='flex flex-wrap items-end font-bold'>
              <span className='text-[0.865em] sm:text-[1.125em] leading-relaxed'>
                {character?.name.full}
              </span>
              {character?.nativeName && (
                <span className='text-[0.65em] sm:text-[1em] leading-relaxed ml-2 font-normal dark:text-text-dark/65'>
                  ({character?.nativeName})
                </span>
              )}
            </div>
          </div>

          {/* coverImg & About */}
          <div className='w-full order-2 flex flex-col sm:flex-row gap-3'>
            <div id='image' className='w-1/5 min-w-24 max-w-48'>
              <img
                className='w-full aspect-2/3 object-cover rounded-lg overflow-hidden'
                src={character?.image}
                alt={character?.name.full}
              />
            </div>
            <div
              id='about'
              className='order-2 w-full sm:w-4/5 pt-1 grow rounded-lg overflow-hidden box-colors'
            >
              <div className='border-b subtle-border-colors-darker px-3 font-semibold text-[1em] leading-relaxed capitalize'>
                About
              </div>
              <div className='p-3 text-[0.65em] font-light flex flex-col space-y-2 leading-relaxed'>
                <p id='aboutBody' className='whitespace-pre-wrap'>
                  {character?.about || 'No biography written.'}
                </p>
                <p>Member Favorites: {character?.favorites}</p>
              </div>
            </div>
          </div>

          {/* Details */}

          <div className='order-3 w-fit flex flex-wrap items-stretch gap-x-5 gap-y-3 box-colors rounded-xl px-4 py-3 shadow-sm'>
            {character?.gender && (
              <div className='flex items-center gap-2'>
                <User className='w-4 h-4 opacity-50' strokeWidth={2} />
                <div className='flex flex-col leading-snug'>
                  <span className='font-semibold text-[0.55em] uppercase tracking-wide opacity-60'>
                    Gender
                  </span>
                  <span className='text-[0.65em] font-medium'>
                    {character.gender}
                  </span>
                </div>
              </div>
            )}

            {character?.age && (
              <>
                <div className='w-px self-stretch bg-current opacity-25' />
                <div className='flex items-center gap-2'>
                  <Cake className='w-4 h-4 opacity-50' strokeWidth={2} />
                  <div className='flex flex-col leading-snug'>
                    <span className='font-semibold text-[0.55em] uppercase tracking-wide opacity-60'>
                      Age
                    </span>
                    <span className='text-[0.65em] font-medium'>
                      {character.age}
                    </span>
                  </div>
                </div>
              </>
            )}

            {character?.favorites && (
              <>
                <div className='w-px self-stretch bg-current opacity-25' />
                <div className='flex items-center gap-2'>
                  <Star className='w-4 h-4 opacity-50' strokeWidth={2} />
                  <div className='flex flex-col leading-snug'>
                    <span className='font-semibold text-[0.55em] uppercase tracking-wide opacity-60'>
                      Favorites
                    </span>
                    <span className='text-[0.65em] font-medium'>
                      {character.favorites}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>

          <div id='Pictures' className='order-3 box-colors rounded-md'>
            <Pictures
              pictures={characterPicturesQ?.data}
              openGallery={openGallery}
              cols={3}
            />
          </div>

          <div className='order-4 flex flex-col md:flex-row gap-3'>
            {/* Animeography */}
            <div
              id='Animeography'
              className='box-colors w-full md:w-1/2 rounded-md h-fit'
            >
              <div className='border-b subtle-border-colors-darker pt-1 px-3 font-semibold text-[1em] leading-relaxed capitalize'>
                Animeography
              </div>
              <div className='flex flex-col pt-2 space-y-2'>
                {!character?.anime.length ? (
                  <p className='p-3 text-[0.65em] font-light leading-relaxed'>
                    No anime appearances.
                  </p>
                ) : (
                  character?.anime.map(entry => (
                    <div
                      key={entry.id}
                      className='flex w-full px-2 space-x-2 border-b subtle-border-colors-darker'
                    >
                      <Link
                        className='w-16 sm:w-20 md:w-1/4 max-w-24 shrink-0'
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
                        <p className='text-[0.625em]'>{entry.role}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Mangaography */}
            <div
              id='Mangaography'
              className='box-colors w-full md:w-1/2 rounded-md h-fit'
            >
              <div className='border-b subtle-border-colors-darker pt-1 px-3 font-semibold text-[1em] leading-relaxed capitalize'>
                Mangaography
              </div>
              <div className='flex flex-col pt-2 space-y-2'>
                {!character?.manga.length ? (
                  <p className='p-3 text-[0.65em] font-light leading-relaxed'>
                    No manga appearances.
                  </p>
                ) : (
                  character?.manga.map(entry => (
                    <div
                      key={entry.id}
                      className='flex w-full px-2 space-x-2 border-b subtle-border-colors-darker'
                    >
                      <Link
                        className='w-16 sm:w-20 md:w-1/4 max-w-24 shrink-0'
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
                        <p className='text-[0.625em]'>{entry.role}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Voice Actors */}
          <div className='order-5 box-colors rounded-md'>
            <div className='border-b subtle-border-colors-darker pt-1 px-3 font-semibold text-[1em] leading-relaxed capitalize'>
              Voice Actors
            </div>
            <div className='grid grid-cols-1 2xs:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2 pt-2 p-2'>
              {!character?.voiceActors.length ? (
                <p className='p-3 text-[0.65em] font-light col-span-full leading-relaxed'>
                  No voice actors listed.
                </p>
              ) : (
                character?.voiceActors.map(actor => (
                  <div
                    key={actor.id}
                    className='w-full flex gap-1 px-2 border-b subtle-border-colors-darker'
                  >
                    <Link
                      className='w-16 xs:w-20 sm:w-24 md:w-1/3 aspect-2/3 shrink-0'
                      to={`/people/${actor.id}`}
                    >
                      <img
                        className='w-full h-full object-cover rounded-md overflow-hidden'
                        src={actor.image}
                        alt={actor.name}
                      />
                    </Link>
                    <div className='flex flex-col w-3/4 gap-1'>
                      <Link
                        className='text-[0.8em] blue-link line-clamp-2'
                        to={`/people/${actor.id}`}
                      >
                        {actor.name}
                      </Link>
                      <p className='text-[0.625em]'>{actor.language}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
      <>
        {showModal && (
          <Gallery
            name={character?.name.full}
            pictures={characterPicturesQ?.data}
            activeIndex={activeIndex}
            closeGallery={closeGallery}
            onNext={() => dispatch({ type: 'next' })}
            onPrev={() => dispatch({ type: 'prev' })}
            onOpen={index => dispatch({ type: 'open', newIndex: index })}
          />
        )}
      </>
    </>
  )
}
