import { useEffect, useRef, useState } from 'react'
import { ChevronDown, Search, X } from 'lucide-react' // added X
import SearchContainer from './SearchContainer'
import { useDebounce } from '../../utility/useDebounce'

const categories = ['all', 'anime', 'manga', 'characters', 'studio', 'people']

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
      if (e.key === 'Escape') setShowSearchModal(false)
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
      <div className='z-50 flex flex-col rounded-xl fixed top-1/2 left-1/2 transform -translate-1/2 w-5/6 h-6/7 sm:w-3/4 sm:h-4/5 max-w-4xl text-xs backdrop-blur-2xl text-text-light dark:text-text-dark bg-amethyst-smoke-500 dark:bg-dark-amethyst-smoke-200 border border-amethyst-smoke-800/40 shadow-2xl'>
        <div className='flex flex-col gap-4 border-b border-amethyst-smoke-800/20 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6'>
          <div className='relative w-full max-w-xl'>
            <Search className='pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-amethyst-smoke-900 dark:text-amethyst-smoke-400' />
            <input
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              type='search'
              placeholder='Search anime, character, etc...'
              className='w-full rounded-md border border-amethyst-smoke-500/20 box-colors bg-amethyst-smoke-200/20 dark:bg-dark-amethyst-smoke-600/25 py-2.5 pl-10 pr-4 text-sm text-amethyst-smoke-900 outline-0 transition focus:border-amethyst-400 dark:text-amethyst-smoke-100 dark:focus:border-amethyst-smoke-300'
            />
          </div>
          <div className='flex items-center justify-between sm:justify-end gap-x-4 w-full sm:w-auto'>
            {/* Category Dropdown */}
            <div className='relative capitalize min-w-30 text-sm font-medium'>
              <label
                className='group peer flex w-full items-center justify-between gap-1 rounded-md border px-3 py-2.5 transition duration-300 border-amethyst-smoke-500/20 box-colors bg-amethyst-smoke-200/20 dark:bg-dark-amethyst-smoke-600/25 text-amethyst-smoke-800 hover:border-amethyst-smoke-400 dark:text-amethyst-smoke-300 cursor-pointer'
                htmlFor='searchCategory'
              >
                <input
                  ref={searchCategoryRef}
                  type='checkbox'
                  name='searchCategory'
                  id='searchCategory'
                  className='hidden'
                />
                <span>{category}</span>
                <ChevronDown
                  className='group-has-checked:rotate-180 duration-200'
                  size={14}
                />
              </label>
              <div className='hidden absolute left-0 top-full mt-1 w-full z-20 peer-has-checked:flex flex-col rounded-md border border-amethyst-smoke-500/20 box-colors bg-amethyst-smoke-200 dark:bg-dark-amethyst-smoke-600 shadow-lg overflow-hidden'>
                {categories.map((item, i) => (
                  <p
                    key={i}
                    className='px-3 py-2 text-xs hover:cursor-pointer hover:bg-amethyst-smoke-500/50 dark:hover:bg-dark-amethyst-smoke-200/50 text-amethyst-smoke-800 dark:text-amethyst-smoke-300 hover:text-indigo-600 dark:hover:text-indigo-400 duration-200'
                    onClick={handleCategorySelect}
                    value={item}
                  >
                    {item}
                  </p>
                ))}
              </div>
            </div>

            {/* Close button */}
            <button
              type='button'
              onClick={() => setShowSearchModal(false)}
              className='inline-flex h-10 w-10 items-center justify-center rounded-full border border-amethyst-smoke-700/30 dark:border-amethyst-smoke-400/30 text-amethyst-smoke-800 dark:text-amethyst-smoke-200 box-colors hover:cursor-pointer hover:bg-amethyst-smoke-700/40 dark:hover:bg-amethyst-smoke-800/65 duration-200'
              aria-label='Close search'
            >
              <X size={18} />
            </button>
          </div>
        </div>
        <SearchContainer
          keyword={debouncedSearchValue}
          type={category}
          closeModal={() => setShowSearchModal(false)}
        />
      </div>
      <div className='z-40 fixed top-0 w-screen h-screen bg-dark-amethyst-smoke-50/90'></div>
    </>
  )
}
