import { useQueries, useQuery, useQueryClient } from '@tanstack/react-query'
import { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Bookmark, ChevronLeft } from 'lucide-react'
import { RootContext } from '../../App'
import { Link } from 'react-router'
import LoaderComponent from '../LoaderComponent'
import EmptyDataFallback from '../EmptyDataFallback'
import { useUserItemModal } from '../userItemModal/useUserItemModal'
import { adaptSearchResults } from '../../anilist/adapters/adaptSearchResults'
import { getAniListSearchResults } from '../../anilist/aniListFetching/getSearchResults'

const classes = {
  chevron: 'p-0.5 rounded-md box-content duration-200 scale-80 md:scale-100'
}

export default function AnimeMangaContainer ({
  searchParams,
  itemType,
  setUserItemModalStates
}) {
  // user-item modal
  const { setShowUserItemModal, setUserItemData } = setUserItemModalStates

  // currentPage state for query pagination
  const [currentPage, setCurrentPage] = useState(1)
  // pagination state
  const [paginationInfo, setPaginationInfo] = useState(null)

  // reset page if searchParams change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchParams])

  // Create query key from all search params
  const queryKey = useMemo(() => {
    const paramsArray = Array.from(searchParams.entries()).sort()
    return ['anilistSearchResults', itemType, currentPage, paramsArray]
  }, [searchParams, itemType, currentPage])

  // Add page to searchParams for the fetch
  const searchParamsWithPage = useMemo(() => {
    const params = new URLSearchParams(searchParams)
    params.set('page', currentPage)
    return params
  }, [searchParams, currentPage])

  // Fetch data from AniList
  const { data, isLoading, isError, error } = useQuery({
    queryKey,
    queryFn: async () => {
      const anilistResponse = await getAniListSearchResults(
        searchParamsWithPage,
        itemType
      )
      const adaptedResponse = adaptSearchResults(anilistResponse)
      return adaptedResponse
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
    enabled: true,
    throwOnError: false
  })

  // Update pagination info from response
  useEffect(() => {
    if (data?.pagination) {
      setPaginationInfo(data.pagination)
    }
  }, [data])

  const queryClient = useQueryClient()

  // navigate between pages
  function pageSwap (dir) {
    if (dir === 'prev') {
      if (currentPage === 1) return
      setCurrentPage(prev => prev - 1)
    } else if (dir === 'next') {
      if (!paginationInfo?.has_next_page) return
      setCurrentPage(prev => prev + 1)
    }
  }

  const uniqueData = data?.data || []

  return (
    <div className='relative order-3 px-3 py-1 min-h-32 text-[1em]'>
      {isLoading ? (
        <>
          <div className='absolute top-full left-1/2 -translate-1/2'>
            <LoaderComponent />
          </div>
        </>
      ) : !uniqueData?.length ? (
        <EmptyDataFallback string='no data found try a different query' />
      ) : isError ? (
        <EmptyDataFallback
          string={`${error?.message || 'failed to load results'}`}
        />
      ) : (
        <>
          {/* Pagination Controls */}
          <div className='w-fit flex flex-row items-center gap-x-1 py-1 px-2 text-[0.9em] box-colors-stronger rounded-lg'>
            {/* Jump to first page — only show once you've moved past it */}
            {currentPage > 1 && (
              <p
                className='px-2 py-0.5 rounded-md hover:cursor-pointer hover:bg-amethyst-smoke-800/20 dark:hover:bg-amethyst-smoke-400/20 duration-200'
                onClick={() => setCurrentPage(1)}
              >
                1
              </p>
            )}

            <div className='flex flex-row items-center gap-x-2'>
              <ChevronLeft
                onClick={() => pageSwap('prev')}
                size={20}
                className={`${classes.chevron} ${
                  currentPage > 1
                    ? 'hover:cursor-pointer hover:bg-amethyst-smoke-800/20 dark:hover:bg-amethyst-smoke-400/20'
                    : 'stroke-text-light/25 dark:stroke-text-dark/25'
                }`}
              />

              {/* Current page indicator replaces the old "N / lastPage" display */}
              <p className='px-2 py-0.5 font-medium select-none'>
                Page {currentPage}
              </p>

              <ChevronLeft
                onClick={() => pageSwap('next')}
                size={20}
                className={`rotate-180 ${classes.chevron} ${
                  paginationInfo?.has_next_page
                    ? 'hover:cursor-pointer hover:bg-amethyst-smoke-800/20 dark:hover:bg-amethyst-smoke-400/20'
                    : 'stroke-text-light/25 dark:stroke-text-dark/25'
                }`}
              />
            </div>
          </div>

          {/* Grid of Items */}
          <div className='py-2 grid grid-cols-1 3xs:grid-cols-2 2xs:grid-cols-3 xs:grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 xl:grid-cols-8 gap-3 md:gap-4'>
            {uniqueData?.map(item => (
              <div
                key={item?.id}
                className='group relative w-full aspect-2/3 rounded-md overflow-hidden flex-col hover:scale-105 hover:cursor-pointer duration-200'
              >
                <Link to={`/${itemType}/${item?.id}`}>
                  <img
                    src={
                      item?.images?.webp?.large_image_url ||
                      item?.images?.webp?.image_url ||
                      item?.images?.jpg?.image_url
                    }
                    alt={item?.title}
                    className='w-full h-full object-cover text-2xs group-hover:brightness-65 duration-200'
                  />
                </Link>
                <div className='absolute bottom-0 left-0 w-full max-h-2/3 box-colors-medium translate-y-full group-hover:translate-y-0.5 duration-200'>
                  <div className='w-full h-full flex flex-col p-1.5 gap-y-1 text-3xs'>
                    <p className='text-[1.4em] font-bold'>
                      {item?.title_english || item?.title}
                    </p>
                    <div className='font-medium flex flex-row items-center flex-wrap text-[1.2em]'>
                      <p className=''>{item?.status}</p>
                      {item?.status?.toLowerCase().includes('not yet') ? (
                        <p>&nbsp;-&nbsp;{item?.aired?.string}</p>
                      ) : (
                        <>
                          {item?.score ? (
                            <p className=''>
                              &nbsp;-&nbsp;{item?.score.toFixed(1)}
                            </p>
                          ) : (
                            ''
                          )}
                        </>
                      )}
                    </div>
                    {item?.genres?.length ? (
                      <div className='flex flex-row flex-wrap gap-x-1 text-[1.1em]'>
                        {item?.genres?.map((genre, i) => (
                          <Link
                            key={i}
                            to={`/${itemType}?genres=${genre?.name}`}
                            className='font-light rounded-full px-1 m-0.5 box-colors-accent hover:cursor-pointer hover:bg-indigo-400/75 hover:text-text-dark duration-200'
                          >
                            {genre?.name}
                          </Link>
                        ))}
                      </div>
                    ) : (
                      ''
                    )}
                  </div>
                </div>
                {/* open user-item modal */}
                <div
                  onClick={() => {
                    setShowUserItemModal(true)
                    setUserItemData(item)
                  }}
                  className='hover:text-indigo-500 absolute top-1.5 right-1.5 w-7.5 h-7.5 box-border p-1 box-colors-semi-medium rounded-full duration-200'
                >
                  <Bookmark className='w-full h-full pointer-events-none' />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
