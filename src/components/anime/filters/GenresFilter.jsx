import { useEffect, useLayoutEffect, useRef, useState } from 'react'
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
  const [isOpen, setIsOpen] = useState(false)
  const isOpenStateRef = useRef(isOpen) // needed to fix stale eventListener
  const { triggerRef, containerRef, style } = useConstrainedDropdown(isOpen)

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

  useEffect(() => {
    // pass the getter to the parent (the getter passes the ref value)
    registerCollector(() => localRef.current)
    // hide the container if the user clicks anywhere outside it
    const handleClickOutside = e => {
      if (
        isOpenStateRef.current &&
        !containerRef.current.contains(e.target) &&
        !triggerRef.current.contains(e.target)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    isOpenStateRef.current = isOpen // update isOpen ref
  }, [isOpen])

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

  function useConstrainedDropdown (isOpen) {
    const triggerRef = useRef(null)
    const containerRef = useRef(null)
    const [style, setStyle] = useState({ left: 0 })

    useLayoutEffect(() => {
      if (!isOpen) return

      function updatePosition () {
        const trigger = triggerRef.current
        const container = containerRef.current
        if (!trigger || !container) return

        const header = trigger.closest('#header')
        if (!header) return

        const headerRect = header.getBoundingClientRect()
        const triggerRect = trigger.getBoundingClientRect()
        const containerWidth = container.offsetWidth
        const documentWidth = document.documentElement.offsetWidth

        let left = 0
        let top = triggerRect.bottom - headerRect.top + 4
        const naturalRight = triggerRect.left + containerWidth
        if (naturalRight > headerRect.right) {
          left = headerRect.right - containerWidth - documentWidth * 0.025
        } else {
          left = triggerRect.left - headerRect.left
        }
        setStyle({ left: `${left}px`, top: `${top}px` })
      }

      updatePosition()
      window.addEventListener('resize', updatePosition)
      return () => window.removeEventListener('resize', updatePosition)
    }, [isOpen])

    return { triggerRef, containerRef, style }
  }

  return (
    <>
      {!view ? (
        // large screens
        <div ref={triggerRef} id={`${keyName}`} className='group w-26'>
          <label
            onClick={() => {
              setIsOpen(!isOpen)
            }}
            className='group peer w-full header-box box-colors-stronger hover:cursor-pointer'
          >
            <p className='text-nowrap truncate text-text-light/80 dark:text-text-dark/80 group-hover:text-text-light dark:group-hover:text-text-dark duration-200'>
              {heading}
            </p>
            <ChevronDown
              size={14}
              className={`${isOpen ? 'rotate-180' : ''} duration-200 ml-1`}
            />
          </label>
          <div
            ref={containerRef}
            style={style}
            className={`z-40 absolute ${
              isOpen ? 'flex' : 'hidden'
            } flex-col rounded-md box-colors-stronger w-md pt-1 px-1`}
          >
            <div className='w-full mb-6.5 max-h-60 overflow-x-scroll'>
              <div className='w-full grid grid-cols-3 gap-0.5 text-[0.9em]'>
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
                className='absolute right-0 bottom-0 mx-1 my-0.5 p-1 text-[0.9em]'
              >
                <div
                  onClick={resetGenres}
                  className='flex flex-row items-center gap-x-1 w-fit rounded-md box-colors-stronger px-1 hover:contrast-105 hover:brightness-90 hover:cursor-pointer duration-200'
                >
                  <p className='uppercase font-medium'>reset</p>
                  <RotateCcw id='rotateIcon' className='font-black' size={13} />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // smaller screens
        <>
          <div id='genre' className='group relative w-full text-[1em]'>
            <label className='min-w-28 max-w-full w-fit group peer small-header-box smallHeaderBox-colors hover:cursor-pointer'>
              <input type='checkbox' className='hidden' />
              <p className='text-text-light/80 dark:text-text-dark/80 group-hover:text-text-light dark:group-hover:text-text-dark duration-200'>
                {heading}
              </p>
              <ChevronDown
                size={14}
                className='group-has-checked:rotate-180 duration-200 ml-1'
              />
            </label>
            <div className='mt-1 hidden peer-has-checked:flex flex-col rounded-md box-colors-stronger w-full p-1.5 pb-5 text-[0.625em]/relaxed'>
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
