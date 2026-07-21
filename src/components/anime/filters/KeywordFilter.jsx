import { Search } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router'

export default function KeywordFilter ({ registerCollector, view = null }) {
  const [searchParams, setSearchParams] = useSearchParams()
  // keyword local state
  const [localState, setLocalState] = useState(
    () => searchParams.get('q') ?? ''
  )
  // localRef
  const localRef = useRef(localState)

  useEffect(() => {
    // pass the getter to the parent (the getter passes the ref value)
    registerCollector(() => localRef.current)
  }, [])

  useEffect(() => {
    setLocalState(searchParams.get('q') ?? '')
  }, [searchParams])

  // refresh ref on localState change
  useEffect(() => {
    localRef.current = localState
  }, [localState])

  // function updates only keyword in searchParams
  function handleKeywordFilter () {
    setSearchParams(prev => ({
      ...Object.fromEntries(prev),
      q: localRef.current
    }))
  }

  return (
    <div
      id='search'
      className={` min-w-28 max-w-48 header-box ${
        !view ? 'box-colors-stronger' : 'smallHeaderBox-colors'
      }`}
    >
      <input
        className={`outline-none font-medium text-[1em] ${!view ? 'w-4/5' : 'w-full'}`}
        value={localState}
        onChange={e => {
          setLocalState(e.target.value)
        }}
        type='search'
        name='searchBar'
        id='searchBar'
        placeholder='Search...'
        onKeyDown={e => {
          if (e.key === 'Enter') {
            handleKeywordFilter()
          }
        }}
      />
      <Search
        onClick={() => {
          handleKeywordFilter()
        }}
        className='hover:cursor-pointer hover:stroke-blue-600 dark:hover:stroke-blue-400 hover:bg-amethyst-smoke-500/15 p-0.5 box-content rounded-md w-3 h-3 md:w-3.5 md:h-3.5 lg:w-4 lg:h-4  duration-200'
      />
    </div>
  )
}
