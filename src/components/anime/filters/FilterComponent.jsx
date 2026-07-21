import { ChevronDown } from 'lucide-react'
import FilterItem from './FilterItem'
import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router'
import { getDisplayLabel } from '../../../pages/Anime/AnimeRootPage'

export default function FilterComponent ({
  keyName,
  data,
  registerCollector,
  view = null
}) {
  const [searchParams] = useSearchParams()
  // localState for values capturing and local use
  const [localState, setLocalState] = useState(
    () => searchParams.get(keyName) ?? ''
  )
  // localRef
  const localRef = useRef(localState)
  // state for dynamic heading/title
  const [heading, setHeading] = useState(keyName)

  // ref to the checkbox used by the click outside function
  const checkboxRef = useRef(null)

  useEffect(() => {
    // pass the getter to the parent (the getter passes the ref value)
    registerCollector(() => localRef.current)

    // uncheck the checkbox if the user clicks anywhere outside the div wrapping the checkbox
    const handleClickOutside = e => {
      if (
        checkboxRef.current &&
        !checkboxRef.current.closest('div').contains(e.target)
      ) {
        checkboxRef.current.checked = false
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    setLocalState(searchParams.get(keyName) ?? '')
  }, [searchParams])

  function handleChange (val) {
    setLocalState(prevState => {
      let prevStateItems = prevState ? prevState.split(',') : []
      if (prevStateItems.includes(val)) {
        prevStateItems = prevStateItems.filter(item => item !== val)
      } else {
        if (prevStateItems.length < 3) {
          // cap filter to 3 items for api limitations
          prevStateItems.push(val)
        }
      }
      return prevStateItems.join(',')
    })
  }

  // update heading/title of the component
  function filterComponentTitle () {
    let headingString = keyName
    if (!localState) {
      return setHeading(headingString)
    }
    const localHeading = localState.split(',')
    headingString =
      localHeading.length > 1
        ? `${getDisplayLabel(localHeading[0], keyName)} + [${
            localHeading.length - 1
          }]`
        : getDisplayLabel(localState, keyName)
    setHeading(headingString?.toLowerCase()?.split('_')?.join(' '))
  }

  // trigger heading update && refresh ref on localState change
  useEffect(() => {
    filterComponentTitle()
    localRef.current = localState
  }, [localState])

  return (
    <>
      {!view ? (
        // large screens
        <div id={keyName} className='group relative max-w-28'>
          <label className='group peer w-full header-box box-colors-stronger hover:cursor-pointer'>
            <input ref={checkboxRef} type='checkbox' className='hidden' />
            <p className='capitalize text-nowrap text-text-light/70 dark:text-text-dark/70 group-hover:text-text-light dark:group-hover:text-text-dark'>
              {heading}
            </p>
            <ChevronDown
              size={14}
              className='group-has-checked:rotate-180 duration-200 ml-1'
            />
          </label>
          <div className='absolute top-6 left-0 hidden peer-has-checked:grid rounded-md box-colors-stronger grid-cols-1 gap-1 w-26 p-2 text-2xs/loose '>
            {Object.entries(data).map(([key, value], i) => (
              <FilterItem
                key={i}
                item={{ [key]: value }}
                localState={localState}
                handleChange={handleChange}
              />
            ))}
          </div>
        </div>
      ) : (
        // small screens
        <>
          <div
            id={keyName}
            className='group relative min-w-28 max-w-full w-fit'
          >
            <label className='group peer w-full small-header-box smallHeaderBox-colors hover:cursor-pointer'>
              <input type='checkbox' className='hidden' />
              <p className='capitalize text-nowrap text-text-light/70 dark:text-text-dark/70 group-hover:text-text-light dark:group-hover:text-text-dark'>
                {heading}
              </p>
              <ChevronDown
                size={14}
                className='group-has-checked:rotate-180 duration-200 ml-1'
              />
            </label>
            <div className='mt-1 hidden peer-has-checked:grid rounded-md box-colors-stronger grid-cols-1 gap-1 w-26 p-2 text-2xs/loose'>
              {Object.entries(data).map(([key, value], i) => (
                <FilterItem
                  key={i}
                item={{ [key]: value }}
                localState={localState}
                handleChange={handleChange}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </>
  )
}
