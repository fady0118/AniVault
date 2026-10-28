// CharacterContainer.jsx
import { Link } from 'react-router'
import LoaderComponent from '../LoaderComponent'
import EmptyDataFallback from '../EmptyDataFallback'
import { useCharacter } from './useCharacter'

export default function CharacterContainer () {
  const { data, isLoading, isError, error, pageIsInvalid, rawPage } =
    useCharacter()
  const uniqueData = data?.data || []
  return (
    <div className='relative px-3 min-h-32 text-[1em]'>
      <div>
        {pageIsInvalid ? (
          <EmptyDataFallback
            string={`page "${rawPage}" isn't valid — try a page number of 1 or higher`}
          />
        ) : isLoading ? (
          <div className='absolute top-full left-1/2 -translate-1/2'>
            <LoaderComponent />
          </div>
        ) : isError ? (
          <EmptyDataFallback
            string={`${error?.message || 'failed to load results'}`}
          />
        ) : !uniqueData?.length ? (
          <EmptyDataFallback string='no data found try a different query' />
        ) : (
          <>
            {/* Grid of Characters */}
            <div className='grid grid-cols-1 3xs:grid-cols-2 2xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4'>
              {uniqueData?.map(item => (
                <div
                  key={item?.id}
                  className='group relative w-full aspect-2/3 rounded-md overflow-hidden flex-col hover:scale-105 hover:cursor-pointer duration-200'
                >
                  <Link to={`/character/${item?.id}`}>
                    <img
                      src={
                        item?.images?.webp?.large_image_url ||
                        item?.images?.webp?.image_url ||
                        item?.images?.jpg?.image_url
                      }
                      alt={item?.title}
                      loading='lazy'
                      className='w-full h-full object-cover text-2xs group-hover:brightness-65 duration-200'
                    />
                  </Link>
                  <div className='absolute bottom-0 left-0 w-full max-h-2/3 box-colors-medium translate-y-full group-hover:translate-y-0.5 duration-200'>
                    <div className='w-full h-full flex flex-col p-1.5 gap-y-1 text-3xs'>
                      <p className='text-[1.4em] font-bold'>
                        {item?.title_english || item?.title}
                      </p>
                      <div className='font-medium flex flex-row items-center flex-wrap text-[1.2em]'>
                        {item?.favourites ? (
                          <p className=''>
                            {item.favourites.toLocaleString()} favourites
                          </p>
                        ) : (
                          ''
                        )}
                        {item?.gender ? (
                          <p className=''>&nbsp;-&nbsp;{item.gender}</p>
                        ) : (
                          ''
                        )}
                      </div>
                      {item?.media?.length ? (
                        <div className='flex flex-row flex-wrap gap-x-1 text-[1.1em]'>
                          {item?.media?.map((m, i) => (
                            <Link
                              key={i}
                              to={`/${m?.type}/${m?.id}`}
                              className='font-light rounded-full px-1 m-0.5 box-colors-accent hover:cursor-pointer hover:bg-indigo-400/75 hover:text-text-dark duration-200'
                            >
                              {m?.title}
                            </Link>
                          ))}
                        </div>
                      ) : (
                        ''
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
