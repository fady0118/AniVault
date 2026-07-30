import { useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router'

export const DEFAULT_PARAMS = {
  type: '',
  status: '',
  q: '',
  genres: '',
  genres_exclude: '',
  tags: '',
  tags_exclude: '',
  order_by: 'POPULARITY',
  sort: 'desc',
  min_score: '0',
  max_score: '100',
  start_date: '',
  end_date: ''
}

export function useAniListParams () {
  const [searchParams, setSearchParams] = useSearchParams()

  const defaultSearchParams = useMemo(() => {
    const params = new URLSearchParams(searchParams)
    for (const [key, defaultValue] of Object.entries(DEFAULT_PARAMS)) {
      if (!params.has(key)) {
        params.set(key, defaultValue)
      }
    }
    return params
  }, [searchParams])

  useEffect(() => {
    const missingDefaults = Object.keys(DEFAULT_PARAMS).some(
      (key) => !searchParams.has(key)
    )
    if (missingDefaults) {
      setSearchParams(defaultSearchParams, { replace: true })
    }
  }, [searchParams, defaultSearchParams, setSearchParams])

  return {
    searchParams: defaultSearchParams,
    setSearchParams
  }
}
