import { useQueries } from '@tanstack/react-query'
import { useState } from 'react'
import { getRecentMedia } from '../../anilist/aniListFetching/homePage/getRecentMedia'

export function useRecentMedia (vars) {
  // Initialize page state: one entry per format, all set to 1
  const [pages, setPages] = useState(() =>
    Object.keys(vars).reduce((acc, key) => ({ ...acc, [key]: 1 }), {})
  )

  // Build query array
  const queries = Object.entries(vars).map(([key, params]) => ({
    queryKey: ['recentData', key, pages[key]],
    queryFn: () => getRecentMedia({ ...params, page: pages[key] })
  }))

  // fetch queries
  const results = useQueries({ queries })

  // Map results back to an object keyed by format
  const dataMap = Object.fromEntries(
    Object.keys(vars).map((key, index) => [key, results[index]])
  )

  // Setter function for format's page
  const setPage = (format, newPage) => {
    setPages(prev => ({ ...prev, [format]: newPage }))
  }

  return { dataMap, setPage, pages }
}
