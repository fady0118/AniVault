import { useEffect, useReducer, useState } from 'react'
import { Link, useParams } from 'react-router'
import Pictures from '../components/character/Pictures'
import Gallery from '../components/character/Gallery'
import useGallery from '../utility/useGallery'
import { useQueries, useQuery } from '@tanstack/react-query'
import { jikanFetch } from '../utility/jikanApi'
import LoaderComponent from '../components/LoaderComponent'
import { getCharacterData } from '../anilist/aniListFetching/getCharacterPage'

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
  const anilistUrl = `https://anilist.co/character/${character?.id}`

  // const { dispatch, showModal, openGallery, closeGallery, activeIndex } =
  //   useGallery(characterPicturesQ?.data ?? [])

  return (
    <>
      {characterQ.isPending ? (
        <div className='fixed top-1/2 left-1/2 -translate-1/2'>
          <LoaderComponent />
        </div>
      ) : (
        <div className='relative left-1/2 -translate-x-1/2 z-10 w-[95%] flex flex-col space-y-3 pt-15 pb-3'>
          {/* Header: Name + Native Name + AniList link */}
          <div
            id='name'
            className='mt-3 min-w-1/2 w-fit rounded-md px-3 py-1 box-colors order-1 flex flex-col'
          >
            <div className='flex flex-wrap items-end font-bold'>
              <span className='text-sm/relaxed sm:text-lg/relaxed'>
                {character?.name}
              </span>
              {character?.nativeName && (
                <span className='text-xs/relaxed sm:text-md/relaxed ml-2 font-normal dark:text-text-dark/65'>
                  ({character?.nativeName})
                </span>
              )}
            </div>
            <div className='flex items-center space-x-1.5'>
              <Link
                className='text-xs/relaxed sm:text-md/relaxed font-normal blue-link'
                to={anilistUrl}
                target='_blank'
              >
                View on AniList
              </Link>
              {/* Optionally, add an AniList icon */}
            </div>
          </div>

          {/* Image + About row */}
          <div className='w-full order-2 flex flex-col sm:flex-row gap-3'>
            <div id='image' className='w-1/5 min-w-24'>
              <img
                className='w-full aspect-2/3 object-cover rounded-lg overflow-hidden'
                src={character?.image}
                alt={character?.name}
              />
            </div>
            <div
              id='about'
              className='order-2 w-full sm:w-4/5 pt-1 rounded-lg overflow-hidden box-colors'
            >
              <div className='border-b border-amethyst-smoke-200/40 px-3 font-semibold text-md/relaxed capitalize'>
                About
              </div>
              <div className='p-3 text-xs font-light flex flex-col space-y-2'>
                <p className='whitespace-pre-wrap'>
                  {character?.about || 'No biography written.'}
                </p>
                <p>Member Favorites: {character?.favorites}</p>
              </div>
            </div>
          </div>

          {/* Details: Gender, Age, etc. */}
          <div className='order-3 flex flex-wrap gap-2 box-colors rounded-md p-3'>
            {character?.gender && (
              <div className='flex items-center space-x-1'>
                <span className='font-semibold text-xs'>Gender:</span>
                <span className='text-xs'>{character?.gender}</span>
              </div>
            )}
            {character?.age && (
              <div className='flex items-center space-x-1'>
                <span className='font-semibold text-xs'>Age:</span>
                <span className='text-xs'>{character?.age}</span>
              </div>
            )}
            {character?.favorites && (
              <div className='flex items-center space-x-1'>
                <span className='font-semibold text-xs'>Favorites:</span>
                <span className='text-xs'>{character?.favorites}</span>
              </div>
            )}
          </div>

          {/* Anime & Manga rows (side by side on large screens) */}
          <div className='order-4 flex flex-col md:flex-row gap-3'>
            {/* Animeography */}
            <div
              id='Animeography'
              className='box-colors w-full md:w-1/2 rounded-md h-fit'
            >
              <div className='border-b border-amethyst-smoke-200/40 pt-1 px-3 font-semibold text-md/relaxed capitalize'>
                Animeography
              </div>
              <div className='flex flex-col pt-2 space-y-2'>
                {!character?.anime.length ? (
                  <p className='p-3 text-xs font-light'>
                    No anime appearances.
                  </p>
                ) : (
                  character?.anime.map(entry => (
                    <div
                      key={entry.id}
                      className='flex w-full px-2 space-x-2 border-b border-amethyst-smoke-400/20'
                    >
                      <Link
                        className='w-1/4'
                        to={`/anime/${entry.id}`} // adjust route as needed
                      >
                        <img
                          className='w-full aspect-3/4 object-cover'
                          src={entry.coverImage}
                          alt={entry.title}
                        />
                      </Link>
                      <div className='flex flex-col w-3/4 space-y-1'>
                        <Link to={`/anime/${entry.id}`}>
                          <p className='text-xs blue-link'>{entry.title}</p>
                        </Link>
                        <p className='text-2xs'>{entry.role}</p>
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
              <div className='border-b border-amethyst-smoke-200/40 pt-1 px-3 font-semibold text-md/relaxed capitalize'>
                Mangaography
              </div>
              <div className='flex flex-col pt-2 space-y-2'>
                {!character?.manga.length ? (
                  <p className='p-3 text-xs font-light'>
                    No manga appearances.
                  </p>
                ) : (
                  character?.manga.map(entry => (
                    <div
                      key={entry.id}
                      className='flex w-full px-2 space-x-2 border-b border-amethyst-smoke-400/20'
                    >
                      <Link
                        className='w-1/4'
                        to={`/manga/${entry.id}`} // adjust route as needed
                      >
                        <img
                          className='w-full aspect-3/4 object-cover'
                          src={entry.coverImage}
                          alt={entry.title}
                        />
                      </Link>
                      <div className='flex flex-col w-3/4 space-y-1'>
                        <Link to={`/manga/${entry.id}`}>
                          <p className='text-xs blue-link'>{entry.title}</p>
                        </Link>
                        <p className='text-2xs'>{entry.role}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Voice Actors */}
          <div className='order-5 box-colors rounded-md'>
            <div className='border-b border-amethyst-smoke-200/40 pt-1 px-3 font-semibold text-md/relaxed capitalize'>
              Voice Actors
            </div>
            <div className='grid grid-cols-1 2xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 pt-2 p-2'>
              {!character?.voiceActors.length ? (
                <p className='p-3 text-xs font-light col-span-full'>
                  No voice actors listed.
                </p>
              ) : (
                character?.voiceActors.map(actor => (
                  <div
                    key={actor.id}
                    className='w-full flex gap-1 px-2 border-b border-amethyst-smoke-400/20'
                  >
                    <Link
                      className='w-1/4 aspect-2/3'
                      to={`/people/${actor.id}`} // adjust route as needed
                    >
                      <img
                        className='w-full h-full object-cover'
                        src={actor.image}
                        alt={actor.name}
                      />
                    </Link>
                    <div className='flex flex-col w-3/4 gap-1'>
                      <Link
                        className='text-xs blue-link'
                        to={`/people/${actor.id}`}
                      >
                        {actor.name}
                      </Link>
                      <p className='text-2xs'>{actor.language}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        /*
            {showModal && (
            <Gallery
              name={characterQ?.data.name}
              pictures={characterPicturesQ?.data}
              activeIndex={activeIndex}
              closeGallery={closeGallery}
              onNext={() => dispatch({ type: "next" })}
              onPrev={() => dispatch({ type: "prev" })}
              onOpen={(index) => dispatch({ type: "open", newIndex: index })}
            />
          )}
        */
      )}
    </>
  )
}
