import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router'
import { useEffect, useState } from 'react'
import LoaderComponent from '../LoaderComponent'
import { X } from 'lucide-react'
import { getSearchModalResults } from '../../anilist/aniListFetching/searchModal/getSearchModalResults'

const CATEGORY_LABELS = {
  anime: 'Anime',
  manga: 'Manga',
  characters: 'Characters',
  staff: 'People',
  studio: 'Studios'
}

export default function SearchContainer ({ keyword, type, closeModal }) {
  const [recentSearches, setRecentSearches] = useState(() => {
    const savedSearches =
      JSON.parse(localStorage.getItem('recentSearches')) || []
    return savedSearches
  })

  const searchQ = useQuery({
    queryKey: ['querySearch', keyword, type],
    queryFn: async () => {
      if (!keyword) return null
      const searchType = type === 'all' ? null : type
      return (await getSearchModalResults(keyword, searchType)) || []
    },
    enabled: !!keyword
  })

  // handle arrow navigation
  useEffect(() => {
    if (!searchQ?.isFetched) return

    const searchResultsCont = document.getElementById('searchResults')
    if (!searchResultsCont) return

    const searchResults = Array.from(searchResultsCont.querySelectorAll('a'))
    if (searchResults.length === 0) return

    let index = 0
    searchResults[index]?.classList.add('searchResult-hovered')

    function handleArrows (event) {
      switch (event.key) {
        case 'ArrowUp':
          event.preventDefault()
          searchResults[index]?.classList.remove('searchResult-hovered')
          index = index > 0 ? --index : searchResults.length - 1
          searchResults[index]?.classList.add('searchResult-hovered')
          searchResults[index]?.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'center'
          })
          break
        case 'ArrowDown':
          event.preventDefault()
          searchResults[index]?.classList.remove('searchResult-hovered')
          index = index < searchResults.length - 1 ? ++index : 0
          searchResults[index]?.classList.add('searchResult-hovered')
          searchResults[index]?.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'center'
          })
          break
        case 'Enter':
          event.preventDefault()
          searchResults[index]?.click()
          break
        default:
          break
      }
    }

    const searchModal = searchResultsCont.parentElement
    searchModal.addEventListener('keydown', handleArrows)
    return () => {
      if (searchModal) searchModal.removeEventListener('keydown', handleArrows)
    }
  }, [searchQ, keyword, type])

  function handleClick (id, image_url, name, link) {
    const savedSearches =
      JSON.parse(localStorage.getItem('recentSearches')) || []
    const existingItem = savedSearches.find(item => item.id === id)
    if (existingItem) {
      const rest = savedSearches.filter(item => item.id !== id)
      const reorderedSearches = [existingItem, ...rest].slice(0, 10)
      localStorage.setItem('recentSearches', JSON.stringify(reorderedSearches))
      setRecentSearches(reorderedSearches)
      closeModal()
      return
    }
    const newSavedSearches = [
      { id, image_url, name, link },
      ...savedSearches
    ].slice(0, 10)
    localStorage.setItem('recentSearches', JSON.stringify(newSavedSearches))
    setRecentSearches(newSavedSearches)
    closeModal()
  }

  function removeRecentSearch (id) {
    const savedSearches =
      JSON.parse(localStorage.getItem('recentSearches')) || []
    const rest = savedSearches.filter(item => item.id !== id)
    localStorage.setItem('recentSearches', JSON.stringify(rest))
    setRecentSearches(rest)
  }

  const categoryOrder =
    type === 'all'
      ? ['anime', 'manga', 'characters', 'staff', 'studio']
      : [type]

  return (
    <>
      {!searchQ?.isFetched && !keyword ? (
        <div id='recentSearches' className='flex flex-col'>
          <div className='font-bold text-[1.35em] capitalize px-4 py-2 lg:py-3'>
            Recent
          </div>
          {recentSearches.length ? (
            recentSearches.map((item, i) => (
              <div
                key={`${item.id}-${i}`}
                className='w-full flex flex-row items-center justify-between rounded-md searchResult-hover durations-200'
              >
                <Link
                  onClick={() =>
                    handleClick(item.id, item.image_url, item.name, item.link)
                  }
                  to={item.link}
                  className='w-full flex flex-row items-center justify-start rounded-md gap-x-3 px-4 py-2 lg:py-3 searchResult-hover durations-200'
                >
                  <img
                    src={item.image_url || ''}
                    alt={item.name}
                    className='w-1/12 min-w-4 max-w-7 aspect-square rounded-full object-cover'
                  />
                  <p>{item.name}</p>
                </Link>
                <div
                  className='rounded-sm mx-3 p-1.5 hover:bg-amethyst-smoke-600/15 duration-200'
                  onClick={() => removeRecentSearch(item.id)}
                >
                  <X size={20} className='hover:cursor-pointer ' />
                </div>
              </div>
            ))
          ) : (
            <div className='px-4 py-6 text-center text-[0.85em] opacity-60'>
              No recent searches
            </div>
          )}
        </div>
      ) : (
        <div
          id='searchResults'
          tabIndex={0}
          className='w-full grid grid-cols-1 max-h-full overflow-y-auto'
        >
          {searchQ?.isPending ? (
            <div className='absolute top-1/2 left-1/2 -translate-1/2'>
              <LoaderComponent />
            </div>
          ) : (
            categoryOrder.map(searchType => {
              const items = searchQ.data[searchType] || []
              if (!items.length) return null

              return (
                <div key={searchType}>
                  <div className='font-bold text-[1.35em] capitalize px-4 py-2 lg:py-3'>
                    {CATEGORY_LABELS[searchType] || searchType}
                  </div>
                  {items.map(item => (
                    <SearchResultItem
                      key={item.id}
                      item={item}
                      searchType={searchType}
                      handleClick={handleClick}
                    />
                  ))}
                </div>
              )
            })
          )}
        </div>
      )}
    </>
  )
}

function SearchResultItem ({ item, searchType, handleClick }) {
  const imageUrl = item.images?.jpg?.image_url || item.image || ''
  const name = item.title || item.name || 'Unknown'
  const link = item.url || `/${searchType}/${item.id}`

  const getInitials = name => {
    return name
      .split(' ')
      .slice(0, 2)
      .map(word => word[0])
      .join('')
      .toUpperCase()
  }

  return (
    <Link
      onClick={() => handleClick(item.id, imageUrl, name, link)}
      to={link}
      className='w-full flex flex-row items-center justify-start gap-x-3 rounded-md px-4 py-2 lg:py-3 searchResult-hover durations-200'
    >
      {/* Image / Placeholder */}
      <div className='w-1/12 min-w-9 max-w-15 aspect-square rounded-full overflow-hidden shrink-0'>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className='w-full h-full object-cover'
          />
        ) : (
          <div className='w-full h-full bg-amethyst-smoke-200 dark:bg-amethyst-smoke-700 flex items-center justify-center text-amethyst-smoke-600 dark:text-amethyst-smoke-300 font-semibold text-sm'>
            {getInitials(name)}
          </div>
        )}
      </div>

      <div className='flex flex-col'>
        <p className='text-[1.25em] font-semibold'>{name}</p>
        {item.format && (
          <p className='text-[0.85em] font-medium opacity-60 capitalize'>
            {item.format}
          </p>
        )}
        {item.status && (
          <p className='text-[0.85em] font-medium opacity-60 capitalize'>
            {item.status.replace(/_/g, ' ')}
          </p>
        )}
        {item.year && (
          <p className='text-[0.85em] font-medium opacity-60'>{item.year}</p>
        )}
      </div>
    </Link>
  )
}
