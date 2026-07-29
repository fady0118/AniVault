import { useState } from 'react'

export function useRelations (data) {
  const [showAllRelations, setShowAllRelations] = useState(false)

  const relations = data?.flattenedRelations ?? []
  const visibleRelations = showAllRelations ? relations : relations.slice(0, 3)

  const relationsImgs = relations.map(rel => ({
    aniList_id: rel.id,
    image:
      rel.images?.jpg?.image_url || rel.images?.jpg?.large_image_url || null
  }))

  return { relationsImgs, showAllRelations, setShowAllRelations }
}
