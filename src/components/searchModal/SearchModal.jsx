import { ChevronDown, Search } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import SearchContainer from './SearchContainer'
import { useDebounce } from '../../utility/useDebounce'

const categories = [
  'all',
  'anime',
  'manga',
  'characters',
  'producers',
  'people'
]
export default function SearchModal ({ setShowSearchModal }) {
  const [searchInput, setSearchInput] = useState('')
  const [category, setCategory] = useState('all')
  const searchCategoryRef = useRef(null)
  const debouncedSearchValue = useDebounce(searchInput, 750)
  function handleCategorySelect (e) {
    const checkboxElm =
      e.target.parentElement.parentElement.querySelector('label>input')
    checkboxElm.checked = false
    setCategory(e.target.getAttribute('value'))
  }
  useEffect(() => {
    const handleKeyDown = e => {
      if (e.key === 'Escape') {
        setShowSearchModal(false)
      }
    }
    const handleClicksOutside = e => {
      if (
        searchCategoryRef.current &&
        !searchCategoryRef.current.closest('div').contains(e.target)
      ) {
        searchCategoryRef.current.checked = false
      }
    }

    document.documentElement.addEventListener('mousedown', handleClicksOutside)
    document.documentElement.addEventListener('keydown', handleKeyDown)
    return () => {
      document.documentElement.removeEventListener(
        'mousedown',
        handleClicksOutside
      )
      document.documentElement.removeEventListener('keydown', handleKeyDown)
    }
  }, [])
  return (
    <>
      <div className='z-50 flex flex-col rounded-lg fixed top-1/2 left-1/2 transform -translate-1/2 w-5/6 h-6/7 sm:w-3/4 sm:h-4/5 max-w-4xl text-xs backdrop-blur-2xl text-text-light dark:text-text-dark bg-amethyst-smoke-500 dark:bg-dark-amethyst-smoke-200 shadow-xl shadow-dark-amethyst-smoke-300/80 dark:shadow-dark-amethyst-smoke-50/80'>
        <div className='flex justify-between items-center px-4 py-3 border-b border-amethyst-smoke-500/20 dark:border-amethyst-smoke-500/20 '>
          <div className='w-full flex items-center justify-between'>
            <div className='w-3/4 flex flex-row items-center gap-x-1 sm:gap-x-3'>
              <Search size={12} />
              <input
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                type='search'
                placeholder='Search anime, character, etc...'
                className='w-full outline-0'
              />
            </div>

            <div className='relative py-0.5 capitalize w-20 text-[0.75em] mr-3'>
              <label
                className='group peer flex flex-row justify-between items-center p-1 w-full rounded-sm searchModal-box-colors border border-amethyst-smoke-50/10 dark:border-amethyst-smoke-50/10 hover:cursor-pointer duration-200'
                htmlFor='searchCategory'
              >
                <input
                  ref={searchCategoryRef}
                  type='checkbox'
                  name='searchCategory'
                  id='searchCategory'
                  className='hidden'
                />
                <p>{category}</p>
                <ChevronDown
                  className='group-has-checked:rotate-180 duration-200'
                  size={12}
                />
              </label>
              <div className='hidden absolute left-0 top-full min-w-full peer-has-checked:flex flex-col searchModal-box-colors rounded-sm border border-amethyst-smoke-50/10 dark:border-amethyst-smoke-50/10'>
                {categories.map((item, i) => (
                  <p
                    key={i}
                    className='px-2 py-1 hover:cursor-pointer hover:bg-amethyst-smoke-500/50 dark:hover:bg-dark-amethyst-smoke-200/50 hover:text-indigo-600/75 dark:hover:text-indigo-400/75 duration-200'
                    onClick={handleCategorySelect}
                    value={item}
                  >
                    {item}
                  </p>
                ))}
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowSearchModal(false)}
            className='flex items-center px-1 text-[0.85em] rounded-sm searchModal-box-colors border border-amethyst-smoke-50/10 dark:border-amethyst-smoke-50/10 hover:cursor-pointer'
          >
            esc
          </button>
        </div>
        <SearchContainer
          searchInput={debouncedSearchValue}
          category={category}
          closeModal={() => setShowSearchModal(false)}
        />
      </div>
      <div className='z-40 fixed top-0 w-screen h-screen bg-dark-amethyst-smoke-50/90'></div>
    </>
  )
}
