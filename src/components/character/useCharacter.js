import { useQuery } from '@tanstack/react-query'
import { useEffect, useMemo, useRef } from 'react'
import { useSearchParams } from 'react-router'
import { getCharacterSearchResults } from '../../anilist/aniListFetching/getCharacterSearchResults'

export function useCharacter () {
  function isValidPageValue (value) {
    const num = Number(value)
    return Number.isInteger(num) && num >= 1
  }
  const [searchParams, setSearchParams] = useSearchParams()
  const collectorStore = useRef({})

  // Self-heal the URL: if `page` is missing entirely, add the default so
  // pagination always has something valid to sync against.
  useEffect(() => {
    if (!searchParams.has('page')) {
      const next = new URLSearchParams(searchParams)
      next.set('page', '1')
      setSearchParams(next, { replace: true })
    }
  }, [searchParams, setSearchParams])

  const rawPage = searchParams.get('page')
  const pageIsInvalid = rawPage !== null && !isValidPageValue(rawPage)
  const currentPage = pageIsInvalid ? null : Number(rawPage ?? 1)

  // Normalize the key so the pre/post "auto-add page=1" renders share one
  // cache entry instead of firing two fetches for the same data.
  const queryKey = useMemo(() => {
    const normalized = new URLSearchParams(searchParams)
    if (!normalized.has('page')) normalized.set('page', '1')
    const paramsArray = Array.from(normalized.entries()).sort()
    return ['anilistCharacterSearchResults', paramsArray]
  }, [searchParams])

  const { data, isLoading, isError, error } = useQuery({
    queryKey,
    queryFn: () => getCharacterSearchResults(searchParams),
    enabled: !pageIsInvalid,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    throwOnError: false
  })

  const paginationInfo = data?.pagination ?? null

  function handleApplyFilter () {
    const keyword = collectorStore.current.keyword?.() || ''
    const params = new URLSearchParams()
    if (keyword) params.set('q', keyword)
    params.set('page', '1') // new search always resets pagination
    setSearchParams(params)
  }

  function navigateToPage (page) {
    if (pageIsInvalid) return
    const next = new URLSearchParams(searchParams)
    next.set('page', String(page))
    setSearchParams(next, { replace: true })
  }

  function pageSwap (dir) {
    if (pageIsInvalid) return
    if (dir === 'prev') {
      if (currentPage <= 1) return
      navigateToPage(currentPage - 1)
    } else if (dir === 'next') {
      if (!paginationInfo?.has_next_page) return
      navigateToPage(currentPage + 1)
    }
  }

  return {
    data,
    isLoading,
    isError,
    error,
    handleApplyFilter,
    navigateToPage,
    pageSwap,
    paginationInfo,
    currentPage,
    collectorStore,
    searchParams,
    setSearchParams,
    pageIsInvalid,
    rawPage
  }
}
