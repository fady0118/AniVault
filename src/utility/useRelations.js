import { useState } from 'react'

export function useRelations (data) {
  const [showAllRelations, setShowAllRelations] = useState(false)

  const relations = data?.flattenedRelations ?? []
  const visibleRelations = showAllRelations ? relations : relations.slice(0, 3)

  const relationsImgs = relations.map(rel => ({
    mal_id: rel.mal_id,
    image:
      rel.images?.jpg?.image_url || rel.images?.jpg?.large_image_url || null
  }))

  return { relationsImgs, showAllRelations, setShowAllRelations }
}
