import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router'
import GenreItem from './GenreItem'
import { ChevronDown, Info, RotateCcw } from 'lucide-react'

export default function GenresFilter ({
  keyName,
  data,
  registerCollector,
  view = null
}) {
  const [searchParams] = useSearchParams()
  const [heading, setHeading] = useState(`${keyName}`)

  const [localState, setLocalState] = useState(() => {
    const genresParams = searchParams.get(`${keyName}`)?.split(',') || []
    const genresExcludeParams =
      searchParams.get(`${keyName}_exclude`)?.split(',') || []
    return Object.fromEntries(
      data.map(name => [
        name,
        genresParams.includes(String(name))
          ? 1
          : genresExcludeParams.includes(String(name))
          ? -1
          : 0
      ])
    )
  })

  // localRef
  const localRef = useRef(null)
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

  // update heading/title of the component
  function filterComponentTitle () {
    let heading = keyName
    const selectedGenresArr = localRef.current[keyName].concat(
      localRef.current[`${keyName}_exclude`]
    )

    if (!selectedGenresArr.length) {
      setHeading(heading)
      return
    }
    selectedGenresArr.length > 1
      ? (heading = `${data.find(item => item == selectedGenresArr[0])} + [${
          selectedGenresArr.length - 1
        }]`)
      : (heading = data.find(item => item == selectedGenresArr[0]))
    setHeading(heading)
  }

  useEffect(() => {
    setLocalState(() => {
      const genresParams = searchParams.get(`${keyName}`)?.split(',') || []
      const genresExcludeParams =
        searchParams.get(`${keyName}_exclude`)?.split(',') || []
      return Object.fromEntries(
        data.map(name => [
          name,
          genresParams.includes(String(name))
            ? 1
            : genresExcludeParams.includes(String(name))
            ? -1
            : 0
        ])
      )
    })
  }, [searchParams])

  useEffect(() => {
    // update genresRef and genres filter title
    setGenresRef(localRef)
    filterComponentTitle()
  }, [localState])

  function handleClick (name) {
    setLocalState(prevState => {
      const current = prevState[name]
      const next = current === 0 ? 1 : current === 1 ? -1 : 0
      if (next === 1 && localRef.current[keyName]?.length >= 3) {
        return { ...prevState, [name]: -1 }
      }
      return { ...prevState, [name]: next }
    })
  }
  function setGenresRef (ref) {
    ref.current = { [keyName]: [], [`${keyName}_exclude`]: [] }
    Object.entries(localState).forEach(([key, value]) => {
      if (value === 1) localRef.current[keyName].push(key)
      else if (value === -1) localRef.current[`${keyName}_exclude`].push(key)
    })
  }
  function resetGenres () {
    setLocalState(prevState => {
      const newState = Object.fromEntries(
        Object.entries(prevState).map(([key, value]) => [key, 0])
      )
      return newState
    })
  }

  return (
    <>
      {!view ? (
        // large screens
        <div id={`${keyName}`} className='group relative max-w-26'>
          <label className='group peer w-full header-box box-colors-stronger hover:cursor-pointer'>
            <input ref={checkboxRef} type='checkbox' className='hidden' />
            <p className='text-nowrap text-text-light/70 dark:text-text-dark/70 group-hover:text-text-light dark:group-hover:text-text-dark duration-200'>
              {heading}
            </p>
            <ChevronDown
              size={14}
              className='group-has-checked:rotate-180 duration-200 ml-1'
            />
          </label>
          <div className='absolute top-6 right-0 translate-x-1/2 hidden peer-has-checked:flex flex-col rounded-md box-colors-stronger w-md p-1.5 text-3xs/relaxed'>
            <div className='w-full grid grid-cols-4 gap-1'>
              {data.map((name, i) => (
                <GenreItem
                  key={i}
                  name={name}
                  localState={localState}
                  handleClick={handleClick}
                />
              ))}
            </div>
            <div
              id='resetGenres'
              className='text-[1.2em] capitalize w-full flex flex-row justify-end items-center px-1'
            >
              <div
                onClick={resetGenres}
                className='flex flex-row items-center gap-x-1 w-fit rounded-md box-colors-stronger px-1 hover:contrast-105 hover:brightness-90 hover:cursor-pointer duration-200'
              >
                <p>reset</p>
                <RotateCcw id='rotateIcon' size={10} />
              </div>
            </div>
          </div>
        </div>
      ) : (
        // smaller screens
        <>
          <div id='genre' className='group relative w-full'>
            <label className='min-w-28 max-w-full w-fit group peer small-header-box smallHeaderBox-colors hover:cursor-pointer'>
              <input type='checkbox' className='hidden' />
              <p className='text-text-light/70 dark:text-text-dark/70 group-hover:text-text-light dark:group-hover:text-text-dark duration-200'>
                {heading}
              </p>
              <ChevronDown
                size={14}
                className='group-has-checked:rotate-180 duration-200 ml-1'
              />
            </label>
            <div className='mt-1 hidden peer-has-checked:flex flex-col rounded-md box-colors-stronger w-full p-1.5 pb-5 text-2xs/relaxed'>
              <div className='w-full grid grid-cols-1 2xs:grid-cols-2 xs:grid-cols-3 gap-1'>
                {data.slice(0, 17).map((name, i) => (
                  <GenreItem
                    key={i}
                    name={name}
                    localState={localState}
                    handleClick={handleClick}
                  />
                ))}
              </div>
              <div
                id='resetGenres'
                className='absolute bottom-1 right-0 text-[1.2em] capitalize w-fit flex flex-row justify-end items-center px-1'
              >
                <div
                  onClick={resetGenres}
                  className='flex flex-row items-center gap-x-1 w-fit rounded-md box-colors px-1 hover:contrast-105 hover:brightness-90 hover:cursor-pointer duration-200'
                >
                  <p>reset</p>
                  <RotateCcw id='rotateIcon' size={10} />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
