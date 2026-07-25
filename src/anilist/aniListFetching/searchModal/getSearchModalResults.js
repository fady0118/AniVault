import { queryAniList } from '../../client'
import { searchQueriesMap } from '../../queries/searchModalQuery'

export async function getSearchModalResults (keyword, type = null) {
  const typesArr = type ? [type] : Object.keys(searchQueriesMap)
  const results = {}

  for (const searchType of typesArr) {
    try {
      const data = await queryAniList(searchQueriesMap[searchType], {
        search: keyword
      })

      const pageData = data?.Page
      if (!pageData) continue

      const key = searchType === 'studio' ? 'studios' : searchType
      const items = pageData[key] || []

      results[searchType] = items.map(item => {
        const base = {
          id: item.id,
          type: searchType
        }

        if (searchType === 'anime' || searchType === 'manga') {
          return {
            ...base,
            title:
              item.title?.english || item.title?.romaji || item.title?.native,
            title_japanese: item.title?.native,
            images: {
              jpg: {
                image_url: item.coverImage?.large || item.coverImage?.medium
              }
            },
            type: item.type?.toLowerCase(),
            format: item.format,
            status: item.status,
            year: item.startDate?.year,
            url: `/${searchType}/${item.id}`
          }
        }

        if (searchType === 'characters' || searchType === 'staff') {
          return {
            ...base,
            name: item.name?.full,
            name_japanese: item.name?.native,
            images: {
              jpg: { image_url: item.image?.large || item.image?.medium }
            },
            url: `/${
              searchType === 'staff'
                ? 'people'
                : searchType === 'characters'
                ? 'character'
                : searchType
            }/${item.id}`
          }
        }

        if (searchType === 'studio') {
          const x = {
            ...base,
            name: item.name,
            url: `/producer/${item.id}`
          }
          return {
            ...base,
            name: item.name,
            url: `/producer/${item.id}`
          }
        }

        return base
      })
    } catch (error) {
      console.error(`Failed to fetch ${searchType} results:`, error)
    }
  }

  return results
}
