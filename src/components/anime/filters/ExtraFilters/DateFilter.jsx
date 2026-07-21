import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router'

export default function DateFilter ({ data, registerCollector }) {
  const [searchParams] = useSearchParams()
  // localState for values capturing and local use
  const [localState, setLocalState] = useState({
    start_date: searchParams.get(data[0]) || '',
    end_date: searchParams.get(data[1]) || ''
  })
  // localRef
  const localRef = useRef(localState)
  // ref to the checkbox used by the click outside function
  const checkboxRef = useRef(null)

  useEffect(() => {
    registerCollector(() => localRef.current)
  }, [])

  useEffect(() => {
    setLocalState({
      start_date: searchParams.get(data[0]) || '',
      end_date: searchParams.get(data[1]) || ''
    })
  }, [searchParams])

  // update ref
  useEffect(() => {
    localRef.current = localState
  }, [localState])

  function handleChange (type, val) {
    setLocalState(prevState => {
      let newState = { ...prevState }
      const startDateValidationElm = document.getElementById(
        'start_date-val_error'
      )
      const endDateValidationElm = document.getElementById('end_date-val_error')
      if (type === 'start_date') {
        if (
          new Date(newState.end_date) > new Date(val) ||
          !newState.end_date ||
          val == ''
        ) {
          newState.start_date = val
          startDateValidationElm.classList.add('hidden')
          endDateValidationElm.classList.add('hidden')
        } else {
          startDateValidationElm.classList.remove('hidden')
        }
      } else if (type === 'end_date') {
        if (
          new Date(newState.start_date) < new Date(val) ||
          !newState.start_date ||
          val == ''
        ) {
          newState.end_date = val
          startDateValidationElm.classList.add('hidden')
          endDateValidationElm.classList.add('hidden')
        } else {
          endDateValidationElm.classList.remove('hidden')
        }
      }
      return newState
    })
  }
  return (
    <>
      {data.map((type, i) => (
        <div
          key={i}
          className='flex flex-col gap-1 h-fit text-[0.8em] text-medium group'
        >
          <label
            htmlFor={type}
            className='px-0.5 capitalize text-text-light/60 dark:text-text-dark/60 tracking-wide transition-colors duration-200 group-focus-within:text-text-light dark:group-focus-within:text-text-dark'
          >
            {type.split('_').join(' ')}
          </label>

          <input
            type='date'
            name={type}
            id={type}
            value={localState[type]}
            onChange={e => handleChange(type, e.target.value)}
            className='rounded-md border border-transparent bg-transparent px-1 py-0.5 text-text-light/80 dark:text-text-dark/80 outline-none transition-all duration-200 hover:cursor-pointer hover:border-text-light/20 dark:hover:border-text-dark/20 focus:border-rose-400/60 dark:focus:border-rose-400/60 focus:text-text-light dark:focus:text-text-dark'
          />

          <p
            id={`${type}-val_error`}
            role='alert'
            className='hidden px-0.5 text-[0.8em] text-rose-500 dark:text-red-400 duration-150'
          >
            {type === 'start_date'
              ? 'Start date must be before end date'
              : 'End date must be after start date'}
          </p>
        </div>
      ))}
    </>
  )
}
